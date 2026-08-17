export const PARTICLE_QUALITY_TIERS = Object.freeze({
  A: { name: "A", particleCount: 1000 },
  B: { name: "B", particleCount: 10000 },
  C: { name: "C", particleCount: 100000, benchmarkOnly: true }
});

export const PARTICLE_STRIDE_BYTES = 16;
export const PARTICLE_BUFFER_COUNT = 2;
export const UNIFORM_BUFFER_BYTES = 64;

export function isWebGPUAvailable(nav = globalThis.navigator) {
  return !!(nav && nav.gpu);
}

export function normalizeCapabilities({ adapter = null, device = null, preferredFormat = "bgra8unorm", requested = true } = {}) {
  const limits = device?.limits || adapter?.limits || {};
  const features = Array.from(device?.features || adapter?.features || []);
  return Object.freeze({
    available: !!device,
    requested,
    adapterInfo: adapter?.info || null,
    preferredFormat,
    features,
    limits: Object.freeze({
      maxStorageBufferBindingSize: Number(limits.maxStorageBufferBindingSize || 0),
      maxBufferSize: Number(limits.maxBufferSize || limits.maxStorageBufferBindingSize || 0),
      maxComputeWorkgroupSizeX: Number(limits.maxComputeWorkgroupSizeX || 0),
      maxComputeInvocationsPerWorkgroup: Number(limits.maxComputeInvocationsPerWorkgroup || 0)
    })
  });
}

export function estimateParticleBufferBytes(particleCount) {
  return particleCount * PARTICLE_STRIDE_BYTES * PARTICLE_BUFFER_COUNT;
}

export function validateParticleBufferSize(particleCount, capabilities) {
  const singleBufferBytes = particleCount * PARTICLE_STRIDE_BYTES;
  const maxStorage = capabilities?.limits?.maxStorageBufferBindingSize || 0;
  const maxBuffer = capabilities?.limits?.maxBufferSize || maxStorage;
  return singleBufferBytes > 0 && (!maxStorage || singleBufferBytes <= maxStorage) && (!maxBuffer || singleBufferBytes <= maxBuffer);
}

export function selectParticleQualityTier(capabilities, requestedTier = "B") {
  const order = ["A", "B", "C"];
  const requestedIndex = Math.max(0, order.indexOf(requestedTier));
  for (let i = requestedIndex; i >= 0; i--) {
    const tier = PARTICLE_QUALITY_TIERS[order[i]];
    if (validateParticleBufferSize(tier.particleCount, capabilities)) return tier;
  }
  return { name: "fallback", particleCount: 0, fallback: true };
}

export function adaptQualityForFrameTime(currentTier, frameTimeMs) {
  if (!currentTier || currentTier.name === "A") return currentTier;
  if (frameTimeMs <= 34) return currentTier;
  return currentTier.name === "C" ? PARTICLE_QUALITY_TIERS.B : PARTICLE_QUALITY_TIERS.A;
}
