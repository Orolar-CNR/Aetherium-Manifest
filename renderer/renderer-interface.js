export const RENDERER_BACKENDS = Object.freeze({ AUTO: "auto", CANVAS: "canvas", WEBGPU: "webgpu" });

export function createRendererDiagnostics(overrides = {}) {
  return {
    backend: "uninitialized",
    webgpuAvailable: false,
    particleCount: 0,
    qualityTier: "none",
    frameTimeMs: 0,
    initializationStatus: "pending",
    fallbackReason: "",
    ...overrides
  };
}

export function hasRendererInterface(renderer) {
  return !!renderer && ["initialize", "resize", "setManifestationState", "render", "dispose", "supports"]
    .every((name) => typeof renderer[name] === "function");
}
