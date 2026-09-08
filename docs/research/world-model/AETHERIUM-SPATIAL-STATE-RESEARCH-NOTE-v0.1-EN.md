# Spatial State Architecture & Functional Aphantasia Simulation in Language Models

**Document Title:** Aetherium Spatial State Research Note
**Document Version:** 0.1.0
**Date:** 2026-09-02
**Status:** RESEARCH | EXPERIMENTAL | NON-CANONICAL | NOT PART OF CURRENT PHASE 0.x RUNTIME

---

## 1. Critical Governance Disclaimer & Isolation Boundary

> **STRICT ISOLATION PRINCIPLE**
> This document and its associated research models represent an isolated, non-canonical research track investigating spatial state representation in language models.
>
> * **NO PRODUCTION PATH MUTATION:** This research strictly resides under `docs/research/world-model/` and `research/world-model/`. It does **NOT** alter, replace, or inject code into the active Phase 0.x production application path (`runtime/`, `manifestation/`, `renderer/`, or `contracts/`).
> * **NON-CANONICAL STATUS:** The concepts, schemas, and state machine models described herein do **NOT** supersede or modify canonical specifications (`Visual State Contract`, `Presence IR`, `Governor Spec`, or `Manifest Contract Spec`).
> * **NO AUTOMATIC PROMOTION:** Findings from this research track remain experimental hypotheses until explicitly ratified through formal Creator Review and Contract Freeze gates.

---

## 2. Executive Summary & Research Motivation

Large Language Models (LLMs) and Multimodal Large Language Models (MLLMs) exhibit impressive capabilities in symbolic manipulation, semantic association, and linguistic logic. However, their ability to maintain consistent, persistent spatial models across multi-step physical or topological transformations remains severely limited.

When evaluated on spatial grid-world maze or object manipulation tasks, leading multimodal models (e.g., Gemini, GPT-5-mini, Claude class models) experience a **2x to 5x performance degradation** when transitioning from text-based adjacency lists to visual grid representations. This empirical phenomenon mirrors a well-documented human neurological phenomenon known as **Functional Aphantasia**.

In humans, congenital aphantasia is characterized by the absence of voluntary visual imagery ("the mind's eye"). Crucially, cognitive neuroscience reveals that individuals with aphantasia maintain intact or superior spatial reasoning, object localization, and topological navigation by relying on **propositional encoding** (abstract spatial structure) rather than visual token imagery.

This research note formulates an architectural model for Aetherium's research track: decoupling symbolic language parsing from a deterministic, explicit spatial state kernel.

---

## 3. Cognitive Governance Assessment (CEA Pipeline)

To rigorously evaluate the spatial state research proposal without ungrounded speculation, the input thesis underwent formal processing through the **Cognitive Environment Architecture (CEA)** governance pipeline:

```text
[Input Research Document]
           │
           ▼
        CEA-OM (Ontological Mapping & Proposal Discovery)
           │
           ▼
        CEA-CR (Claim Review & Evidence Mapping)
           │
           ▼
        CEA-DVP (Decision, Verification & Artifact Classification)
```

### 3.1 CEA-OM: Ontological Mapping & Discovery
* **Core Discovery:** LLMs fail at spatial continuity not due to visual acuity loss, but due to the absence of a deterministic geometric state kernel. Relying on context-window attention layers to retain coordinates leads to error accumulation, zombie agent states, and long-horizon stability collapse.
* **Proposed Mechanism:** Decouple language reasoning ($I_t$) from spatial state evolution ($S_{t+1} = \Phi(S_t, I_t)$) and output generation ($O_t = \Psi(S_t, I_t)$).

### 3.2 CEA-CR: Claim Review & Evidence Mapping
* **Claim 1 (Decoupled State Machine Superiority):** Decoupling state transition control from LLM decoding temperature guarantees determinism and eliminates accumulated state drift.
  * *Evidence in Repository:* `research/world-model/transition-rules/transition-rules.js` and `tests/world-model/world-model.test.js` demonstrate $100\%$ byte-level identical state hash reproduction across independent test runs.
  * *Classification:* `IMPLEMENTED_AND_VERIFIED` for basic physical field mechanics; `RESEARCH_HYPOTHESIS` for full LLM multi-agent benchmarks.
* **Claim 2 (Two-Tier Dataset Requirement):** Distinguishing semantic world knowledge from explicit state transition trajectories prevents overfitting and semantic hallucination.
  * *Evidence in Repository:* `research/world-model/scenarios/scenario-corpus.js` provides structured scenario inputs.
  * *Classification:* `RESEARCH_SPECIFICATION`.

### 3.3 CEA-DVP: Decision, Verification & Artifact Classification
* **Final CEA Classification Decisions:**
  * **B4 / Decoupled State Machine Architecture:** Classified as `RESEARCH_HYPOTHESIS`. Must be validated against Benchmark Matrix T1–T7 before any promotion consideration.
  * **Two-Tier Dataset & Schemas:** Classified as `RESEARCH_SPECIFICATION` under `docs/research/world-model/`.
  * **Speculative Spatial / Manifestation Concepts:** Classified as `VISION / SPECULATIVE_DESIGN`.

---

## 4. Two-Tier Dataset Architecture

To evaluate spatial reasoning objectively, the research track enforces a strict two-tier data architecture:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: RESEARCH CORPUS                         │
│  • Semantic background knowledge                                       │
│  • Rulebooks, topological constraints, and environmental logic          │
│  • Abstract relational definitions (containment, adjacency, bounds)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Input
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TIER 2: SPATIAL STATE TRANSITION                     │
│  Quantitative multi-step trajectories governed by standardized Schema:  │
│                                                                        │
│  1. WorldState (S_t)          - Mathematical snapshot of physical environment│
│  2. EnvironmentalEvent (I_t)  - External impulse, drag, or force perturbation│
│  3. TransitionRule (Φ)        - Deterministic math equations governing S_{t+1}│
│  4. GroundTruth (S_{GT})      - Calculated exact mathematical destination│
│  5. ManifestationProxy (O_t)  - Compiled intermediate spatial rendering proxy│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mathematical State Transition & Ground Truth Mechanics

### 5.1 State & Output Decoupling Equations
World state evolution is strictly deterministic and decoupled from text generation:

$$\text{Next State: } S_{t+1} = \Phi(S_t, I_t)$$

$$\text{Manifested Output: } O_t = \Psi(S_t, I_t)$$

Where:
* $S_t \in \mathcal{S}$ represents the canonical `WorldState` snapshot at time $t$.
* $I_t \in \mathcal{I}$ represents the input `EnvironmentalEvent`.
* $\Phi: \mathcal{S} \times \mathcal{I} \rightarrow \mathcal{S}$ is the deterministic state transition function.
* $\Psi: \mathcal{S} \times \mathcal{I} \rightarrow \mathcal{O}$ compiles state into a `ManifestationProxy`.

### 5.2 Computed Ground Truth Isolation Principle
* **Strict Calculation Rule:** Ground Truth ($S_{t+1}^{\text{GT}}$) MUST be computed directly by evaluating $\Phi(S_t, I_t)$ using fixed algorithmic rules.
* **Separation of Prediction and Truth:**
  $$\text{Predicted State: } \hat{S}_{t+1} = \text{Model Inference}(S_t, I_t)$$
  $$\text{Ground Truth State: } S_{t+1}^{\text{GT}} = \Phi_{\text{deterministic}}(S_t, I_t)$$
* **Zero LLM Guessing:** Ground truth coordinates and topological relations must never be estimated using human heuristics or probabilistic LLM sampling.

---

## 6. Error Taxonomy Specification

When evaluated against Ground Truth, model failures are categorized according to the following 4-tier diagnostic taxonomy:

| Error Category | Mechanism & Behavioral Profile | Diagnostic Metric |
| :--- | :--- | :--- |
| **State Tracking Deficiencies** | Memory loss or hallucination of non-existent entity attributes or coordinates without an intervening trigger event. | Attribute Amnesia Rate / Hallucinated Entity Count |
| **Transition Rule Violations** | Attempting actions that violate physical or spatial constraints (e.g., passing through solid obstacles, teleportation). | Rule Violation Frequency per Trajectory Step |
| **Topological Inconsistency** | Failure to maintain inheritance or containment relations (e.g., item moving out of a container without un-nesting). | Graph Edit Distance (GED) on Topological Edges |
| **Granularity Collapse** | Ability to comprehend coarse relative directions ("left of") while failing completely at exact coordinate precision. | Euclidean Distance Error ($\Delta d > \epsilon$) |

---

## 7. Baseline Architectural Models (B1 – B4)

To isolate performance gains attributable to explicit state persistence versus context length, four baseline tiers are defined:

1. **Baseline 1 (B1 - Pure Text LLM):** Standard auto-regressive LLM relying exclusively on in-context token history.
2. **Baseline 2 (B2 - LLM with Scratchpad/Working Memory):** LLM augmented with explicit Chain-of-Thought scratchpad reasoning.
3. **Baseline 3 (B3 - Vision-Language Models):** Multimodal model processing visual grid snapshots at each step.
4. **Baseline 4 (B4 - Decoupled State Machine Architecture):** Aetherium experimental architecture where the LLM parses intent while an independent, deterministic state machine computes state transitions.

> **RESEARCH STATUS OF B4:** B4 is classified as a `RESEARCH_HYPOTHESIS`. It is **NOT** a canonical architecture decision for Aetherium's production runtime.

---

## 8. Classification of Speculative & Unverified Concepts

To prevent architectural drift and maintain scientific integrity, concepts identified in research literature are explicitly categorized by evidence level:

| Concept Name | Proposed Description | Repository Evidence Level | Final Research Classification |
| :--- | :--- | :--- | :--- |
| **Explicit Spatial State ($S_t$)** | Numerical vector state for energy, fields, disturbances. | Code exists in `research/world-model/world-state/` | `VERIFIED_RESEARCH_PROTOTYPE` |
| **Deterministic Transition Rules ($\Phi$)** | Field propagation, decay, superposition math. | Code exists in `research/world-model/transition-rules/` | `VERIFIED_RESEARCH_PROTOTYPE` |
| **ManifestationProxy Compilation** | Spatial region & density compilation without GPU leakage. | Code exists in `research/world-model/proxy-state/` | `VERIFIED_RESEARCH_PROTOTYPE` |
| **SDF-Driven Manifestation** | Signed Distance Field representation for spatial bounds. | Benchmarked in `research/field-dynamics/` | `ISOLATED_RESEARCH_CANDIDATE` |
| **8D Manifold State Space** | 8-dimensional cognitive/spatial state manifold. | Documented in research notes; no runtime implementation | `VISION / SPECULATIVE_DESIGN` |
| **Attractor Forces & Fracture** | Dynamic field fracture and attractor manifold collapse. | Mathematical proposal only | `VISION / SPECULATIVE_DESIGN` |
| **Token Density & Semantic Coherence** | Direct mapping from LLM attention weights to visual density. | Theoretical hypothesis | `UNVERIFIED_HYPOTHESIS` |

---

## 9. Conclusion & Next Steps

This research note establishes the formal substrate for spatial state evaluation within Aetherium's research boundary. By maintaining a strict isolation from the Phase 0.x Application Path, the project can rigorously evaluate spatial state models using Benchmark Matrix T1–T7 without compromising the production engine.
