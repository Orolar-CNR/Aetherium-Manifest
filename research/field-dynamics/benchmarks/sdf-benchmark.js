/**
 * Research Candidate: Dynamic SDF Morphology Benchmark Suite
 * Status: RESEARCH / NON-CANONICAL
 *
 * Measures:
 * 1. Computational Cost (frame time, p50/p95 latency, memory)
 * 2. Resource Scaling across Profiles (LOW: 20k, MID: 100k, HIGH: 250k)
 * 3. Degradation Strategy Comparison (FULL -> REDUCED_DETAIL -> SIMPLIFIED -> SYMBOLIC -> MINIMAL)
 * 4. Determinism / Reproducibility Verification
 * 5. Morphological Fidelity Convergence
 */

import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import { SDFParticleEngine } from '../sdf/particle-engine.js';

async function runSDFBenchmark() {
  const fixturePath = path.resolve('research/field-dynamics/fixtures/sample-field.json');
  const sdfConfig = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  const benchmarkResults = {
    timestamp: new Date().toISOString(),
    document_id: "AETHERIUM-SDF-BENCHMARK-RUN-v0.1",
    status: "RESEARCH_NON_CANONICAL",
    scaling_experiments: [],
    degradation_experiments: [],
    determinism_check: null
  };

  console.log("=================================================");
  console.log("Aetherium Dynamic SDF Morphology Research Benchmark");
  console.log("Status: RESEARCH / NON-CANONICAL");
  console.log("=================================================\n");

  // 1. Resource Scaling Benchmark
  const profiles = [
    { name: 'LOW', particles: 20000 },
    { name: 'MID', particles: 100000 },
    { name: 'HIGH', particles: 250000 }
  ];

  console.log("--- 1. Resource Scaling Experiment ---");
  for (const prof of profiles) {
    const engine = new SDFParticleEngine(prof.particles, 42);
    const frameTimes = [];
    const steps = 30;

    for (let s = 0; s < steps; s++) {
      const t0 = performance.now();
      engine.step(sdfConfig, 0.016, s, 'FULL');
      const t1 = performance.now();
      frameTimes.push(t1 - t0);
    }

    frameTimes.sort((a, b) => a - b);
    const avg = frameTimes.reduce((a, b) => a + b, 0) / steps;
    const p50 = frameTimes[Math.floor(steps * 0.5)];
    const p95 = frameTimes[Math.floor(steps * 0.95)];
    const morphologyError = engine.computeMorphologyError(sdfConfig, steps, 'FULL');
    const memUse = process.memoryUsage().heapUsed / 1024 / 1024;

    const res = {
      profile: prof.name,
      particle_count: prof.particles,
      avg_frame_time_ms: Math.round(avg * 1000) / 1000,
      p50_frame_time_ms: Math.round(p50 * 1000) / 1000,
      p95_frame_time_ms: Math.round(p95 * 1000) / 1000,
      morphology_error: Math.round(morphologyError * 10000) / 10000,
      heap_used_mb: Math.round(memUse * 100) / 100
    };

    benchmarkResults.scaling_experiments.push(res);
    console.log(`[${prof.name}] Particles: ${prof.particles.toLocaleString()} | Avg: ${res.avg_frame_time_ms}ms | p95: ${res.p95_frame_time_ms}ms | Error: ${res.morphology_error}`);
  }

  // 2. Degradation Strategy Experiment
  console.log("\n--- 2. Degradation Strategy Comparison (MID Profile: 100,000 particles) ---");
  const degradationLevels = ['FULL', 'REDUCED_DETAIL', 'SIMPLIFIED', 'SYMBOLIC', 'MINIMAL_SAFE_FIELD'];

  for (const deg of degradationLevels) {
    const engine = new SDFParticleEngine(100000, 42);
    const frameTimes = [];
    const steps = 20;

    for (let s = 0; s < steps; s++) {
      const t0 = performance.now();
      engine.step(sdfConfig, 0.016, s, deg);
      const t1 = performance.now();
      frameTimes.push(t1 - t0);
    }

    frameTimes.sort((a, b) => a - b);
    const avg = frameTimes.reduce((a, b) => a + b, 0) / steps;
    const p95 = frameTimes[Math.floor(steps * 0.95)];
    const morphologyError = engine.computeMorphologyError(sdfConfig, steps, deg);

    const degRes = {
      degradation_level: deg,
      particle_count: 100000,
      avg_frame_time_ms: Math.round(avg * 1000) / 1000,
      p95_frame_time_ms: Math.round(p95 * 1000) / 1000,
      morphology_error: Math.round(morphologyError * 10000) / 10000
    };

    benchmarkResults.degradation_experiments.push(degRes);
    console.log(`[Degradation: ${deg.padEnd(20)}] Avg: ${degRes.avg_frame_time_ms}ms | p95: ${degRes.p95_frame_time_ms}ms | Error: ${degRes.morphology_error}`);
  }

  // 3. Determinism Verification
  console.log("\n--- 3. Determinism & Reproducibility Check ---");
  const engineA = new SDFParticleEngine(10000, 999);
  const engineB = new SDFParticleEngine(10000, 999);

  for (let s = 0; s < 20; s++) {
    engineA.step(sdfConfig, 0.016, s, 'FULL');
    engineB.step(sdfConfig, 0.016, s, 'FULL');
  }

  const snapA = engineA.exportSnapshot();
  const snapB = engineB.exportSnapshot();
  const isDeterministic = snapA.sampleSum === snapB.sampleSum &&
                          snapA.firstParticle[0] === snapB.firstParticle[0];

  benchmarkResults.determinism_check = {
    seed: 999,
    particle_count: 10000,
    is_deterministic: isDeterministic,
    hash_match: snapA.sampleSum === snapB.sampleSum,
    sampleSum_A: snapA.sampleSum,
    sampleSum_B: snapB.sampleSum
  };

  console.log(`Deterministic Match: ${isDeterministic ? '✅ PASS' : '❌ FAIL'} (Sum A: ${snapA.sampleSum}, Sum B: ${snapB.sampleSum})`);

  // Write Benchmark Summary Report to JSON
  const outputPath = path.resolve('research/field-dynamics/benchmarks/benchmark-summary.json');
  fs.writeFileSync(outputPath, JSON.stringify(benchmarkResults, null, 2), 'utf8');
  console.log(`\nBenchmark execution completed. Results written to: ${outputPath}`);

  return benchmarkResults;
}

if (process.argv[1] && process.argv[1].endsWith('sdf-benchmark.js')) {
  runSDFBenchmark().catch(err => {
    console.error("Benchmark failed:", err);
    process.exit(1);
  });
}

export { runSDFBenchmark };
