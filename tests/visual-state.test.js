import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createVisualState,
  validateVisualState,
  clampVisualState
} from "../runtime/visual-state.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (err) {
    failed++;
    console.error(`❌ ${name}`);
    console.error(err);
  }
}

console.log("Starting Aetherium Visual State Contract Tests...\n");

runTest("A. Missing phase → rejected", () => {
  assert.throws(() => createVisualState({ shape: "sphere" }), /missing required semantic property: phase/i);
  assert.strictEqual(validateVisualState({ shape: "sphere" }), false);
});

runTest("B. Missing shape → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE" }), /missing required semantic property: shape/i);
  assert.strictEqual(validateVisualState({ phase: "IDLE" }), false);
});

runTest("C. Missing optional numeric field → still schema-valid (only phase/shape are required); creation fills defaults per spec table", () => {
  // Numeric fields are optional in the schema (required: [phase, shape] only), so an
  // object that omits them still strictly conforms and validateVisualState is true.
  assert.strictEqual(validateVisualState({ phase: "IDLE", shape: "sphere" }), true);
  const state = createVisualState({ phase: "IDLE", shape: "sphere" });
  assert.strictEqual(state.energy, 0.18);
  assert.strictEqual(state.density, 0.55);
  assert.strictEqual(state.turbulence, 0.10);
  assert.strictEqual(state.coherence, 0.88);
  assert.strictEqual(state.confidence, 0.55);
  assert.strictEqual(state.hue, 190);
});

runTest("D. Unknown property → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", banana: true }), /unknown property rejected/i);
  assert.strictEqual(
    validateVisualState({ phase: "IDLE", shape: "sphere", energy: 0.5, hue: 190, density: 0.5, turbulence: 0.2, coherence: 0.8, confidence: 0.5, banana: true }),
    false
  );
});

runTest("E. Numeric string → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: "0.5" }), /expected number, got string/i);
});

runTest("F. Boolean as numeric field → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: true }), /expected number, got boolean/i);
});

runTest("G. NaN → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: NaN }), /must be finite/i);
});

runTest("H & I. Infinity / -Infinity → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: Infinity }), /must be finite/i);
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: -Infinity }), /must be finite/i);
});

runTest("J. Invalid phase → rejected", () => {
  assert.throws(() => createVisualState({ phase: "ASLEEP", shape: "sphere" }), /invalid phase/i);
});

runTest("K. Invalid shape → rejected", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "hexagon" }), /invalid shape/i);
});

runTest("K2. All documented shapes accepted", () => {
  for (const shape of ["sphere", "triangle", "spiral", "line", "wave"]) {
    assert.doesNotThrow(() => createVisualState({ phase: "IDLE", shape }));
  }
});

runTest("L & M. Numeric out-of-bounds → clamped", () => {
  const state = createVisualState({ phase: "IDLE", shape: "sphere", energy: 1.5, turbulence: -0.5 });
  assert.strictEqual(state.energy, 1.0);
  assert.strictEqual(state.turbulence, 0.0);
});

runTest("M2. Turbulence clamps at 0.65", () => {
  const state = createVisualState({ phase: "IDLE", shape: "sphere", turbulence: 0.9 });
  assert.strictEqual(state.turbulence, 0.65);
});

runTest("N. Density = 0 → valid", () => {
  const state = createVisualState({ phase: "IDLE", shape: "sphere", density: 0 });
  assert.strictEqual(state.density, 0);
});

runTest("O, P, Q. Hue boundary checks", () => {
  assert.strictEqual(createVisualState({ phase: "IDLE", shape: "sphere", hue: 360 }).hue, 360);
  assert.strictEqual(createVisualState({ phase: "IDLE", shape: "sphere", hue: 370 }).hue, 360);
  assert.strictEqual(createVisualState({ phase: "IDLE", shape: "sphere", hue: -10 }).hue, 0);
});

runTest("R & S. Immutability checks", () => {
  const original = { phase: "IDLE", shape: "sphere", energy: 1.5 };
  const originalCopy = { ...original };
  const result = createVisualState(original);
  assert.deepEqual(original, originalCopy, "Original candidate was mutated!");
  assert.notStrictEqual(result, original, "Returned object is strictly equal to candidate!");
});

runTest("T. Equivalent candidates produce identical results", () => {
  const a = createVisualState({ phase: "IDLE", shape: "sphere" });
  const b = createVisualState({ phase: "IDLE", shape: "sphere" });
  assert.deepEqual(a, b);
});

runTest("U, V, W. Malformed inputs are rejected, not defaulted", () => {
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", unknownKey: 1 }));
  assert.throws(() => createVisualState({ phase: "IDLE", shape: "sphere", energy: "0.8" }));
  assert.throws(() => createVisualState({ phase: "UNKNOWN" }));
});

runTest("X. clampVisualState throws (deprecated)", () => {
  assert.throws(() => clampVisualState({ phase: "IDLE", shape: "sphere" }), /deprecated/i);
});

runTest("Schema Consistency Guard (JSON Check)", () => {
  const schemaPath = path.join(__dirname, "../contracts/visual-state.schema.json");
  const schemaStr = fs.readFileSync(schemaPath, "utf8");
  const schema = JSON.parse(schemaStr);

  assert.ok(schema.$schema.includes("2020-12"), "Must use draft 2020-12 schema identifier");
  assert.strictEqual(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["phase", "shape"], "Only phase/shape should be strictly required");
  assert.ok(schema.properties.hue.maximum === 360);
  assert.ok(schema.properties.turbulence.maximum === 0.65, "turbulence max must match app.js's tuned field-function constants");
  assert.deepEqual(
    schema.properties.shape.enum,
    ["sphere", "triangle", "spiral", "line", "wave"],
    "schema shape enum must match ALLOWED_SHAPES in runtime/visual-state.js and app.js's renderer switch-case"
  );
});

console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
