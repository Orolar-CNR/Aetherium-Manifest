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

  if (typeof state.hue !== "number" || isNaN(state.hue) || state.hue < 0 || state.hue > 360) {
    return false;
  }

  if (typeof state.energy !== "number" || isNaN(state.energy) || state.energy < 0 || state.energy > 1) {
    return false;
  }

  if (typeof state.density !== "number" || isNaN(state.density) || state.density < 0 || state.density > 1) {
    return false;
  }

  if (typeof state.turbulence !== "number" || isNaN(state.turbulence) || state.turbulence < 0 || state.turbulence > 0.65) {
    return false;
  }

  if (typeof state.coherence !== "number" || isNaN(state.coherence) || state.coherence < 0 || state.coherence > 1) {
    return false;
  }

  if (typeof state.confidence !== "number" || isNaN(state.confidence) || state.confidence < 0 || state.confidence > 1) {
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
  const safeCandidate = candidate || {};
  const result = {};

  // Phase
  if ("phase" in safeCandidate) {
    result.phase = safeCandidate.phase;
  } else {
    result.phase = DEFAULTS.phase;
  }

  // Shape
  if ("shape" in safeCandidate) {
    result.shape = safeCandidate.shape;
  } else {
    result.shape = DEFAULTS.shape;
  }

  // Helper helper to handle numeric parsing and clamping
  const clampField = (value, min, max, defaultVal) => {
    if (value === undefined || value === null) {
      return defaultVal;
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return defaultVal;
    }
    return Math.min(max, Math.max(min, parsed));
  };

  result.hue = clampField(safeCandidate.hue, 0, 360, DEFAULTS.hue);
  result.energy = clampField(safeCandidate.energy, 0, 1, DEFAULTS.energy);
  result.density = clampField(safeCandidate.density, 0, 1, DEFAULTS.density);
  result.turbulence = clampField(safeCandidate.turbulence, 0, 0.65, DEFAULTS.turbulence);
  result.coherence = clampField(safeCandidate.coherence, 0, 1, DEFAULTS.coherence);
  result.confidence = clampField(safeCandidate.confidence, 0, 1, DEFAULTS.confidence);

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
