# Aetherium Manifest

Perceptual interface for AI system state — rendered as light, particles, and motion.

```text
Receive Message → Process → Manifest as Light
```

The text field is an **input channel**, not a chat answer surface. The system intentionally does **not** return textual answers on the visual surface. Primary output is environmental manifestation: light, color, particle formation, motion, density, and coherence.

- **Package Version:** `0.2.0` (Phase 0.x Governed Prototype)
- **Live Demo:** [orolar-cnr.github.io/Aetherium-Manifest](https://orolar-cnr.github.io/Aetherium-Manifest/)
- **Repository:** [github.com/Orolar-CNR/Aetherium-Manifest](https://github.com/Orolar-CNR/Aetherium-Manifest)

---

## Current Engineering Truth & Epistemic Principles

System truth and architectural authority are governed strictly by verifiable implementation and executable test evidence rather than long-term vision or unratified proposals.

### Core Doctrine
> **State before beauty. Governor before renderer. Intent before image.**

### Epistemic Rule
$$\text{Lexical Gate PASS} \neq \text{Architecture PASS} \neq \text{Implementation PASS}$$

Passing the Lexical CI/CD Boundary Gate confirms lexical boundary compliance, but does **not** signify that Phase 1 architectural components or runtime modules are implemented.

### Evidence Hierarchy
When documentation or claims conflict, authority is determined by the following strict hierarchy:
1. **Observed Repository Execution & Executable Tests** (`npm test`, CI test status)
2. **Current Engineering Truth** (`docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md`)
3. **Locked Contracts & Ratified ADRs** (`contracts/visual-state.schema.json`, `docs/decisions/ADR-DRAFT-P0-*`)
4. **Architecture Specifications** (SAD v4.2, Presence IR Spec, Governor Spec, Manifest Contract Spec)
5. **Research Candidates & Proposals** (`docs/research/*`, `research/*` — strictly non-canonical)
6. **Vision** (`docs/AETHERIUM-MANIFEST-VISION.md` — directional, non-implementation fact)

---

## Current Implementation Status

| Phase / Gate | Status | Description |
| :--- | :--- | :--- |
| **Phase 0.0** Light Output Proof | ✅ Completed | Particle and visual light output foundation established. |
| **Phase 0.1** Visual State Contract | ✅ Completed | Canonical schema (`contracts/visual-state.schema.json`), validator (`runtime/visual-state.js`), and golden fixtures. |
| **Phase 0.2** Canvas2D Reference Renderer | ✅ Completed | Deterministic reference renderer path (`runtime/reference-renderer.js`, `renderer/canvas-renderer.js`) with conformance suite. |
| **Phase 0.2** WebGPU Particle PoC | ✅ Completed | Experimental WebGPU backend (`renderer/webgpu-renderer.js`), adapter boundary (`manifestation/webgpu-adapter.js`), WGSL shaders, deterministic `rendererSeed`, and automatic Canvas2D fallback. |
| **Phase 0.3** Contract Consistency Matrix | ✅ Documented | Reconciliation artifact (`docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md`) identifying P0 alignment items. |
| **P0 ADR Drafts** | 📝 Pending Ratification | Four draft ADRs (`ADR-DRAFT-P0-01` through `04`) awaiting ratification in `docs/decisions/`. |
| **Lexical Boundary Gate** | ✅ PASS | CI linter engine (`tools/lexical/aetherium-interaction-linter-v2.py`) and policy v0.2 active in blocking CI workflow. |
| **Gate A - Contract Freeze Gate** | ⏳ In Progress | Preparing for contract ratification prior to freezing Presence IR, Governor, and Manifest Contract specs. |
| **Gate B - IntentCore Integration** | 🛑 Not Started | Prerequisite: Gate A closure. |
| **Gate C - Phase 1 Presence Runtime** | 🛑 Not Started | Prerequisite: Gate B completion. Target pipeline: `PresenceVectorCandidate` → `Governor A` → `PresenceIREnvelope`. |

---

## Master Component Matrix

| Component ID | Component Name | Actual Status | Epistemic / Truth Classification | Description & Location |
| :--- | :--- | :--- | :--- | :--- |
| `COMP-001` | Lexical CI/CD Boundary Gate | `PASS` | `IMPLEMENTED_REQUIRES_EXECUTABLE_PROOF` | Linter engine v2 (`python3`), Policy v0.2, CI blocking step, and evidence logging (`reports/lexical/latest.json`). |
| `COMP-002` | Blank-First Interaction Model | `IMPLEMENTED` | `CURRENT_CANONICAL` | Minimal composer contact surface (`index.html`, `app.js`). Omits persistent chat text; isolates diagnostics in secondary drawer. |
| `COMP-003` | Visual State Schema v0.1 | `IMPLEMENTED` | `CURRENT_CANONICAL` | Active contract (`contracts/visual-state.schema.json`), normalization/clamping runtime, and golden test fixtures. |
| `COMP-004` | Canvas2D Reference Renderer | `IMPLEMENTED` | `CURRENT_CANONICAL` | Reference manifestation implementation (`runtime/reference-renderer.js`, `renderer/canvas-renderer.js`) with conformance suite. |
| `COMP-005` | WebGPU Manifestation Backend | `EXPERIMENTAL` | `EXPERIMENTAL` | WebGPU particle PoC (`renderer/webgpu-renderer.js`, `runtime/webgpu/*`, WGSL shaders). Operates strictly via adapter boundary with Canvas2D fallback. |
| `COMP-006` | AETH Compiler | `SPECIFIED` | `RETAINED_BUT_FUTURE` | Pipeline specification in SAD v4.2. No production runtime compiler implemented yet. |
| `COMP-007` | Presence IR Pipeline | `SPECIFIED` | `RETAINED_BUT_FUTURE` | Intermediate representation spec (`docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`). Runtime transform pipeline not yet implemented. |
| `COMP-008` | Governor A (Semantic / Policy) | `SPECIFIED` | `RETAINED_BUT_FUTURE` | Semantic validity & policy risk evaluation rules specified (`docs/governance/AETHERIUM-GOVERNOR-SPEC.md`). Runtime interceptor not active in Phase 0.x. |
| `COMP-009` | Governor B (Device / Safety) | `SPECIFIED` | `RETAINED_BUT_FUTURE` | Device capability, flicker/photosensitivity safety rules specified. Hardware pressure kept separate from semantic policy risk. |
| `COMP-010` | Environmental Dynamics Runtime | `RESEARCH_ONLY` | `RESEARCH_CANDIDATE` | World model research engine (`research/world-model/`). Isolated from production runtime authority. |

---

## Knowledge & Lexical Governance

Lexical boundary policy is deterministically enforced to prevent architectural term drift and ensure that general user interface views adhere to the blank-first interaction model.

### Linter Engine & CI Gate
- **Linter Engine:** `tools/lexical/aetherium-interaction-linter-v2.py`
- **Policy Specification:** `tools/lexical/aetherium-lexical-policy.json` (Policy Version `0.2`)
- **CI Workflow Integration:** `.github/workflows/deploy.yml` (blocking step executing with `--strict`)
- **Machine-Readable Evidence:** `reports/lexical/latest.json`

### Interaction Model & Surface Constraints
- **Blank-First Surface:** Primary contact surface (`index.html`) presents a clean, responsive particle field without persistent greetings or chat answers.
- **Surface Wording Isolation:** Target internal architectural jargon (e.g., *"Governor Approved"*, *"L2/L3"*, *"pipeline"*, or *"AETH → Presence IR → Governor"*) is strictly forbidden from general user interaction views per Truth Governance.
- **Diagnostics Isolation:** System metrics (stress, entropy, coherence) and technical diagnostics are strictly contained within a secondary Diagnostics drawer (`#diagnosticsDrawer`), accessible only upon user request.

---

## Dual Renderer Pipeline Architecture

Phase 0.x features a dual rendering pipeline consisting of a Canvas2D reference renderer and an experimental WebGPU manifestation backend.

```text
Message Input
      ↓
System receives message
      ↓
Local Interpreter (Phase 0 Heuristic)
      ↓
Visual State Contract (Validate / Clamp)
      ↓
Backend Selection (?renderer=auto|webgpu|canvas)
      ├───────────────────────────────┬───────────────────────────────┐
      ▼                               ▼                               ▼
WebGPU Manifestation Path      Canvas2D Reference Path       Explicit Force Canvas
(Adapter → Numeric GPU Params   (Reference Renderer Path)     (Debug / Conformance)
 → WGSL Shaders)
      │                               │
      └───────────────┬───────────────┘
                      ▼
        Particle & Light Manifestation
```

### Pipeline Rules & Invariants
- **Backend Selection (URL Query):**
  - `?renderer=auto`: Prefer WebGPU; automatically fall back to Canvas2D if unsupported or on initialization failure (default).
  - `?renderer=webgpu`: Explicitly request WebGPU; fall back to Canvas2D if WebGPU setup fails.
  - `?renderer=canvas`: Force Canvas2D reference renderer path.
  - `?seed=<integer>`: Provide explicit `rendererSeed` for deterministic particle field initialization.
- **Manifestation Adapter Boundary (`manifestation/webgpu-adapter.js`):**
  - WebGPU is strictly a **manifestation backend** with zero semantic authority.
  - Visual State objects are translated strictly into flat numeric GPU parameters (`colorR`, `colorG`, `colorB`, `particleDensity`, `motionSpeed`, `coherenceFactor`, `turbulenceFactor`).
- **Shader Invariants:**
  - WGSL compute and render shaders (`runtime/webgpu/**/*.wgsl`) receive only numeric uniform buffers.
  - Shaders contain no text, raw intent strings, or prohibited semantic field identifiers.
- **Deterministic Seeding:** `rendererSeed` guarantees byte-level repeatable initialization across render runs.

---

## Research Isolation

All research tracks, experimental models, and non-canonical proposals are strictly isolated from production execution paths to guarantee runtime stability and contract integrity.

### Research Track Isolation
- **Environmental Dynamics Runtime (World Model):** Located under `research/world-model/` and `docs/research/world-model/`. Provides analytical oracle calculations, semi-implicit Euler integration, and spatial state traceability benchmarks.
- **Field Dynamics & Photonic Manifestation:** Located under `research/field-dynamics/` and `docs/research/field-dynamics/`. Explores signed distance fields (SDF) and physical light manifestation concepts (`PHYSICAL-MANIFESTATION-LIGHT-INTERFACE.md`, requiring explicit approval for physical photon exploration).

### Non-Canonical Authority Rules
- Research modules hold `RESEARCH CANDIDATE` or `VISION` status.
- Research code paths cannot mutate canonical contracts (`contracts/visual-state.schema.json`), affect backend selection, or alter Phase 0.x production runtime paths (`app.js`, `runtime/visual-state.js`, `renderer/*`).

---

## Governing Documents Hierarchy & Classification

### Precedence Hierarchy
When documentation or design files contain conflicting claims, authoritative status is determined in the following order:

1. **Current Engineering Truth** (`docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md`) — Records actual executable repository capabilities.
2. **Locked Contracts & Ratified ADRs** (`contracts/visual-state.schema.json`, `docs/decisions/ADR-DRAFT-P0-*`) — Normative rules.
3. **Architecture Specifications** — SAD v4.2 (`docs/architecture/AETHERIUM-MANIFEST-SAD-v4.2.md`), Presence IR Spec (`docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`), Governor Spec (`docs/governance/AETHERIUM-GOVERNOR-SPEC.md`), Manifest Contract Spec (`docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md`).
4. **Research Candidate Notes** (`docs/research/*`, `research/*`) — Non-normative exploratory work.
5. **Vision** (`docs/AETHERIUM-MANIFEST-VISION.md`) — Long-term aspirational direction (non-implementation fact).

### Architectural Concept Classification (5-Level System)
1. **CURRENT CANONICAL:** Active, tested, and enforced in production runtime code (e.g., Visual State Contract, Canvas2D Reference Renderer, Lexical Gate).
2. **RETAINED BUT FUTURE:** Formally specified contracts for upcoming phases, retained in architecture without active Phase 0 runtime implementation (e.g., Presence IR, Governor A/B, AETH Compiler).
3. **RESEARCH / EXPERIMENTAL:** Non-canonical exploratory tracks isolated from production runtime authority (e.g., Environmental Dynamics Runtime, Field Dynamics SDF).
4. **SUPERSEDED:** Obsolete architectural patterns replaced by formal specifications (e.g., 4DP precision replaced by 6DP determinism protocol).
5. **NON-CANONICAL HISTORICAL:** Historical drafts and early proposals maintained strictly for historical context.

---

## Test Suite Status & Determinism Protocol

The codebase maintains automated test coverage across contract validation, WebGPU adapter boundaries, baseline visual snapshot preservation, perceptual evaluation, temporal signal fusion, and isolated research suites.

### Test Execution Commands

```bash
# Execute full test suite
npm test

# Run WebGPU adapter and WGSL shader invariant tests
npm run test:webgpu

# Run perceptual evaluation harness tests
npm run test:perceptual

# Run visual state baseline snapshot tests
npm run test:baseline

# Run isolated World Model environmental dynamics research tests
npm run test:world-model

# Run SDF research benchmarks (Non-canonical)
npm run benchmark:sdf
```

### Current Verification Status
- **Core Contract & WebGPU Suite:** 36/36 tests passed (Visual State schema validation, numeric bounds clamping, Golden Fixture execution, WebGPU capability normalization, adapter numerical boundary, WGSL shader invariant scan).
- **Baseline Snapshot Suite:** PASS (Visual snapshot preservation & BLAKE3/SHA-256 state hashing).
- **Perceptual Evaluation Suite:** PASS (Perceptual harness verification).
- **Temporal Signal Fusion Suite:** PASS (Event ordering, episode correlation, spatial continuity, interaction cancellation, voice/gesture correlation).
- **Environmental Dynamics Suite:** PASS (Analytical oracle, semi-implicit Euler integrator, determinism replay, time consistency guard, convergence experiments).
- **Lexical Boundary Gate:** PASS (105 files scanned, 0 violations, evidence written to `reports/lexical/latest.json`).

### Canonical Determinism Protocol
All canonical state hashing, trace logging, and baseline snapshots follow strict determinism rules:
- **Numeric Precision:** `precision_dp = 6` (6 decimal places rounding for all floating-point state output).
- **Hash Algorithm:** BLAKE3-256 (with SHA-256 as fallback for snapshot hashing).
- **Serialization Standard:** Lexicographically sorted JSON keys, UTF-8 encoded, with explicit `trace_seed`.

---

## Roadmap & Release Gates

```text
Gate A: Phase 0 Freeze & Contract Ratification (IN_PROGRESS)
  │
  ├── Ratify / Defer P0 ADR Drafts (ADR-DRAFT-P0-01 to 04)
  └── Close Contract Freeze Gate (Lock Presence IR, Governor, Manifest Contract specs)
  │
  ▼
Gate B: IntentCore Integration (NOT_STARTED)
  │
  └── Implement IntentCore mapping & canonical signal validation
  │
  ▼
Gate C: Phase 1 Presence Runtime Thin Slice (NOT_STARTED)
  │
  ├── PresenceVectorCandidate creation
  ├── Minimal Governor A evaluation
  ├── PresenceIREnvelope generation
  └── End-to-end fixture execution tests
```

### Next Immediate Steps
1. **Contract Ratification:** Formally review and ratify or defer P0 ADR drafts (`docs/decisions/ADR-DRAFT-P0-01` through `04`).
2. **Close Gate A (Phase 0 Freeze):** Freeze core contract specifications based on the Contract Consistency Matrix (`docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md`).
3. **Initiate Phase 1 Thin Slice:** Develop the minimal runtime pipeline (`PresenceVectorCandidate` → `Governor A` → `PresenceIREnvelope`) backed by automated fixture tests, keeping research tracks strictly isolated.

---

## Quick Start

```bash
# Clone and serve locally
npm run serve
# Open http://localhost:8080
```

Or open `index.html` via any static HTTP server.

---

## What This Project Is Not (Yet)

- **Not** a finished Cognitive OS.
- **Not** a production WebGPU rendering engine.
- **Not** an active Governor / Presence Runtime in Phase 0.x.
- **Not** an LLM host driving WebGPU shaders directly.
- **Not** a claim that visual state mappings are scientifically validated for all users.

Refer to [Current Engineering Truth](docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md) for the binding list of current implementation facts.
