import assert from "node:assert/strict";
import { CANONICAL_PERCEPTUAL_FIXTURES, getFixtureById, getRandomizedTrialSet } from "../testing/perceptual-fixtures.js";
import { PerceptualEvaluationSession } from "../testing/perceptual-harness.js";

function runTests() {
  console.log("Running perceptual evaluation harness tests...");

  // 1. Check canonical fixtures presence and sanity
  assert.ok(Array.isArray(CANONICAL_PERCEPTUAL_FIXTURES));
  assert.strictEqual(CANONICAL_PERCEPTUAL_FIXTURES.length, 7);
  const listening = getFixtureById("FIX-LISTENING-01");
  assert.strictEqual(listening.ground_truth_state, "LISTENING");

  // 2. Randomized trial set reproducibility
  const set1 = getRandomizedTrialSet(100);
  const set2 = getRandomizedTrialSet(100);
  assert.deepEqual(set1, set2);

  // 3. Test Session lifecycle & recording
  const session = new PerceptualEvaluationSession({ sessionId: "test-sess-01", seed: 100 });
  session.startSession();

  let trial = session.getCurrentTrial();
  assert.strictEqual(trial.trialIndex, 0);

  // Simulate 100ms response time
  const recorded = session.recordResponse({ participantChoice: trial.manifestState.phase, confidenceScore: 4 });
  assert.strictEqual(recorded.recorded.is_correct, true);
  assert.strictEqual(recorded.recorded.confidence_score, 4);

  // Record remaining trials
  while (!session.completed) {
    const cur = session.getCurrentTrial();
    if (!cur) break;
    session.recordResponse({ participantChoice: cur.manifestState.phase, confidenceScore: 5 });
  }

  const result = session.exportStructuredResult();
  assert.strictEqual(result.session_id, "test-sess-01");
  assert.strictEqual(result.summary_metrics.recognition_accuracy_pct, 100);
  assert.strictEqual(result.summary_metrics.avg_confidence_score, 4.86);
  assert.ok(result.summary_metrics.confusion_matrix["LISTENING"]["LISTENING"] >= 1);

  console.log("✅ Perceptual evaluation harness tests passed");
}

runTests();
