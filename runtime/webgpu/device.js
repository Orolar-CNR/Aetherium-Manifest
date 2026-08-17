import { isWebGPUAvailable, normalizeCapabilities } from "./capabilities.js";

export async function requestWebGPUAdapter(nav = globalThis.navigator, options = { powerPreference: "high-performance" }) {
  if (!isWebGPUAvailable(nav)) return null;
  return nav.gpu.requestAdapter(options);
}

export async function requestWebGPUDevice(adapter, descriptor = {}) {
  if (!adapter) return null;
  return adapter.requestDevice(descriptor);
}

export function getPreferredCanvasFormat(nav = globalThis.navigator) {
  if (isWebGPUAvailable(nav) && typeof nav.gpu.getPreferredCanvasFormat === "function") {
    return nav.gpu.getPreferredCanvasFormat();
  }
  return "bgra8unorm";
}

export async function initializeWebGPUDevice({ navigatorRef = globalThis.navigator, adapterOptions, deviceDescriptor } = {}) {
  if (!isWebGPUAvailable(navigatorRef)) {
    return { adapter: null, device: null, capabilities: normalizeCapabilities({ requested: false }), fallbackReason: "navigator.gpu unavailable" };
  }
  try {
    const adapter = await requestWebGPUAdapter(navigatorRef, adapterOptions);
    if (!adapter) return { adapter: null, device: null, capabilities: normalizeCapabilities({ requested: true }), fallbackReason: "requestAdapter returned null" };
    const device = await requestWebGPUDevice(adapter, deviceDescriptor);
    if (!device) return { adapter, device: null, capabilities: normalizeCapabilities({ adapter, requested: true }), fallbackReason: "requestDevice returned null" };
    const preferredFormat = getPreferredCanvasFormat(navigatorRef);
    return { adapter, device, capabilities: normalizeCapabilities({ adapter, device, preferredFormat }), fallbackReason: "" };
  } catch (error) {
    const fallbackReason = error instanceof Error ? error.message : "webgpu adapter/device creation failed";
    return { adapter: null, device: null, capabilities: normalizeCapabilities({ requested: true }), fallbackReason };
  }
}
