# Aetherium Manifest

Aetherium Light Manifest is a perception-oriented perceptual interface rendered as light and particle formation. It translates user intent directly into structured fluid manifestations without relying on traditional textual feedback.

---

## Current Status: Phase 0.1 — Canonical Visual State Contract

Phase 0.1 establishes a strict, machine-readable visual state contract (`contracts/visual-state.schema.json`) and safety governor (`runtime/visual-state.js`) to decouple intent parsing from rendering.

### Core Architectural Philosophy

The system **intentionally does not return textual answers** in the visual surface.
The manifestation response is represented purely through physical phenomena:
* **Light & Color**: Direct HSL color wheel transitions mapping semantic energy.
* **Particle Formation**: Coordinated geometric coordinate fields.
* **Motion & Morphology**: Smooth interpolation, noise, and structural transition.
* **Density & Coherence**: System response fidelity and physical tightness.

---

## Architecture

```
User Intent
     ↓
Phase-0 Interpreter
     ↓
Visual State Contract (JSON Schema Draft 2020-12)
     ↓
Governor (Clamping & Validation)
     ↓
Light Renderer (2D HTML5 Canvas Particles)
```

1. **User Intent**: The raw user text input (e.g., Thai/English commands).
2. **Phase-0 Interpreter**: High-efficiency local string-matching heuristic (no LLM, zero latency).
3. **Visual State Contract**: Decoupled schema defining allowed phases, shapes, and numeric ranges.
4. **Governor**: Safely clamps bounds, populates defaults, and strictly validates target state objects before submission.
5. **Light Renderer**: Animates, interpolates, and renders the particles dynamically based on the governed target state.

---

## Directory Layout

* `contracts/visual-state.schema.json`: Machine-readable contract (JSON Schema Draft 2020-12).
* `runtime/visual-state.js`: Zero-dependency safety validation and state factory.
* `docs/PHASE-0.1-VISUAL-STATE-CONTRACT.md`: In-depth contract design and pipeline documentation.
* `tests/visual-state.test.js`: Comprehensive, lightweight Node.js native tests.
* `app.js`: Local prototype interpreter and canvas particle rendering system.
* `index.html`: Responsive HTML5 viewport & interaction canvas structure.
* `styles.css`: Fluid typography, hardware-accelerated layouts, and deep dark aesthetic.

---

## Running Locally

To start the interface locally, simply open `index.html` in a web browser supporting ES6 Modules.

## Testing

To run the contract verification tests locally, execute:

```bash
node tests/visual-state.test.js
```
