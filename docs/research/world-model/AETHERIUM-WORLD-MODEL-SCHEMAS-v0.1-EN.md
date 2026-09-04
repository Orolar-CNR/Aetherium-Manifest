# AETHERIUM WORLD MODEL SCHEMAS SPECIFICATION

**Document Version:** 0.1
**Date:** 2026-09-02
**Status:** RESEARCH | NON-CANONICAL | EXPERIMENTAL | NOT PART OF CURRENT PHASE 0.x RUNTIME

---

## 1. Overview

This document specifies the four core research schemas powering the **Environmental Dynamics Runtime**:

1. **`WorldState`**: Represents persistent environmental parameters (energy, coherence, fields, disturbances, global time).
2. **`EnvironmentalEvent`**: Represents discrete input signals (touch, drag, impulse, message event) affecting the environment.
3. **`TransitionRule`**: Defines mathematical parameters governing state evolution, propagation, decay, and field interactions.
4. **`ManifestationProxy`**: The compiled intermediate spatial-temporal output passed downstream for visual manifestation.

Formal JSON Schema definitions reside in `research/world-model/schemas/*.schema.json`.

---

## 2. WorldState Specification

```json
{
  "version": "0.1.0",
  "timestamp": 12.5,
  "step": 25,
  "global_energy": 0.65,
  "coherence": 0.82,
  "entropy": 0.18,
  "fields": [
    {
      "id": "field-01",
      "type": "radial_expansion",
      "center": [0.5, 0.5],
      "radius": 0.25,
      "intensity": 0.7,
      "frequency": 1.2
    }
  ],
  "disturbances": [
    {
      "id": "dist-01",
      "position": [0.42, 0.38],
      "amplitude": 0.8,
      "decay_rate": 0.05,
      "age": 1.2
    }
  ]
}
```

---

## 3. EnvironmentalEvent Specification

```json
{
  "id": "evt-101",
  "type": "touch_impulse",
  "timestamp": 12.0,
  "position": [0.42, 0.38],
  "intensity": 0.8,
  "parameters": {
    "radius": 0.05,
    "force": 1.2
  }
}
```

Supported event types in Phase 0.3 research:
* `touch_impulse`: Sudden localized energy injection.
* `continuous_drag`: Directional flow vector addition.
* `message_event`: Global background energy / coherence modulation.
* `field_reset`: Controlled field relaxation.

---

## 4. TransitionRule Specification

Transition rules determine how state $S_t$ evolves to $S_{t+\Delta t}$ given event $E_t$:

* **Energy Decay**: $E_{t+\Delta t} = E_t \cdot (1 - \gamma \cdot \Delta t)$
* **Disturbance Propagation**: $R_{t+\Delta t} = R_t + v \cdot \Delta t$
* **Superposition**: When two disturbance fields overlap within threshold distance $d$, their intensity merges via constructive/destructive interference: $I_{\text{combined}} = \sqrt{I_1^2 + I_2^2 + 2 I_1 I_2 \cos(\Delta \phi)}$.

---

## 5. ManifestationProxy Specification

The `ManifestationProxy` aggregates active field state into explicit rendering hints:

```json
{
  "version": "0.1.0",
  "timestamp": 12.5,
  "region": {
    "center": [0.42, 0.38],
    "extent": [0.3, 0.3]
  },
  "density": 0.75,
  "flow": [0.12, -0.05],
  "coherence": 0.82,
  "morphology": "vortex_ring",
  "persistence": 2.5,
  "visual_hints": {
    "primary_hue_shift": 15.0,
    "turbulence": 0.22,
    "particle_count_scale": 1.25
  }
}
```

---

## 6. Determinism & Precision Standard

In alignment with canonical Aetherium determinism rules:
* Precision: 6 decimal places (`precision_dp = 6`).
* Hash digest: BLAKE3-256 or SHA-256 for research state snapshots.
* Key sorting: Lexicographical key sorting during serialization.
