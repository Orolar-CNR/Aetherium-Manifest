# Aetherium Temporal Signal Fusion & Early Manifestation Specification v0.1

**Classification**: `PHASE 0.x INTERACTION INFRASTRUCTURE / CANDIDATE DESIGN`
**Status**: `CANDIDATE DESIGN — PHASE 0.x INFRASTRUCTURE`
**Date**: March 2025

---

## 1. Truth Governance & Epistemic Boundaries

To prevent architecture drift and uphold **Aetherium Truth Governance**, all concepts in this document are strictly classified across four epistemic layers:

| Governance Layer | Status / Scope in Phase 0.x | Description |
| :--- | :--- | :--- |
| **VISION (Long-Term Direction)** | Conceptual Metaphor | Human ↔ Cognitive Environment interaction; non-command, non-turn-based environmental interface. |
| **CANONICAL ARCHITECTURE (Phase 1 Spec)** | 🛑 **Not Started / Specification Only** | AETH Compiler → PresenceVectorCandidate (8D latent state) → Governor A → PresenceIR → Perceptual Compiler → Governor B → Manifest Contract. |
| **PHASE 0.x INTERACTION INFRASTRUCTURE** | ⚙️ **Implemented Candidate Design** | Temporal Signal Fusion Layer, Interaction Episode Correlation, Graceful Early Manifestation, Typographyless Primary Surface. |
| **CURRENT ENGINEERING REALITY** | ✅ **Implemented Phase 0 Runtime** | User Input → Phase-0 Interpreter (Local Heuristic Mapping) → Visual State Contract → Canvas2D / WebGPU Reference Renderer. |

> **Mandatory Invariant**: The creation of client-side signal fusion or interaction episode objects in Phase 0.x MUST NOT be claimed as the implementation of Phase 1 Presence Runtime, Presence IR execution, or Governor permission enforcement boundaries.

---

## 2. Temporal Signal Fusion Layer

The **Temporal Signal Fusion Layer** is a lightweight, client-side signal organization pipeline operating upstream of the Phase-0 Interpreter. Its primary responsibility is **signal normalization and correlation**, not semantic reasoning.

```
┌─────────────────────────────────────────────────────────┐
│              Multi-Modal Human Input                    │
│   (Pointer / Touch / Motion / Voice / Text / Attach)   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
          ┌───────────────────────────────────┐
          │   Temporal Signal Fusion Layer    │
          │   - Normalize Input Signals       │
          │   - Preserve event_time & ingest  │
          │   - Early Manifestation Triggers  │
          └─────────────────┬─────────────────┘
                            │
                            ▼
                   Interaction Episode
                            │
                            ▼
                Phase-0 Local Interpreter
                            │
                            ▼
                  Visual State Contract
                            │
                            ▼
               Canvas2D / WebGPU Renderer
```

### 2.1 Signal Normalization Schema

Every human interaction signal ingested by the runtime is normalized into a unified signal envelope preserving physical timing and origin:

```json
{
  "signal_id": "sig-1741170000120-p1",
  "signal_type": "pointer.down",
  "source": "pointer",
  "event_time": 1741170000000.12,
  "ingest_time": 1741170000000.45,
  "coordinates": {
    "x": 420.5,
    "y": 310.2,
    "normalized_x": 0.35,
    "normalized_y": 0.42
  },
  "metadata": {
    "pointerType": "touch",
    "isPrimary": true,
    "button": 0
  },
  "sequence": 1
}
```

### 2.2 Invariant Timing Rules (`event_time` vs `ingest_time`)

1. **`event_time`**: High-resolution performance timestamp (DOM `timeStamp` or `performance.now()`) recording when the physical gesture or audio signal occurred at the hardware/client boundary.
2. **`ingest_time`**: High-resolution timestamp recording when the Temporal Signal Fusion Layer ingested and processed the event into memory.
3. **Strict Non-Collapse Rule**: `event_time` and `ingest_time` **MUST remain separate properties** and MUST NEVER be merged or collapsed into a single timestamp.

---

## 3. Interaction Episode Correlation Rules

An **Interaction Episode** represents a bounded temporal and spatial sequence of multi-modal human interaction signals.

Correlation in Phase 0.x is strictly **deterministic and inspectable**.

### 3.1 Deterministic Correlation Criteria

Two or more incoming signals are grouped into the same `InteractionEpisode` if they satisfy the following rules:

1. **Temporal Proximity**: The delta $\Delta t = |\text{event\_time}_B - \text{event\_time}_A|$ falls within the configured temporal correlation window ($\Delta t \le 1500\text{ ms}$).
2. **Spatial Continuity**: Pointer/touch move events originate from or continue the active spatial trajectory of an active gesture within the spatial radius threshold ($R \le 150\text{ px}$).
3. **Interaction Lifecycle Continuity**: Events matching active gesture sequences (`pointerdown` → `pointermove` → `pointerup` / `pointercancel`) belong to the same active episode lifecycle.
4. **Voice Context Alignment**: Final or interim speech recognition transcripts arriving while a pointer/touch gesture is active (or within $1200\text{ ms}$ post-release) correlate with the active/recent spatial interaction episode.

### 3.2 Interaction Episode Schema

```json
{
  "episode_id": "ep-1741170000000-8821",
  "status": "COMMITTED",
  "start_event_time": 1741170000000.12,
  "end_event_time": 1741170000000.85,
  "signals": [...],
  "spatial_context": {
    "initial_x": 420.5,
    "initial_y": 310.2,
    "centroid_x": 435.0,
    "centroid_y": 320.1,
    "max_distance": 45.2
  },
  "primary_text": "ขยายตรงนี้",
  "temporal_confidence": 0.95
}
```

---

## 4. Graceful Early Manifestation

**Graceful Early Manifestation** provides immediate physical feedback in the environmental manifestation field upon raw interaction signals (`pointerdown`, `pointermove`, `touch`), eliminating perceived latency before semantic interpretation finishes.

### 4.1 Physical Environmental Triggers

- **Tap / Pointer Down**: Generates an expanding local light propagation ripple at $(x, y)$.
- **Pointer Move / Drag**: Generates a particle trail and localized field density deformation along the touch trajectory.
- **Pointer Up / Release**: Initiates ripple decay and smoothly transitions back to the base particle field.

### 4.2 Early Manifestation Safety Invariants

1. **Reversibility**: Early manifestations affect transient render attributes (ripple objects, local field velocity adjustments) and do not overwrite the canonical target state until an `InteractionEpisode` commits.
2. **Single State Authority**: The `VisualStateContract` remains the sole authoritative source of target visual states (`phase`, `shape`, `hue`, `energy`, `density`, `coherence`, `turbulence`). Early manifestations are transient perturbations layered over the current visual state.
3. **Renderer Isolation**: Raw intent strings or unvalidated user gestures are NEVER passed directly into the core state machine. The renderer receives only explicit geometric parameters and transient ripple definitions.

---

## 5. Typographyless Morphological Rendering

In alignment with Phase 0.x interaction surface requirements:

1. **Elimination of Primary Surface Text**: Textual response widgets (e.g. `#responseSignal` or inline conversational answers) are eliminated from the main `#manifestCanvas` surface.
2. **Text Field as Input Port Only**: `#intentInput` functions strictly as a human signal entry port.
3. **Morphological Communication**: System answers are expressed through:
   - HSL Color Wheel shifts
   - Energy and density fluctuations
   - Particle formation and coherence
   - Spatial ripple and field deformation
4. **Diagnostic Isolation**: Numerical metrics (FPS, 8D parameters, logs) remain isolated within `#diagnosticsDrawer`.
