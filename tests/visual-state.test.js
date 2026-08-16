import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createVisualState,
  validateVisualState,
  clampVisualState
} from "../runtime/visual-state.js";
import {
  initializeParticles,
  ReferenceParticle,
  getParticleBudget
} from "../runtime/reference-renderer.js";

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
  assert.throws(() => createVisualState({ phase: "IDLE" }), /missing required semantic property: phase|shape/i);
  assert.strictEqual(validateVisualState({ phase: "IDLE" }), false);
});

runTest("C. Missing optional numeric field → still schema-valid (only phase/shape are required); creation fills defaults per spec table", () => {
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

/* ---------------------------------------------------------
 * Phase 0.2 Golden Fixture & Reference Renderer Conformance Tests
 * --------------------------------------------------------- */

const expectedFixtures = [
  "idle.json",
  "listening.json",
  "processing.json",
  "responding.json",
  "warning.json",
  "error.json",
  "nirodha.json"
];

const mockCanvasCtx = {
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  save: () => {},
  restore: () => {},
  clearRect: () => {},
  fillRect: () => {},
  stroke: () => {},
  setTransform: () => {},
  createRadialGradient: () => ({
    addColorStop: () => {}
  }),
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  globalCompositeOperation: ""
};

runTest("Phase 0.2: All 7 Golden Fixtures exist, validate, and convert to canonical states", () => {
  const fixturesDir = path.join(__dirname, "fixtures/visual-states");
  for (const file of expectedFixtures) {
    const filePath = path.join(fixturesDir, file);
    assert.ok(fs.existsSync(filePath), `Fixture file ${file} must exist`);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    assert.strictEqual(validateVisualState(content), true, `Fixture ${file} must validate under validateVisualState`);
    const state = createVisualState(content);
    assert.ok(state.phase, `Fixture ${file} must produce a valid phase`);
    assert.ok(state.shape, `Fixture ${file} must produce a valid shape`);
  }
});

runTest("Phase 0.2: Reference Renderer execution safety with all Golden Fixtures", () => {
  const fixturesDir = path.join(__dirname, "fixtures/visual-states");
  const dimensions = { width: 1000, height: 800, centerX: 500, centerY: 400 };

  for (const file of expectedFixtures) {
    const filePath = path.join(fixturesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const state = createVisualState(content);

    const particles = initializeParticles(100, 12345);
    assert.strictEqual(particles.length, 100);

    for (const p of particles) {
      assert.doesNotThrow(() => {
        p.update(1000, 0.016, state, dimensions, 0.5);
        p.draw(mockCanvasCtx, state, dimensions, 1000);
      }, `Updating/drawing particle with fixture ${file} must not throw`);
    }
  }
});

runTest("Phase 0.2: Deterministic Seeding Guarantee (same fixture + same seed -> same initial renderer state)", () => {
  const seed = 424242;
  const count = 50;

  const particlesA = initializeParticles(count, seed);
  const particlesB = initializeParticles(count, seed);
  const particlesDiff = initializeParticles(count, 999999);

  assert.strictEqual(particlesA.length, count);
  assert.strictEqual(particlesB.length, count);

  for (let i = 0; i < count; i++) {
    assert.strictEqual(particlesA[i].seed, particlesB[i].seed, `Particle ${i} seed must match`);
    assert.strictEqual(particlesA[i].angle, particlesB[i].angle, `Particle ${i} angle must match`);
    assert.strictEqual(particlesA[i].radius, particlesB[i].radius, `Particle ${i} radius must match`);
    assert.strictEqual(particlesA[i].size, particlesB[i].size, `Particle ${i} size must match`);
    assert.strictEqual(particlesA[i].alpha, particlesB[i].alpha, `Particle ${i} alpha must match`);
  }

  let matchedAllWithDiffSeed = true;
  for (let i = 0; i < count; i++) {
    if (particlesA[i].seed !== particlesDiff[i].seed) {
      matchedAllWithDiffSeed = false;
      break;
    }
  }
  assert.strictEqual(matchedAllWithDiffSeed, false, "Different seeds must produce different particle states");
});

runTest("Phase 0.2: density = 0 is fully safe and does not throw or crash renderer", () => {
  const zeroDensityState = createVisualState({ phase: "IDLE", shape: "sphere", density: 0 });
  assert.strictEqual(zeroDensityState.density, 0);

  const particles = initializeParticles(50, 777);
  const dimensions = { width: 800, height: 600, centerX: 400, centerY: 300 };

  for (const p of particles) {
    assert.doesNotThrow(() => {
      p.update(500, 0.016, zeroDensityState, dimensions);
      p.draw(mockCanvasCtx, zeroDensityState, dimensions, 500);
    });
  }

  const zeroParticles = initializeParticles(0, 777);
  assert.strictEqual(zeroParticles.length, 0);
});

runTest("Phase 0.2: NIRODHA state is safe and renders minimal visual activity", () => {
  const nirodhaFixture = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/visual-states/nirodha.json"), "utf8"));
  const nirodhaState = createVisualState(nirodhaFixture);
  assert.strictEqual(nirodhaState.phase, "NIRODHA");

  const particles = initializeParticles(50, 888);
  const dimensions = { width: 800, height: 600, centerX: 400, centerY: 300 };

  let drawCallsCount = 0;
  const countCtx = {
    ...mockCanvasCtx,
    arc: () => { drawCallsCount++; }
  };

  for (const p of particles) {
    p.update(500, 0.016, nirodhaState, dimensions);
    p.draw(countCtx, nirodhaState, dimensions, 500);
  }

  assert.strictEqual(drawCallsCount, 0, "NIRODHA particles should skip active drawing");
});

console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
