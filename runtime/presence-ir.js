/**
 * Aetherium Presence IR & Minimal Governor A Runtime (Phase 1 Thin First Slice)
 *
 * Lean & Pure-Functional Backend implementation of:
 * - Step 1: PresenceVectorCandidate structure parsing & clamping
 * - Step 2: Minimal Governor A (pure function validation, clamping & policy_risk rejection)
 * - Step 3: PresenceIREnvelope encapsulation (single-parent lineage, uint64 wire strings, integrity hash placeholder)
 */

/**
 * Validates whether a uint64 string conforms to the decimal string wire format.
 * Rejects raw numbers, negative strings, floating points, scientific notation.
 *
 * @param {string} val
 * @returns {boolean}
 */
export function isValidUint64String(val) {
  if (typeof val !== 'string') return false;
  return /^(0|[1-9]\d*)$/.test(val);
}

/**
 * Clamps a numeric value within [min, max].
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {{ clampedValue: number, isClamped: boolean }}
 */
function clamp(val, min, max) {
  if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
    throw new TypeError(`Invalid numeric value for vector field: ${val}`);
  }
  if (val < min) return { clampedValue: min, isClamped: true };
  if (val > max) return { clampedValue: max, isClamped: true };
  return { clampedValue: val, isClamped: false };
}

/**
 * Normalizes and clamps a raw PresenceVectorCandidate.
 * Vector dimensions:
 * - x, y, z: [-1.0, 1.0]
 * - phase / intent_phase: [0.0, 1.0]
 * - confidence: [0.0, 1.0]
 * - energy: [0.0, 1.0]
 * - coherence: [0.0, 1.0]
 * - policy_risk: [0.0, 1.0]
 *
 * @param {Object} rawCandidate
 * @returns {{ vector: Object, isClamped: boolean }}
 */
export function parseAndClampCandidateVector(rawCandidate) {
  if (!rawCandidate || typeof rawCandidate !== 'object') {
    throw new TypeError('PresenceVectorCandidate must be a non-null object');
  }

  let wasClamped = false;

  const clampField = (fieldVal, min, max, defaultVal = 0.0) => {
    const val = fieldVal !== undefined ? fieldVal : defaultVal;
    const res = clamp(val, min, max);
    if (res.isClamped) wasClamped = true;
    return res.clampedValue;
  };

  const phaseVal = rawCandidate.phase !== undefined ? rawCandidate.phase : rawCandidate.intent_phase;

  const vector = {
    x: clampField(rawCandidate.x, -1.0, 1.0, 0.0),
    y: clampField(rawCandidate.y, -1.0, 1.0, 0.0),
    z: clampField(rawCandidate.z, -1.0, 1.0, 0.0),
    phase: clampField(phaseVal, 0.0, 1.0, 0.0),
    confidence: clampField(rawCandidate.confidence, 0.0, 1.0, 1.0),
    energy: clampField(rawCandidate.energy, 0.0, 1.0, 0.5),
    coherence: clampField(rawCandidate.coherence, 0.0, 1.0, 1.0),
    policy_risk: clampField(rawCandidate.policy_risk, 0.0, 1.0, 0.0)
  };

  return { vector, isClamped: wasClamped };
}

/**
 * Minimal Governor A evaluation (Pure Function).
 * - Performs structural and numeric bounds validation & clamping.
 * - Rejects candidate if policy_risk > 0.85 (Risk Rejection).
 *
 * @param {Object} candidate
 * @returns {Object} Governance Decision Object
 */
export function evaluateMinimalGovernorA(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return {
      action: 'REJECT',
      status: 'REJECTED',
      reason: 'Candidate payload is null or not an object',
      vector: null
    };
  }

  try {
    const { vector, isClamped } = parseAndClampCandidateVector(candidate);

    // Step 2: Risk Rejection Gate (policy_risk > 0.85)
    if (vector.policy_risk > 0.85) {
      return {
        action: 'REJECT',
        status: 'REJECTED',
        reason: `Policy risk rejected: policy_risk (${vector.policy_risk}) > 0.85 threshold`,
        vector
      };
    }

    const action = isClamped ? 'CLAMP' : 'VALIDATE';

    return {
      action,
      status: 'ACCEPTED',
      vector,
      isClamped
    };
  } catch (err) {
    return {
      action: 'REJECT',
      status: 'REJECTED',
      reason: `Validation error: ${err.message}`,
      vector: null
    };
  }
}

/**
 * Step 3: PresenceIREnvelope Encapsulation
 * Wraps a validated/clamped PresenceVector into a canonical PresenceIREnvelope.
 *
 * @param {Object} governanceResult - Output from evaluateMinimalGovernorA
 * @param {Object} traceMetadata - Options for lineage and transport envelope
 * @returns {Object} PresenceIREnvelope
 */
export function encapsulatePresenceIR(governanceResult, traceMetadata = {}) {
  if (!governanceResult || governanceResult.status !== 'ACCEPTED') {
    throw new Error('Cannot encapsulate unaccepted or rejected governance result into PresenceIREnvelope');
  }

  const { vector, isClamped } = governanceResult;

  const tick = String(traceMetadata.tick ?? '0');
  const stateVersion = String(traceMetadata.state_version ?? '0');
  const timestampNs = String(traceMetadata.timestamp_ns ?? '0');

  if (!isValidUint64String(tick)) {
    throw new TypeError(`Invalid uint64 tick string: ${traceMetadata.tick}`);
  }
  if (!isValidUint64String(stateVersion)) {
    throw new TypeError(`Invalid uint64 state_version string: ${traceMetadata.state_version}`);
  }
  if (!isValidUint64String(timestampNs)) {
    throw new TypeError(`Invalid uint64 timestamp_ns string: ${traceMetadata.timestamp_ns}`);
  }

  const parentTraceId = traceMetadata.parent_trace_id !== undefined ? traceMetadata.parent_trace_id : null;
  if (parentTraceId !== null && typeof parentTraceId !== 'string') {
    throw new TypeError('parent_trace_id must be a string or null (single-parent lineage)');
  }

  const intentState = traceMetadata.intent_state || 'RESPONDING';
  const validIntentStates = ['IDLE', 'PROCESSING', 'RESPONDING', 'ERROR'];
  if (!validIntentStates.includes(intentState)) {
    throw new TypeError(`Invalid intent_state: ${intentState}`);
  }

  const envelope = {
    ir_version: '0.1.0',
    tick,
    state_version: stateVersion,
    timestamp_ns: timestampNs,
    trace_id: traceMetadata.trace_id || 'trace-root-0001',
    parent_trace_id: parentTraceId,
    trace_seed: traceMetadata.trace_seed || 'seed-default-0001',
    intent: {
      state: intentState,
      phase: vector.phase
    },
    vector: {
      x: vector.x,
      y: vector.y,
      z: vector.z,
      phase: vector.phase,
      confidence: vector.confidence,
      energy: vector.energy,
      coherence: vector.coherence,
      policy_risk: vector.policy_risk
    },
    normalization: {
      clamped: Boolean(isClamped),
      policy_version: traceMetadata.policy_version || '1.0.0',
      precision_dp: 6
    },
    integrity_hash: traceMetadata.integrity_hash || 'BLAKE3_256_PLACEHOLDER_0000000000000000000000000000000000000000'
  };

  return envelope;
}
