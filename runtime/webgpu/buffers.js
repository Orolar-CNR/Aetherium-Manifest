import { PARTICLE_STRIDE_BYTES, UNIFORM_BUFFER_BYTES, validateParticleBufferSize } from "./capabilities.js";

export const PARTICLE_BUFFER_USAGE = globalThis.GPUBufferUsage
  ? globalThis.GPUBufferUsage.STORAGE | globalThis.GPUBufferUsage.COPY_DST
  : 0;

export const UNIFORM_BUFFER_USAGE = globalThis.GPUBufferUsage
  ? globalThis.GPUBufferUsage.UNIFORM | globalThis.GPUBufferUsage.COPY_DST
  : 0;

export function calculateParticleBufferBytes(particleCount) {
  if (!Number.isInteger(particleCount) || particleCount < 0) {
    throw new TypeError("particleCount must be a non-negative integer");
  }
  return particleCount * PARTICLE_STRIDE_BYTES;
}

export function assertParticleBuffersWithinLimits(particleCount, capabilities) {
  if (!validateParticleBufferSize(particleCount, capabilities)) {
    throw new RangeError(`particle buffer for ${particleCount} particles exceeds WebGPU limits`);
  }
  return calculateParticleBufferBytes(particleCount);
}

export function createPingPongParticleBuffers(device, particleCount, capabilities) {
  const byteLength = assertParticleBuffersWithinLimits(particleCount, capabilities);
  return {
    byteLength,
    positions: [0, 1].map(() => device.createBuffer({ size: byteLength, usage: PARTICLE_BUFFER_USAGE })),
    velocities: [0, 1].map(() => device.createBuffer({ size: byteLength, usage: PARTICLE_BUFFER_USAGE }))
  };
}

export function createManifestUniformBuffer(device) {
  return device.createBuffer({ size: UNIFORM_BUFFER_BYTES, usage: UNIFORM_BUFFER_USAGE });
}
