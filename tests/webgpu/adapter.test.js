import assert from "node:assert/strict";
import { createInitialParticleData, packGpuManifestUniforms, requireRendererSeed, visualStateToGpuManifestParameters } from "../../manifestation/webgpu-adapter.js";
import { normalizeCapabilities, selectParticleQualityTier, validateParticleBufferSize } from "../../runtime/webgpu/capabilities.js";
import { calculateParticleBufferBytes } from "../../runtime/webgpu/buffers.js";
import { chooseRendererBackend } from "../../renderer/backend-selection.js";

const state = { phase: "PROCESSING", shape: "spiral", turbulence: 9, energy: 2, coherence: -1, hue: 720, confidence: 0.9 };
const params = visualStateToGpuManifestParameters(state, { particleCount: 1000000, time: 1, deltaTime: 0.5 });

assert.deepEqual(Object.keys(params), ["turbulence", "intensity", "coherence", "particle_count", "flow_direction", "time", "delta_time", "simulation_scale"]);
assert.strictEqual(params.turbulence, 0.65);
assert.strictEqual(params.intensity, 1);
assert.strictEqual(params.coherence, 0);
assert.strictEqual(params.particle_count, 100000);
assert.strictEqual(params.delta_time, 0.1);
assert.ok(Object.values(params).every((value) => typeof value === "number"));
assert.deepEqual(Array.from(packGpuManifestUniforms(params)).length, 16);

assert.throws(() => requireRendererSeed(undefined), /rendererSeed/);
assert.deepEqual(Array.from(createInitialParticleData(8, 1234)), Array.from(createInitialParticleData(8, 1234)));
assert.notDeepEqual(Array.from(createInitialParticleData(8, 1234)), Array.from(createInitialParticleData(8, 5678)));

const lowCaps = normalizeCapabilities({ device: { limits: { maxStorageBufferBindingSize: 16_000, maxBufferSize: 16_000 } } });
const midCaps = normalizeCapabilities({ device: { limits: { maxStorageBufferBindingSize: 160_000, maxBufferSize: 160_000 } } });
const highCaps = normalizeCapabilities({ device: { limits: { maxStorageBufferBindingSize: 1_600_000, maxBufferSize: 1_600_000 } } });
assert.strictEqual(selectParticleQualityTier(lowCaps, "C").name, "A");
assert.strictEqual(selectParticleQualityTier(midCaps, "C").name, "B");
assert.strictEqual(selectParticleQualityTier(highCaps, "C").name, "C");
assert.strictEqual(validateParticleBufferSize(100000, highCaps), true);
assert.strictEqual(calculateParticleBufferBytes(1000), 16000);

assert.deepEqual(chooseRendererBackend({ requested: "canvas", navigatorRef: {} }), { backend: "canvas", fallbackReason: "canvas requested" });
assert.strictEqual(chooseRendererBackend({ requested: "auto", navigatorRef: { gpu: {} } }).backend, "webgpu");
assert.strictEqual(chooseRendererBackend({ requested: "webgpu", navigatorRef: {} }).backend, "canvas");

console.log("✅ WebGPU adapter/capability tests passed");
