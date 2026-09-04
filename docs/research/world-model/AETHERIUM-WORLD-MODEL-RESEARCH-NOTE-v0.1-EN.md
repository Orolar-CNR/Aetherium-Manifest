# AETHERIUM WORLD MODEL RESEARCH NOTE

**Document Version:** 0.1
**Date:** 2026-09-02
**Status:** RESEARCH | NON-CANONICAL | EXPERIMENTAL | NOT PART OF CURRENT PHASE 0.x RUNTIME

---

## 1. Research Status & Vocabulary

This document strictly adheres to the canonical Aetherium governance vocabulary:

* **RESEARCH / EXPERIMENTAL**: Code or specification constructed solely for research and evaluation.
* **NON-CANONICAL**: Must not be substituted for active contracts (`Visual State`, `Presence IR`, `Governor`, or `Manifest Contract`).
* **ENVIRONMENTAL DYNAMICS RUNTIME**: The experimental subsystem managing persistent state, transition rules, and state evolution.
* **COGNITIVE ENVIRONMENT MODEL**: Conceptual framework defining the environment as a persistent state space influenced by events.
* **MANIFESTATION PROXY**: Intermediate research structure conveying spatial/temporal manifestation parameters downstream.

---

## 2. Research Problem & Core Question

Traditional interactive visual systems treat user inputs as ephemeral triggers for pre-canned animations (e.g., Touch $\rightarrow$ Ripple Effect $\rightarrow$ Return to Idle). Such systems lack persistent causal continuity.

This research investigates the core question:

> **«Can Aetherium maintain a persistent, inspectable, evolving environmental state independently of its visual renderer?»**

---

## 3. Core Principles Derived from Code World Model (CWM)

While CWM relies on video models and MiniMax-H3 inference for visual output, Aetherium adapts four core architectural patterns into a lightweight, governed framework:

1. **Persistent State Evolution**: Past events leave persistent traces in environmental energy, coherence, and field disturbances.
2. **Explicit Transition Rules**: Environmental changes follow deterministic, inspectable rules ($S_{t+1} = f(S_t, E_t, R)$) rather than black-box frame guessing.
3. **Separation of State from Rendering**: World/Environment state is completely decoupled from Canvas2D or WebGPU renderers.
4. **Spatial-Temporal Manifestation Proxy**: Compiling evolving state into intermediate numerical bounds (`ManifestationProxy`) for downstream manifestation.

---

## 4. Conceptual Architecture & Data Flow

```text
HUMAN / SIGNAL
      │
      ▼
Environmental Event (touch, drag, impulse, message)
      │
      ▼
Deterministic Transition Rules (decay, propagation, superposition)
      │
      ▼
Environmental State (Energy, Coherence, Fields, Disturbances)
      │
      ▼
Manifestation Proxy (Spatial region, Morphology, Flow, Density, Persistence)
      │
      ▼
Downstream Renderer Path (Particle / Light Environment)
```

---

## 5. Multi-Step Causality Example

Unlike ephemeral particle animations, state transitions persist across interaction steps:

* **Step 1 ($t_0$)**: User touches position $[0.5, 0.5]$ (Energy $0.3 \rightarrow 0.8$, Disturbance $D_1$ created).
* **Step 2 ($t_1$)**: $D_1$ expands outward while decaying. Persistent state retains $D_1$ active bounds.
* **Step 3 ($t_2$)**: User touches position $[0.6, 0.5]$ (Disturbance $D_2$ created).
* **Step 4 ($t_3$)**: $D_1$ and $D_2$ undergo field superposition (constructive/destructive interference) based on deterministic rules.

---

## 6. Research Hypotheses

* **H1 (State Continuity)**: Explicit state evolution allows multi-touch interactions to interact causally over time rather than resetting visual state.
* **H2 (Renderer Decoupling)**: A `ManifestationProxy` provides sufficient numeric description for renderers without leaking renderer-specific GPU buffers into the world state.
* **H3 (Determinism)**: Given identical initial state, seed, event sequence, and transition rules, $S_n$ and $P_n$ are 100% reproducible ($100\%$ byte-level or $10^{-6}$ numerical equality).

---

## 7. Research Boundaries & Non-Goals

> **STRICT NON-GOALS:**
> * ❌ Do NOT replace or modify the Phase 0.x production interpreter or renderer pipeline.
> * ❌ Do NOT introduce heavy LLM video models or Python dependencies into Aetherium.
> * ❌ Do NOT present `ManifestationProxy` or `WorldState` as replacements for canonical `Presence IR` or `Visual State Contract`.
> * ❌ Do NOT modify `app.js`, `index.html`, or core contracts.
