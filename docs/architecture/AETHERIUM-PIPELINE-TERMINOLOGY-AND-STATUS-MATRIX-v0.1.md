# AETHERIUM-PIPELINE-TERMINOLOGY-AND-STATUS-MATRIX-v0.1.md

**Document Title:** AETHERIUM-PIPELINE-TERMINOLOGY-AND-STATUS-MATRIX-v0.1.md
**Type:** Pipeline Terminology and Implementation Status Matrix (DOCS_ONLY)
**Status:** `RESEARCH / NOT NORMATIVE`
**Scope:** Pipeline Terminology, Engineering Reality Classification, and Architectural Conflict Register for Aetherium-Manifest
**Core Doctrine:** "State before beauty. Governor before renderer. Intent before image. Evidence before specification freeze."

---

## 1. Header & Document Purpose

This document serves as an overarching reconciliation and mapping matrix for the pipeline concepts, terminology, implementation statuses, and unresolved architectural decisions across the Aetherium-Manifest project.

As specified by architectural governance:
- This document is **DOCS_ONLY / RESEARCH / NOT NORMATIVE**.
- It does **NOT** modify or replace any frozen Phase 0.x runtime contracts (`contracts/visual-state.schema.json`, `runtime/visual-state.js`, `app.js`, `manifestation/webgpu-adapter.js`).
- It does **NOT** silently ratify new canonical specifications or unify disputed 8D dimension sets.
- It provides a single source of truth for classifying what is currently implemented, what is selected for the Phase 1 First Slice, and what remains in Target Architecture / Research.

---

## 2. Pipeline Stage Classification

To prevent architectural drift and eliminate "hallucinated implementations," system concepts are strictly categorized into three distinct operational environments:

```
+-----------------------------------------------------------------------------------+
| GROUP A: Current Engineering Reality (Phase 0.x — FROZEN_WITH_DEFERRED_ITEMS)      |
|                                                                                   |
|  [Message Input] -> [Local Interpreter] -> [Visual State Contract] -> [Renderer]   |
|                                                     (7 States)         (Canvas2D/ |
|                                                                         WebGPU)   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| GROUP B: Phase 1 First Slice (SELECTED — ADR-PIPELINE-DIRECTION-001)               |
|                                                                                   |
|  [PresenceVectorCandidate] -> [Minimal Governor A] -> [PresenceIREnvelope] ->      |
|                                                       [Conformance Tests]         |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| GROUP C: Target Architecture & Research (OPEN / NOT STARTED / RESEARCH)          |
|                                                                                   |
|  [Human Signal] -> [AGNS] -> [AETH] -> [Presence IR (8D)] -> [Governor A/B] ->    |
|                     [Perceptual Compiler] -> [Manifestation Runtime]              |
+-----------------------------------------------------------------------------------+
```

### 2.1 Group A — Current Engineering Reality (Phase 0.x)
- **Status:** `FROZEN_WITH_DEFERRED_ITEMS`
- **Active Pipeline:**
  ```text
  Message Input → Local Interpreter → Visual State Contract → Renderer
  ```
- **Visual State Enum (7 States):** `IDLE`, `LISTENING`, `PROCESSING`, `RESPONDING`, `WARNING`, `ERROR`, `NIRODHA`.
- **Renderer Manifestation:** Canvas2D (Baseline Reference Renderer) and WebGPU Particle Engine (Experimental PoC via `webgpu-adapter.js`).
- **Invariance:** No Phase 1 additions (Presence IR, Governor, AETH) may alter Phase 0.x code or schema without a formal unfreeze review.

### 2.2 Group B — Phase 1 First Slice
- **Status:** `SELECTED / PENDING RATIFICATION` (Controlled by `ADR-PIPELINE-DIRECTION-001.md`)
- **First Slice Pipeline:**
  ```text
  PresenceVectorCandidate → Minimal Governor A → PresenceIREnvelope → Conformance / Fixture Tests
  ```
- **Scope Boundary:**
  - Includes pure functional candidate validation, clamping, rejection, single-parent lineage tracking, and deterministic envelope emission.
  - **Excludes:** AGNS neural evaluation, ambiguous AETH compiler/language stages, Governor B hardware safety gates, Transition Engine, World Model/prediction runtimes, WebGPU/Canvas2D renderer integration, and 8D dimension canonicalization.

### 2.3 Group C — Target Architecture & Research Pipeline
- **Status:** `TARGET ARCHITECTURE / OPEN / NOT STARTED / RESEARCH CANDIDATE`
- **Full Future Pipeline:**
  ```text
  Human Signal → AGNS → AETH → Presence IR (8D) → Governor A/B → Perceptual Compiler → Manifest Contract → Manifestation Runtime
  ```
- **Decoupled Microkernel Architecture:** Intent Runtime, Retrieval Runtime, Reasoning Runtime, Governance Runtime.
- **Rule:** Concepts in Group C MUST NOT be treated as executable code or normative contracts until individual slices pass G1–G4 acceptance gates with empirical evidence.

---

## 3. Terminology Registry

| Term | Primary Source Document | Engineering Reality Status | Implementation Status | Approval Status | Conflict / Ambiguity Notes |
|---|---|---|---|---|---|
| **AGNS** | SAD v4.2, 8D Registry Draft | Target Architecture (Group C) | `NOT_IMPLEMENTED` | Proposal / Vision | Neural evaluation stage. Outside First Slice scope. |
| **AETH** | SAD v4.2, Contract Consistency Matrix | Target Architecture (Group C) | `NOT_IMPLEMENTED` | Open / Draft | Declarative language concept. Ambiguous usage across docs; outside First Slice. |
| **PresenceVectorCandidate** | Presence IR Spec v0.1, Phase 1 Planning Gate | First Slice Target (Group B) | `SPECIFIED_NOT_IMPLEMENTED` | Pending Ratification | Candidate input struct before governance evaluation. |
| **Minimal Governor A** | Governor Spec v0.1, Phase 1 Planning Gate | First Slice Target (Group B) | `SPECIFIED_NOT_IMPLEMENTED` | Pending Ratification | Pure validation/clamping function. Minimal subset of full Governor A. |
| **PresenceIREnvelope** | Presence IR Spec v0.1 | First Slice Target (Group B) | `SPECIFIED_NOT_IMPLEMENTED` | Pending Ratification | Governed wire envelope emitted ONLY after Governor A validation. |
| **Canonical Presence IR** | Presence IR Spec v0.1 | Target Architecture (Group C) | `SPECIFIED_NOT_IMPLEMENTED` | Draft | 8-dimensional state representation. Dimensions disputed across drafts. |
| **8D PresenceVector (Set 1)** | Presence IR Spec v0.1, SAD v4.2 | Target Architecture (Group C) | `SPECIFIED_NOT_IMPLEMENTED` | Draft | `x, y, z, intent_phase, confidence, energy, coherence, policy_risk`. |
| **8D PresenceVector (Set 2)** | 8D Registry Draft / Research Notes | Research Space (Group C) | `RESEARCH_CANDIDATE` | Unapproved | `D1_Comp_Stress, D2_Entropy_Ratio, D3_Semantic_Coherence, D4_Temporal_Turbulence, D5_Token_Density, D6_Fracture_Risk, D7_Semantic_Symmetry, D8_Temporal_Decay`. |
| **Governor A** | Governor Spec v0.1 | Target Architecture (Group C) | `SPECIFIED_NOT_IMPLEMENTED` | Draft / Spec Freeze | Semantic & Policy Gate. Evaluates intent, policy risk, and ethics. |
| **Governor B** | Governor Spec v0.1, SAD v4.2 | Target Architecture (Group C) | `SPECIFIED_NOT_IMPLEMENTED` | Draft / Spec Freeze | Hardware Safety & Finalization Gate (photosensitivity, particle budget, Tier limits). Outside First Slice. |
| **NIRODHA** | Visual State Contract v0.1, Governor Spec v0.1 | Current Reality (Group A) / Target (Group C) | `IMPLEMENTED` (Phase 0.1) / `SPECIFIED` (Gov) | Ratified (P0.1) / Draft (Gov) | Phase 0.1: 7th Visual State enum. Governor: Fail-safe action/state outcome. Dual role documented. |
| **Transition Engine** | SAD v4.2, Event Journey Spec | Target Architecture (Group C) | `NOT_IMPLEMENTED` | Proposal / Vision | Interpolation engine between state vectors. Outside First Slice. |
| **Visual State Contract** | `contracts/visual-state.schema.json` | Current Reality (Group A) | `IMPLEMENTED` | Frozen | 7-state contract for Phase 0.x browser prototype. |
| **webgpu-adapter.js** | `manifestation/webgpu-adapter.js` | Current Reality (Group A) | `IMPLEMENTED` | Frozen | Numeric parameter mapping from Visual State to WGSL uniforms. |

---

## 4. Truth & Implementation Matrix

| Concept / Artifact | Document Spec | Code Location | Executable Evidence | Status |
|---|---|---|---|---|
| **Phase 0.1 Visual State** | `docs/PHASE-0.1-VISUAL-STATE-CONTRACT.md` | `runtime/visual-state.js`, `contracts/visual-state.schema.json` | `tests/visual-state.test.js` (Passing) | `IMPLEMENTED` |
| **Canvas2D Reference Renderer** | `docs/testing/AETHERIUM-REFERENCE-RENDERER-CONFORMANCE.md` | `runtime/reference-renderer.js`, `renderer/canvas-renderer.js` | Browser execution + test suite | `IMPLEMENTED` |
| **WebGPU Particle PoC** | `docs/renderer/AETHERIUM-WEBGPU-PARTICLE-PROOF.md` | `renderer/webgpu-renderer.js`, `manifestation/webgpu-adapter.js` | `tests/webgpu-adapter.test.js` (Passing) | `PROVISIONAL_POC` |
| **Contract Consistency Matrix v0.1** | `docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md` | N/A (Doc only) | Reviewed artifact | `SPECIFIED_NOT_IMPLEMENTED` |
| **P0 ADR Drafts (P0-01 to P0-04)** | `docs/decisions/ADR-DRAFT-P0-*.md` | N/A (Doc only) | Draft review | `DEFERRED` (Pending Ratification) |
| **Phase 1 Planning Gate** | `docs/decisions/PHASE-0-CONTRACT-FREEZE-REVIEW.md` | N/A (Doc only) | Planning gate spec | `SPECIFIED_NOT_IMPLEMENTED` |
| **Presence IR Wire Envelope** | `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md` | N/A | None in codebase | `SPECIFIED_NOT_IMPLEMENTED` |
| **Governor A/B Policy Engine** | `docs/governance/AETHERIUM-GOVERNOR-SPEC.md` | N/A | None in codebase | `SPECIFIED_NOT_IMPLEMENTED` |
| **8D PresenceVector (Set 1 or Set 2)** | Presence IR Spec / 8D Registry Draft | N/A | None in codebase | `SPECIFIED_NOT_IMPLEMENTED` / `RESEARCH_CANDIDATE` |
| **AETH / AGNS / Perceptual Compiler** | SAD v4.2 | N/A | None in codebase | `RESEARCH_CANDIDATE` / `UNDEFINED` |

---

## 5. Conflict Register

The following unresolved conflicts across project documentation have been formally recorded. They MUST NOT be resolved by individual coding agents or docs-only tasks without an explicit Creator Decision / ratified ADR.

### Conflict CR-001: 8D Presence IR Dimension Set Discrepancy
- **Issue:** Two distinct, incompatible 8-dimensional vector definitions exist in project documentation:
  - **Set 1 (Presence IR Spec v0.1 & SAD v4.2):**
    `x` (float64 [-1,1]), `y` (float64 [-1,1]), `z` (float64 [-1,1]), `intent_phase` (float64 [0,1]), `confidence` (float64 [0,1]), `energy` (float64 [0,1]), `coherence` (float64 [0,1]), `policy_risk` (float64 [0,1]).
  - **Set 2 (8D Registry Draft & Research Notes):**
    `D1_Comp_Stress`, `D2_Entropy_Ratio`, `D3_Semantic_Coherence`, `D4_Temporal_Turbulence`, `D5_Token_Density`, `D6_Fracture_Risk`, `D7_Semantic_Symmetry`, `D8_Temporal_Decay`.
- **Impact:** Set 1 focuses on spatial projection + semantic/policy state, whereas Set 2 focuses on cognitive/thermodynamic field metrics.
- **Resolution Path:** Neither set is canonicalized in this task. Both are recorded as unresolved candidates. The First Slice uses PresenceVector fields from Set 1 for candidate validation without locking Set 2 out of future research feature space.

### Conflict CR-002: Governor Jurisdiction and First Slice Scope
- **Issue:** The 8D Registry Draft describes full Governor A (semantic/ethical gravity) and Governor B (hardware/photosensitivity safety gate for 1M particles). However, the Phase 1 First Slice planning gate (`PHASE-0-CONTRACT-FREEZE-REVIEW.md`) specifies only a pure functional **Minimal Governor A** with a simplified `policy_risk > 0.85` fixture rejection rule and explicitly excludes Governor B.
- **Impact:** Attempting to mandate full Governor A/B and WebGPU compute shader integration in the First Slice violates the Phase 1 Planning Gate boundary.
- **Resolution Path:** ADR-PIPELINE-DIRECTION-001 locks the First Slice scope to Minimal Governor A without Governor B or renderer coupling.

### Conflict CR-003: Dual Role of NIRODHA (Visual State vs. Governor Outcome)
- **Issue:** In Phase 0.1 (`contracts/visual-state.schema.json`), `NIRODHA` is one of the 7 valid `VisualState` enum values representing a quiet, unperturbed visual rest state. In Presence IR v0.1 / Governor Spec, `NIRODHA` represents a critical Governor fail-safe action outcome, while `IntentState` on the wire uses a 4-state enum (`IDLE | PROCESSING | RESPONDING | ERROR`).
- **Impact:** Conflating `NIRODHA` as a wire `IntentState` causes candidate validation failures in Presence IR v0.1 (where `NIRODHA` is rejected as an invalid `IntentState`).
- **Resolution Path:** Preserve `NIRODHA` as a Phase 0.1 Visual State and Governor action/fail-safe outcome while maintaining the 4-state `IntentState` wire enum for Presence IR v0.1 candidates in the First Slice.

### Conflict CR-004: Acceptance Criteria (Gates G1–G4) vs. Implementation Evidence
- **Issue:** The 8D Registry Draft outlines Gates G1 (Contract Conformance), G2 (Mapping Correctness), G3 (Renderer Integration Adapter), and G4 (Runtime & Perceptual Evaluation) as prerequisite gates. However, labeling dimensions as `VERIFIED` or `IMPLEMENTED` before executable code and perceptual study evidence exist violates the Epistemic Rules (CEA-DVP) defined in Section 3 of the draft.
- **Impact:** Threatens the repository with "hallucinated implementations."
- **Resolution Path:** Enforce CEA-DVP: Truth Status `IMPLEMENTED` is strictly reserved for components with passing, reproducible integration tests in the main branch.

---

## 6. Open Decision Register

| Decision ID | Decision Title | Options / Candidates | Creator Decision Required | Target Milestone |
|---|---|---|---|---|
| **OD-001** | Phase 1 First Slice Pipeline Scope | Option A: Minimal First Slice (`PresenceVectorCandidate → Minimal Governor A → PresenceIREnvelope`).<br>Option B: Full Target Pipeline (`AGNS → AETH → Presence IR → Governor A/B → Renderer`). | **RESOLVED via ADR-PIPELINE-DIRECTION-001** (Option A selected) | Phase 1 Gate |
| **OD-002** | Canonical 8D Presence IR Dimension Mapping | Candidate 1: Set 1 (`x,y,z,intent_phase,confidence,energy,coherence,policy_risk`).<br>Candidate 2: Set 2 (`D1..D8` thermodynamic field parameters).<br>Candidate 3: Hybrid (Set 1 as Wire Core, Set 2 in Research Space). | **PENDING CREATOR DECISION** | Post-First Slice |
| **OD-003** | IntentState Vocabulary Alignment | Option A: Extend wire enum to 7 states.<br>Option B: Maintain 4-state wire enum and map operational/safety states downstream.<br>Option C: Hybrid governed metadata. | **PENDING CREATOR DECISION** (Tracked in ADR-DRAFT-P0-01) | Phase 0.3 Ratification |

---

## 7. Decision Record & Ratification Log

- **ADR-PIPELINE-DIRECTION-001:** Selected Option A for OD-001. Formally ratified the Phase 1 First Slice boundary, keeping Phase 0 frozen and deferring AGNS, AETH, Governor B, Transition Engine, and 8D dimension canonicalization.

---

## 8. Summary of Non-Alteration Guarantees

This document certifies that:
1. `contracts/visual-state.schema.json` is **UNTOUCHED**.
2. `runtime/visual-state.js` and `runtime/reference-renderer.js` are **UNTOUCHED**.
3. `renderer/webgpu-renderer.js` and `manifestation/webgpu-adapter.js` are **UNTOUCHED**.
4. `package.json` and build dependencies are **UNTOUCHED**.
5. No new runtime code or shaders were introduced in this step.
