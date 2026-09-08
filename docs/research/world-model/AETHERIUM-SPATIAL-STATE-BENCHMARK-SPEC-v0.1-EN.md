# Spatial State Benchmark Specification (Matrix T1 – T7)

**Document Title:** Aetherium Spatial State Benchmark Specification
**Document Version:** 0.1.0
**Date:** 2026-09-02
**Status:** RESEARCH | EXPERIMENTAL | NON-CANONICAL | NOT PART OF CURRENT PHASE 0.x RUNTIME

---

## 1. Overview & Research Objective

This document defines the formal research specification for **Benchmark Matrix T1 – T7**, designed to measure the spatial state tracking, persistence, topological integrity, and determinism of language models and agent architectures.

Unlike static Visual Question Answering (VQA) or textual adjacency benchmarks, Matrix T1 – T7 evaluates **multi-step spatial state trajectories** against algorithmically computed **Deterministic Ground Truth**.

```text
       ┌────────────────────────────────────────────────────────┐
       │                   BENCHMARK RUNNER                     │
       └───────────────────────────┬────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   ┌──────────────────────┐                  ┌──────────────────────┐
   │ EVALUATED ARCHITECTURE│                  │  DETERMINISTIC KERNEL│
   │ (e.g. B1, B2, B3, B4) │                  │  (Ground Truth Spec) │
   └──────────┬───────────┘                  └──────────┬───────────┘
              │ Predicted State                         │ Calculated Truth
              ▼                                         ▼
   ┌────────────────────────────────────────────────────────────────┐
   │                       METRIC EVALUATOR                         │
   │  • State Accuracy (SA)    • Determinism Index (DI)             │
   │  • Graph Edit Distance    • OTAP / UFGW Trajectory Score       │
   │  • Error Taxonomy Categorizer                                  │
   └────────────────────────────────────────────────────────────────┘
```

---

## 2. Benchmark Matrix Scenarios (T1 – T7)

### T1: Single-Step Execution (Basic Spatial Geometry)
* **Objective:** Evaluate fundamental spatial intent parsing and single-step geometric coordinate transformation.
* **Input State ($S_0$):** Canonical `WorldState` with entity $E_1$ at position $[0.50, 0.50]$ and global energy $E = 0.10$.
* **Action Input ($I_1$):** `EnvironmentalEvent` of type `touch_impulse` at position $[0.50, 0.50]$ with intensity $0.80$.
* **Transition Rule ($\Phi$):** $E_{t+1} = E_t + \Delta E$; disturbance $D_1$ spawned at $[0.50, 0.50]$ with amplitude $0.80$.
* **Expected Ground Truth ($S_{\text{GT}}$):** State with global energy $E = 0.90$, 1 disturbance at $[0.50, 0.50]$, age $= 0.0$.
* **Evaluation Metrics:** State Accuracy ($100\%$ required), Coordinate Error ($\Delta d = 0.000000$).
* **Failure Condition:** Missing disturbance or incorrect coordinate extraction.
* **Error Taxonomy Mapping:** `Transition Rule Violations` / `Granularity Collapse`.
* **Repository Alignment:** Partial verification in Test 1 (`tests/world-model/world-model.test.js`). Verified byte-level hash determinism; exact numerical energy equal to 0.90 assertion is currently unasserted in test suite (`PARTIAL_VERIFICATION`).

---

### T2: Event Commutativity (Order-Independence Verification)
* **Objective:** Test whether independent non-overlapping spatial events produce identical final world states regardless of input order.
* **Input State ($S_0$):** Quiescent state with zero active disturbances.
* **Action Inputs ($I_A, I_B$):**
  * $I_A$: `touch_impulse` at $[0.20, 0.20]$, intensity $0.50$.
  * $I_B$: `touch_impulse` at $[0.80, 0.80]$, intensity $0.50$.
* **Execution Paths:**
  * Path 1: $S_0 \xrightarrow{I_A} S_1 \xrightarrow{I_B} S_2^{(AB)}$
  * Path 2: $S_0 \xrightarrow{I_B} S_1' \xrightarrow{I_A} S_2^{(BA)}$
* **Transition Rule ($\Phi$):** Independent spatial field superposition.
* **Expected Ground Truth ($S_{\text{GT}}$):** $S_2^{(AB)} \equiv S_2^{(BA)}$ (byte-level identical canonical hash).
* **Evaluation Metrics:** Determinism Index ($\text{DI} = 1.0$), Commutativity Variance ($\Delta = 0.0$).
* **Failure Condition:** Language model ordering bias causes $S_2^{(AB)} \neq S_2^{(BA)}$.
* **Error Taxonomy Mapping:** `State Tracking Deficiencies` (Order-bias hallucination).
* **Repository Alignment:** Specification ready. Transition rules support superposition (`research/world-model/transition-rules/`), but no executable test explicitly compares Path $AB$ vs Path $BA$ (`SPECIFICATION_READY`).

---

### T3: State Persistence (Long-Horizon Working Memory)
* **Objective:** Verify spatial state retention across intervening non-spatial conversational distractors.
* **Input State ($S_0$):** Entity $E_1$ placed inside Container $C_1$ at position $[0.30, 0.70]$.
* **Action Inputs:**
  * Step 1: Set entity position ($S_0 \rightarrow S_1$).
  * Steps 2 – 10: $N=9$ non-spatial text dialogue steps (distractor task).
  * Step 11: Query position of $E_1$.
* **Transition Rule ($\Phi$):** Passive state retention with zero spatial decay for topological containment.
* **Expected Ground Truth ($S_{\text{GT}}$):** $E_1$ position strictly remains $[0.30, 0.70]$ inside $C_1$.
* **Evaluation Metrics:** State Persistence Ratio, Attribute Amnesia Rate.
* **Failure Condition:** Model forgets location or hallucinates reset to origin $[0.0, 0.0]$.
* **Error Taxonomy Mapping:** `State Tracking Deficiencies` (Attribute Amnesia).
* **Repository Alignment:** Partial verification by Test 2 in `tests/world-model/world-model.test.js`. Verifies multi-step state persistence in deterministic state engine; conversational LLM distractor benchmark is not implemented (`PARTIAL_VERIFICATION`).

---

### T4: Repeat Execution (Cyclical Loop & Drift Resistance)
* **Objective:** Evaluate state machine stability against repetitive cyclical actions to detect accumulated coordinate drift or zombie deadlock states.
* **Input State ($S_0$):** Initial disturbance field $D_1$ at $[0.50, 0.50]$.
* **Action Input ($I_1 \dots I_N$):** Execute $N=50$ identical cycle steps (impulse $\rightarrow$ decay $\rightarrow$ impulse).
* **Transition Rule ($\Phi$):** Bounded energy evolution ($E \le 1.0$) and age incrementation.
* **Expected Ground Truth ($S_{\text{GT}}$):** Exactly bounded energy and age values matching closed-form equation.
* **Evaluation Metrics:** Accumulated Coordinate Drift ($\Delta d$), Zombie Loop Frequency ($0\%$).
* **Failure Condition:** Unbounded energy growth, infinite loops, or NaN coordinate collapse.
* **Error Taxonomy Mapping:** `Transition Rule Violations` (Accumulated Drift).
* **Repository Alignment:** Specification ready. Transition rules support bounded energy decay, but no test file executes a 50-step loop (`SPECIFICATION_READY`).

---

### T5: Frame of Reference Transformation (Egocentric vs. Allocentric)
* **Objective:** Test model resistance to directional/reading bias when transforming perspective from observer-centric (left/right) to world-centric (north/east/coordinates).
* **Input State ($S_0$):** Observer facing East at $[0.50, 0.50]$. Object $X$ is 2 units "Ahead" (East).
* **Action Input ($I_1$):** "Turn 90 degrees Left, move 1 unit Ahead".
* **Transition Rule ($\Phi$):**
  * Initial facing: $0^\circ$ (East).
  * New facing: $+90^\circ$ (North).
  * New coordinate: $[0.50, 0.50] + [0, 1.0] = [0.50, 1.50]$.
* **Expected Ground Truth ($S_{\text{GT}}$):** Observer position $[0.50, 1.50]$, facing North ($90^\circ$). Object $X$ position unchanged at $[2.50, 0.50]$.
* **Evaluation Metrics:** Coordinate Accuracy, Heading Direction Error ($\Delta \theta = 0^\circ$).
* **Failure Condition:** Confusion between egocentric "Left" and allocentric "West".
* **Error Taxonomy Mapping:** `Granularity Collapse` / `Topological Inconsistency`.
* **Repository Alignment:** Specification ready. Multi-agent spatial suite design (`SPECIFICATION_READY`).

---

### T6: Topological Constraints (Containment & Inheritance)
* **Objective:** Test inheritance of spatial positions for nested object hierarchies.
* **Input State ($S_0$):** Key $K_1$ is inside Box $B_1$. Box $B_1$ is at position $[0.10, 0.10]$.
* **Action Input ($I_1$):** Move Box $B_1$ along vector $[+0.40, +0.50]$.
* **Transition Rule ($\Phi$):**
  * Position update: $\text{Pos}(B_1) \rightarrow [0.50, 0.60]$.
  * Containment propagation: $\forall x \in \text{Contains}(B_1), \text{Pos}(x) \leftarrow \text{Pos}(B_1) + \text{RelativeOffset}(x)$.
* **Expected Ground Truth ($S_{\text{GT}}$):** Both $B_1$ and $K_1$ located at $[0.50, 0.60]$.
* **Evaluation Metrics:** Topological Graph Edit Distance ($\text{GED} = 0$), Containment Invariance.
* **Failure Condition:** Box moves to $[0.50, 0.60]$ while Key $K_1$ remains stranded at $[0.10, 0.10]$.
* **Error Taxonomy Mapping:** `Topological Inconsistency`.
* **Repository Alignment:** Specification ready. Schemas defined (`research/world-model/schemas/`), containment graph engine un-implemented (`SPECIFICATION_READY`).

---

### T7: Deterministic Reversibility (Symmetry Verification)
* **Objective:** Verify that applying exact inverse spatial actions restores the original initial state.
* **Input State ($S_0$):** Quiescent state $S_0$.
* **Action Sequence:**
  * Forward: Apply impulse $I_1 = (+0.30, +0.20)$. State transitions $S_0 \xrightarrow{I_1} S_1$.
  * Inverse: Apply inverse impulse $I_1^{-1} = (-0.30, -0.20)$. State transitions $S_1 \xrightarrow{I_1^{-1}} S_2$.
* **Transition Rule ($\Phi$):** Vector translation symmetry.
* **Expected Ground Truth ($S_{\text{GT}}$):** $S_2 \equiv S_0$ (within numerical precision $10^{-6}$).
* **Evaluation Metrics:** Reversibility Error $\Delta S = \|S_2 - S_0\|_2$, Symmetry Index.
* **Failure Condition:** Non-zero residual energy or coordinate offset lingering after net-zero action sequence.
* **Error Taxonomy Mapping:** `State Tracking Deficiencies` (Non-Symmetric Drift).
* **Repository Alignment:** Specification ready. Mathematical symmetry supported by equations in `research/world-model/transition-rules/transition-rules.js`, but no reversibility test executed (`SPECIFICATION_READY`).

---

## 3. Quantitative Metrics & Evaluation Mathematics

### 3.1 State Accuracy ($\text{SA}$)
Evaluates the proportion of state variables that match Ground Truth within precision threshold $\epsilon = 10^{-6}$:

$$\text{SA} = \frac{1}{N} \sum_{i=1}^{N} \mathbb{I}\left( \|S_i^{\text{pred}} - S_i^{\text{GT}}\|_2 < \epsilon \right)$$

### 3.2 Determinism Index ($\text{DI}$)
Measures output identity across $K$ independent runs with identical inputs and varying random seeds (or decoding temperatures):

$$\text{DI} = \frac{2}{K(K-1)} \sum_{i=1}^{K-1} \sum_{j=i+1}^{K} \mathbb{I}\left( \text{Hash}(S^{(i)}) == \text{Hash}(S^{(j)}) \right)$$

### 3.3 Trajectory Validity via Graph Edit Distance ($\text{GED}$)
Evaluates structural distance between predicted topological graph $G_{\text{pred}}$ and Ground Truth graph $G_{\text{GT}}$:

$$\text{GED}(G_{\text{pred}}, G_{\text{GT}}) = \min_{(e_1, \dots, e_k) \in \mathcal{P}} \sum_{i=1}^{k} c(e_i)$$

Where $c(e_i)$ represents the operational cost of node/edge insertion, deletion, or substitution.

### 3.4 Optimal Transport for Agentic Planning ($\text{OTAP}$)
Evaluates trajectory sequence alignment using Unbalanced Fused Gromov-Wasserstein ($\text{UFGW}$) distance, accounting for redundant or skipped planning steps without penalizing valid multi-step variations.

---

## 4. Verification & Repository Evidence Summary

| Scenario | Objective | Verified Repository Status | Evidence Location |
| :--- | :--- | :--- | :--- |
| **T1: Single-Step** | Single impulse coordinate transformation | `PARTIAL_VERIFICATION` | `tests/world-model/world-model.test.js` (Test 1) |
| **T2: Commutativity** | Order-independent event identity | `SPECIFICATION_READY` | `research/world-model/scenarios/scenario-corpus.js` |
| **T3: Persistence** | Multi-step state retention | `PARTIAL_VERIFICATION` | `tests/world-model/world-model.test.js` (Test 2) |
| **T4: Repeat Execution** | Cyclical loop stability & drift | `SPECIFICATION_READY` | `research/world-model/transition-rules/transition-rules.js` |
| **T5: Frame Reference** | Ego vs Allocentric transformation | `SPECIFICATION_READY` | `research/world-model/scenarios/` |
| **T6: Topology** | Containment & position inheritance | `SPECIFICATION_READY` | `research/world-model/schemas/` |
| **T7: Reversibility** | Inverse event symmetry | `SPECIFICATION_READY` | `research/world-model/transition-rules/transition-rules.js` |

---

## 5. Governance & Boundary Rules

> **RESEARCH ISOLATION GUARANTEE**
> Benchmark Matrix T1–T7 serves exclusively as a diagnostic test suite for the research track. Running or failing T1–T7 benchmarks does **NOT** block or impact the production runtime build or deployment pipeline.
