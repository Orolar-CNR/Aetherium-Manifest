import assert from "node:assert";
import { LocalLLMInterpreter } from "../app.js";
import { validateVisualState } from "../runtime/visual-state.js";

async function runTests() {
  console.log("Starting LocalLLMInterpreter Unit & Integration Tests...\n");

  const interpreter = new LocalLLMInterpreter();

  // Test 1: Instantiation
  assert.ok(interpreter !== null, "LocalLLMInterpreter should instantiate properly");
  assert.strictEqual(interpreter.isReady, false, "isReady should initially be false");

  // Test 2: Node environment fallback initialization
  await interpreter.initialize();
  assert.strictEqual(interpreter.isReady, false, "In Node env, initialize() should detect non-browser env and remain non-ready");

  // Test 3: Fallback execution to interpretIntent
  const visualState = await interpreter.interpretMessage("วิเคราะห์ระบบ");
  assert.ok(visualState, "interpretMessage should return a visual state object");
  assert.ok(validateVisualState(visualState), "Returned state from interpretMessage must pass validateVisualState");

  // Test 4: Parameter bounds & schema compliance
  assert.ok(visualState.turbulence <= 0.65, "Turbulence must be clamped to <= 0.65");
  assert.ok(visualState.energy >= 0.0 && visualState.energy <= 1.0, "Energy must be within [0.0, 1.0]");
  assert.ok(visualState.coherence >= 0.0 && visualState.coherence <= 1.0, "Coherence must be within [0.0, 1.0]");
  assert.ok(visualState.density >= 0.0 && visualState.density <= 1.0, "Density must be within [0.0, 1.0]");

  // Test 5: createGovernedVisualState method
  const candidate = {
    phase: "RESPONDING",
    shape: "triangle",
    hue: 200,
    energy: 0.9,
    density: 0.8,
    turbulence: 0.9, // Out of bounds
    coherence: 0.85
  };
  const governed = interpreter.createGovernedVisualState(candidate);
  assert.ok(validateVisualState(governed), "Governed visual state must be valid");
  assert.strictEqual(governed.turbulence, 0.65, "Turbulence out of bounds must be clamped to 0.65");

  console.log("✅ All LocalLLMInterpreter tests passed successfully! 🎉\n");
}

runTests().catch((err) => {
  console.error("LocalLLMInterpreter test failed:", err);
  process.exit(1);
});
