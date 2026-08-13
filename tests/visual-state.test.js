import assert from "node:assert/strict";
import {
  validateVisualState,
  clampVisualState,
  createVisualState
} from "../runtime/visual-state.js";

console.log("Starting Aetherium Visual State Contract Tests...");

// Helper for test logging
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    throw err;
  }
}

// 1. valid state accepted
test("1. valid state accepted", () => {
  const state = {
    phase: "PROCESSING",
    shape: "spiral",
    hue: 270,
    energy: 0.7,
    density: 0.5,
    turbulence: 0.2,
    coherence: 0.9,
    confidence: 0.8
  };
  assert.equal(validateVisualState(state), true);
});

// 2. invalid phase rejected
test("2. invalid phase rejected", () => {
  const state = {
    phase: "BANANA", // invalid phase
    shape: "spiral",
    hue: 270,
    energy: 0.7,
    density: 0.5,
    turbulence: 0.2,
    coherence: 0.9,
    confidence: 0.8
  };
  assert.equal(validateVisualState(state), false);
});

// 3. invalid shape rejected
test("3. invalid shape rejected", () => {
  const state = {
    phase: "PROCESSING",
    shape: "hexagon", // invalid shape
    hue: 270,
    energy: 0.7,
    density: 0.5,
    turbulence: 0.2,
    coherence: 0.9,
    confidence: 0.8
  };
  assert.equal(validateVisualState(state), false);
});

// 4. hue clamps to 0..360
test("4. hue clamps to 0..360", () => {
  // Test high clamping
  const candidateHigh = {
    phase: "PROCESSING",
    shape: "spiral",
    hue: 400,
    energy: 0.7,
    density: 0.5,
    turbulence: 0.2,
    coherence: 0.9,
    confidence: 0.8
  };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.hue, 360);
  assert.equal(validateVisualState(clampedHigh), true);

  // Test low clamping
  const candidateLow = {
    phase: "PROCESSING",
    shape: "spiral",
    hue: -10,
    energy: 0.7,
    density: 0.5,
    turbulence: 0.2,
    coherence: 0.9,
    confidence: 0.8
  };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.hue, 0);
  assert.equal(validateVisualState(clampedLow), true);
});

// 5. energy clamps to 0..1
test("5. energy clamps to 0..1", () => {
  const candidateHigh = { energy: 1.5 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.energy, 1.0);

  const candidateLow = { energy: -0.2 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.energy, 0.0);
});

// 6. density clamps to 0..1
test("6. density clamps to 0..1", () => {
  const candidateHigh = { density: 1.2 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.density, 1.0);

  const candidateLow = { density: -0.5 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.density, 0.0);
});

// 7. turbulence clamps to 0..0.65
test("7. turbulence clamps to 0..0.65", () => {
  const candidateHigh = { turbulence: 0.8 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.turbulence, 0.65);

  const candidateLow = { turbulence: -0.1 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.turbulence, 0.0);
});

// 8. coherence clamps to 0..1
test("8. coherence clamps to 0..1", () => {
  const candidateHigh = { coherence: 1.1 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.coherence, 1.0);

  const candidateLow = { coherence: -0.01 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.coherence, 0.0);
});

// 9. confidence clamps to 0..1
test("9. confidence clamps to 0..1", () => {
  const candidateHigh = { confidence: 5.0 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.confidence, 1.0);

  const candidateLow = { confidence: -2.3 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.confidence, 0.0);
});

// 10. equivalent inputs produce deterministic governed state
test("10. equivalent inputs produce deterministic governed state", () => {
  const candidate1 = {
    phase: "LISTENING",
    shape: "sphere",
    hue: 195,
    energy: 0.30,
    density: 0.52,
    turbulence: 0.18,
    coherence: 0.84,
    confidence: 0.82
  };

  const candidate2 = {
    phase: "LISTENING",
    shape: "sphere",
    hue: 195,
    energy: 0.30,
    density: 0.52,
    turbulence: 0.18,
    coherence: 0.84,
    confidence: 0.82
  };

  const state1 = createVisualState(candidate1);
  const state2 = createVisualState(candidate2);

  assert.deepEqual(state1, state2);
});

console.log("All Aetherium Visual State Contract tests passed successfully!");
