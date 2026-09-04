/**
 * Environmental Dynamics Runtime - Environmental Event Model (Research Only)
 */

import { roundDP } from '../world-state/world-state.js';

export const VALID_EVENT_TYPES = [
  'touch_impulse',
  'continuous_drag',
  'message_event',
  'field_reset'
];

export function createEnvironmentalEvent({
  id,
  type = 'touch_impulse',
  timestamp = 0,
  position = [0.5, 0.5],
  intensity = 0.5,
  parameters = {}
}) {
  if (!VALID_EVENT_TYPES.includes(type)) {
    throw new Error(`Invalid EnvironmentalEvent type: ${type}`);
  }

  return {
    id: id || `evt-${Math.random().toString(36).slice(2, 8)}`,
    type,
    timestamp: roundDP(timestamp),
    position: [roundDP(position[0] ?? 0.5), roundDP(position[1] ?? 0.5)],
    intensity: roundDP(Math.max(0, Math.min(1, intensity))),
    parameters: {
      radius: roundDP(parameters.radius ?? 0.05),
      force: roundDP(parameters.force ?? 1.0),
      vector: [
        roundDP(parameters.vector?.[0] ?? 0),
        roundDP(parameters.vector?.[1] ?? 0)
      ],
      text: parameters.text || ''
    }
  };
}
