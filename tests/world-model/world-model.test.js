/**
 * Test Suite for Environmental Dynamics Runtime Research Prototype
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { createInitialWorldState, serializeStateCanonical } from '../../research/world-model/world-state/world-state.js';
import { createEnvironmentalEvent } from '../../research/world-model/event-model/event-model.js';
import { evolveWorldState } from '../../research/world-model/transition-rules/transition-rules.js';
import { compileManifestationProxy } from '../../research/world-model/proxy-state/manifestation-proxy.js';
import { ALL_SCENARIOS } from '../../research/world-model/scenarios/scenario-corpus.js';

import {
  calculateAnalyticalOracle,
  simulateExperimentalState,
  evaluateDifferentialComparison,
  runConvergenceExperiment,
  addVector,
  scaleVector,
  subtractVector,
  cloneState
} from './harness.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting Environmental Dynamics Runtime Research Test Suite...');

// Load scenario fixture
const fixturePath = path.join(__dirname, 'fixtures', 'scenario-t1.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

// Test A — Analytical Oracle
{
  console.log('Test A: Analytical Oracle closed-form calculation');
  const oracleResult = calculateAnalyticalOracle(fixture.initialState, fixture.targetTime);

  // P(1.0) = [0,0,0] + [1.5,0,0]*1 + 0.5*[0.5,0,0]*1^2 = [1.75, 0, 0]
  // V(1.0) = [1.5,0,0] + [0.5,0,0]*1 = [2.0, 0, 0]
  assert.strictEqual(oracleResult.position[0], 1.75, 'Position X should be 1.75');
  assert.strictEqual(oracleResult.position[1], 0, 'Position Y should be 0');
  assert.strictEqual(oracleResult.position[2], 0, 'Position Z should be 0');
  assert.strictEqual(oracleResult.velocity[0], 2.0, 'Velocity X should be 2.0');
  console.log('  ✅ Analytical Oracle produced exact closed-form analytical reference');
}

// Test B — Numerical Integrator
{
  console.log('Test B: Semi-Implicit Euler state step advancement');
  const experimentalResult = simulateExperimentalState(fixture.initialState, fixture.timestep, fixture.substeps);
  assert.strictEqual(experimentalResult.elapsedTime, 1.0, 'Elapsed time should equal 1.0');
  assert.strictEqual(typeof experimentalResult.position[0], 'number');
  assert.strictEqual(typeof experimentalResult.velocity[0], 'number');
  console.log('  ✅ Numerical Integrator advanced state step-by-step iteratively');
}

// Test C — Oracle Coupling Guard (Non-zero approximation error assertion)
{
  console.log('Test C: Oracle Coupling Guard (Divergence Check)');
  const evalResult = evaluateDifferentialComparison(fixture);
  assert.strictEqual(evalResult.positionError > 0, true, 'Position error must be non-zero for non-zero acceleration');
  console.log(`  ✅ Oracle coupling broken: measurable non-zero position error observable (${evalResult.positionError.toFixed(6)})`);
}

// Test D — Differential Comparison & Tolerances
{
  console.log('Test D: Differential Comparison against declared tolerances');
  const evalResult = evaluateDifferentialComparison(fixture);
  assert.strictEqual(evalResult.status, 'WITHIN_TOLERANCE', 'Experiment status must be WITHIN_TOLERANCE');
  assert.strictEqual(evalResult.positionError <= fixture.tolerances.position.absolute, true);
  assert.strictEqual(evalResult.velocityError <= fixture.tolerances.velocity.absolute, true);
  console.log(`  ✅ Differential comparison passed (Position Error: ${evalResult.positionError}, Velocity Error: ${evalResult.velocityError})`);
}

// Test E — Time Consistency
{
  console.log('Test E: Time Consistency Guard');
  const invalidFixture = { ...fixture, targetTime: 2.0 }; // timestep 0.01 * 100 = 1.0 != 2.0
  assert.throws(() => {
    evaluateDifferentialComparison(invalidFixture);
  }, /Invalid experiment configuration/, 'Mismatch between achievedTime and targetTime must throw');
  console.log('  ✅ Time consistency guard rejected mismatched experiment configuration');
}

// Test F — Deterministic Replay
{
  console.log('Test F: Deterministic Replay Test');
  const res1 = simulateExperimentalState(fixture.initialState, fixture.timestep, fixture.substeps);
  const res2 = simulateExperimentalState(fixture.initialState, fixture.timestep, fixture.substeps);
  assert.deepStrictEqual(res1.position, res2.position, 'Position output must be bitwise identical for identical runs');
  assert.deepStrictEqual(res1.velocity, res2.velocity, 'Velocity output must be bitwise identical for identical runs');
  console.log('  ✅ Deterministic replay verified: identical numeric results across runs');
}

// Test G — Convergence Experiment
{
  console.log('Test G: Convergence Experiment across decreasing timesteps');
  const timesteps = [0.1, 0.05, 0.01, 0.005, 0.001];
  const convergenceResults = runConvergenceExperiment(
    fixture.initialState,
    fixture.targetTime,
    timesteps,
    fixture.tolerances
  );

  for (let i = 1; i < convergenceResults.length; i++) {
    const prev = convergenceResults[i - 1];
    const curr = convergenceResults[i];
    assert.strictEqual(
      curr.positionError < prev.positionError,
      true,
      `Position error for dt=${curr.timestep} (${curr.positionError}) must be smaller than for dt=${prev.timestep} (${prev.positionError})`
    );
  }

  console.log('  ✅ Convergence verified: smaller timesteps strictly reduced position error');
  console.log('  📊 Observed Convergence Results:');
  convergenceResults.forEach(r => {
    const rateStr = r.observedRate !== null ? ` (observed rate p ≈ ${r.observedRate.toFixed(2)})` : '';
    console.log(`     dt = ${r.timestep.toString().padEnd(5)} | pos error = ${r.positionError.toFixed(8)}${rateStr}`);
  });
}

// Test H — Regression Tests (Original Environmental Dynamics Runtime Tests)

// H1. Determinism Test
{
  console.log('Test H1: Repeat Execution Determinism (Original)');
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

// H2. Multi-step Persistence Test
{
  console.log('Test H2: Multi-step Causal State Persistence (Original)');
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

// H3. Superposition & Interference Test
{
  console.log('Test H3: Spatial Superposition & Interference (Original)');
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

// H4. Invalid Event & Parameter Clamping Test
{
  console.log('Test H4: Invalid Event Handling & Parameter Clamping (Original)');
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

// H5. Deterministic ManifestationProxy Compilation Test
{
  console.log('Test H5: Deterministic ManifestationProxy Generation (Original)');
  const state = createInitialWorldState({ global_energy: 0.7, coherence: 0.85 });
  const proxy1 = compileManifestationProxy(state);
  const proxy2 = compileManifestationProxy(state);

  assert.deepStrictEqual(proxy1, proxy2, 'Proxy compilation must be deterministic');
  assert.strictEqual(typeof proxy1.density, 'number');
  assert.strictEqual(typeof proxy1.coherence, 'number');
  assert.strictEqual(Array.isArray(proxy1.region.center), true);
  console.log('  ✅ ManifestationProxy compilation validated');
}

// H6. Scenario Corpus Integration Test
{
  console.log('Test H6: All Scenarios Execute Deterministically (Original)');
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

console.log('✨ All Environmental Dynamics Runtime & Harness tests passed successfully!\n');
