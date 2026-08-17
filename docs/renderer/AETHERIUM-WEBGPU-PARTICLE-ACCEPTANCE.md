# Aetherium WebGPU Particle Acceptance

The WebGPU renderer is a manifestation backend, not a semantic authority.

## Required Semantic Boundary

```text
One Semantic State → Many Manifestations
Semantic Authority → Manifestation Adapter → GPU
```

Acceptance requires `manifestation/webgpu-adapter.js` to remain the only transformation path from canonical state to GPU parameters. Shaders must remain free of semantic enums, raw intent, shape strings, phase strings, policy logic, Governor logic, and LLM text.

## Quality Targets

- Tier A: 1,000 particles.
- Tier B: 10,000 particles.
- Tier C: 100,000 particles as a target benchmark only, not a universal acceptance requirement.

Buffer sizes must be checked against normalized device limits before allocation. If limits cannot support the requested tier, the renderer must downgrade safely or fall back to Canvas2D.

## Fallback Behavior

- `?renderer=canvas` always uses the preserved Canvas2D reference path.
- `?renderer=auto` uses WebGPU when available and falls back to Canvas2D otherwise.
- `?renderer=webgpu` attempts WebGPU and falls back safely if initialization or limits fail.
- `?debug=1` may show backend, WebGPU availability, particle count, quality tier, frame time, initialization status, and fallback reason.

Debug output must not expose semantic reasoning, raw intent, LLM text, policy decisions, or Governor decisions.

## Adaptive Render Quality

Adaptive render quality is a downstream renderer/resource mechanism only. It may inspect device limits and frame time and may reduce the particle budget. It must not mutate canonical Visual State or reinterpret semantic meaning.

## Contract Preservation

This proof of concept must not modify:

- `contracts/visual-state.schema.json`
- `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`
- `docs/governance/AETHERIUM-GOVERNOR-SPEC.md`
- `docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md`
