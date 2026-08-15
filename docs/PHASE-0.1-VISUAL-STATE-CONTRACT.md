# Aetherium Visual State Contract — Phase 0.1 Documentation

## 1. Purpose

The Aetherium Visual State Contract defines the first machine-readable, canonical, and deterministic boundary between intent interpretation and perception-oriented visual manifestation.

Phase 0.1 introduces a strict schema constraint, an isolated visual state validator / normalizer, and a pure modular validator. This decouples the responsibility of meaning interpretation and visual constraint policing from the canvas-based rendering engine.

> **CRITICAL ARCHITECTURAL BOUNDARY:**
> Phase 0.1 is **NOT** an AI reasoning engine. It is a visual-state contract and validated rendering foundation. No textual answers are returned or rendered in the visual surface. The response is represented solely through light, particle formation, motion, morphology, density, energy, and color.

---

## 2. Current Pipeline

The system processes and delivers user intent to human perception via the following strict pipeline:

```
User Intent
     │
     ▼
Prototype Intent Interpreter (app.js)
     │ [interprets raw user text / matches heuristics]
     ▼
Candidate State Object
     │
     ▼
Visual State Validator / Normalizer (runtime/visual-state.js -> createVisualState())
     │ [normalizes, clamps, and validates the state object]
     ▼
Canonical Target Visual State (Deterministic & Validated)
     │
     ▼
Renderer (app.js -> updateState() & render())
     │ [interpolates values over time; simulates particles, noise, and bursts]
     ▼
Perceptual Phenomenon (HTML5 Canvas)
     │
     ▼
Human Perception (Light, Particles, Motion, Morphology, Density, Energy, Color, Coherence)
```

---

## 3. Visual State Fields and Specification

The visual state contract is specified declaratively in `contracts/visual-state.schema.json` and enforced programmatically in `runtime/visual-state.js`.

### 3.1 Allowed Phases (`phase`)
Determines the macroscopic behavioral phase of the manifest.
* `IDLE`: Resting state, waiting for user interaction.
* `LISTENING`: Receptive to user touch or intent input.
* `PROCESSING`: Thinking/analyzing (dynamic spiral formation).
* `RESPONDING`: Active manifestation/synthesis.
* `WARNING`: Disrupted state, orange/red wave behaviors.
* `ERROR`: Critical failure state.
* `NIRODHA`: Near-zero activity, near-void manifestation (no particle rendering).

### 3.2 Allowed Shapes (`shape`)
Governs the underlying geometrical field guide for particles.
* `sphere`: Standard spherical coordinate field.
* `triangle`: Dynamic three-sided vector coordinate field.
* `spiral`: Radial logarithmic spiral pathing.
* `line`: Linear distribution along the horizontal axis.
* `wave`: Sinusoidal wave morphologist.

### 3.3 Numeric Parameters and Ranges

| Field | Range | Default | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `hue` | `0` .. `360` | `190` | Base color angle on the HSL color wheel. |
| `energy` | `0.0` .. `1.0` | `0.18` | Particle velocity scale and core size multiplier. |
| `density` | `0.0` .. `1.0` | `0.55` | Extent of particle spatial footprint and budget scaling. |
| `turbulence` | `0.0` .. `0.65` | `0.10` | Maximum noise displacement multiplier applied to particles. |
| `coherence` | `0.0` .. `1.0` | `0.88` | Particle movement stiffness and spring tension towards target fields. |
| `confidence` | `0.0` .. `1.0` | `0.55` | Accuracy/reliability metric of the interpreter's classification. |

---

## 4. Architectural Guarantees

### What the Visual State Validator / Normalizer Guarantees
1. **Immutability**: Input candidates are never mutated. `clampVisualState` and `createVisualState` always return new, distinct state objects.
2. **Determinism**: Given the exact same interpreter candidate parameters, the validator / normalizer guarantees the output canonical target visual state is 100% identical.
3. **Strict Boundaries**: Any numeric value outside its allowed bounds is safely clamped.
4. **Structural Validity**: Any missing fields (except phase/shape which represent critical semantic categories and must be supplied) are populated with safe defaults.
5. **No Silent Malformations**: Attempting to supply unsupported phases (e.g. `"BANANA"`) or shapes will result in validation failure and throw a runtime exception instead of being silently translated into arbitrary states.

### What the Renderer is Allowed to Receive
1. **Validated / Normalized States Only**: The renderer is completely insulated from raw user intent text and semantic parsing. It only ever receives validated, normalized, and fully-specified canonical target visual states.
2. **Decoupled Interpolation**: The renderer is allowed to maintain its own local, transient "Current Render State" which smoothly interpolates (lerps) towards the canonical target state over time.
3. **Derived Metrics**: Render-specific parameters like particle budget, alpha noise, glow, index-specific lightness, or circular hue interpolation are calculated locally within the renderer and do not contaminate the semantic contract.

---

## 5. Intentionally NOT Implemented (Phase-0.1 Exclusions)

The following architectures belong to subsequent phases and are **strictly forbidden** from being implemented in Phase 0.1:
* Large Language Models (LLM) or remote AI reasoning engines.
* Aetherium Expression (AETH) DSL and compiler.
* Presence Intermediate Representation (Presence IR) runtime.
* 8D manifold state vectors.
* WebSockets or backend services.
* WebGPU, Three.js, React, or custom GPU pipelines (vanilla 2D Canvas is used).
* Persistence/Databases.
* Telemetry, authentication, or external analytical services.
