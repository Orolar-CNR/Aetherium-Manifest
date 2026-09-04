/**
 * Environmental Dynamics Runtime - WorldState Management (Research Only)
 */

export const PRECISION_DP = 6;

export function roundDP(val, dp = PRECISION_DP) {
  if (typeof val !== 'number' || isNaN(val)) return 0;
  const factor = Math.pow(10, dp);
  return Math.round(val * factor) / factor;
}

export function createInitialWorldState(custom = {}) {
  return {
    version: '0.1.0',
    timestamp: roundDP(custom.timestamp ?? 0),
    step: custom.step ?? 0,
    global_energy: roundDP(Math.max(0, Math.min(1, custom.global_energy ?? 0.2))),
    coherence: roundDP(Math.max(0, Math.min(1, custom.coherence ?? 0.8))),
    entropy: roundDP(Math.max(0, Math.min(1, custom.entropy ?? 0.1))),
    fields: (custom.fields ?? []).map(f => clampField(f)),
    disturbances: (custom.disturbances ?? []).map(d => clampDisturbance(d))
  };
}

export function clampField(field) {
  return {
    id: field.id || `field-${Math.random().toString(36).slice(2, 7)}`,
    type: field.type || 'radial_expansion',
    center: [roundDP(field.center?.[0] ?? 0.5), roundDP(field.center?.[1] ?? 0.5)],
    radius: roundDP(Math.max(0, field.radius ?? 0.1)),
    intensity: roundDP(Math.max(0, Math.min(1, field.intensity ?? 0.5))),
    frequency: roundDP(Math.max(0, field.frequency ?? 1.0))
  };
}

export function clampDisturbance(dist) {
  return {
    id: dist.id || `dist-${Math.random().toString(36).slice(2, 7)}`,
    position: [roundDP(dist.position?.[0] ?? 0.5), roundDP(dist.position?.[1] ?? 0.5)],
    amplitude: roundDP(Math.max(0, Math.min(1, dist.amplitude ?? 0.5))),
    decay_rate: roundDP(Math.max(0, dist.decay_rate ?? 0.05)),
    age: roundDP(Math.max(0, dist.age ?? 0))
  };
}

export function serializeStateCanonical(state) {
  const sortedState = {
    version: state.version,
    timestamp: roundDP(state.timestamp),
    step: state.step,
    global_energy: roundDP(state.global_energy),
    coherence: roundDP(state.coherence),
    entropy: roundDP(state.entropy),
    fields: state.fields.map(f => ({
      center: [roundDP(f.center[0]), roundDP(f.center[1])],
      frequency: roundDP(f.frequency),
      id: f.id,
      intensity: roundDP(f.intensity),
      radius: roundDP(f.radius),
      type: f.type
    })).sort((a, b) => a.id.localeCompare(b.id)),
    disturbances: state.disturbances.map(d => ({
      age: roundDP(d.age),
      amplitude: roundDP(d.amplitude),
      decay_rate: roundDP(d.decay_rate),
      id: d.id,
      position: [roundDP(d.position[0]), roundDP(d.position[1])]
    })).sort((a, b) => a.id.localeCompare(b.id))
  };

  return JSON.stringify(sortedState);
}
