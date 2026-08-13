/**
 * AETHERIUM MANIFEST - PHASE 0.1
 * Canonical Visual State Enforcement
 */

const VALID_PHASES = new Set(['IDLE', 'LISTENING', 'PROCESSING', 'RESPONDING', 'WARNING', 'ERROR', 'NIRODHA']);
const VALID_SHAPES = new Set(['sphere', 'vortex', 'wave']);

const NUMERIC_FIELDS = {
  hue: { min: 0, max: 360, default: 190 },
  energy: { min: 0, max: 1.0, default: 0.5 },
  density: { min: 0, max: 1.0, default: 0.5 },
  turbulence: { min: 0, max: 1.0, default: 0.2 },
  coherence: { min: 0, max: 1.0, default: 0.8 },
  confidence: { min: 0, max: 1.0, default: 0.5 }
};

const ALLOWED_KEYS = new Set(['phase', 'shape', ...Object.keys(NUMERIC_FIELDS)]);

/**
 * Pure validation of a canonical Visual State.
 * Never mutates, clamps, or fills defaults.
 */
export function validateVisualState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return false;

  // Exact required semantic fields
  if (!('phase' in state) || !('shape' in state)) return false;
  if (!VALID_PHASES.has(state.phase) || !VALID_SHAPES.has(state.shape)) return false;

  for (const key of Object.keys(state)) {
    if (!ALLOWED_KEYS.has(key)) return false; // Reject unknown keys

    if (NUMERIC_FIELDS[key]) {
      const val = state[key];
      // Strict numeric enforcement
      if (typeof val !== 'number' || !Number.isFinite(val)) return false;
      
      const bounds = NUMERIC_FIELDS[key];
      if (val < bounds.min || val > bounds.max) return false;
    }
  }

  return true;
}

/**
 * Creates a Canonical Target Visual State from a Candidate State.
 * Enforces normalization, clamps valid out-of-range numerics, and 
 * rejects (throws) on malformed semantics or types.
 * Guaranteed to return a new object (immutable input).
 */
export function createVisualState(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new TypeError("Candidate must be an object");
  }

  // 1. Missing semantic validation (Do not invent semantic meaning)
  if (!('phase' in candidate)) throw new Error("Missing required semantic property: phase");
  if (!('shape' in candidate)) throw new Error("Missing required semantic property: shape");

  // 2. Semantic enum validation
  if (!VALID_PHASES.has(candidate.phase)) throw new Error(`Invalid phase: ${candidate.phase}`);
  if (!VALID_SHAPES.has(candidate.shape)) throw new Error(`Invalid shape: ${candidate.shape}`);

  const canonicalState = {
    phase: candidate.phase,
    shape: candidate.shape
  };

  // 3. Property and strict type validation
  for (const key of Object.keys(candidate)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new Error(`Unknown property rejected: ${key}`);
    }

    if (NUMERIC_FIELDS[key]) {
      const val = candidate[key];
      
      // Strict type checks (no silent string coercion, no null, no NaN/Infinity)
      if (typeof val !== 'number') {
        throw new TypeError(`Invalid type for ${key}: expected number, got ${typeof val}`);
      }
      if (!Number.isFinite(val)) {
        throw new TypeError(`Invalid numeric value for ${key}: must be finite`);
      }

      // Safe numeric clamping
      const bounds = NUMERIC_FIELDS[key];
      canonicalState[key] = Math.max(bounds.min, Math.min(bounds.max, val));
    }
  }

  // 4. Numeric Defaulting (Only for missing optional numeric properties)
  for (const [key, bounds] of Object.entries(NUMERIC_FIELDS)) {
    if (!(key in canonicalState)) {
      canonicalState[key] = bounds.default;
    }
  }

  return canonicalState;
}

/**
 * @deprecated Use createVisualState instead.
 * Previous implementation silently dropped unknown properties.
 */
export function clampVisualState(candidate) {
  throw new Error("clampVisualState is deprecated. Use createVisualState() for deterministic, strict contract enforcement.");
}
