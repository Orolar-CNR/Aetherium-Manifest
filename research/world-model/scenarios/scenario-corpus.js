/**
 * Environmental Dynamics Runtime - Scenario Corpus (Research Only)
 */

import { createInitialWorldState } from '../world-state/world-state.js';
import { createEnvironmentalEvent } from '../event-model/event-model.js';

export const SCENARIO_A_SINGLE_TOUCH = {
  id: 'scenario-a-single-touch',
  name: 'Scenario A: Touch Impulse -> Local Field Disturbance -> Propagation',
  initialState: createInitialWorldState({ global_energy: 0.1, coherence: 0.9 }),
  events: [
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'touch-01',
        type: 'touch_impulse',
        timestamp: 0.1,
        position: [0.5, 0.5],
        intensity: 0.8,
        parameters: { radius: 0.05, force: 1.2 }
      })
    },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null }
  ]
};

export const SCENARIO_B_MULTI_TOUCH_INTERFERENCE = {
  id: 'scenario-b-multi-touch',
  name: 'Scenario B: Multi-touch Persistent Interference',
  initialState: createInitialWorldState({ global_energy: 0.1, coherence: 0.8 }),
  events: [
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'touch-101',
        type: 'touch_impulse',
        timestamp: 0.1,
        position: [0.3, 0.5],
        intensity: 0.7
      })
    },
    { deltaTime: 0.1, event: null },
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'touch-102',
        type: 'touch_impulse',
        timestamp: 0.3,
        position: [0.4, 0.5], // Overlaps within threshold 0.25
        intensity: 0.7
      })
    },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null }
  ]
};

export const SCENARIO_C_DRAG_DEFORMATION = {
  id: 'scenario-c-drag',
  name: 'Scenario C: Continuous Drag -> Directional Field Deformation',
  initialState: createInitialWorldState({ global_energy: 0.2, coherence: 0.7 }),
  events: [
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'drag-201',
        type: 'continuous_drag',
        timestamp: 0.1,
        position: [0.2, 0.5],
        intensity: 0.6,
        parameters: { vector: [0.4, -0.1] }
      })
    },
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'drag-202',
        type: 'continuous_drag',
        timestamp: 0.2,
        position: [0.4, 0.45],
        intensity: 0.8,
        parameters: { vector: [0.5, -0.1] }
      })
    },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null }
  ]
};

export const SCENARIO_D_MESSAGE_TRANSITION = {
  id: 'scenario-d-message',
  name: 'Scenario D: Signal Event -> Environmental State Transition',
  initialState: createInitialWorldState({ global_energy: 0.1, coherence: 0.5 }),
  events: [
    {
      deltaTime: 0.1,
      event: createEnvironmentalEvent({
        id: 'msg-301',
        type: 'message_event',
        timestamp: 0.1,
        position: [0.5, 0.5],
        intensity: 0.9,
        parameters: { text: 'Aetherium Resonance Input' }
      })
    },
    { deltaTime: 0.1, event: null },
    { deltaTime: 0.1, event: null }
  ]
};

export const ALL_SCENARIOS = [
  SCENARIO_A_SINGLE_TOUCH,
  SCENARIO_B_MULTI_TOUCH_INTERFERENCE,
  SCENARIO_C_DRAG_DEFORMATION,
  SCENARIO_D_MESSAGE_TRANSITION
];
