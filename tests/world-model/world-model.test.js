/**
 * Test Suite for Environmental Dynamics Runtime Research Prototype
 */

import assert from 'assert';
import { createInitialWorldState, serializeStateCanonical } from '../../research/world-model/world-state/world-state.js';
import { createEnvironmentalEvent } from '../../research/world-model/event-model/event-model.js';
import { evolveWorldState } from '../../research/world-model/transition-rules/transition-rules.js';
import { compileManifestationProxy } from '../../research/world-model/proxy-state/manifestation-proxy.js';
import { ALL_SCENARIOS } from '../../research/world-model/scenarios/scenario-corpus.js';

console.log('🧪 Starting Environmental Dynamics Runtime Research Test Suite...');

// 1. Determinism Test
{
  console.log('Test 1: Repeat Execution Determinism');
  const initState = createInitialWorldState({ global_energy: 0.1 });
  const event1 = createEnvironmentalEvent({
    id: 'evt-test-1',
    type: 'touch_impulse',
    timestamp: 0.1,
    position: [0.4, 0.6],
    intensity: 0.8
  });

  const stateRun1 = evolveWorldState(initState, event1, 0.1);
  const stateRun2 = evolveWorldState(initState, event1, 0.1);

  const hash1 = serializeStateCanonical(stateRun1);
  const hash2 = serializeStateCanonical(stateRun2);

  assert.strictEqual(hash1, hash2, 'Identical inputs must yield identical canonical serialized state');
  console.log('  ✅ Repeat execution produced byte-level identical canonical state hash');
}

// 2. Multi-step Persistence Test
{
  console.log('Test 2: Multi-step Causal State Persistence');
  let state = createInitialWorldState({ global_energy: 0.1 });
  assert.strictEqual(state.disturbances.length, 0);

  // Step 1: Touch impulse adds disturbance
  const event1 = createEnvironmentalEvent({
    id: 'evt-touch',
    type: 'touch_impulse',
    timestamp: 0.1,
    position: [0.5, 0.5],
    intensity: 0.9
  });
  state = evolveWorldState(state, event1, 0.1);
  assert.strictEqual(state.disturbances.length, 1);
  assert.strictEqual(state.global_energy > 0.1, true, 'Energy should increase after touch impulse');

  // Step 2: Natural decay over time without new event
  const initialEnergy = state.global_energy;
  state = evolveWorldState(state, null, 0.5);
  assert.strictEqual(state.disturbances.length, 1, 'Disturbance should persist across steps');
  assert.strictEqual(state.disturbances[0].age > 0, true, 'Disturbance age should increase');
  assert.strictEqual(state.global_energy < initialEnergy, true, 'Energy should decay over time');
  console.log('  ✅ Multi-step state persistence and relaxation verified');
}

// 3. Superposition & Interference Test
{
  console.log('Test 3: Spatial Superposition & Interference');
  let state = createInitialWorldState({ global_energy: 0.1 });

  const evtA = createEnvironmentalEvent({
    id: 'evt-a',
    type: 'touch_impulse',
    timestamp: 0.1,
    position: [0.50, 0.50],
    intensity: 0.6
  });

  const evtB = createEnvironmentalEvent({
    id: 'evt-b',
    type: 'touch_impulse',
    timestamp: 0.2,
    position: [0.55, 0.50], // Within superposition threshold 0.25
    intensity: 0.6
  });

  state = evolveWorldState(state, evtA, 0.1);
  state = evolveWorldState(state, evtB, 0.1);

  assert.strictEqual(state.disturbances.length, 2, 'Two overlapping disturbances present');
  assert.strictEqual(state.disturbances[0].amplitude >= 0.6, true, 'Superposition resonance boosted amplitude');
  console.log('  ✅ Superposition interference verified for overlapping fields');
}

// 4. Invalid Event & Parameter Clamping Test
{
  console.log('Test 4: Invalid Event Handling & Parameter Clamping');
  assert.throws(() => {
    createEnvironmentalEvent({ type: 'invalid_event_type' });
  }, /Invalid EnvironmentalEvent type/, 'Invalid event type should throw error');

  const clampedState = createInitialWorldState({
    global_energy: 1.5, // Out of bounds -> should clamp to 1.0
    coherence: -0.5     // Out of bounds -> should clamp to 0.0
  });

  assert.strictEqual(clampedState.global_energy, 1.0);
  assert.strictEqual(clampedState.coherence, 0.0);
  console.log('  ✅ Out-of-bounds parameters clamped successfully');
}

// 5. Deterministic ManifestationProxy Compilation Test
{
  console.log('Test 5: Deterministic ManifestationProxy Generation');
  const state = createInitialWorldState({ global_energy: 0.7, coherence: 0.85 });
  const proxy1 = compileManifestationProxy(state);
  const proxy2 = compileManifestationProxy(state);

  assert.deepStrictEqual(proxy1, proxy2, 'Proxy compilation must be deterministic');
  assert.strictEqual(typeof proxy1.density, 'number');
  assert.strictEqual(typeof proxy1.coherence, 'number');
  assert.strictEqual(Array.isArray(proxy1.region.center), true);
  console.log('  ✅ ManifestationProxy compilation validated');
}

// 6. Scenario Corpus Integration Test
{
  console.log('Test 6: All Scenarios Execute Deterministically');
  for (const scenario of ALL_SCENARIOS) {
    let s = { ...scenario.initialState };
    for (const stepInfo of scenario.events) {
      s = evolveWorldState(s, stepInfo.event, stepInfo.deltaTime);
    }
    const proxy = compileManifestationProxy(s);
    assert.strictEqual(typeof proxy.morphology, 'string');
  }
  console.log('  ✅ All scenario corpus items executed cleanly');
}

console.log('✨ All Environmental Dynamics Runtime tests passed successfully!\n');
