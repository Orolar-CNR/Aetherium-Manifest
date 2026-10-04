# Aetherium Manifest

Perceptual interface for AI system state — rendered as light, particles, and motion.

Phase 0.x interaction flow:

```text
Receive Message → Process → Manifest as Light
รับข้อความ → ประมวลผล → ส่งออกเป็นอานุภาพแสง
```

The text field is an **input channel**, not a chat answer surface.  
The system intentionally does **not** return textual answers on the visual surface.  
Primary output is environmental manifestation: light, color, particle formation, motion, density, and coherence.

**Live demo:** [orolar-cnr.github.io/Aetherium-Manifest](https://orolar-cnr.github.io/Aetherium-Manifest/)  
**Repository:** [github.com/Orolar-CNR/Aetherium-Manifest](https://github.com/Orolar-CNR/Aetherium-Manifest)

---

## Governing documents

When documents disagree, follow this order of authority:

| Priority | Document | Role |
|----------|----------|------|
| 1 | [Current Truth](docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md) | What the repository actually supports today |
| 2 | Locked contracts / ratified ADRs | Normative rules after freeze |
| 3 | Architecture specs | Direction and boundaries |
| 4 | Research notes | Non-canonical experiments |
| 5 | [Vision](docs/AETHERIUM-MANIFEST-VISION.md) | Long-term direction — **not** implementation fact |

> **State before beauty. Governor before renderer. Intent before image.**  
> Do not let language prettier than evidence become system truth.

---

## Current status & roadmap

| Phase | Status | Summary |
|-------|--------|---------|
| **0.0** Light Output Proof | ✅ Done | Basic light / particle foundation |
| **0.1** Visual State Contract | ✅ Done | `contracts/visual-state.schema.json` + `runtime/visual-state.js` + tests |
| **0.2** Canvas2D Reference Renderer | ✅ Done | Reference path + conformance docs |
| **0.2** WebGPU Particle PoC | ✅ Done | Dual backend, adapter, Canvas2D fallback, deterministic `rendererSeed` |
| **0.3** Contract Consistency Matrix | ✅ Docs | Open P0 items identified |
| **P0 ADR drafts** | 📝 Draft | Four ADRs pending ratification |
| **Lexical Boundary Gate** | ✅ Pass | CI linter + policy (wording governance) |
| **Contract Freeze Gate** | ⏳ Open | Ratify or formally defer P0 ADRs |
| **Phase 1 Presence Runtime** | 🛑 Not started | Candidate → Governor A → Envelope |

Package version: **0.2.0** (Phase 0.x governed prototype).

---

## Architecture (Phase 0.x runtime)

```text
Message Input
      ↓
System receives message
      ↓
Local interpreter (Phase-0 heuristic)
      ↓
Visual State Contract (validate / clamp)
      ↓
Backend selection (?renderer=auto|webgpu|canvas)
      ├──────────────────┬─────────────────┐
      ▼                  ▼
WebGPU path         Canvas2D path
(adapter → numeric  (reference renderer)
 params → WGSL)
      ↓
Manifestation as light & particles
```

### Rules already enforced in code

- WebGPU is a **manifestation backend only** — no semantic authority
- Pipeline: `Visual State → webgpu-adapter → numeric params → WGSL`
- Shaders do not interpret intent or semantic state
- Explicit `rendererSeed` for deterministic initialization
- Automatic Canvas2D fallback if WebGPU is unavailable or init fails

### Phase 1 target pipeline (not implemented yet)

```text
Human signal → Intent → AETH → Presence IR → Governor A/B → Manifestation runtime
```

Phase 0.x does **not** run this canonical pipeline. It maps messages to Visual State locally.

---

## Quick start

```bash
# from repo root
npm run serve
# open http://localhost:8080
```

Or open `index.html` via any static file server.

**Renderer control (URL):**

| Query | Behavior |
|-------|----------|
| `?renderer=auto` | Prefer WebGPU, fall back to Canvas2D (default) |
| `?renderer=webgpu` | Request WebGPU; fall back if init fails |
| `?renderer=canvas` | Force Canvas2D reference path |
| `?seed=1337` | Explicit renderer seed (integer) |

---

## Testing & benchmarks

```bash
npm test                 # full suite (visual-state, webgpu, baseline, perceptual, temporal, world-model)
npm run test:webgpu      # WebGPU adapter + shader invariants
npm run test:perceptual  # perceptual harness
npm run test:baseline    # baseline snapshot
npm run benchmark:sdf    # field-dynamics SDF research benchmark (non-canonical)
```

---

## Repository layout

```text
contracts/          Visual State JSON Schema
runtime/            visual-state, reference-renderer, temporal-signal-fusion, webgpu/*
renderer/           backend-selection, canvas-renderer, webgpu-renderer, interface
manifestation/      webgpu-adapter (state → numeric GPU params only)
docs/               architecture, contracts, governance, decisions, research, testing
research/           field-dynamics + world-model (RESEARCH ONLY)
tools/lexical/      interaction linter + policy (CI gate)
tests/              contract and runtime tests
app.js              orchestrator
index.html          surface
```

---

## Research (non-canonical)

Artifacts under `docs/research/` and `research/` are **RESEARCH CANDIDATE**.

They must not replace active contracts:

- Visual State  
- Presence IR (spec)  
- Governor (spec)  
- Manifest Contract (spec)  

World-model and field-dynamics code paths are isolated from production authority.

---

## What this project is not (yet)

- Not a finished Cognitive OS  
- Not a production WebGPU engine  
- Not a full Governor / Presence Runtime  
- Not an LLM host that drives shaders directly  
- Not a claim that semantic→perceptual mappings are scientifically validated for all users  

See [Current Truth](docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md) for the binding list.

---

## Next steps

1. **Place governing docs** — `CURRENT TRUTH` + `VISION` under `docs/` (if not already merged).  
2. **Contract Ratification** — review `docs/decisions/ADR-DRAFT-P0-*` (Accept / Revise / Defer).  
3. **Close Contract Freeze Gate** — lock or explicitly defer Presence IR, Governor, Manifest Contract items from the matrix.  
4. **Only then** — Phase 1 thin slice: `PresenceVectorCandidate` → minimal Governor A → `PresenceIREnvelope` + fixture tests.

Do not expand research into the main path while Gate A (Phase 0 Freeze) is still open.

---

## Doctrine

```text
Meaning → Governed State → Manifestation → Perception
```

One semantic state. Many possible manifestations.  
Renderer never owns meaning.
