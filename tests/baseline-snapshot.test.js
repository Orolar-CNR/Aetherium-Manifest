import assert from "node:assert/strict";
import { simulateParticlePositionsCPU, computeBufferHash, generateBaselineMetadata } from "../testing/baseline-snapshot.js";

async function runTests() {
  console.log("Running baseline snapshot tests...");

  const manifestState = { phase: "LISTENING", shape: "sphere", hue: 195, energy: 0.3, density: 0.52, turbulence: 0.18, coherence: 0.84, confidence: 0.82 };

  // 1. Determinism test - same seed & state produces identical particle buffer
  const run1 = simulateParticlePositionsCPU({ count: 100, seed: 12345, manifestState, steps: 50 });
  const run2 = simulateParticlePositionsCPU({ count: 100, seed: 12345, manifestState, steps: 50 });
  assert.deepEqual(Array.from(run1), Array.from(run2));

  // 2. Hash consistency test
  const hash1 = await computeBufferHash(run1, "SHA-256");
  const hash2 = await computeBufferHash(run2, "SHA-256");
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(typeof hash1, "string");
  assert.strictEqual(hash1.length, 64);

  // 3. Different seed produces different hash
  const run3 = simulateParticlePositionsCPU({ count: 100, seed: 99999, manifestState, steps: 50 });
  const hash3 = await computeBufferHash(run3, "SHA-256");
  assert.notStrictEqual(hash1, hash3);

  // 4. Baseline Metadata JSON Schema conformance test
  const metadata = await generateBaselineMetadata({
    baselineId: "base-test-01",
    seed: 12345,
    stateId: "STATE_LISTENING",
    manifestState,
    entityCount: 100,
    simulationTimeMs: 1000,
    frameCount: 60,
    finalPositions: run1
  });

  assert.strictEqual(metadata.baseline_id, "base-test-01");
  assert.strictEqual(metadata.inputs.seed, 12345);
  assert.strictEqual(metadata.inputs.state_id, "STATE_LISTENING");
  assert.strictEqual(metadata.execution.entity_count, 100);
  assert.strictEqual(metadata.output_characteristics.snapshot_hash, hash1);
  assert.ok(Array.isArray(metadata.output_characteristics.spatial_bounds.min));
  assert.ok(Array.isArray(metadata.output_characteristics.spatial_bounds.max));

  console.log("✅ Baseline snapshot preservation & hashing tests passed");
}

runTests().catch(err => {
  console.error("❌ Baseline snapshot test failed:", err);
  process.exit(1);
});
