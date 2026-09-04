/**
 * Test Suite: Dynamic SDF Morphology Research Module
 * Status: RESEARCH / NON-CANONICAL
 *
 * Verifies correctness, determinism, multi-layer field evaluation,
 * and degradation behavior of the isolated experimental SDF module.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { SDFPrimitives } from '../research/field-dynamics/sdf/primitives.js';
import { SDFFieldEvaluator } from '../research/field-dynamics/sdf/evaluator.js';
import { SDFParticleEngine } from '../research/field-dynamics/sdf/particle-engine.js';

console.log("Starting Dynamic SDF Morphology Research Tests...\n");

// Test 1: Analytical Primitives
{
  const sphereDist = SDFPrimitives.sphere([2.0, 0, 0], 1.0);
  assert.strictEqual(sphereDist, 1.0, "Sphere distance at (2,0,0) with r=1 should be 1.0");

  const boxDist = SDFPrimitives.box([2.0, 0, 0], [1.0, 1.0, 1.0]);
  assert.strictEqual(boxDist, 1.0, "Box distance at (2,0,0) with halfExtents=1 should be 1.0");

  const torusDist = SDFPrimitives.torus([1.5, 0, 0], [1.0, 0.25]);
  assert.strictEqual(torusDist, 0.25, "Torus distance at (1.5,0,0) with R=1.0, r=0.25 should be 0.25");

  console.log("✅ Test 1: SDF Primitives mathematical correctness verified");
}

// Test 2: Finite Difference Gradient Computation
{
  const config = { layers: { foreground: { type: 'sphere', radius: 1.0 } } };
  const grad = SDFFieldEvaluator.computeGradient([2.0, 0, 0], config, 0, 'FULL');
  assert.strictEqual(Math.round(grad[0]), 1, "Gradient on x-axis for sphere at (2,0,0) should point along +x");
  assert.strictEqual(Math.round(grad[1]), 0, "Gradient y-component should be 0");
  assert.strictEqual(Math.round(grad[2]), 0, "Gradient z-component should be 0");

  console.log("✅ Test 2: Finite difference gradient vector computation verified");
}

// Test 3: Multi-Layer Evaluator & Degradation Fallbacks
{
  const config = JSON.parse(fs.readFileSync(path.resolve('research/field-dynamics/fixtures/sample-field.json'), 'utf8'));

  const distFull = SDFFieldEvaluator.evaluateMultiLayer([0, 0, 0], config, 0, 'FULL');
  const distMin = SDFFieldEvaluator.evaluateMultiLayer([0, 0, 0], config, 0, 'MINIMAL_SAFE_FIELD');

  assert.notStrictEqual(distFull, distMin, "Full evaluation and Minimal Safe Field evaluation should produce distinct values");
  assert.strictEqual(distMin, -0.5, "Minimal Safe Field should evaluate sphere of radius 0.5 at origin to -0.5");

  console.log("✅ Test 3: Multi-layer evaluation & degradation strategies verified");
}

// Test 4: Determinism Guarantee (Same seed + same input = identical outcome)
{
  const config = JSON.parse(fs.readFileSync(path.resolve('research/field-dynamics/fixtures/sample-field.json'), 'utf8'));

  const engine1 = new SDFParticleEngine(1000, 777);
  const engine2 = new SDFParticleEngine(1000, 777);

  for (let i = 0; i < 10; i++) {
    engine1.step(config, 0.016, i, 'FULL');
    engine2.step(config, 0.016, i, 'FULL');
  }

  const snap1 = engine1.exportSnapshot();
  const snap2 = engine2.exportSnapshot();

  assert.strictEqual(snap1.sampleSum, snap2.sampleSum, "Deterministic sample sums must match exactly for identical seeds");
  assert.deepStrictEqual(snap1.firstParticle, snap2.firstParticle, "First particle positions must match exactly");

  console.log("✅ Test 4: Determinism & reproducibility guarantee verified");
}

// Test 5: Particle Convergence towards Isosurface d(x)=0
{
  const config = JSON.parse(fs.readFileSync(path.resolve('research/field-dynamics/fixtures/sample-field.json'), 'utf8'));
  const engine = new SDFParticleEngine(500, 101);

  const initialError = engine.computeMorphologyError(config, 0, 'FULL');
  for (let i = 0; i < 30; i++) {
    engine.step(config, 0.016, i, 'FULL');
  }
  const finalError = engine.computeMorphologyError(config, 30, 'FULL');

  assert.ok(finalError < initialError, `Morphological error must decrease (Initial: ${initialError.toFixed(4)}, Final: ${finalError.toFixed(4)})`);

  console.log(`✅ Test 5: Particle convergence verified (Error reduced from ${initialError.toFixed(4)} to ${finalError.toFixed(4)})`);
}

console.log("\nAll Dynamic SDF Research Tests Completed Successfully! 🎉");
