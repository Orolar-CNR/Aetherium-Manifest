# Aetherium Reference Renderer Conformance Spec

**Phase identity:** `0.1-reference-renderer`
**Contract version:** `visual-state/0.1`

---

## 1. Purpose

This document specifies the conformance model, boundary rules, fixture requirements, and determinism guarantees for the Aetherium Light Manifest Reference Renderer (Phase 0.2).

The Reference Renderer serves as a baseline, 2D HTML5 Canvas manifestation surface to demonstrate and verify Visual State Contract compliance (`visual-state/0.1`).

---

## 2. Architectural Boundary

```
Visual State Contract (Phase 0.1 Input)
         │
         ▼
Reference Renderer (runtime/reference-renderer.js)
         │
         ▼
Transient Particle & Render State
         │
         ▼
2D Canvas Manifestation Surface
```

### Boundary Constraints:
- **No Intent Parsing in Renderer:** The renderer strictly consumes governed Visual States (`createVisualState`). It does NOT parse natural language input or infer intent.
- **No Contract Redefinition:** The renderer MUST NOT redefine semantic enums (`phase`, `shape`) or extend schema properties.
- **Transient State Isolation:** Particle positions (`x`, `y`), velocities (`vx`, `vy`), and transient angles are non-canonical runtime artifacts and are isolated from the canonical Visual State object.

---

## 3. Fixture Format & Conformance Model

Golden fixtures are stored in `tests/fixtures/visual-states/`:
1. `idle.json`
2. `listening.json`
3. `processing.json`
4. `responding.json`
5. `warning.json`
6. `error.json`
7. `nirodha.json`

Every fixture contains a fully-specified, deterministic Visual State adhering to `contracts/visual-state.schema.json`.

### Verification Rules:
1. **Schema Conformance:** JSON parsing & schema validation (`validateVisualState`).
2. **Runtime Governance:** State normalizer instantiation (`createVisualState`).
3. **Execution Safety:** Handing fixture objects to particle initialization and update/draw passes must produce zero exceptions.

---

## 4. Deterministic Guarantees

For any given Visual State fixture:
$$\text{same Visual State} + \text{same renderer seed} \longrightarrow \text{same initial particle state}$$

- Particle generation utilizes Mulberry32 32-bit deterministic PRNG (`createPRNG(seed)`).
- Passing an identical seed guarantees bit-exact identical initial particle positions, velocities, sizes, angles, and noise seeds across initializations.

---

## 5. Edge Cases & Special Manifestations

- **`density = 0` Safety:** `density = 0` represents zero particle/visual density. The renderer handles `PARTICLE_COUNT = 0` and `density = 0` safely without division-by-zero or loop exceptions.
- **`NIRODHA` State:** Represents cessation/near-zero perceptual activity. Particle rendering is safely skipped during `NIRODHA` phase, preventing unnecessary GPU/CPU draw overhead.
- **Opt-in Diagnostic Surface (`?debug=1`):** A development-only overlay displays real-time diagnostic telemetry (phase, target vs current values, particle budget, FPS, renderer mode). In normal mode, the surface remains strictly text-free.

---

## 6. Current Limitations

- **Reference Implementation Only:** This Canvas2D renderer is a reference manifestation surface, not the final WebGPU/3D spatial runtime.
- **State-Level Determinism:** Phase 0.2 guarantees state-level and particle initial coordinate determinism, not image-level or pixel-perfect cross-browser raster regression testing.
