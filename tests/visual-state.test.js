import assert from "node:assert/strict";
import fs from "node:fs";
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
  const candidateHigh = { phase: "IDLE", shape: "sphere", energy: 1.5 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.energy, 1.0);

  const candidateLow = { phase: "IDLE", shape: "sphere", energy: -0.2 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.energy, 0.0);
});

// 6. density clamps to 0..1
test("6. density clamps to 0..1", () => {
  const candidateHigh = { phase: "IDLE", shape: "sphere", density: 1.2 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.density, 1.0);

  const candidateLow = { phase: "IDLE", shape: "sphere", density: -0.5 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.density, 0.0);
});

// 7. turbulence clamps to 0..0.65
test("7. turbulence clamps to 0..0.65", () => {
  const candidateHigh = { phase: "IDLE", shape: "sphere", turbulence: 0.8 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.turbulence, 0.65);

  const candidateLow = { phase: "IDLE", shape: "sphere", turbulence: -0.1 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.turbulence, 0.0);
});

// 8. coherence clamps to 0..1
test("8. coherence clamps to 0..1", () => {
  const candidateHigh = { phase: "IDLE", shape: "sphere", coherence: 1.1 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.coherence, 1.0);

  const candidateLow = { phase: "IDLE", shape: "sphere", coherence: -0.01 };
  const clampedLow = clampVisualState(candidateLow);
  assert.equal(clampedLow.coherence, 0.0);
});

// 9. confidence clamps to 0..1
test("9. confidence clamps to 0..1", () => {
  const candidateHigh = { phase: "IDLE", shape: "sphere", confidence: 5.0 };
  const clampedHigh = clampVisualState(candidateHigh);
  assert.equal(clampedHigh.confidence, 1.0);

  const candidateLow = { phase: "IDLE", shape: "sphere", confidence: -2.3 };
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

/*
 * Expand Test Coverage (Section 10)
 */

test("A. missing phase -> rejected", () => {
  // missing phase should be rejected by clampVisualState (throws)
  assert.throws(() => {
    clampVisualState({
      shape: "sphere",
      energy: 0.5
    });
  }, /Missing required semantic property: phase/);

  // and rejected by validateVisualState
  const invalidState = {
    shape: "sphere",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("B. missing shape -> rejected", () => {
  // missing shape should be rejected by clampVisualState (throws)
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      energy: 0.5
    });
  }, /Missing required semantic property: shape/);

  // and rejected by validateVisualState
  const invalidState = {
    phase: "IDLE",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("C. missing required numeric field -> rejected by canonical validation", () => {
  // If we create a state with a missing numeric field using validateVisualState directly
  const stateWithMissingNumeric = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8
    // confidence is missing
  };
  assert.equal(validateVisualState(stateWithMissingNumeric), false);
});

test("D. unknown property -> rejected", () => {
  // clampVisualState should throw on unknown property
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      banana: true
    });
  }, /Unknown property rejected/);

  // validateVisualState should return false on unknown property
  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5,
    banana: true
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("E. numeric string -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: "0.5"
    });
  }, TypeError);

  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: "0.5",
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("F. boolean supplied as numeric field -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: true
    });
  }, TypeError);

  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: true,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("G. NaN -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: NaN
    });
  }, TypeError);

  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: NaN,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("H. Infinity -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: Infinity
    });
  }, TypeError);

  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: Infinity,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("I. -Infinity -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: -Infinity
    });
  }, TypeError);

  const invalidState = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: -Infinity,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("J. phase invalid -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "BANANA",
      shape: "sphere"
    });
  }, /Invalid semantic phase/);

  const invalidState = {
    phase: "BANANA",
    shape: "sphere",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("K. shape invalid -> rejected", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "BANANA"
    });
  }, /Invalid semantic shape/);

  const invalidState = {
    phase: "IDLE",
    shape: "BANANA",
    hue: 190,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(invalidState), false);
});

test("L. numeric high value -> clamped", () => {
  const result = clampVisualState({
    phase: "IDLE",
    shape: "sphere",
    energy: 1.5
  });
  assert.equal(result.energy, 1.0);
});

test("M. numeric low value -> clamped", () => {
  const result = clampVisualState({
    phase: "IDLE",
    shape: "sphere",
    energy: -0.5
  });
  assert.equal(result.energy, 0.0);
});

test("N. density = 0 -> valid", () => {
  const state = {
    phase: "IDLE",
    shape: "sphere",
    hue: 190,
    energy: 0.5,
    density: 0,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(state), true);
});

test("O. hue = 360 -> valid", () => {
  const state = {
    phase: "IDLE",
    shape: "sphere",
    hue: 360,
    energy: 0.5,
    density: 0.5,
    turbulence: 0.1,
    coherence: 0.8,
    confidence: 0.5
  };
  assert.equal(validateVisualState(state), true);
});

test("P. hue > 360 -> clamp to 360", () => {
  const result = clampVisualState({
    phase: "IDLE",
    shape: "sphere",
    hue: 370
  });
  assert.equal(result.hue, 360);
});

test("Q. hue < 0 -> clamp to 0", () => {
  const result = clampVisualState({
    phase: "IDLE",
    shape: "sphere",
    hue: -10
  });
  assert.equal(result.hue, 0);
});

test("R. original candidate not mutated", () => {
  const candidate = {
    phase: "IDLE",
    shape: "sphere",
    hue: 400,
    energy: 1.5
  };
  const cloned = { ...candidate };
  clampVisualState(candidate);
  assert.deepEqual(candidate, cloned);
});

test("S. createVisualState() returns a new object", () => {
  const candidate = {
    phase: "IDLE",
    shape: "sphere",
    hue: 200,
    energy: 0.5
  };
  const result = createVisualState(candidate);
  assert.notStrictEqual(result, candidate);
});

test("T. equivalent candidates produce exactly identical results", () => {
  const candidate1 = {
    phase: "LISTENING",
    shape: "sphere",
    hue: 195,
    energy: 0.30,
    density: 0.52
  };
  const candidate2 = {
    phase: "LISTENING",
    shape: "sphere",
    hue: 195,
    energy: 0.30,
    density: 0.52
  };
  const state1 = createVisualState(candidate1);
  const state2 = createVisualState(candidate2);
  assert.deepEqual(state1, state2);
});

test("U. unknown keys are not silently discarded", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      banana: "fruit"
    });
  }, /Unknown property rejected/);
});

test("V. malformed numeric strings are not converted to defaults", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "sphere",
      energy: "banana"
    });
  }, TypeError);
});

test("W. malformed semantic values do not become IDLE/sphere silently", () => {
  assert.throws(() => {
    clampVisualState({
      phase: "BANANA",
      shape: "sphere"
    });
  }, /Invalid semantic phase/);

  assert.throws(() => {
    clampVisualState({
      phase: "IDLE",
      shape: "BANANA"
    });
  }, /Invalid semantic shape/);
});

/*
 * Schema Verification Test (Section 11)
 */
test("X. Schema parity verification", () => {
  const schemaPath = "./contracts/visual-state.schema.json";
  const schemaRaw = fs.readFileSync(schemaPath, "utf-8");
  const schema = JSON.parse(schemaRaw);

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, [
    "phase",
    "shape",
    "hue",
    "energy",
    "density",
    "turbulence",
    "coherence",
    "confidence"
  ]);

  // Check expected enum members
  const expectedPhases = ["IDLE", "LISTENING", "PROCESSING", "RESPONDING", "WARNING", "ERROR", "NIRODHA"];
  assert.deepEqual(schema.properties.phase.enum, expectedPhases);

  const expectedShapes = ["sphere", "triangle", "spiral", "line", "wave"];
  assert.deepEqual(schema.properties.shape.enum, expectedShapes);

  // Check expected numeric ranges
  assert.equal(schema.properties.hue.minimum, 0);
  assert.equal(schema.properties.hue.maximum, 360);

  assert.equal(schema.properties.energy.minimum, 0);
  assert.equal(schema.properties.energy.maximum, 1);

  assert.equal(schema.properties.density.minimum, 0);
  assert.equal(schema.properties.density.maximum, 1);

  assert.equal(schema.properties.turbulence.minimum, 0);
  assert.equal(schema.properties.turbulence.maximum, 0.65);

  assert.equal(schema.properties.coherence.minimum, 0);
  assert.equal(schema.properties.coherence.maximum, 1);

  assert.equal(schema.properties.confidence.minimum, 0);
  assert.equal(schema.properties.confidence.maximum, 1);
});

console.log("All Aetherium Visual State Contract tests passed successfully!");
