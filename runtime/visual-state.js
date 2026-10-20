/**
 * Aetherium Visual State Contract Validation and Safety Governor
 * Phase 1 (Observable State Manifestation) with Phase 0.1 Backward Compatibility
 */

export const ALLOWED_STATES = new Set([
  "IDLE",
  "LISTENING",
  "PROCESSING",
  "UNCERTAIN",
  "CONTRADICTION",
  "RESOLVED"
]);

export const ALLOWED_TOPOLOGIES = new Set([
  "STABLE_RING",
  "WAVEFORM",
  "CONCENTRIC_SHELLS",
  "DISPERSED_FIELD",
  "CRACKED_SHELL",
  "CRYSTALLIZED_CORE"
]);

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
  confidence: { min: 0, max: 1.0, default: 0.55 },
  lightIntensity: { min: 0, max: 1.0, default: 0.5 }
};

const ALLOWED_KEYS = new Set([
  "state",
  "topology",
  "phase",
  "shape",
  ...Object.keys(NUMERIC_FIELDS)
]);

/**
 * Intent-to-Parameter Mapping Dictionaries
 * Maps cognitive tones to contract parameter configurations.
 */
export const INTENT_MAPPING_DICTIONARY = Object.freeze({
  certainty: {
    state: "RESOLVED",
    topology: "CRYSTALLIZED_CORE",
    phase: "RESPONDING",
    shape: "sphere",
    hue: 210,
    energy: 0.85,
    density: 0.85,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.95,
    lightIntensity: 0.85
  },
  conviction: {
    state: "RESOLVED",
    topology: "CRYSTALLIZED_CORE",
    phase: "RESPONDING",
    shape: "sphere",
    hue: 210,
    energy: 0.85,
    density: 0.85,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.95,
    lightIntensity: 0.85
  },
  caution: {
    state: "UNCERTAIN",
    topology: "DISPERSED_FIELD",
    phase: "WARNING",
    shape: "triangle",
    hue: 35,
    energy: 0.3,
    density: 0.4,
    turbulence: 0.55,
    coherence: 0.4,
    confidence: 0.5,
    lightIntensity: 0.3
  },
  hesitation: {
    state: "UNCERTAIN",
    topology: "DISPERSED_FIELD",
    phase: "WARNING",
    shape: "triangle",
    hue: 35,
    energy: 0.3,
    density: 0.4,
    turbulence: 0.55,
    coherence: 0.4,
    confidence: 0.5,
    lightIntensity: 0.3
  },
  exploration: {
    state: "PROCESSING",
    topology: "CONCENTRIC_SHELLS",
    phase: "PROCESSING",
    shape: "spiral",
    hue: 280,
    energy: 0.75,
    density: 0.65,
    turbulence: 0.45,
    coherence: 0.6,
    confidence: 0.7,
    lightIntensity: 0.6
  },
  inquiry: {
    state: "LISTENING",
    topology: "WAVEFORM",
    phase: "PROCESSING",
    shape: "wave",
    hue: 270,
    energy: 0.7,
    density: 0.6,
    turbulence: 0.4,
    coherence: 0.65,
    confidence: 0.65,
    lightIntensity: 0.5
  },
  contemplation: {
    state: "PROCESSING",
    topology: "CONCENTRIC_SHELLS",
    phase: "PROCESSING",
    shape: "sphere",
    hue: 190,
    energy: 0.25,
    density: 0.9,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.85,
    lightIntensity: 0.4
  },
  deep_reasoning: {
    state: "PROCESSING",
    topology: "CONCENTRIC_SHELLS",
    phase: "PROCESSING",
    shape: "sphere",
    hue: 190,
    energy: 0.25,
    density: 0.9,
    turbulence: 0.05,
    coherence: 0.95,
    confidence: 0.85,
    lightIntensity: 0.4
  }
});

const PHASE_TO_STATE_MAP = {
  IDLE: { state: "IDLE", topology: "STABLE_RING", lightIntensity: 0.15 },
  LISTENING: { state: "LISTENING", topology: "WAVEFORM", lightIntensity: 0.3 },
  PROCESSING: { state: "PROCESSING", topology: "CONCENTRIC_SHELLS", lightIntensity: 0.5 },
  RESPONDING: { state: "RESOLVED", topology: "CRYSTALLIZED_CORE", lightIntensity: 0.8 },
  WARNING: { state: "UNCERTAIN", topology: "DISPERSED_FIELD", lightIntensity: 0.25 },
  ERROR: { state: "CONTRADICTION", topology: "CRACKED_SHELL", lightIntensity: 0.2 },
  NIRODHA: { state: "IDLE", topology: "STABLE_RING", lightIntensity: 0.05 }
};

const STATE_TO_PHASE_MAP = {
  IDLE: { phase: "IDLE", shape: "sphere" },
  LISTENING: { phase: "LISTENING", shape: "wave" },
  PROCESSING: { phase: "PROCESSING", shape: "spiral" },
  UNCERTAIN: { phase: "WARNING", shape: "triangle" },
  CONTRADICTION: { phase: "ERROR", shape: "line" },
  RESOLVED: { phase: "RESPONDING", shape: "sphere" }
};

/**
 * Validates a Visual State against the contract specification in
 * contracts/visual-state.schema.json.
 *
 * @param {any} state - The object to validate.
 * @returns {boolean} True if strictly valid; false otherwise.
 */
export function validateVisualState(obj) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  const hasNewRequired = "state" in obj && "topology" in obj;
  const hasLegacyRequired = "phase" in obj && "shape" in obj;

  if (!hasNewRequired && !hasLegacyRequired) return false;

  if ("state" in obj && !ALLOWED_STATES.has(obj.state)) return false;
  if ("topology" in obj && !ALLOWED_TOPOLOGIES.has(obj.topology)) return false;
  if ("phase" in obj && !ALLOWED_PHASES.has(obj.phase)) return false;
  if ("shape" in obj && !ALLOWED_SHAPES.has(obj.shape)) return false;

  for (const key of Object.keys(obj)) {
    if (!ALLOWED_KEYS.has(key)) return false;

    if (NUMERIC_FIELDS[key]) {
      const val = obj[key];
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
 * @param {any} candidate - The input values to normalize and govern.
 * @returns {any} A new, strictly valid canonical VisualState object.
 * @throws {TypeError|Error} If the candidate is malformed.
 */
export function createVisualState(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new TypeError("Candidate must be an object");
  }

  if (!("phase" in candidate) && !("state" in candidate)) {
    throw new Error("Missing required semantic property: phase");
  }

  const hasNewReq = "state" in candidate && "topology" in candidate;
  const hasLegacyReq = "phase" in candidate && "shape" in candidate;

  if (!hasNewReq && !hasLegacyReq) {
    if (!("topology" in candidate) && !("shape" in candidate)) {
      throw new Error("Missing required semantic property: shape");
    }
  }

  if ("state" in candidate && !ALLOWED_STATES.has(candidate.state)) {
    throw new Error(`Invalid state: ${candidate.state}`);
  }
  if ("topology" in candidate && !ALLOWED_TOPOLOGIES.has(candidate.topology)) {
    throw new Error(`Invalid topology: ${candidate.topology}`);
  }
  if ("phase" in candidate && !ALLOWED_PHASES.has(candidate.phase)) {
    throw new Error(`Invalid phase: ${candidate.phase}`);
  }
  if ("shape" in candidate && !ALLOWED_SHAPES.has(candidate.shape)) {
    throw new Error(`Invalid shape: ${candidate.shape}`);
  }

  const canonicalState = {};

  if ("state" in candidate) {
    canonicalState.state = candidate.state;
  }
  if ("topology" in candidate) {
    canonicalState.topology = candidate.topology;
  }
  if ("phase" in candidate) {
    canonicalState.phase = candidate.phase;
  }
  if ("shape" in candidate) {
    canonicalState.shape = candidate.shape;
  }

  if (!("state" in canonicalState) && canonicalState.phase) {
    const mapped = PHASE_TO_STATE_MAP[canonicalState.phase];
    if (mapped) {
      canonicalState.state = mapped.state;
      if (!("topology" in canonicalState)) canonicalState.topology = mapped.topology;
      if (!("lightIntensity" in candidate)) canonicalState.lightIntensity = mapped.lightIntensity;
    }
  }

  if (!("phase" in canonicalState) && canonicalState.state) {
    const mapped = STATE_TO_PHASE_MAP[canonicalState.state];
    if (mapped) {
      canonicalState.phase = mapped.phase;
      if (!("shape" in canonicalState)) canonicalState.shape = mapped.shape;
    }
  }

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

  if (!mappedDict && !baseCandidate.phase && !baseCandidate.state && !overrides.phase && !overrides.state) {
    throw new Error(`Unknown intent tone: ${toneKey || intentInput}`);
  }

  const candidate = {
    ...(mappedDict || {}),
    ...baseCandidate,
    ...overrides
  };

  return createVisualState(candidate);
}

export function clampVisualState() {
  throw new Error("clampVisualState is deprecated. Use createVisualState() for deterministic, strict contract enforcement.");
}
