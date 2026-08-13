/**
 * Aetherium Visual State Contract Validation and Safety Governor
 * Phase 0.1
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

export const DEFAULTS = {
  phase: "IDLE",
  shape: "sphere",
  hue: 190,
  energy: 0.18,
  density: 0.55,
  turbulence: 0.10,
  coherence: 0.88,
  confidence: 0.55
};

/**
 * Validates a Visual State against the contract specification in contracts/visual-state.schema.json.
 * It is a pure, non-mutating validation that does not clamp or fill defaults.
 * It rejects any unknown fields, missing required fields, or out-of-bound values.
 *
 * @param {any} state - The object to validate.
 * @returns {boolean} True if strictly valid; false otherwise.
 */
export function validateVisualState(state) {
  if (state === null || typeof state !== "object" || Array.isArray(state)) {
    return false;
  }

  // Check required fields
  const required = [
    "phase",
    "shape",
    "hue",
    "energy",
    "density",
    "turbulence",
    "coherence",
    "confidence"
  ];

  for (const field of required) {
    if (!(field in state)) {
      return false;
    }
  }

  // Reject unknown keys
  const allowedKeys = new Set(required);
  for (const key of Object.keys(state)) {
    if (!allowedKeys.has(key)) {
      return false;
    }
  }

  // Check types & specific constraints
  if (typeof state.phase !== "string" || !ALLOWED_PHASES.has(state.phase)) {
    return false;
  }

  if (typeof state.shape !== "string" || !ALLOWED_SHAPES.has(state.shape)) {
    return false;
  }

  const validateNumber = (val, min, max) => {
    if (typeof val !== "number" || !Number.isFinite(val)) {
      return false;
    }
    return val >= min && val <= max;
  };

  if (!validateNumber(state.hue, 0, 360)) {
    return false;
  }

  if (!validateNumber(state.energy, 0, 1)) {
    return false;
  }

  if (!validateNumber(state.density, 0, 1)) {
    return false;
  }

  if (!validateNumber(state.turbulence, 0, 0.65)) {
    return false;
  }

  if (!validateNumber(state.coherence, 0, 1)) {
    return false;
  }

  if (!validateNumber(state.confidence, 0, 1)) {
    return false;
  }

  return true;
}

/**
 * Safely clamps numeric values and ensures allowed enumerations.
 * It does not mutate the candidate object, returning a new normalized object instead.
 *
 * If phase or shape are invalid or missing, it will NOT invent semantic meaning;
 * it will retain the invalid/missing values so that validateVisualState can catch them,
 * unless they are explicitly undefined/missing, in which case we populate the defaults
 * to prevent accidental runtime reference errors.
 *
 * @param {any} candidate - The input values to normalize.
 * @returns {any} A new normalized object.
 */
export function clampVisualState(candidate) {
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new TypeError("Candidate must be a non-null object.");
  }

  const allowedKeys = new Set([
    "phase",
    "shape",
    "hue",
    "energy",
    "density",
    "turbulence",
    "coherence",
    "confidence"
  ]);

  // Reject unknown keys
  for (const key of Object.keys(candidate)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Unknown property rejected: "${key}"`);
    }
  }

  const result = {};

  // Check required semantic properties
  if (!("phase" in candidate)) {
    throw new Error("Missing required semantic property: phase");
  }
  if (typeof candidate.phase !== "string" || !ALLOWED_PHASES.has(candidate.phase)) {
    throw new Error(`Invalid semantic phase: "${candidate.phase}"`);
  }
  result.phase = candidate.phase;

  if (!("shape" in candidate)) {
    throw new Error("Missing required semantic property: shape");
  }
  if (typeof candidate.shape !== "string" || !ALLOWED_SHAPES.has(candidate.shape)) {
    throw new Error(`Invalid semantic shape: "${candidate.shape}"`);
  }
  result.shape = candidate.shape;

  // Clamping and validation helper for numeric fields
  const processNumericField = (key, min, max, defaultVal) => {
    if (!(key in candidate) || candidate[key] === undefined) {
      return defaultVal;
    }
    const val = candidate[key];
    if (typeof val !== "number" || !Number.isFinite(val)) {
      throw new TypeError(`Invalid numeric type for "${key}": expected finite number, got ${typeof val === "object" ? (val === null ? "null" : "object") : typeof val}`);
    }
    return Math.min(max, Math.max(min, val));
  };

  result.hue = processNumericField("hue", 0, 360, DEFAULTS.hue);
  result.energy = processNumericField("energy", 0, 1, DEFAULTS.energy);
  result.density = processNumericField("density", 0, 1, DEFAULTS.density);
  result.turbulence = processNumericField("turbulence", 0, 0.65, DEFAULTS.turbulence);
  result.coherence = processNumericField("coherence", 0, 1, DEFAULTS.coherence);
  result.confidence = processNumericField("confidence", 0, 1, DEFAULTS.confidence);

  return result;
}

/**
 * Factory that creates a guaranteed-valid canonical target visual state from a candidate.
 * If validation fails after normalization, it throws an Error.
 *
 * @param {any} candidate - The prototype input candidate state.
 * @returns {any} A strictly valid canonical VisualState object.
 * @throws {Error} If validation fails.
 */
export function createVisualState(candidate) {
  const normalized = clampVisualState(candidate);

  if (!validateVisualState(normalized)) {
    throw new Error(`Visual State Validation Failed: candidate was normalized to ${JSON.stringify(normalized)} but does not satisfy the contract schema.`);
  }

  return normalized;
}
