/**
 * Canonical Experiment Fixtures for Perceptual Evaluation Protocol.
 * Maps known ground-truth semantic states to manifestation parameters.
 * IMPORTANT: Ground truth MUST NOT be generated randomly.
 * All shapes strictly adhere to visual-state.schema.json: ["sphere", "triangle", "spiral", "line", "wave"]
 */

export const CANONICAL_PERCEPTUAL_FIXTURES = Object.freeze([
  {
    fixture_id: "FIX-IDLE-01",
    ground_truth_state: "IDLE",
    manifest_state: {
      phase: "IDLE",
      shape: "sphere",
      hue: 200,
      energy: 0.1,
      density: 0.3,
      turbulence: 0.05,
      coherence: 0.95,
      confidence: 1.0
    },
    description: "Low energy, highly coherent calm sphere manifestation"
  },
  {
    fixture_id: "FIX-LISTENING-01",
    ground_truth_state: "LISTENING",
    manifest_state: {
      phase: "LISTENING",
      shape: "sphere",
      hue: 195,
      energy: 0.3,
      density: 0.52,
      turbulence: 0.18,
      coherence: 0.84,
      confidence: 0.82
    },
    description: "Moderate energy, receptive pulsating state"
  },
  {
    fixture_id: "FIX-PROCESSING-01",
    ground_truth_state: "PROCESSING",
    manifest_state: {
      phase: "PROCESSING",
      shape: "spiral",
      hue: 270,
      energy: 0.75,
      density: 0.7,
      turbulence: 0.65,
      coherence: 0.4,
      confidence: 0.9
    },
    description: "High turbulence spiral vortex indicating calculation"
  },
  {
    fixture_id: "FIX-RESPONDING-01",
    ground_truth_state: "RESPONDING",
    manifest_state: {
      phase: "RESPONDING",
      shape: "wave",
      hue: 140,
      energy: 0.85,
      density: 0.8,
      turbulence: 0.2,
      coherence: 0.9,
      confidence: 0.95
    },
    description: "Bright harmonic wave radiating structured response"
  },
  {
    fixture_id: "FIX-WARNING-01",
    ground_truth_state: "WARNING",
    manifest_state: {
      phase: "WARNING",
      shape: "triangle",
      hue: 35,
      energy: 0.9,
      density: 0.6,
      turbulence: 0.65,
      coherence: 0.2,
      confidence: 0.7
    },
    description: "Agitated amber triangle with unstable dynamics"
  },
  {
    fixture_id: "FIX-ERROR-01",
    ground_truth_state: "ERROR",
    manifest_state: {
      phase: "ERROR",
      shape: "line",
      hue: 0,
      energy: 0.95,
      density: 0.9,
      turbulence: 0.65,
      coherence: 0.05,
      confidence: 0.5
    },
    description: "High chaotic crimson line dispersion"
  },
  {
    fixture_id: "FIX-NIRODHA-01",
    ground_truth_state: "NIRODHA",
    manifest_state: {
      phase: "NIRODHA",
      shape: "sphere",
      hue: 240,
      energy: 0.0,
      density: 0.1,
      turbulence: 0.0,
      coherence: 1.0,
      confidence: 1.0
    },
    description: "Quiescent zero-energy void sphere state"
  }
]);

export function getFixtureById(fixtureId) {
  return CANONICAL_PERCEPTUAL_FIXTURES.find(f => f.fixture_id === fixtureId) || null;
}

export function getRandomizedTrialSet(seed = 12345) {
  let s = seed >>> 0;
  const next = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const list = [...CANONICAL_PERCEPTUAL_FIXTURES];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
