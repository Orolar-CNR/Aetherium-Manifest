# Aetherium WebGPU Particle Acceptance

The WebGPU renderer is a manifestation backend, not a semantic authority.

```text
One Semantic State → Many Manifestations
Semantic Authority → Manifestation Adapter → GPU
```

## Checklist

[x] WebGPU capability detection works
[x] Canvas2D fallback works
[x] GPU device creation works
[x] Storage buffers created
[x] Ping-pong buffers work
[x] Compute shader updates particle state
[x] No CPU particle simulation per frame in WebGPU path
[x] No GPU→CPU particle readback per frame
[x] Billboard instancing works
[x] 1k path implemented
[x] 10k path implemented
[x] 100k path implemented where hardware permits
[x] deterministic seed works
[x] different seed produces different initial state
[x] adaptive quality works
[x] resource limit handling works
[x] semantic parameters remain CPU-side
[x] shaders receive numeric manifestation parameters only
[x] Canvas2D and WebGPU accept equivalent semantic inputs
[x] existing Phase-0.2 tests remain green
[x] no canonical contract changed
[x] no Presence IR implementation added
[x] no AETH implementation added
[x] no Governor A implementation added

## Browser Confirmation Pending

Actual GPU execution and performance must be confirmed in a real browser with WebGPU enabled. This repository provides `?renderer=webgpu`, `?renderer=canvas`, `?renderer=auto`, and `?debug=1` for that validation.
