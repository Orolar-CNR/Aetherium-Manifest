# AETHERIUM-RUNTIME-INTEGRATION-MATRIX-v0.2

**Status**: RATIFIED FOR INTEGRATION GOVERNANCE
**Domain**: Architecture Governance & Historical Reconciliation
**Scope**: Reconciliation of historical Aetherium architecture concepts with the current canonical contract stack.
**Purpose**: Preserve valuable historical research without allowing superseded schemas, prototypes, or implementation details to silently become canonical again.

---

## 1. Documentation Doctrine

This document is the reconciliation layer between the historical Aetherium research corpus and the current canonical contract architecture.

The following rules are mandatory:

1. Historical concepts may inform future architecture, but no historical document may silently override a ratified canonical contract.
2. Research feature spaces are not automatically wire schemas.
3. Renderer implementation details are not automatically Manifest Contract fields.
4. A prototype implementation is not authoritative over a ratified contract.
5. When a historical concept conflicts with a current contract, the current contract wins and the historical concept is retained only as historical, research, or future architecture as explicitly classified here.
6. Open questions remain open until a canonical document records and ratifies a decision.

---

## 2. Canonical Authority

The following documents are the current architectural authorities, in descending order of scope:

* `docs/architecture/AETHERIUM-MANIFEST-SAD-v4.2.md`
* `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`
* `docs/governance/AETHERIUM-GOVERNOR-SPEC.md`
* `docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md` — once ratified

Historical material does not override these documents.

### 2.1 Status of a “current” concept

A concept MUST NOT be labeled `CURRENT CANONICAL` solely because it appears in a draft.

Use `CURRENT CANONICAL` only when the concept is explicitly ratified by the active contract/architecture authority.

Use `RATIFIED FOR FREEZE` / `READY FOR FREEZE` when the concept is approved for contract freeze but the document itself has not yet been frozen.

---

## 3. Integration Classification Taxonomy

* **A. CURRENT CANONICAL**: Ratified and authoritative in the active architecture.
* **B. RETAINED BUT FUTURE**: Accepted architectural direction, intentionally deferred from the current implementation.
* **C. RESEARCH / EXPERIMENTAL**: Valid research direction without sufficient contract/runtime formalization for canonical use.
* **D. SUPERSEDED**: Replaced by a newer, more precise, or more governed definition.
* **E. NON-CANONICAL HISTORICAL**: Historical terminology, prototypes, metaphors, or discarded approaches retained for provenance only.

---

## 4. Canonical Runtime Pipeline

The historical macro pipeline remains useful, but it MUST be interpreted through the current contract boundaries.

```
User / Voice / Agent / Telemetry
            ↓
      Intent Extraction
            ↓
        AETH Compiler
            ↓
 PresenceVectorCandidate
            ↓
         Governor A
            ↓
   PresenceIREnvelope
            ↓
   Perceptual Compiler
            ↓
 ManifestContractCandidate
            ↓
         Governor B
            ↓
GovernedManifestContract
            ↓
   Manifestation Runtime
            ↓
 Renderer / GPU Backend
```

The older shorthand:

```
Intent → AETH → IR → Governor → GPU
```

remains valid only as a macro architectural slogan. It MUST NOT be used as a wire-level implementation specification because it hides the Candidate/Envelope boundary, the Perceptual Compiler, and the Governor A/B split.

---

## 5. Required Integration Table

| Legacy Concept | Legacy Definition | Current Canonical Layer | Decision | Current Status | Reason | Future Target Document |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Intent → AETH → IR → Governor → GPU** | Linear execution chain from user input to hardware render. | System Pipeline Overview | Retain as Shorthand | E. NON-CANONICAL HISTORICAL | Macro architectural slogan; hides Candidate/Envelope boundaries, Perceptual Compiler, and Governor A/B split. | `docs/architecture/AETHERIUM-MANIFEST-SAD-v4.2.md` |
| **Renderer isolation** | Strict decoupling of rendering engine from intent parsing and business logic. | Perceptual Rendering Layer | Preserve Isolation | A. CURRENT CANONICAL | Essential invariant to prevent raw intent or unvalidated candidate state from driving visual output directly. | `docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md` |
| **Presence IR / 8D** | 8-dimensional vector representations of semantic/perceptual state. | Presence IR Layer | Preserve as Research Vector Space | C. RESEARCH / EXPERIMENTAL | Historical 8D variants conflict with active Presence IR v0.1 schema; retained as feature spaces or encoder outputs. | `docs/research/AETHERIUM-8D-FEATURE-SPACE-SPEC.md` |
| **AETH Visual Contract** | High-level declarative contract language for visual manifestation rules. | Compilation / Intent Translation | Retain Direction | B. RETAINED BUT FUTURE* | AETH represents retained compiler direction, subject to active AETH and Manifest Contract specifications. | `docs/compiler/AETHERIUM-AETH-SPEC.md` |
| **Qterro Reflex Runtime** | Sub-millisecond local reflex and particle dynamics execution engine. | Execution / Reflex Layer | Retain Execution Layer | B. RETAINED BUT FUTURE (RETAINED / FUTURE EXECUTION LAYER) | High-performance execution/reflex engine downstream of Governor B; not a governance authority. | `docs/runtime/AETHERIUM-QTERRO-REFLEX-SPEC.md` |
| **Deterministic physics pipeline** | Physics and particle updates driven by deterministic seed and state tick. | Simulation / Engine Layer | Adopt Determinism Principles | B. RETAINED BUT FUTURE | Physics execution relies on deterministic seeds (`trace_seed`) and fixed-point math, guided by governed state. | `docs/runtime/AETHERIUM-PHYSICS-PIPELINE-SPEC.md` |
| **Policy-aware manifestation** | Visual presentation dynamically modulated by real-time policy and safety scores. | Governance Layer (Governor A & B) | Enforce Boundary Split | A. CURRENT CANONICAL | Policy risk split between Governor A (semantic policy risk) and Governor B (perceptual safety / device capabilities). | `docs/governance/AETHERIUM-GOVERNOR-SPEC.md` |
| **Telemetry** | System health, performance metrics, and state logging. | Observability / Audit Layer | Decouple from Wire Schema | B. RETAINED BUT FUTURE | Telemetry belongs in separate paths (audit/observability) and must not pollute the canonical Presence IR wire schema. | `docs/observability/AETHERIUM-TELEMETRY-SPEC.md` |
| **WebSocket state synchronization** | Bi-directional streaming transport for state synchronization. | Transport Layer | Defer to Transport Spec | B. RETAINED BUT FUTURE (FUTURE TRANSPORT) | Transport protocols do not define Presence IR semantics; isolated into future transport specification. | `docs/transport/AETHERIUM-TRANSPORT-SPEC.md` |
| **Delta synchronization** | Transmitting only state vector diffs across network frames. | Transport / State Sync Layer | Defer to Transport Spec | B. RETAINED BUT FUTURE (FUTURE TRANSPORT) | Optimization layer for network bandwidth; wire state semantics remain defined by canonical contracts. | `docs/transport/AETHERIUM-TRANSPORT-SPEC.md` |
| **Predictive runtime** | Client-side speculation and state prewarming to mask latency. | Execution / Speculation Layer | Classify as Non-Authoritative | C. RESEARCH / EXPERIMENTAL | Speculative runtime MUST NOT become a second state authority; must respect authoritative `trace_id`, `tick`, and governance decisions. | `docs/research/AETHERIUM-PREDICTIVE-RUNTIME-SPEC.md` |
| **Ghost workers** | Background worker threads calculating speculative particle trajectories. | Worker / Execution Layer | Classify as Non-Authoritative | C. RESEARCH / EXPERIMENTAL | Execution technique for predictive prewarming; operates strictly under speculation boundaries. | `docs/research/AETHERIUM-PREDICTIVE-RUNTIME-SPEC.md` |
| **WebGPU** | Next-generation compute/render API for particle simulation. | Perceptual Rendering Layer | Retain Future Preferred Backend | B. RETAINED BUT FUTURE | Preferred future backend for high-density particle manifestation; NOT a Phase-0 or Phase-1 hard requirement. | `docs/rendering/AETHERIUM-WEBGPU-RENDERER-SPEC.md` |
| **WebGL2 fallback** | Shader-based 3D render pipeline for legacy hardware compatibility. | Perceptual Rendering Layer | Retain Fallback Backend | B. RETAINED BUT FUTURE | Secondary fallback backend when WebGPU capabilities are unavailable on client hardware. | `docs/rendering/AETHERIUM-WEBGL2-RENDERER-SPEC.md` |
| **Canvas2D prototype renderer** | Lightweight 2D HTML5 canvas particle renderer. | Phase-0 Reference Surface | Retain Reference Surface | A. CURRENT CANONICAL (REFERENCE IMPLEMENTATION) | Serves exclusively as Phase-0.1 reference validation surface; not the canonical manifestation architecture. | `docs/PHASE-0.1-VISUAL-STATE-CONTRACT.md` |
| **FlatBuffers** | Zero-copy binary serialization format for state frames. | Wire Transport Layer | Defer to Transport Spec | B. RETAINED BUT FUTURE (FUTURE TRANSPORT) | Binary wire transport optimization; independent of canonical Presence IR semantics. | `docs/transport/AETHERIUM-TRANSPORT-SPEC.md` |
| **Binary IR** | Packed binary representation of Presence IR fields. | Wire Transport Layer | Defer to Transport Spec | B. RETAINED BUT FUTURE (FUTURE TRANSPORT) | Binary serialization strategy reserved for production network streaming. | `docs/transport/AETHERIUM-TRANSPORT-SPEC.md` |
| **Runtime states** | Lifecycle states governing system operation and manifestation transitions. | Multilayer State Taxonomy | Categorize State Layers | A. CURRENT CANONICAL | System state must be qualified by layer: Semantic State, Canonical Runtime State, or Transient Render State. | `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md` |
| **Morphology** | Geometric particle structuring and visual shape transformation. | Perceptual Manifestation Layer | Map to Manifest Contract | A. CURRENT CANONICAL | Controlled via governed visual contract parameters (`shape`, `density`, `coherence`). | `docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md` |
| **Transition semantics** | Rules governing interpolation and timing between visual states. | Perceptual Rendering Layer | Map to Manifest Contract | A. CURRENT CANONICAL | Managed via `transition_ms`, easing parameters, and advisory `IntentContext.phase`. | `docs/contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md` |
| **Light Asset Registry** | Centralized catalog of certified visual shaders, forms, and particle palettes. | Asset / Manifestation Registry | Retain Concept | B. RETAINED BUT FUTURE* | Catalog of pre-approved perceptual assets consumed by Perceptual Compiler and Governor B. | `docs/assets/AETHERIUM-LIGHT-ASSET-REGISTRY.md` |
| **Semantic topology** | Graph-based representation of intent relationships and contextual continuity. | Intent Parsing / AGNS Layer | Retain Research Concept | C. RESEARCH / EXPERIMENTAL | Upstream contextual analysis model used by intent extraction / AGNS to construct rich intent candidates. | `docs/research/AETHERIUM-SEMANTIC-TOPOLOGY-SPEC.md` |
| **Cognitive replay** | Historical session playback for auditing, debugging, and verification. | Observability & Audit Layer | Retain Audit Concept | B. RETAINED BUT FUTURE | Replays governed `PresenceIREnvelope` sequences using deterministic seeds (`trace_seed`). | `docs/observability/AETHERIUM-REPLAY-SPEC.md` |

\* *`B*` indicates a concept whose architectural direction is retained, but whose detailed contract remains subject to the active AETH/Manifest Contract specifications.*

---

## 6. Presence IR Conflicts and Resolution

Historical material contains multiple definitions of “8D”. Examples include:

### Historical Variant A
```
x
y
z
intent_phase
confidence
energy
coherence
policy_risk
```

### Historical Variant B
```
attention
motion
novelty
stability
emotion
intent
context
temporal
```

These are not the same schema and MUST NOT be merged.

The current `AETHERIUM-PRESENCE-IR-SPEC.md` is authoritative for the runtime contract.

Alternative dimensional spaces may be retained as:
* research feature spaces
* future encoder outputs
* model-specific latent representations

They MUST NOT become wire fields without a new contract decision.

---

## 7. Policy-Risk Boundary

Historical designs sometimes treated `policy_risk` as a catch-all score spanning semantic risk, accessibility, hardware pressure, and runtime safety.

The current architecture separates these concerns.

### Governor A
Owns the semantic/policy authority for the governed Presence state, including `policy_risk` as defined by the active Presence IR/Governor contracts.

### Governor B
Owns downstream perceptual and runtime-context safety, including:
* device capability
* resource budget
* render complexity
* flicker/photosensitivity policy
* accessibility adaptation

Hardware pressure MUST NOT be silently folded into `PresenceVector.policy_risk`.

The purpose of the separation is to prevent device constraints from rewriting upstream semantic meaning.

---

## 8. Determinism and Canonicalization

Historical documents used a four-decimal precision rule.

That rule is **SUPERSEDED**.

The current canonical protocol uses:
* `precision_dp = 6`
* canonical JSON serialization
* lexicographically sorted keys
* UTF-8 encoding
* BLAKE3-256 integrity hashing where specified
* `trace_seed` for deterministic pseudo-random behavior
* explicit treatment of `timestamp_ns` as wall-clock metadata where the active contract exempts it from deterministic identity

No compatibility mode for the historical four-decimal rule is required.

---

## 9. Qterro Placement

Qterro is retained as a future reflex/execution layer.

It is not a governance authority.

### Preferred Conceptual Placement

```
Governor A
    ↓
PresenceIREnvelope
    ↓
Perceptual Compiler
    ↓
Governor B
    ↓
GovernedManifestContract
    ↓
Qterro / Reflex Execution
    ↓
Renderer / GPU
```

This is a future architecture target, not a Phase 0.1 or Phase 1 implementation requirement.

---

## 10. Telemetry and Observability

Historical telemetry concepts remain valuable, but telemetry is not part of the canonical Presence IR merely because it is useful for debugging.

Telemetry belongs in separate paths:
* Governance Audit
* Runtime Observability
* Replay / Verification
* Performance Metrics

Canonical IR fields MUST be added only when explicitly required by the active contract.

---

## 11. Transport Architecture

Historical concepts such as:
* WebSocket
* full-state synchronization
* delta updates
* heartbeat
* synchronization requests/responses
* rollback
* FlatBuffers
* binary IR frames

are retained as future transport architecture.

They do not define Presence IR semantics.

The eventual transport specification SHOULD define how the canonical contracts are encoded and synchronized without changing their semantics.

---

## 12. Predictive Runtime and Ghost Workers

Prediction is classified as **RESEARCH / EXPERIMENTAL** until its authority and reconciliation rules are formally specified.

Any future prediction system MUST preserve:
* authoritative `trace_id`
* authoritative `tick`
* `state_version`
* governance decisions
* deterministic replay behavior

Prediction MUST NOT become a second source of truth.

A predicted state is a speculative value until accepted through the canonical governance path.

---

## 13. GPU and Rendering Backends

The current backend hierarchy is:

```
Phase-0 Reference Renderer
        Canvas2D
             ↓
Future Renderer Abstraction
        ┌────┴────┐
        ↓         ↓
     WebGL2    WebGPU
    fallback  preferred
```

This is a backend strategy, not a change to the semantic contracts.

WebGPU is **NOT** a Phase-0 or Phase-1 hard requirement.

---

## 14. Runtime State Taxonomy

The word “state” MUST be qualified by layer.

### 14.1 Semantic State
What the system is doing or intending.

Example:
```
IntentContext.state
```

### 14.2 Canonical Runtime State
The governed runtime truth represented by the canonical Presence IR envelope.

Example:
```
PresenceIREnvelope
```

### 14.3 Transient Render State
Frame-local/interpolated values used to realize the canonical target state.

Example:
```
currentHue
currentEnergy
currentParticleField
```

Transient render state MUST NOT become a hidden source of semantic truth.

---

## 15. Legacy State Vocabulary

Historical state names such as:
* `STANDBY`
* `THINKING`
* `MANIFESTING`
* `SAFE_MODE`
* `SUSPENDED`

MUST NOT be silently added to the active `IntentState` enum.

They may be retained as historical vocabulary or future semantic aliases only after explicit ratification.

The active enum remains the sole source of truth for semantic-state naming.

---

## 16. Canonical Boundary Invariants

The following invariants are mandatory:

* **Invariant 1 — Intent Isolation**: The Renderer MUST NOT receive raw intent.
* **Invariant 2 — Candidate Isolation**: The Perceptual Compiler MUST NOT consume an ungoverned `PresenceVectorCandidate`.
* **Invariant 3 — Manifest Isolation**: The Renderer MUST NOT consume a `ManifestContractCandidate`.
* **Invariant 4 — Governance Supremacy**: Every state that reaches manifestation MUST have passed through the required Governor stage for that layer.
* **Invariant 5 — Semantic Preservation**: Device/resource adaptation MUST NOT silently redefine upstream semantic intent.
* **Invariant 6 — Deterministic Identity**: Canonical state identity MUST be reproducible under the active deterministic contract, subject to explicitly documented wall-clock metadata exceptions.
* **Invariant 7 — Historical Non-Override**: Historical documents MAY inform future work but MUST NOT override a ratified contract.

---

## 17. Recommended Future Specification Order

To prevent architecture drift, future canonical specifications SHOULD be produced in this order:

1. `AETHERIUM-MANIFEST-CONTRACT-SPEC.md`
2. `AETHERIUM-TRANSPORT-SPEC.md`
3. `AETHERIUM-RENDERER-SPEC.md`
4. `AETHERIUM-OBSERVABILITY-SPEC.md`
5. `AETHERIUM-AETH-SPEC.md`
6. `AETHERIUM-QTERRO-SPEC.md`
7. `AETHERIUM-PREDICTION-SPEC.md`

Implementation SHOULD follow the contract order rather than the historical research order.

---

## 18. Final Governance Rule

Aetherium is allowed to remember every idea it has explored. It is not allowed to let historical ideas silently redefine what the runtime means today.

The canonical architecture evolves through explicit specification changes, versioned decisions, and ratification — not through prototype drift.
