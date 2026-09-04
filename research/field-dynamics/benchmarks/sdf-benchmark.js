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
import os from 'os';
import { execSync } from 'child_process';
import { SDFParticleEngine } from '../sdf/particle-engine.js';

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (_) {
    return 'UNAVAILABLE';
  }
}

function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage && process.memoryUsage().heapUsed) {
    const heapUsedMb = process.memoryUsage().heapUsed / 1024 / 1024;
    return `${Math.round(heapUsedMb * 100) / 100} MB`;
  }
  return 'UNAVAILABLE';
}

async function runSDFBenchmark() {
  const fixturePath = path.resolve('research/field-dynamics/fixtures/sample-field.json');
  const sdfConfig = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  const gitCommit = getGitCommit();
  const timestamp = new Date().toISOString();
  const envInfo = `${process.title || 'node'} ${process.version} (${process.platform} ${process.arch})`;
  const deviceRuntimeInfo = `${os.type()} ${os.release()} | CPUs: ${os.cpus().length} x ${os.cpus()[0]?.model || 'Generic CPU'} | Total Mem: ${Math.round(os.totalmem() / 1024 / 1024)} MB`;

  const benchmarkResults = {
    timestamp: timestamp,
    git_commit: gitCommit,
    environment: envInfo,
    device_runtime_information: deviceRuntimeInfo,
    document_id: "AETHERIUM-SDF-BENCHMARK-RUN-v0.1",
    status: "RESEARCH_NON_CANONICAL",
    configuration: {
      steps_per_experiment: 30,
      time_step: 0.016,
      sdf_resolution: "UNAVAILABLE", // Grid resolution not applicable to analytic SDF evaluator
      sdf_layer_count: 3 // Background, Primary, Accent layers in sample field
    },
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
    const memUse = getMemoryUsage();

    const res = {
      profile: prof.name,
      particle_count: prof.particles,
      sdf_resolution: "UNAVAILABLE",
      sdf_layer_count: 3,
      frame_time: `${Math.round(avg * 1000) / 1000} ms`,
      p50_frame_time: `${Math.round(p50 * 1000) / 1000} ms`,
      p95_frame_time: `${Math.round(p95 * 1000) / 1000} ms`,
      memory_usage: memUse,
      degradation_configuration: 'FULL',
      observed_result: `Average frame time ${Math.round(avg * 1000) / 1000} ms with morphology error ${Math.round(morphologyError * 10000) / 10000}`
    };

    benchmarkResults.scaling_experiments.push(res);
    console.log(`[${prof.name}] Particles: ${prof.particles.toLocaleString()} | Frame Time: ${res.frame_time} | p95: ${res.p95_frame_time} | Error: ${res.observed_result}`);
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
    const p50 = frameTimes[Math.floor(steps * 0.5)];
    const p95 = frameTimes[Math.floor(steps * 0.95)];
    const morphologyError = engine.computeMorphologyError(sdfConfig, steps, deg);
    const memUse = getMemoryUsage();

    const degRes = {
      degradation_configuration: deg,
      particle_count: 100000,
      sdf_resolution: "UNAVAILABLE",
      sdf_layer_count: deg === 'MINIMAL_SAFE_FIELD' ? 1 : 3,
      frame_time: `${Math.round(avg * 1000) / 1000} ms`,
      p50_frame_time: `${Math.round(p50 * 1000) / 1000} ms`,
      p95_frame_time: `${Math.round(p95 * 1000) / 1000} ms`,
      memory_usage: memUse,
      observed_result: `Average frame time ${Math.round(avg * 1000) / 1000} ms with morphology error ${Math.round(morphologyError * 10000) / 10000}`
    };

    benchmarkResults.degradation_experiments.push(degRes);
    console.log(`[Degradation: ${deg.padEnd(20)}] Frame Time: ${degRes.frame_time} | p95: ${degRes.p95_frame_time} | Result: ${degRes.observed_result}`);
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
    sdf_resolution: "UNAVAILABLE",
    sdf_layer_count: 3,
    determinism_result: isDeterministic ? "PASS" : "FAIL",
    hash_match: snapA.sampleSum === snapB.sampleSum,
    sampleSum_A: snapA.sampleSum,
    sampleSum_B: snapB.sampleSum,
    observed_result: `Deterministic state sum match: ${snapA.sampleSum}`
  };

  console.log(`Deterministic Match: ${isDeterministic ? '✅ PASS' : '❌ FAIL'} (Sum A: ${snapA.sampleSum}, Sum B: ${snapB.sampleSum})`);

  // Ensure target output directory exists
  const resultsDir = path.resolve('research/field-dynamics/benchmarks/results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Write JSON report
  const jsonPath = path.join(resultsDir, 'sdf-benchmark-result.json');
  fs.writeFileSync(jsonPath, JSON.stringify(benchmarkResults, null, 2), 'utf8');

  // Generate Markdown report
  const mdReport = `# Aetherium Dynamic SDF Morphology Benchmark Report

**Status:** RESEARCH / NON-CANONICAL
**Timestamp:** ${timestamp}
**Git Commit:** \`${gitCommit}\`
**Environment:** ${envInfo}
**Device / Runtime Information:** ${deviceRuntimeInfo}

---

## 1. Executive Summary

- **Determinism Result:** \`${benchmarkResults.determinism_check.determinism_result}\`
- **SDF Resolution:** \`${benchmarkResults.configuration.sdf_resolution}\`
- **SDF Layer Count:** \`${benchmarkResults.configuration.sdf_layer_count}\`

---

## 2. Resource Scaling Experiments

| Profile | Particle Count | Frame Time | p50 Frame Time | p95 Frame Time | Memory Usage | Degradation | Observed Result |
|---|---|---|---|---|---|---|---|
${benchmarkResults.scaling_experiments.map(e => `| ${e.profile} | ${e.particle_count.toLocaleString()} | ${e.frame_time} | ${e.p50_frame_time} | ${e.p95_frame_time} | ${e.memory_usage} | ${e.degradation_configuration} | ${e.observed_result} |`).join('\n')}

---

## 3. Degradation Strategy Experiments

| Degradation Config | Particle Count | Frame Time | p50 Frame Time | p95 Frame Time | Memory Usage | Observed Result |
|---|---|---|---|---|---|---|
${benchmarkResults.degradation_experiments.map(e => `| ${e.degradation_configuration} | ${e.particle_count.toLocaleString()} | ${e.frame_time} | ${e.p50_frame_time} | ${e.p95_frame_time} | ${e.memory_usage} | ${e.observed_result} |`).join('\n')}

---

## 4. Determinism Verification

- **Seed:** \`${benchmarkResults.determinism_check.seed}\`
- **Particle Count:** \`${benchmarkResults.determinism_check.particle_count}\`
- **Determinism Result:** \`${benchmarkResults.determinism_check.determinism_result}\`
- **Observed Result:** \`${benchmarkResults.determinism_check.observed_result}\`
`;

  const mdPath = path.join(resultsDir, 'sdf-benchmark-result.md');
  fs.writeFileSync(mdPath, mdReport, 'utf8');

  console.log(`\nBenchmark execution completed.`);
  console.log(`Machine-readable output: ${jsonPath}`);
  console.log(`Human-readable report: ${mdPath}`);

  return benchmarkResults;
}

if (process.argv[1] && process.argv[1].endsWith('sdf-benchmark.js')) {
  runSDFBenchmark().catch(err => {
    console.error("Benchmark failed:", err);
    process.exit(1);
  });
}

export { runSDFBenchmark };
