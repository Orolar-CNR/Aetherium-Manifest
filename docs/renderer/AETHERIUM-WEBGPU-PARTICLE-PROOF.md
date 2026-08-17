# Aetherium WebGPU Particle Proof of Concept

The WebGPU renderer is a manifestation backend, not a semantic authority.

## Architecture

```text
One Semantic State → Many Manifestations

Canonical Visual State
  └─ Semantic Authority → Manifestation Adapter → GPU
                      manifestation/webgpu-adapter.js
                         └─ numeric GPU Manifest Parameters
                              └─ WGSL compute/render shaders
```

The Phase-0.2 Canvas2D path remains preserved in `runtime/reference-renderer.js` and is wrapped by `renderer/canvas-renderer.js`. WebGPU is an optional backend selected by `app.js` with `?renderer=auto`, `?renderer=webgpu`, or `?renderer=canvas`.

## CPU / GPU Boundary

CPU-side code owns canonical state validation and smoothing. The mandatory choke point is `manifestation/webgpu-adapter.js`, which maps canonical state to numeric manifestation parameters only: `turbulence`, `intensity`, `coherence`, `particle_count`, `flow_direction`, `time`, `delta_time`, and `simulation_scale`.

GPU-side WGSL receives uniforms and vec4-aligned storage buffers only. It does not receive raw Visual State, semantic labels, intent text, phase strings, shape strings, LLM text, policy decisions, or Governor decisions.

## Frame Path

1. CPU updates numeric manifestation uniforms.
2. WebGPU compute pass updates particles.
3. Ping-pong storage buffers swap read/write state.
4. WebGPU render pass draws instanced billboards.
5. Canvas presents the frame.

There is no per-frame GPU-to-CPU particle readback and no per-frame CPU particle simulation in the WebGPU backend.

## Particle Storage

Particles use vec4-aligned storage layouts:

- `position: vec4<f32>`
- `velocity: vec4<f32>`

The renderer allocates two position buffers and two velocity buffers, alternating read A/write B and read B/write A.

## Deterministic Initialization

WebGPU initialization requires an explicit `rendererSeed`. This is renderer-local only; it does not add `trace_seed` and does not change the Visual State schema.
