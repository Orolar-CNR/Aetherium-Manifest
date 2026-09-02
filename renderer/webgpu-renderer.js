import { createRendererDiagnostics } from "./renderer-interface.js";
import { initializeWebGPUDevice } from "../runtime/webgpu/device.js";
import { selectParticleQualityTier, adaptQualityForFrameTime } from "../runtime/webgpu/capabilities.js";
import { createManifestUniformBuffer, createPingPongParticleBuffers } from "../runtime/webgpu/buffers.js";
import { createInitialParticleData, packGpuManifestUniforms, visualStateToGpuManifestParameters, requireRendererSeed } from "../manifestation/webgpu-adapter.js";

async function loadText(path) {
  const response = await fetch(new URL(path, import.meta.url));
  return response.text();
}

export function createWebGPURenderer({ canvas, rendererSeed } = {}) {
  requireRendererSeed(rendererSeed);
  let device;
  let context;
  let capabilities;
  let format;
  let width = 1;
  let height = 1;
  let particleCount = 0;
  let tier = { name: "none", particleCount: 0 };
  let frameTimeMs = 0;
  let fallbackReason = "";
  let status = "pending";
  let positionBuffers = [];
  let velocityBuffers = [];
  let uniformBuffer;
  let computePipeline;
  let renderPipeline;
  const computeBindGroups = [];
  const renderBindGroups = [];
  let ping = 0;
  let params = null;

  return {
    supports: () => !!globalThis.navigator?.gpu,

    async initialize() {
      try {
        const initialized = await initializeWebGPUDevice();
        ({ device, capabilities, fallbackReason } = initialized);
        if (!device) { status = "fallback"; return this; }

        context = canvas?.getContext("webgpu");
        if (!context) { fallbackReason = "webgpu canvas context unavailable"; status = "fallback"; return this; }

        format = capabilities.preferredFormat;
        context.configure({ device, format, alphaMode: "premultiplied" });

        tier = selectParticleQualityTier(capabilities, "C");
        particleCount = tier.particleCount;
        if (!particleCount) { fallbackReason = "device limits too small for Tier A"; status = "fallback"; return this; }

        const buffers = createPingPongParticleBuffers(device, particleCount, capabilities);
        positionBuffers = buffers.positions;
        velocityBuffers = buffers.velocities;
        uniformBuffer = createManifestUniformBuffer(device);

        const initial = createInitialParticleData(particleCount, rendererSeed);
        const zero = new Float32Array(particleCount * 4);
        device.queue.writeBuffer(positionBuffers[0], 0, initial);
        device.queue.writeBuffer(positionBuffers[1], 0, initial);
        device.queue.writeBuffer(velocityBuffers[0], 0, zero);
        device.queue.writeBuffer(velocityBuffers[1], 0, zero);

        const [computeSource, vertexSource, fragmentSource] = await Promise.all([
          loadText("../runtime/webgpu/compute/particle-update.wgsl"),
          loadText("../runtime/webgpu/render/particle.vert.wgsl"),
          loadText("../runtime/webgpu/render/particle.frag.wgsl")
        ]);

        computePipeline = device.createComputePipeline({
          layout: "auto",
          compute: { module: device.createShaderModule({ code: computeSource }), entryPoint: "main" }
        });
        renderPipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module: device.createShaderModule({ code: vertexSource }), entryPoint: "main" },
          fragment: {
            module: device.createShaderModule({ code: fragmentSource }),
            entryPoint: "main",
            targets: [{
              format,
              blend: {
                color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" },
                alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }
              }
            }]
          },
          primitive: { topology: "triangle-list" }
        });

        for (const [read, write] of [[0, 1], [1, 0]]) {
          computeBindGroups.push(device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: positionBuffers[read] } },
              { binding: 1, resource: { buffer: velocityBuffers[read] } },
              { binding: 2, resource: { buffer: positionBuffers[write] } },
              { binding: 3, resource: { buffer: velocityBuffers[write] } },
              { binding: 4, resource: { buffer: uniformBuffer } }
            ]
          }));
          renderBindGroups.push(device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: positionBuffers[write] } },
              { binding: 1, resource: { buffer: uniformBuffer } }
            ]
          }));
        }

        status = "ready";
      } catch (error) {
        fallbackReason = error instanceof Error ? error.message : "webgpu initialization failed";
        status = "fallback";
      }
      return this;
    },

    resize(size) { width = size.width; height = size.height; },

    triggerEarlyManifestation(signal) {
      // Graceful Early Manifestation stub for WebGPU backend
    },

    setManifestationState(state, timing = {}) {
      params = visualStateToGpuManifestParameters(state, { particleCount, time: timing.time || 0, deltaTime: timing.deltaTime || 0.016, simulationScale: 1 });
      if (device && uniformBuffer) device.queue.writeBuffer(uniformBuffer, 0, packGpuManifestUniforms(params, { width, height }));
    },

    render() {
      if (status !== "ready") return;
      const start = performance.now();
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(computePipeline);
      pass.setBindGroup(0, computeBindGroups[ping]);
      pass.dispatchWorkgroups(Math.ceil(particleCount / 64));
      pass.end();

      const view = context.getCurrentTexture().createView();
      const rpass = encoder.beginRenderPass({ colorAttachments: [{ view, clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: "clear", storeOp: "store" }] });
      rpass.setPipeline(renderPipeline);
      rpass.setBindGroup(0, renderBindGroups[ping]);
      rpass.draw(6, particleCount);
      rpass.end();
      device.queue.submit([encoder.finish()]);
      ping = 1 - ping;

      frameTimeMs = performance.now() - start;
      const nextTier = adaptQualityForFrameTime(tier, frameTimeMs);
      if (nextTier.name !== tier.name) {
        tier = nextTier;
        particleCount = Math.min(particleCount, tier.particleCount);
      }
    },

    dispose() {
      for (const buffer of [...positionBuffers, ...velocityBuffers, uniformBuffer].filter(Boolean)) buffer.destroy();
      status = "disposed";
    },

    getDiagnostics() {
      return createRendererDiagnostics({ backend: "webgpu", webgpuAvailable: !!capabilities?.available, particleCount, qualityTier: tier.name, frameTimeMs, initializationStatus: status, fallbackReason });
    }
  };
}
