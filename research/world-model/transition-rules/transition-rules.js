/**
 * Environmental Dynamics Runtime - Transition Rules & State Evolution (Research Only)
 */

import { roundDP, clampField, clampDisturbance } from '../world-state/world-state.js';

export const DEFAULT_TRANSITION_RULE = {
  rule_id: 'default-physics-v0.1',
  energy_decay_rate: 0.1,
  propagation_speed: 0.15,
  superposition_threshold: 0.25,
  coherence_recovery_rate: 0.05,
  entropy_growth_rate: 0.02
};

export function evolveWorldState(currentState, event = null, deltaTime = 0.1, rule = DEFAULT_TRANSITION_RULE) {
  const dt = Math.max(0, deltaTime);
  const nextStep = currentState.step + 1;
  const nextTimestamp = roundDP(currentState.timestamp + dt);

  let energy = currentState.global_energy;
  let coherence = currentState.coherence;
  let entropy = currentState.entropy;

  let fields = currentState.fields.map(f => ({ ...f }));
  let disturbances = currentState.disturbances.map(d => ({ ...d }));

  // 1. Process incoming event if provided
  if (event) {
    if (event.type === 'touch_impulse') {
      energy = Math.min(1.0, energy + event.intensity * 0.4);
      entropy = Math.min(1.0, entropy + event.intensity * 0.1);
      coherence = Math.max(0.0, coherence - event.intensity * 0.15);

      disturbances.push(clampDisturbance({
        id: `dist-${event.id}`,
        position: event.position,
        amplitude: event.intensity,
        decay_rate: 0.15,
        age: 0
      }));

      fields.push(clampField({
        id: `field-${event.id}`,
        type: 'radial_expansion',
        center: event.position,
        radius: event.parameters.radius || 0.05,
        intensity: event.intensity,
        frequency: 1.5
      }));
    } else if (event.type === 'continuous_drag') {
      energy = Math.min(1.0, energy + event.intensity * 0.25);
      const vec = event.parameters.vector || [0, 0];

      disturbances.push(clampDisturbance({
        id: `dist-drag-${event.id}`,
        position: event.position,
        amplitude: event.intensity * 0.8,
        decay_rate: 0.2,
        age: 0
      }));

      fields.push(clampField({
        id: `field-drag-${event.id}`,
        type: 'directional_flow',
        center: event.position,
        radius: 0.1,
        intensity: event.intensity,
        frequency: Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]) + 0.5
      }));
    } else if (event.type === 'message_event') {
      energy = Math.min(1.0, energy + event.intensity * 0.5);
      coherence = Math.min(1.0, coherence + 0.2);
      entropy = Math.max(0.0, entropy - 0.1);

      fields.push(clampField({
        id: `field-msg-${event.id}`,
        type: 'harmonic_standing_wave',
        center: [0.5, 0.5],
        radius: 0.4,
        intensity: event.intensity,
        frequency: 2.0
      }));
    } else if (event.type === 'field_reset') {
      energy = 0.1;
      coherence = 0.9;
      entropy = 0.05;
      fields = [];
      disturbances = [];
    }
  }

  // 2. State relaxation & natural physics over deltaTime
  energy = Math.max(0.0, energy - rule.energy_decay_rate * dt);
  coherence = Math.min(1.0, coherence + rule.coherence_recovery_rate * dt);
  entropy = Math.min(1.0, Math.max(0.0, entropy + rule.entropy_growth_rate * dt));

  // 3. Evolve fields (expansion)
  fields = fields
    .map(f => {
      const newRadius = f.radius + rule.propagation_speed * dt;
      const newIntensity = f.intensity * Math.exp(-0.2 * dt);
      return clampField({
        ...f,
        radius: newRadius,
        intensity: newIntensity
      });
    })
    .filter(f => f.intensity > 0.01 && f.radius < 1.5);

  // 4. Evolve disturbances (aging & attenuation)
  disturbances = disturbances
    .map(d => {
      const newAge = d.age + dt;
      const newAmp = d.amplitude * Math.exp(-d.decay_rate * dt);
      return clampDisturbance({
        ...d,
        age: newAge,
        amplitude: newAmp
      });
    })
    .filter(d => d.amplitude > 0.01);

  // 5. Calculate Superposition / Field Interactions
  disturbances = applySuperpositionInterference(disturbances, rule.superposition_threshold);

  return {
    version: '0.1.0',
    timestamp: roundDP(nextTimestamp),
    step: nextStep,
    global_energy: roundDP(energy),
    coherence: roundDP(coherence),
    entropy: roundDP(entropy),
    fields: fields.map(clampField),
    disturbances: disturbances.map(clampDisturbance)
  };
}

function applySuperpositionInterference(disturbances, threshold) {
  if (disturbances.length < 2) return disturbances;

  const result = [...disturbances];
  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      const d1 = result[i];
      const d2 = result[j];
      const dx = d1.position[0] - d2.position[0];
      const dy = d1.position[1] - d2.position[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < threshold && dist > 0.0001) {
        // Constructive interference raises local amplitude slightly, shifts position towards weighted center
        const totalAmp = d1.amplitude + d2.amplitude;
        const boost = 1.05; // 5% constructive resonance
        result[i].amplitude = roundDP(Math.min(1.0, d1.amplitude * boost));
        result[j].amplitude = roundDP(Math.min(1.0, d2.amplitude * boost));
      }
    }
  }
  return result;
}
