# Spatial State Traceability Matrix

**Document Title:** Aetherium Spatial State Research Traceability Matrix
**Document Version:** 0.1.0
**Date:** 2026-09-02
**Status:** RESEARCH | EXPERIMENTAL | NON-CANONICAL | NOT PART OF CURRENT PHASE 0.x RUNTIME
**Audit Baseline Commit:** `cf776f17d4a32cc6e184cf0f9b7338e62b740265`

---

## 1. Traceability Overview & Purpose

This document provides end-to-end forward and backward traceability for all core claims, specifications, implementations, test suites, and execution evidence across the **Spatial State / World Model Research Track**.

It enables auditors to traverse the complete verification chain for any research claim:

$$\text{Research Claim} \longrightarrow \text{Specification} \longrightarrow \text{Source Implementation} \longrightarrow \text{Test Suite} \longrightarrow \text{Execution} \longrightarrow \text{Evidence} \longrightarrow \text{Classification}$$

When any link in this chain is missing, the matrix explicitly highlights the broken link as an **Evidence Gap**.

---

## 2. Research Claim Traceability Chain

| Research Claim | Specification Document | Source Code Implementation | Test File & Function | Execution Evidence | Observed Result | Classification | Broken Link / Gap |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **WorldState Creation & Hash** | `AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md` | `research/world-model/world-state/world-state.js` | `tests/world-model/world-model.test.js` (Test 1) | Executed in Audit (`cf776f1`) | Exit 0, byte-level hash match | `VERIFIED` | None |
| **EnvironmentalEvent Validation** | `AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md` | `research/world-model/event-model/event-model.js` | `tests/world-model/world-model.test.js` (Test 4) | Executed in Audit (`cf776f1`) | Exit 0, throws on invalid type | `VERIFIED` | None |
| **Parameter Clamping** | `AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md` | `research/world-model/event-model/event-model.js` | `tests/world-model/world-model.test.js` (Test 4) | Executed in Audit (`cf776f1`) | Exit 0, energy clamped to 1.0 | `VERIFIED` | None |
| **Transition Field Propagation** | `AETHERIUM-SPATIAL-STATE-RESEARCH-NOTE-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `tests/world-model/world-model.test.js` (Test 2) | Executed in Audit (`cf776f1`) | Exit 0, energy decays over time | `VERIFIED` | None |
| **Superposition & Interference** | `AETHERIUM-SPATIAL-STATE-RESEARCH-NOTE-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `tests/world-model/world-model.test.js` (Test 3) | Executed in Audit (`cf776f1`) | Exit 0, amplitude boosted | `VERIFIED` | None |
| **ManifestationProxy Compilation** | `AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md` | `research/world-model/proxy-state/manifestation-proxy.js` | `tests/world-model/world-model.test.js` (Test 5) | Executed in Audit (`cf776f1`) | Exit 0, deterministic proxy object | `VERIFIED` | None |
| **Scenario Corpus Execution** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/scenarios/scenario-corpus.js` | `tests/world-model/world-model.test.js` (Test 6) | Executed in Audit (`cf776f1`) | Exit 0, all scenarios execute | `VERIFIED` | None |
| **T1 Single-Step Exact Ground Truth** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `tests/world-model/world-model.test.js` (Test 1) | Executed in Audit (`cf776f1`) | Exit 0, checks hash but missing `energy === 0.90` assertion | `PARTIAL_VERIFICATION` | Test Gap (`GAP-001`) |
| **T2 Event Commutativity** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `ABSENT` | `ABSENT` | No execution evidence | `SPECIFICATION_READY` | Test Gap / Execution Gap (`GAP-005`) |
| **T3 Dialogue State Persistence** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/world-state/world-state.js` | `tests/world-model/world-model.test.js` (Test 2) | Executed in Audit (`cf776f1`) | Exit 0, state decays; no LLM distractor test | `PARTIAL_VERIFICATION` | Architecture Gap (`GAP-007`) |
| **T4 50-Step Repeat Loop Stability** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `ABSENT` | `ABSENT` | No 50-step loop execution | `SPECIFICATION_READY` | Test Gap (`GAP-002`) |
| **T5 Frame of Reference Transformation** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `ABSENT` | `ABSENT` | `ABSENT` | No code or test | `SPECIFICATION_READY` | Implementation Gap (`GAP-004`) |
| **T6 Topological Containment Propagation** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `ABSENT` | `ABSENT` | `ABSENT` | No code or test | `SPECIFICATION_READY` | Implementation Gap (`GAP-004`) |
| **T7 Deterministic Reversibility Symmetry** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `research/world-model/transition-rules/transition-rules.js` | `ABSENT` | `ABSENT` | No reversibility test | `SPECIFICATION_READY` | Test Gap (`GAP-003`) |
| **State Accuracy Metric (SA)** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `ABSENT` | `ABSENT` | `ABSENT` | No code or test | `RESEARCH_CONCEPT` | Traceability Gap (`GAP-006`) |
| **Graph Edit Distance Metric (GED)** | `AETHERIUM-SPATIAL-STATE-BENCHMARK-SPEC-v0.1-EN.md` | `ABSENT` | `ABSENT` | `ABSENT` | No code or test | `RESEARCH_CONCEPT` | Traceability Gap (`GAP-006`) |
| **Baseline B4 (Decoupled State Machine)** | `AETHERIUM-SPATIAL-STATE-RESEARCH-NOTE-v0.1-EN.md` | Kernel in `research/world-model/` | `tests/world-model/world-model.test.js` | Executed in Audit (`cf776f1`) | Kernel passes; no LLM agent benchmark | `RESEARCH_HYPOTHESIS` | Benchmark Gap |
| **8D Manifold State Space** | `AETHERIUM-SPATIAL-STATE-RESEARCH-NOTE-v0.1-EN.md` | `ABSENT` | `ABSENT` | `ABSENT` | Documented math only | `VISION` | Implementation Gap |

---

## 3. Traceability Chain Breakdown & Gap Summary

```text
                                TRACEABILITY CHAIN ANALYSIS

   Research Claim
        │
        ├─► Specification Found? ──────► [ YES: 100% ]
        │
        ├─► Implementation Code Found? ─► [ PARTIAL: 60% Code / 40% Missing ]
        │
        ├─► Unit / Integration Test? ──► [ PARTIAL: 35% Covered / 65% Missing or Incomplete ]
        │
        ├─► Execution Evidence? ───────► [ PARTIAL: 6 Core Tests Executed Cleanly ]
        │
        └─► Exact Ground Truth Match? ─► [ PARTIAL: Determinism Verified / Numerical GT Unasserted ]
```

### Breakdown of Identified Gaps

1. **GAP-001 (Test Assertion Gap - T1):** Test 1 verifies byte-level hash determinism across repeated executions, but fails to assert numerical coordinate and global energy equality ($E = 0.90$) as required by Benchmark Spec T1.
2. **GAP-002 (Test Gap - T4):** Benchmark Spec T4 describes a 50-step repeated impulse/decay cycle. Test 1 executes a single step. No loop execution test exists.
3. **GAP-003 (Test Gap - T7):** Benchmark Spec T7 describes inverse impulse symmetry ($S_0 \xrightarrow{I_1} S_1 \xrightarrow{I_1^{-1}} S_2 \equiv S_0$). No executable test exists for inverse actions.
4. **GAP-004 (Implementation Gap - T5 & T6):** Frame of reference coordinate transformation (T5) and topological graph containment inheritance (T6) are described in schemas/specs but have zero source code implementation in `research/world-model/`.
5. **GAP-005 (Execution Gap - T2):** Transition rules support superposition, but no test file executes the $S_2^{(AB)} \equiv S_2^{(BA)}$ order-independence comparison.
6. **GAP-006 (Traceability Gap - Metrics):** State Accuracy ($\text{SA}$), Graph Edit Distance ($\text{GED}$), and OTAP trajectory alignment are specified mathematically in Benchmark Spec Section 3, but lack operational code implementations.
7. **GAP-007 (Architecture Gap - T3):** Multi-step state decay is tested in the deterministic engine, but the conversational LLM distractor benchmark required by T3 is absent.

---

## 4. Governance & Production Isolation Confirmation

* **Production Path Changed:** NO
* **Canonical Architecture Changed:** NO
* **Canonical Contracts Changed:** NO
* **Research Boundary Preserved:** YES

This traceability matrix operates exclusively within the isolated research track and does not impact production runtime or canonical contracts.
