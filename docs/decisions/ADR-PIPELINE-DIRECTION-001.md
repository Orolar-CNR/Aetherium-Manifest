# ADR-PIPELINE-DIRECTION-001: Selection of Phase 1 First Slice Scope and Pipeline Ordering Discipline

**Document Title:** ADR-PIPELINE-DIRECTION-001
**Status:** `DRAFT — PENDING RATIFICATION`
**Date:** 2026-10-06
**Type:** Architecture Decision Record (DOCS_ONLY)
**Scope:** Phase 1 Pipeline Selection, Boundary Isolation, and 8D Canonicalization Policy
**Core Principles:** "State before beauty. Governor before renderer. Intent before image. Evidence before specification freeze."

---

## 1. Context and Problem Statement

The Aetherium-Manifest project defines an ambitious Target Architecture spanning natural language intent interpretation, neural evaluation (AGNS), declarative AETH constraints, canonical 8D Presence Intermediate Representation (Presence IR), dual-stage Governor validation (Governor A/B), and high-performance WebGPU particle manifestation.

However, recent proposals (such as the draft `8D-PRESENCE-IR-DIMENSION-REGISTRY-v0.1.md`) introduce conflicting definitions for the 8D PresenceVector dimensions (Set 1 spatial/intent vs. Set 2 thermodynamic metrics) and prematurely couple downstream WebGPU shader mechanics with upstream governance contracts.

Attempting to implement or canonicalize the entire target pipeline simultaneously introduces severe architectural risk, potential specification drift, and "hallucinated implementations" where documentation outpaces verified code.

To uphold the core doctrine of the project, an explicit decision is required to select a thin, testable **First Slice** for Phase 1 while keeping Phase 0.x strictly frozen and deferring unverified target components.

---

## 2. Decision Drivers

1. **Epistemic Discipline (CEA-DVP):** Specifications and code MUST be grounded in verifiable repository evidence. Unverified research proposals MUST NOT be treated as normative runtime contracts.
2. **Phase 0.x Stability:** The active browser prototype (`contracts/visual-state.schema.json`, `runtime/visual-state.js`, Canvas2D reference, and WebGPU PoC adapter) is `FROZEN_WITH_DEFERRED_ITEMS`. No Phase 1 task may break or modify Phase 0.x files.
3. **Deterministic Governance Boundary:** The core purpose of Presence IR is to enforce a tamper-proof, deterministic boundary between candidate intent and downstream manifestation. Governance MUST be established and tested before renderer coupling.
4. **Dimension Registry Ambiguity:** Project documentation currently contains two incompatible 8D vector candidate sets. A premature selection of either set as the sole canonical standard without empirical evidence would constrain future research and introduce breaking changes.

---

## 3. Considered Options

- **Option A (Selected Thin Slice):** Scope Phase 1 First Slice exclusively to:
  `PresenceVectorCandidate → Minimal Governor A → PresenceIREnvelope → Conformance / Fixture Tests`.
- **Option B (Full Target Pipeline):** Attempt to implement the complete end-to-end chain (`AGNS → AETH → 8D Presence IR → Governor A/B → Perceptual Compiler → WebGPU Renderer`).
- **Option C (Immediate 8D Canonicalization):** Freeze one of the two proposed 8D dimension sets (Set 1 vs Set 2) as the permanent Canonical Presence IR standard prior to First Slice testing.

---

## 4. Decision Outcome

### Selected Option: Option A (Thin First Slice)

The project formally ratifies **Option A** as the controlling architectural decision for Phase 1 initiation.

#### 4.1 Selected First Slice Pipeline
The target pipeline for the first Phase 1 engineering slice is strictly bounded to:

```text
PresenceVectorCandidate
        │
        ▼
Minimal Governor A (Pure functional validation, clamping, policy_risk > 0.85 rejection)
        │
        ▼
PresenceIREnvelope (Single-parent lineage, decimal uint64 wire strings, integrity hash placeholder)
        │
        ▼
Conformance / Fixture Tests (10 deterministic planning fixtures F-01 to F-10)
```

#### 4.2 Freeze Guarantees
- **Phase 0.x Code Freeze:** `contracts/visual-state.schema.json`, `runtime/visual-state.js`, `runtime/reference-renderer.js`, `renderer/webgpu-renderer.js`, `manifestation/webgpu-adapter.js`, and `app.js` remain strictly **FROZEN**.
- **No Renderer Coupling:** No renderer (Canvas2D or WebGPU) sits downstream of `PresenceIREnvelope` in this First Slice.

#### 4.3 Explicitly Deferred Pipeline Components
The following architectural stages are explicitly kept **OUT OF SCOPE** for the First Slice:
- **AGNS (Artificial General Neural Signal):** Neural evaluation stage.
- **AETH Compiler / Language Parser:** Declarative intent translation.
- **Governor B:** Hardware safety, particle budget scaling, and photosensitivity gate.
- **Perceptual Compiler:** Downstream manifestation mapping.
- **Transition Engine & World Model:** Temporal interpolation and prediction runtimes.
- **Renderer Integration:** Direct mapping of Presence IR onto WebGPU shaders or Canvas2D.

#### 4.4 Policy on 8D PresenceVector Canonicalization
- **Neither 8D dimension set is canonicalized as the sole normative standard by this decision.**
- **Set 1 (`x, y, z, intent_phase, confidence, energy, coherence, policy_risk`):** Used strictly as the candidate validation structure for `PresenceVectorCandidate` in the First Slice.
- **Set 2 (`D1_Comp_Stress, D2_Entropy_Ratio, ...`):** Remains strictly in the **Research Feature Space** (`docs/research/`) as a non-normative candidate.
- Any future unification or canonicalization requires a dedicated ADR supported by reproducible baseline measurements and perceptual study evidence.

---

## 5. Consequences

### Positive
- Establishes a clean, isolated, pure-functional boundary for Phase 1 verification without risking renderer instability.
- Eliminates dependency on unwritten compiler or neural interpretation stages.
- Preserves complete backward compatibility with Phase 0.x browser prototype.
- Prevents premature commitment to an unproven 8D dimension mapping.

### Negative
- The First Slice does not produce visible light or particle output on the screen (the output is a governed JSON/wire envelope validated via test fixtures).
- Downstream rendering of Presence IR is deferred to subsequent Phase 1 integration slices.

---

## 6. Compliance and Non-Alteration Checklist

This ADR certifies that:
- [x] No runtime code, shaders, tests, package files, or existing canonical contracts have been modified.
- [x] Phase 0.x Visual State Contract remains frozen.
- [x] No dependencies were installed or modified.
- [x] `AETHERIUM-PIPELINE-TERMINOLOGY-AND-STATUS-MATRIX-v0.1.md` reflects this decision.
