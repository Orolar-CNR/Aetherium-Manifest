# Aetherium Manifest

Aetherium Light Manifest is a perception-oriented perceptual interface rendered as light and particle formation. It processes input messages directly into structured fluid manifestations without relying on traditional textual feedback.

The Phase 0.x primary interaction flow is:

«Receive Message → Process → Manifest as Light»
(«Message Input → Visual Interpretation → Light Manifestation» / «รับข้อความ → ประมวลผล → ส่งออกเป็นอานุภาพแสง»)

---

## Current Status & Roadmap

| Phase | Status | Summary |
|---|---|---|
| **Phase 0.0 Light Output Proof** | ✅ Completed | Basic light emission and particle dynamics foundation |
| **Phase 0.1 Visual State Contract** | ✅ Completed | Machine-readable schema (`contracts/visual-state.schema.json`), `createVisualState`, normalizer, and test suite |
| **Phase 0.2 Canvas2D Reference Renderer** | ✅ Completed | Reference renderer (`runtime/reference-renderer.js`) and conformance verification |
| **Phase 0.2 WebGPU Particle PoC** | ✅ Completed | Dual-backend pipeline with WebGPU acceleration, adapter, and automatic Canvas2D fallback |
| **Phase 0.3 Contract Consistency Matrix** | ✅ Completed (Docs) | Reconciliation matrix evaluating contract coherence (`docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md`) |
| **Contract Freeze Gate** | ⏳ Pending Ratification | PR B Contract Ratification (P0 ADRs) prior to locking specification freeze |
| **Phase 1 Presence Runtime** | 🛑 Not Started | PresenceVectorCandidate, Governor A runtime, and PresenceIREnvelope execution engine |

---

## Core Architectural Philosophy

The text input field is an input channel that receives a user's message. It is not a conversational answer surface.
The system **intentionally does not return textual answers** in the visual surface.
The primary output is environmental manifestation through physical phenomena:
* **Light & Color**: Direct HSL color wheel transitions mapping semantic energy.
* **Particle Formation**: Coordinated geometric coordinate fields.
* **Motion & Morphology**: Smooth interpolation, noise, and structural transition.
* **Density & Coherence**: System response fidelity and physical tightness.

---

## Architecture & Truth Boundary

### Current Engineering Reality (Phase 0.x Runtime)

```text
Message Input (User input text / signal)
            ↓
  System Receives Message
            ↓
  Local Interpreter (Process & interpret input message)
            ↓
  Visual State Contract (Generate visual state: JSON Schema & Runtime Clamping)
            ↓
  Backend Selection (Auto / WebGPU / Canvas2D)
      ┌─────┴────────────────────────┐
      ▼                              ▼
WebGPU Manifestation Path      Canvas2D Reference Path
 (manifestation/webgpu-adapter)  (renderer/canvas-renderer)
      ↓                              ↓
Numeric GPU Parameters         HTML5 Canvas 2D Surface
      ↓
WGSL Compute & Render Shaders (Output / Manifest as Light & Particles)
```

### Canonical / Future Specification (Phase 1 Target Pipeline)

```text
Human Signal → Intent → AETH Compiler → Presence IR → Governor A/B → Manifestation Runtime
```

The Phase 0.x runtime performs local message interpretation and visual state generation directly, without executing the Phase 1 canonical pipeline.

---

### Backend Selection & Dual-Path Rendering
* **URL Parameter Control**: Force or test specific rendering backends using `?renderer=auto`, `?renderer=webgpu`, or `?renderer=canvas`.
* **Automatic Fallback**: If WebGPU initialization fails (unsupported browser, device lost, or feature missing), the system automatically degrades gracefully to the Canvas2D reference renderer.
* **WebGPU Manifestation Authority Boundary**: WebGPU functions **purely as a downstream manifestation backend**, holding **no semantic authority**.
* **Transformation Pipeline**: `Semantic / Visual State` → `WebGPU Adapter` → `Numeric GPU Parameters` → `WGSL Compute/Render Shaders`. Shader code contains no semantic state evaluation.
* **Determinism**: Renderer initialization requires an explicit `rendererSeed` to ensure deterministic execution and repeatable particle layouts across test suites.

---

## Research & Non-Canonical Artifacts

* **Field Dynamics Research**: Located in `docs/research/field-dynamics/` (including Research Notes, Benchmark Matrices, and Baseline Metadata Schema).
* **Status**: **RESEARCH CANDIDATE** — These documents represent exploratory research into field dynamics and baseline metadata. They are **non-canonical** and MUST NOT be confused with or substituted for active contracts (`Visual State`, `Presence IR`, `Governor`, or `Manifest Contract`).
* **Dynamic SDF Benchmark**: Reproducible via `npm run benchmark:sdf` with machine-readable and human-readable results written to `research/field-dynamics/benchmarks/results/`.

---

## Directory Layout

* `contracts/visual-state.schema.json`: Machine-readable contract (JSON Schema Draft 2020-12).
* `runtime/`: Visual state safety validation (`visual-state.js`), reference renderer (`reference-renderer.js`), and WebGPU lower-level device/buffer abstractions.
* `renderer/`: Dual-path rendering engine logic (`backend-selection.js`, `canvas-renderer.js`, `webgpu-renderer.js`, `renderer-interface.js`).
* `manifestation/`: WebGPU adapter (`webgpu-adapter.js`) mapping Visual State to pure numeric GPU parameters.
* `docs/`: Architecture specifications, ADRs, matrices, research notes, and renderer proof acceptance docs.
* `tests/`: Contract, WebGPU adapter, and WGSL shader invariant test suites.
* `app.js`: Application orchestrator with interpreter and backend selection.
* `index.html`: Responsive viewport & interaction canvas surface.

---

## Running Locally

To start the interface locally, serve the root directory using any standard static file server (or run `npm run serve` / `python3 -m http.server 8080`) and open `index.html` in a WebGPU-supported web browser (or use `?renderer=canvas` for Canvas2D fallback).

---

## Testing & Benchmarks

To run the complete verification test suite (Visual State Contract + WebGPU Adapter + WebGPU Shader Invariants), execute:

```bash
npm test
```

To run WebGPU specific tests:

```bash
npm run test:webgpu
```

To run the Dynamic SDF Research Benchmark:

```bash
npm run benchmark:sdf
```

---

## Next Steps

1. **Contract Ratification (PR B)**: Review and ratify P0 Architecture Decision Records (`docs/decisions/ADR-DRAFT-P0-*`) resolving open contract items from the Consistency Matrix.
2. **Contract Freeze Gate**: Lock Presence IR v0.1, Governor v0.1, and Manifest Contract v0.1 specs.
3. **Phase 1 Presence Runtime**: Begin Phase 1 implementation (PresenceVectorCandidate, Governor A runtime, Envelope pipeline).
