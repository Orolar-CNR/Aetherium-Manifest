# Cognitive Environment Model & Environmental Dynamics Runtime Research

**Status:** RESEARCH | NON-CANONICAL | EXPERIMENTAL | NOT PART OF CURRENT PHASE 0.x RUNTIME
**Document Version:** 0.1
**Date:** 2026-09-02

---

## Overview & Status Disclaimer

This directory contains research documentation and architectural exploration for the **Cognitive Environment Model** and **Environmental Dynamics Runtime** within Aetherium-Manifest.

> **CRITICAL GOVERNANCE BOUNDARY**
> All work in this directory and associated code in `research/world-model/` is classified as:
> * **RESEARCH**
> * **NON-CANONICAL**
> * **EXPERIMENTAL**
> * **NOT PART OF CURRENT PHASE 0.x RUNTIME**
>
> This research track does **NOT** alter the active Phase 0.x production path, does **NOT** modify canonical contracts (Visual State Contract, Presence IR, Governor, Manifest Contract), and serves purely as an experimental study.

---

## Conceptual Architecture

The research explores separating persistent world/environment state evolution from visual rendering.

```text
Human / AI / Signal
        │
        ▼
Environmental Event
        │
        ▼
Deterministic Transition Rules
        │
        ▼
Environmental State (WorldState Evolution)
        │
        ▼
Manifestation Proxy
        │
        ▼
[Downstream Renderers / Manifestation Engine]
```

### Key Terminology

1. **Environmental Dynamics Runtime** *(Primary Research Term)*: The experimental runtime engine responsible for evolving environmental state over time according to deterministic transition rules.
2. **Cognitive Environment Model** *(Secondary Conceptual Term)*: The conceptual model of an environment whose state evolves persistently and causally in response to events.
3. **Manifestation Proxy** *(Representation Term)*: An intermediate spatial-temporal research representation generated from evolving state, describing what should manifest (region, morphology, intensity, flow, persistence) without embedding renderer-specific logic.

---

## Relationship to Code World Model (CWM)

[Code World Model (CWM)](https://github.com/buaacyw/code-world-model) serves strictly as an **external research reference / inspiration source**. CWM proposes separating world evolution (via a coding agent / world brain) from video generation (via conditioning proxies).

For Aetherium-Manifest:
* CWM implementation is **NOT** copied or used as a dependency.
* Video generation models are **NOT** used or required.
* Instead, Aetherium borrows the underlying architectural principle:
  $$\text{Environment State} \neq \text{Renderer State}$$
  $$\text{World Evolution} \neq \text{Visual Realization}$$

---

## Documents in this Directory

* [`AETHERIUM-WORLD-MODEL-RESEARCH-NOTE-v0.1-EN.md`](./AETHERIUM-WORLD-MODEL-RESEARCH-NOTE-v0.1-EN.md): Motivation, research questions, hypotheses, and architectural relationship.
* [`AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md`](./AETHERIUM-WORLD-MODEL-SCHEMAS-v0.1-EN.md): Detailed specification of research schemas (`WorldState`, `EnvironmentalEvent`, `TransitionRule`, `ManifestationProxy`).

---

## Running the Research Prototype

The research prototype runs as an isolated CLI benchmark and test suite:

```bash
# Run the reproducible benchmark suite
npm run benchmark:world-model

# Run the focused unit & determinism test suite
npm run test:world-model
```

All benchmark results are reproducibly generated and saved to:
`research/world-model/benchmarks/results/`
