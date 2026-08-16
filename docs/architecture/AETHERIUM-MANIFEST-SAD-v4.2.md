# Aetherium Manifest System Architecture Document (SAD) v4.2

## 1. System Overview

The Aetherium Light Manifest system translates human intent into real-time perceptual manifestations (light, particle formation, morphology, energy, and density) without relying on traditional textual feedback.

System Architecture Document (SAD) v4.2 establishes the specification freeze boundaries for Presence IR v0.1 and Governor v0.1, defining the structural data pipelines, dual governance boundaries, and physical execution guarantees.

---

## 2. End-to-End Architectural Pipeline

```
[ User Intent ]
       │
       ▼
[ Intent Interpreter / AGNS ]
       │  (Emits candidate intent payload + advisory policy_risk)
       ▼
[ Presence IR Frame Candidate ]
       │  (uint64 decimal strings, single parent_trace_id, advisory phase)
       ▼
[ Governor A (Semantic Governance) ]
       │  (Independent policy_risk evaluation, range bounds, lineage & BLAKE3 verification)
       ▼
[ Governed Presence IR Frame ]
       │
       ▼
[ Governor B (Perceptual Governance) ]
       │  (Device tier adapt, photosensitivity & resource safety, Manifest Contract)
       ▼
[ Perceptual Light Renderer ]
       │  (Canvas 2D particle simulation, color, energy, morphology)
       ▼
[ Human Perception ]
```

---

## 3. Core Architectural Subsystems

### 3.1 Intent Interpreter & AGNS
- Receives raw user text or gesture inputs.
- Extracts intent classification parameters and candidate state attributes.
- May attach an estimated `policy_risk` score to the candidate payload.
- Provides `IntentContext.phase` as an advisory presentation timing hint.

### 3.2 Presence Intermediate Representation (Presence IR v0.1)
- Serves as the canonical wire contract and intermediate state structure.
- The Presence IR v0.1 payload, including PresenceVector and PresenceIREnvelope, is defined normatively by docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md.
- **Lineage**: Enforces single-parent trace lineage via `parent_trace_id: string | null`. Future extension point `parent_trace_ids: string[]` is reserved for IR MAJOR version bumps.
- **Transport**: Transports all `uint64` fields as base-10 decimal strings over JSON to avoid 64-bit IEEE-754 precision loss.
- **Monotonic Sequence**: Maintains `state_version` as a monotonically increasing sequence strictly scoped per `trace_id`. Out-of-order frames must trigger rejection and resynchronization.
- **Canonicalization**: Specifies `Canonicalization Profile v0.1` using lexicographically sorted keys, UTF-8, no insignificant whitespace, `precision_dp = 6`, and `BLAKE3-256` hashing.

### 3.3 Dual Governance Engine (Governor A / Governor B)
- **Governor A (Semantic & Physical Validity)**:
  - Validates candidate structural schema and numeric ranges.
  - Independently evaluates and verifies effective `policy_risk` (AGNS estimates are non-authoritative).
  - Enforces trace lineage (`parent_trace_id`) and integrity verification.
  - Executes semantic safety actions (`VALIDATE`, `CLAMP`, `DAMPEN`, `FALLBACK`, `REJECT`, `SUSPEND`, `TERMINATE`).
  - Controls the `NIRODHA` semantic kill-switch.

- **Governor B (Perceptual & Resource Safety)**:
  - Receives semantically valid states from Governor A.
  - Evaluates renderer capabilities, active device tiers, and particle resource budgets.
  - Enforces photosensitivity, anti-flicker policies, and Manifest Contract constraints before rendering.

### 3.4 Perceptual Light Renderer
- Renders governed target states using fluid particle dynamics, HSL color transitions, spatial coordinate fields, and noise turbulence.
- Operates under strict non-textual manifestation principles.

---

## 4. Architectural Principles and Guarantees

1. **Non-Textual Perception Principle**:
   Communication is expressed exclusively through light, motion, particle coherence, and morphology. No textual responses are rendered on the visual surface.

2. **Independent Semantic Governance**:
   Upstream inputs (including AGNS `policy_risk` ratings and `IntentContext.phase` timing hints) are non-authoritative. Governor A independently verifies semantic safety and policy compliance.

3. **Deterministic Governance Evaluation**:
   Given identical candidate states, intent payloads, policy versions, and trace seeds, Governor A and B produce deterministic governance outcomes.

4. **Safety Isolation Split**:
   Semantic governance (Governor A) and physical/perceptual/resource safety (Governor B) operate in distinct, non-overlapping boundary domains.

---

## 5. Relationship to Phase 0.1 Browser Prototype

- **Prototype Precursor**: The Phase 0.1 browser application (`app.js`, `runtime/visual-state.js`) is an early prototype precursor.
- **Non-Conformant Scope**: Phase 0.1 is **NOT** a full Presence IR v0.1 or Governor A/B implementation. It implements basic type validation, parameter clamping, and local particle rendering.
- **No Premature Retrofitting**: Presence IR wire fields (e.g., `trace_id`, `tick`, `parent_trace_id`, `integrity_hash`) and BLAKE3 dependencies MUST NOT be retrofitted into Phase 0.1 browser runtime code.
