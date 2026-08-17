# Aetherium WebGPU Particle Proof of Concept

Status: **PROOF OF CONCEPT**, not production GPU runtime.

The WebGPU renderer is a manifestation backend, not a semantic authority.

## 1. Purpose

This proof proves the architectural thesis:

```text
One Semantic State
  ↓
Many Possible Manifestations
```

The Phase-0.2 Canvas2D Reference Renderer remains the baseline reference surface. WebGPU is added as an optional manifestation backend.

## 2. Architecture

```text
Canonical Visual State
  ↓
Semantic Authority
  ↓
Manifestation Adapter
  ↓
Renderer Backend
  ↓
GPU
```

```text
Semantic Authority → Manifestation Adapter → GPU
```

`app.js` chooses a renderer backend with `?renderer=auto`, `?renderer=webgpu`, or `?renderer=canvas`. The existing Canvas2D behavior is wrapped by `renderer/canvas-renderer.js`; the WebGPU path is implemented by `renderer/webgpu-renderer.js` and the compatibility re-export `runtime/webgpu/webgpu-renderer.js`.

## 3. GPU/CPU Boundary

CPU code owns canonical Visual State validation, semantic interpretation, and state smoothing. The GPU receives only numeric manifestation parameters created by `manifestation/webgpu-adapter.js`.

WGSL must not receive raw user text, raw intent, semantic enums, shape strings, phase strings, LLM output, Presence IR objects, policy decisions, or Governor logic.

## 4. Buffer Layout

Particle storage uses vec4-aligned storage buffers:

- `position: vec4<f32>` = 16 bytes per particle
- `velocity: vec4<f32>` = 16 bytes per particle

The uniform layout is 16 `f32` values / 64 bytes:

1. turbulence
2. intensity
3. coherence
4. flow_direction
5. time
6. delta_time
7. simulation_scale
8. particle_count
9. width
10. height
11. center_x
12. center_y
13-16. padding

## 5. Compute Pass

`runtime/webgpu/compute/particle-update.wgsl` uses `@compute @workgroup_size(64)`. It integrates velocity, updates position, applies bounded flow, and applies deterministic numeric turbulence. The shader operates only on numeric uniforms and storage buffers.

## 6. Ping-Pong Model

The renderer allocates two position buffers and two velocity buffers. Each compute pass reads one pair and writes the other pair, then the renderer flips the active index for the next frame.

There is no in-place read/write particle update and no per-frame CPU particle simulation in the WebGPU backend.

## 7. Render Pass

`runtime/webgpu/render/particle.vert.wgsl` uses `@builtin(instance_index)` to fetch particle positions from GPU storage and emits six vertices per particle billboard. One render call draws the selected particle budget.

## 8. Manifestation Adapter

`manifestation/webgpu-adapter.js` maps governed Visual State fields to GPU-safe numeric parameters:

- `turbulence` → `turbulence`
- `energy` → `intensity`
- `coherence` → `coherence`
- renderer particle budget → `particle_count`
- `hue` → numeric `flow_direction`

The full Visual State object is not serialized to WGSL.

## 9. Fallback Strategy

- `?renderer=canvas` forces Canvas2D.
- `?renderer=auto` chooses WebGPU when `navigator.gpu` is available, otherwise Canvas2D.
- `?renderer=webgpu` attempts WebGPU and falls back to Canvas2D if adapter, device, canvas context, pipeline, or limits fail.

Fallback preserves the same semantic input and does not modify canonical state.

## 10. Adaptive Quality

Adaptive Render Quality is downstream resource adaptation only. Tiers are:

- Tier A: 1,000 particles
- Tier B: 10,000 particles
- Tier C: 100,000 particles

The renderer starts from the highest tier supported by device limits and can downgrade when approximate frame time exceeds budget. This is not Governor A and not a production Governor B implementation.

## 11. Determinism

WebGPU initialization requires an explicit integer renderer seed. The same seed and particle count produce identical initial GPU upload data. Different seeds produce different initialization data. The seed is renderer/runtime data and is not part of the Visual State Contract.

## 12. Browser Test Procedure

1. Run `npm run serve`.
2. Open `http://localhost:8080/?renderer=canvas&debug=1` and confirm Canvas2D diagnostics.
3. Open `http://localhost:8080/?renderer=auto&debug=1` and confirm WebGPU on a compatible browser or Canvas fallback otherwise.
4. Open `http://localhost:8080/?renderer=webgpu&debug=1` on a WebGPU-compatible browser and confirm compute/render diagnostics.

## 13. Measured Results

No browser hardware was available in this automated environment, so no FPS or hardware throughput claims are made here. The implementation exposes the debug surface needed to record measured results in a real browser.

## 14. Known Limitations

- Node tests validate pure logic and shader source boundaries, not actual GPU execution.
- The particle simulation is intentionally simple and not curl noise or fluid simulation.
- Adaptive quality is coarse and proof-oriented.
- 100k particles are a target on suitable desktop GPUs, not a universal guarantee.

## 15. Future Work

- Real-browser WebGPU conformance matrix.
- Measured performance table by adapter/device.
- More sophisticated manifestation-only morphology.
- Future WebGL2, glyph, or text renderers behind the same backend boundary.
