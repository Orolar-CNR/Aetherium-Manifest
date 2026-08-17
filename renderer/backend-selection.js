import { isWebGPUAvailable, normalizeCapabilities, selectParticleQualityTier } from "../runtime/webgpu/capabilities.js";

export function chooseRendererBackend({ requested = "auto", navigatorRef = globalThis.navigator, capabilities = normalizeCapabilities() } = {}) {
  const webgpuAvailable = isWebGPUAvailable(navigatorRef) || capabilities.available;
  if (requested === "canvas") return { backend: "canvas", fallbackReason: "canvas requested" };
  if (requested === "webgpu" && !webgpuAvailable) return { backend: "canvas", fallbackReason: "webgpu requested but navigator.gpu unavailable" };
  if (requested === "webgpu" || (requested === "auto" && webgpuAvailable)) return { backend: "webgpu", fallbackReason: "" };
  return { backend: "canvas", fallbackReason: "auto fallback: navigator.gpu unavailable" };
}

export { selectParticleQualityTier };
