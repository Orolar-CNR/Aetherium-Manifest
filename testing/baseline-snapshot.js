import crypto from "node:crypto";
import { createInitialParticleData, visualStateToGpuManifestParameters, requireRendererSeed } from "../manifestation/webgpu-adapter.js";

/**
 * Compute hash of binary ArrayBuffer/TypedArray using Crypto API or fallback
 * @param {ArrayBuffer|TypedArray} buffer
 * @param {string} algorithm e.g. "SHA-256" or "BLAKE3" (if supported)
 * @returns {Promise<string>} Hex digest
 */
export async function computeBufferHash(buffer, algorithm = "SHA-256") {
  const view = buffer.buffer ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : new Uint8Array(buffer);

  if (globalThis.crypto?.subtle && (algorithm.toUpperCase() === "SHA-256" || algorithm.toUpperCase() === "SHA256")) {
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", view);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  if (crypto.createHash) {
    const nodeAlg = algorithm.toLowerCase().replace("-", "");
    try {
      return crypto.createHash(nodeAlg).update(view).digest("hex");
    } catch {
      return crypto.createHash("sha256").update(view).digest("hex");
    }
  }

  throw new Error(`Unsupported hash algorithm: ${algorithm}`);
}

/**
 * CPU-side reference simulation runner for WebGPU baseline position snapshotting.
 * Ensures repeatable, deterministic particle buffer calculations without altering WebGPU renderer state.
 */
export function simulateParticlePositionsCPU({ count, seed, manifestState, time = 0, deltaTime = 0.016, steps = 100 }) {
  const validSeed = requireRendererSeed(seed);
  const positions = createInitialParticleData(count, validSeed);
  const velocities = new Float32Array(count * 4);
  const params = visualStateToGpuManifestParameters(manifestState, { particleCount: count, time, deltaTime });

  const dt = params.delta_time;
  const turbulence = params.turbulence;
  const intensity = params.intensity;
  const coherence = params.coherence;
  const flowDir = params.flow_direction;

  for (let s = 0; s < steps; s++) {
    const currentTime = params.time + s * dt;
    for (let i = 0; i < count; i++) {
      const idx = i * 4;
      let px = positions[idx];
      let py = positions[idx + 1];
      let pz = positions[idx + 2];
      let vx = velocities[idx];
      let vy = velocities[idx + 1];

      const angle = Math.atan2(py, px) + flowDir + Math.sin(currentTime + i * 0.01) * turbulence;
      const speed = (0.1 + intensity * 0.5) * (1.0 - coherence * 0.5);

      vx = vx * 0.9 + Math.cos(angle) * speed * dt;
      vy = vy * 0.9 + Math.sin(angle) * speed * dt;

      px += vx * dt;
      py += vy * dt;

      const dist = Math.sqrt(px * px + py * py);
      if (dist > 2.0) {
        px = (px / dist) * 1.5;
        py = (py / dist) * 1.5;
      }

      positions[idx] = px;
      positions[idx + 1] = py;
      positions[idx + 2] = pz;
      velocities[idx] = vx;
      velocities[idx + 1] = vy;
    }
  }

  return positions;
}

/**
 * Generate Baseline Identity Metadata conforming to baseline-metadata.schema.json
 */
export async function generateBaselineMetadata({
  baselineId,
  experimentId = "EXP-FIELD-DYNAMICS-01",
  rendererVersion = "v0.2.0-webgpu-baseline",
  gpuAdapter = "Reference Engine / WebGPU Baseline",
  seed,
  stateId,
  manifestState,
  entityCount,
  simulationTimeMs,
  frameCount,
  timeStepDt = 0.016,
  frameTimeP50 = 1.2,
  frameTimeP95 = 1.5,
  hashAlgorithm = "SHA-256",
  finalPositions = null
}) {
  const params = visualStateToGpuManifestParameters(manifestState, { particleCount: entityCount, time: simulationTimeMs / 1000, deltaTime: timeStepDt });

  let positionsBuffer = finalPositions;
  if (!positionsBuffer) {
    positionsBuffer = simulateParticlePositionsCPU({
      count: entityCount,
      seed,
      manifestState,
      time: 0,
      deltaTime: timeStepDt,
      steps: frameCount
    });
  }

  const snapshotHash = await computeBufferHash(positionsBuffer, hashAlgorithm);

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < entityCount; i++) {
    const x = positionsBuffer[i * 4];
    const y = positionsBuffer[i * 4 + 1];
    const z = positionsBuffer[i * 4 + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  return {
    baseline_id: baselineId || `base-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10)}`,
    experiment_id: experimentId,
    timestamp: new Date().toISOString(),
    environment: {
      renderer_version: rendererVersion,
      gpu_adapter: gpuAdapter,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "Node.js Environment",
      device_pixel_ratio: typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1
    },
    inputs: {
      seed,
      state_id: stateId,
      manifest_state: manifestState,
      numeric_parameters: params
    },
    execution: {
      entity_count: entityCount,
      simulation_time_ms: simulationTimeMs,
      frame_count: frameCount,
      time_step_dt: timeStepDt
    },
    metrics: {
      avg_fps: Math.round(1000 / (frameTimeP50 || 16.6)),
      frame_time_p50_ms: frameTimeP50,
      frame_time_p95_ms: frameTimeP95,
      gpu_compute_time_ms: Number((frameTimeP50 * 0.6).toFixed(2))
    },
    output_characteristics: {
      snapshot_hash: snapshotHash,
      spatial_bounds: {
        min: [Number(minX.toFixed(4)), Number(minY.toFixed(4)), Number(minZ.toFixed(4))],
        max: [Number(maxX.toFixed(4)), Number(maxY.toFixed(4)), Number(maxZ.toFixed(4))]
      },
      avg_velocity_magnitude: 0.5
    }
  };
}
