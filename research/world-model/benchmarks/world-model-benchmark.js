/**
 * Environmental Dynamics Runtime Benchmark & Output Generator (Research Only)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_SCENARIOS } from '../scenarios/scenario-corpus.js';
import { evolveWorldState } from '../transition-rules/transition-rules.js';
import { serializeStateCanonical } from '../world-state/world-state.js';
import { compileManifestationProxy } from '../proxy-state/manifestation-proxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESULTS_DIR = path.join(__dirname, 'results');

export function runBenchmark() {
  const startTimeMs = Date.now();
  const scenarioResults = [];

  for (const scenario of ALL_SCENARIOS) {
    const scStartTime = performance.now();

    // Run 1: Primary Run
    let stateRun1 = { ...scenario.initialState };
    const stepTraceRun1 = [];

    for (const stepInfo of scenario.events) {
      stateRun1 = evolveWorldState(stateRun1, stepInfo.event, stepInfo.deltaTime);
      stepTraceRun1.push({
        step: stateRun1.step,
        timestamp: stateRun1.timestamp,
        energy: stateRun1.global_energy,
        coherence: stateRun1.coherence,
        field_count: stateRun1.fields.length,
        disturbance_count: stateRun1.disturbances.length,
        canonical_hash: serializeStateCanonical(stateRun1)
      });
    }

    const proxyRun1 = compileManifestationProxy(stateRun1);

    // Run 2: Determinism Verification Run
    let stateRun2 = { ...scenario.initialState };
    for (const stepInfo of scenario.events) {
      stateRun2 = evolveWorldState(stateRun2, stepInfo.event, stepInfo.deltaTime);
    }
    const hash1 = serializeStateCanonical(stateRun1);
    const hash2 = serializeStateCanonical(stateRun2);
    const deterministicPass = (hash1 === hash2);

    const scEndTime = performance.now();

    scenarioResults.push({
      scenario_id: scenario.id,
      name: scenario.name,
      steps_executed: scenario.events.length,
      execution_time_ms: Math.round((scEndTime - scStartTime) * 1000) / 1000,
      determinism: {
        pass: deterministicPass,
        run1_canonical_json: hash1,
        run2_canonical_json: hash2
      },
      final_state: stateRun1,
      manifestation_proxy: proxyRun1,
      step_trace: stepTraceRun1
    });
  }

  const totalTimeMs = Date.now() - startTimeMs;

  const benchmarkResult = {
    metadata: {
      title: 'Aetherium Environmental Dynamics Runtime Benchmark',
      status: 'RESEARCH | NON-CANONICAL | EXPERIMENTAL',
      timestamp: new Date().toISOString(),
      execution_time_ms: totalTimeMs,
      node_version: process.version,
      platform: process.platform,
      total_scenarios: ALL_SCENARIOS.length,
      all_deterministic_passed: scenarioResults.every(r => r.determinism.pass)
    },
    scenarios: scenarioResults
  };

  // Ensure output directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  // Write JSON result
  const jsonPath = path.join(RESULTS_DIR, 'world-model-benchmark.json');
  fs.writeFileSync(jsonPath, JSON.stringify(benchmarkResult, null, 2), 'utf-8');

  // Write Markdown summary
  const mdPath = path.join(RESULTS_DIR, 'world-model-benchmark.md');
  const mdContent = generateMarkdownReport(benchmarkResult);
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  console.log(`✅ Benchmark completed in ${totalTimeMs}ms.`);
  console.log(`📊 JSON Report: ${jsonPath}`);
  console.log(`📝 MD Report: ${mdPath}`);
  console.log(`🎯 Determinism Status: ${benchmarkResult.metadata.all_deterministic_passed ? '100% PASSED' : 'FAILED'}`);

  return benchmarkResult;
}

function generateMarkdownReport(result) {
  let md = `# Aetherium Environmental Dynamics Runtime Benchmark Report\n\n`;
  md += `**Status:** ${result.metadata.status}  \n`;
  md += `**Timestamp:** ${result.metadata.timestamp}  \n`;
  md += `**Total Execution Time:** ${result.metadata.execution_time_ms} ms  \n`;
  md += `**Determinism Result:** ${result.metadata.all_deterministic_passed ? '✅ 100% PASS' : '❌ FAIL'}  \n\n`;
  md += `---\n\n## Executive Summary\n\n`;
  md += `This benchmark validates the **Environmental Dynamics Runtime** research prototype. It tests whether Aetherium can evolve persistent environmental state deterministically and compile \`ManifestationProxy\` bounds without relying on canonical renderers.\n\n`;
  md += `---\n\n## Scenario Results\n\n`;

  for (const sc of result.scenarios) {
    md += `### ${sc.name} (${sc.scenario_id})\n\n`;
    md += `* **Steps Executed:** ${sc.steps_executed}\n`;
    md += `* **Execution Time:** ${sc.execution_time_ms} ms\n`;
    md += `* **Determinism Verification:** ${sc.determinism.pass ? '✅ PASSED (Exact Canonical Equality)' : '❌ FAILED'}\n`;
    md += `* **Final Energy:** ${sc.final_state.global_energy}\n`;
    md += `* **Final Coherence:** ${sc.final_state.coherence}\n`;
    md += `* **Active Fields:** ${sc.final_state.fields.length}\n`;
    md += `* **Active Disturbances:** ${sc.final_state.disturbances.length}\n\n`;
    md += `#### Compiled Manifestation Proxy\n\`\`\`json\n${JSON.stringify(sc.manifestation_proxy, null, 2)}\n\`\`\`\n\n---\n\n`;
  }

  md += `*End of Benchmark Report*\n`;
  return md;
}

if (process.argv[1] && process.argv[1].includes('world-model-benchmark.js')) {
  runBenchmark();
}
