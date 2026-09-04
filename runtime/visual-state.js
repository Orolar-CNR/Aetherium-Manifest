/**
 * Aetherium Visual State Contract Validation and Safety Governor
 * Phase 0.1
 *
 * This module merges the strict type-safety hardening (no silent numeric-string
 * coercion, unknown-key rejection, NaN/Infinity rejection) with the shape/numeric
 * ranges that were already documented and shipped in docs/PHASE-0.1-VISUAL-STATE-
 * CONTRACT.md and used by app.js's particle field renderer (sphere/triangle/
 * spiral/line/wave, turbulence capped at 0.65). See docs/PHASE-0.1-VISUAL-STATE-
 * CONTRACT.md section 3 for the source of truth on these values.
 */

export const ALLOWED_PHASES = new Set([
  "IDLE",
  "LISTENING",
  "PROCESSING",
  "RESPONDING",
  "WARNING",
  "ERROR",
  "NIRODHA"
]);

export const ALLOWED_SHAPES = new Set([
  "sphere",
  "triangle",
  "spiral",
  "line",
  "wave"
]);

const NUMERIC_FIELDS = {
  hue: { min: 0, max: 360, default: 190 },
  energy: { min: 0, max: 1.0, default: 0.18 },
  density: { min: 0, max: 1.0, default: 0.55 },
  turbulence: { min: 0, max: 0.65, default: 0.10 },
  coherence: { min: 0, max: 1.0, default: 0.88 },
  confidence: { min: 0, max: 1.0, default: 0.55 }
};

const ALLOWED_KEYS = new Set(["phase", "shape", ...Object.keys(NUMERIC_FIELDS)]);

/**
 * Intent-to-Parameter Mapping Dictionaries
 * Maps cognitive tones to contract parameter configurations.
 */
export const INTENT_MAPPING_DICTIONARY = Object.freeze({
  certainty: {
    phase: "RESPONDING",
    shape: "sphere",
    hue: 210,
    energy: 0.85,
    density: 0.85,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.95
  },
  conviction: {
    phase: "RESPONDING",
    shape: "sphere",
    hue: 210,
    energy: 0.85,
    density: 0.85,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.95
  },
  caution: {
    phase: "WARNING",
    shape: "triangle",
    hue: 35,
    energy: 0.3,
    density: 0.4,
    turbulence: 0.55,
    coherence: 0.4,
    confidence: 0.5
  },
  hesitation: {
    phase: "WARNING",
    shape: "triangle",
    hue: 35,
    energy: 0.3,
    density: 0.4,
    turbulence: 0.55,
    coherence: 0.4,
    confidence: 0.5
  },
  exploration: {
    phase: "PROCESSING",
    shape: "spiral",
    hue: 280,
    energy: 0.75,
    density: 0.65,
    turbulence: 0.45,
    coherence: 0.6,
    confidence: 0.7
  },
  inquiry: {
    phase: "PROCESSING",
    shape: "wave",
    hue: 270,
    energy: 0.7,
    density: 0.6,
    turbulence: 0.4,
    coherence: 0.65,
    confidence: 0.65
  },
  contemplation: {
    phase: "PROCESSING",
    shape: "sphere",
    hue: 190,
    energy: 0.25,
    density: 0.9,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.85
  },
  deep_reasoning: {
    phase: "PROCESSING",
    shape: "sphere",
    hue: 190,
    energy: 0.25,
    density: 0.9,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.85
  }
});

/**
 * Validates a Visual State against the contract specification in
 * contracts/visual-state.schema.json.
 * Pure, non-mutating validation. Never clamps or fills defaults -- an object is
 * only "valid" here if it is ALREADY a fully-specified canonical state.
 * Rejects any unknown fields, missing required fields (phase/shape), or
 * out-of-bound / wrongly-typed values.
 *
 * @param {any} state - The object to validate.
 * @returns {boolean} True if strictly valid; false otherwise.
 */
export function validateVisualState(state) {
  if (state === null || typeof state !== "object" || Array.isArray(state)) {
    return false;
  }

  if (!("phase" in state) || !("shape" in state)) return false;
  if (!ALLOWED_PHASES.has(state.phase) || !ALLOWED_SHAPES.has(state.shape)) return false;

  for (const key of Object.keys(state)) {
    if (!ALLOWED_KEYS.has(key)) return false; // Reject unknown keys

    if (NUMERIC_FIELDS[key]) {
      const val = state[key];
      if (typeof val !== "number" || !Number.isFinite(val)) return false;

      const bounds = NUMERIC_FIELDS[key];
      if (val < bounds.min || val > bounds.max) return false;
    }
  }

  return true;
}

/**
 * Creates a Canonical Target Visual State from a Candidate State.
 *
 * - phase/shape are mandatory semantic fields: missing or invalid values throw.
 *   The runtime never invents a semantic meaning that wasn't supplied.
 * - Numeric fields are strictly type-checked: non-number, NaN, and +/-Infinity
 *   throw (no silent coercion of numeric strings/booleans).
 * - In-range numbers pass through; out-of-range numbers are clamped, per
 *   docs/PHASE-0.1-VISUAL-STATE-CONTRACT.md section 4 ("Strict Boundaries").
 * - Missing OPTIONAL numeric fields are filled with the documented defaults
 *   (section 3.3) -- this is not a "silent malformation" fallback, it's the
 *   spec's own default-filling rule (section 4.4).
 * - Unknown properties throw. The candidate object itself is never mutated;
 *   this always returns a new object.
 *
 * @param {any} candidate - The input values to normalize and govern.
 * @returns {any} A new, strictly valid canonical VisualState object.
 * @throws {TypeError|Error} If the candidate is malformed.
 */
export function createVisualState(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new TypeError("Candidate must be an object");
  }

  if (!("phase" in candidate)) throw new Error("Missing required semantic property: phase");
  if (!("shape" in candidate)) throw new Error("Missing required semantic property: shape");

  if (!ALLOWED_PHASES.has(candidate.phase)) throw new Error(`Invalid phase: ${candidate.phase}`);
  if (!ALLOWED_SHAPES.has(candidate.shape)) throw new Error(`Invalid shape: ${candidate.shape}`);

  const canonicalState = {
    phase: candidate.phase,
    shape: candidate.shape
  };

  for (const key of Object.keys(candidate)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new Error(`Unknown property rejected: ${key}`);
    }

    if (NUMERIC_FIELDS[key]) {
      const val = candidate[key];

      if (typeof val !== "number") {
        throw new TypeError(`Invalid type for ${key}: expected number, got ${typeof val}`);
      }
      if (!Number.isFinite(val)) {
        throw new TypeError(`Invalid numeric value for ${key}: must be finite`);
      }

      const bounds = NUMERIC_FIELDS[key];
      canonicalState[key] = Math.max(bounds.min, Math.min(bounds.max, val));
    }
  }

  for (const [key, bounds] of Object.entries(NUMERIC_FIELDS)) {
    if (!(key in canonicalState)) {
      canonicalState[key] = bounds.default;
    }
  }

  return canonicalState;
}

/**
 * Maps a cognitive intent tone or intent payload to a canonical Visual State.
 *
 * @param {string|object} intentInput - Cognitive tone string (e.g. "certainty", "caution", "exploration", "contemplation") or object containing tone/parameters.
 * @param {object} [overrides={}] - Optional property overrides to apply on top of the mapped dictionary state.
 * @returns {object} A new, strictly valid canonical VisualState object.
 * @throws {Error|TypeError} If the intent tone is unknown and no valid candidate phase/shape are provided, or if validation fails.
 */
export function mapIntentToVisualState(intentInput, overrides = {}) {
  let toneKey = null;
  let baseCandidate = {};

  if (typeof intentInput === "string") {
    toneKey = intentInput.toLowerCase().trim();
  } else if (intentInput && typeof intentInput === "object" && !Array.isArray(intentInput)) {
    if (typeof intentInput.tone === "string") {
      toneKey = intentInput.tone.toLowerCase().trim();
    }
    const { tone, ...restInput } = intentInput;
    baseCandidate = { ...restInput };
  } else {
    throw new TypeError("intentInput must be a cognitive tone string or an object");
  }

  const mappedDict = toneKey ? INTENT_MAPPING_DICTIONARY[toneKey] : null;

  if (!mappedDict && !baseCandidate.phase && !overrides.phase) {
    throw new Error(`Unknown intent tone: ${toneKey || intentInput}`);
  }

  const candidate = {
    ...(mappedDict || {}),
    ...baseCandidate,
    ...overrides
  };

  return createVisualState(candidate);
}

/**
 * @deprecated Use createVisualState instead.
 * The previous implementation of this function silently coerced numeric
 * strings via Number(value) and silently dropped unknown properties, which
 * violated the "No Silent Malformations" guarantee. Kept as a hard-failing
 * stub so any remaining call sites are caught immediately instead of quietly
 * behaving differently than the caller expects.
 */
export function clampVisualState() {
  throw new Error("clampVisualState is deprecated. Use createVisualState() for deterministic, strict contract enforcement.");
}
