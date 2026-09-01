import { CANONICAL_PERCEPTUAL_FIXTURES, getRandomizedTrialSet } from "./perceptual-fixtures.js";

/**
 * Perceptual Evaluation Protocol Session Orchestrator
 */
export class PerceptualEvaluationSession {
  constructor({ sessionId, participantId, rendererBackend = "auto", seed = 42 } = {}) {
    this.sessionId = sessionId || `session-${Math.random().toString(36).substring(2, 10)}`;
    this.participantId = participantId || "anonymous";
    this.rendererBackend = rendererBackend;
    this.seed = seed;
    this.trials = [];
    this.currentTrialIndex = 0;
    this.trialSet = getRandomizedTrialSet(seed);
    this.startTime = null;
    this.trialStartTime = null;
    this.completed = false;
  }

  startSession() {
    this.startTime = performance.now();
    this.currentTrialIndex = 0;
    this.trials = [];
    this.completed = false;
    return this.getCurrentTrial();
  }

  getCurrentTrial() {
    if (this.currentTrialIndex >= this.trialSet.length) {
      this.completed = true;
      return null;
    }
    const fixture = this.trialSet[this.currentTrialIndex];
    this.trialStartTime = performance.now();
    return {
      trialIndex: this.currentTrialIndex,
      totalTrials: this.trialSet.length,
      trialId: `trial-${this.sessionId}-${this.currentTrialIndex + 1}`,
      fixtureId: fixture.fixture_id,
      manifestState: fixture.manifest_state
    };
  }

  recordResponse({ participantChoice, confidenceScore = 3 }) {
    if (this.completed || this.trialStartTime === null) {
      throw new Error("No active trial to record response for");
    }

    const responseTimeMs = Number((performance.now() - this.trialStartTime).toFixed(2));
    const fixture = this.trialSet[this.currentTrialIndex];
    const choice = participantChoice ? participantChoice.toUpperCase() : "MISSING";
    const isCorrect = choice === fixture.ground_truth_state.toUpperCase();

    const record = {
      trial_id: `trial-${this.sessionId}-${this.currentTrialIndex + 1}`,
      fixture_id: fixture.fixture_id,
      ground_truth: fixture.ground_truth_state,
      participant_choice: choice,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
      confidence_score: Math.max(1, Math.min(5, confidenceScore)),
      timestamp: new Date().toISOString()
    };

    this.trials.push(record);
    this.currentTrialIndex++;

    return {
      recorded: record,
      nextTrial: this.getCurrentTrial()
    };
  }

  exportStructuredResult() {
    const totalTrials = this.trialSet.length;
    const recordedTrials = this.trials.length;
    const validTrials = this.trials.filter(t => t.participant_choice !== "MISSING").length;
    const correctTrials = this.trials.filter(t => t.is_correct).length;
    const incorrectTrials = validTrials - correctTrials;
    const missingTrials = totalTrials - validTrials;

    // Accuracy = correct_trials / total_trials (denominator includes all planned trials)
    const accuracyPct = totalTrials > 0 ? Number(((correctTrials / totalTrials) * 100).toFixed(2)) : 0;

    const avgResponseTimeMs = recordedTrials > 0
      ? Number((this.trials.reduce((sum, t) => sum + t.response_time_ms, 0) / recordedTrials).toFixed(2))
      : 0;

    const avgConfidenceScore = recordedTrials > 0
      ? Number((this.trials.reduce((sum, t) => sum + t.confidence_score, 0) / recordedTrials).toFixed(2))
      : 0;

    // Confusion matrix: GROUND TRUTH -> PARTICIPANT CHOICE
    const availableStates = Array.from(new Set(CANONICAL_PERCEPTUAL_FIXTURES.map(f => f.ground_truth_state)));
    const confusionMatrix = {};
    for (const actual of availableStates) {
      confusionMatrix[actual] = {};
      for (const predicted of [...availableStates, "MISSING"]) {
        confusionMatrix[actual][predicted] = 0;
      }
    }

    for (const t of this.trials) {
      if (confusionMatrix[t.ground_truth] && confusionMatrix[t.ground_truth][t.participant_choice] !== undefined) {
        confusionMatrix[t.ground_truth][t.participant_choice]++;
      }
    }

    return {
      session_id: this.sessionId,
      participant_id: this.participantId,
      timestamp: new Date().toISOString(),
      metadata: {
        renderer_backend: this.rendererBackend,
        seed: this.seed
      },
      summary_metrics: {
        total_trials: totalTrials,
        valid_trials: validTrials,
        correct_trials: correctTrials,
        incorrect_trials: incorrectTrials,
        missing_trials: missingTrials,
        recognition_accuracy_pct: accuracyPct,
        avg_response_time_ms: avgResponseTimeMs,
        avg_confidence_score: avgConfidenceScore,
        confusion_matrix: confusionMatrix
      },
      trials: this.trials
    };
  }
}
