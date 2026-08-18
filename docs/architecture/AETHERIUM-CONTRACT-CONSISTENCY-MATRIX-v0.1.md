# Phase 0.3 — Contract Consistency Matrix v0.1

## 1. Purpose

This Contract Consistency Matrix evaluates structural coherence across the
current Aetherium Manifest specification and protocol layers.

Its purpose is to identify:

- already-consistent concepts
- unresolved contract decisions
- explicit contradictions
- provisional mappings between prototype and canonical layers

This document is a reconciliation and review artifact.

It MUST NOT silently ratify a new canonical contract.

---

## 2. Scope

This document evaluates five architectural authorities / references:

1. **SAD v4.2**
   High-level architecture, boundaries, and system topology.

2. **Presence IR v0.1**
   Normative authority for Presence IR wire/state structures.

3. **Governor v0.1**
   Normative authority for Governor A/B governance behavior,
   jurisdiction, and action vocabulary.

4. **Manifest Contract v0.1**
   Draft authority for downstream perceptual manifestation structure.

5. **Phase 0.1 Visual State**
   Non-conformant prototype precursor; not a canonical authority.

---

## 3. Authority by Scope

Authority is scope-based rather than a single global ranking.

| Authority | Authority Scope |
|---|---|
| SAD v4.2 | System architecture and macro boundaries |
| Presence IR v0.1 | Presence IR wire/state contract |
| Governor v0.1 | Governance jurisdiction, policy, and actions |
| Manifest Contract v0.1 | Perceptual manifestation contract (draft) |
| Phase 0.1 Visual State | Prototype/reference history only |

A child contract MUST NOT contradict the architectural boundaries established
by SAD v4.2.

A prototype MUST NOT override a ratified contract.

---

## 4. Classification Semantics

Each evaluated concept is assigned one of four statuses:

- **CONSISTENT**
  No contradiction is detected and no additional architectural decision
  is currently required.

- **OPEN**
  The current documents contain an unresolved decision that MUST be ratified
  before the relevant freeze gate.

- **CONTRADICTION**
  Two or more active specifications explicitly define incompatible
  semantics or constraints.

- **PROVISIONAL ALIGNMENT**
  Different layers use different representations, but a conceptual mapping
  exists and has not yet been promoted to a canonical wire-level decision.

---

## 5. Contract Comparison Matrix

| Concept | SAD v4.2 | Presence IR | Governor | Manifest Contract | Phase 0.1 | Status | Required Decision / Next Steps |
|---|---|---|---|---|---|---|---|
| **IntentState** | reference | 4-state enum | uses NIRODHA | 7-state vocabulary | 7-state prototype | **OPEN** | Ratify Unify / Split / Hybrid in PR B |
| **IntentContext.phase** | referenced | advisory `[0,1]` | advisory | indirect | not canonical | **CONSISTENT** | No contradiction detected |
| **PresenceVector.phase** | conceptual | waveform/oscillatory phase | Governor A bounds | not semantic state | unrelated | **OPEN** | Ratify normative numeric domain in PR B |
| **semantic_state.phase** | not detailed | not direct | not direct | operational state enum | prototype mapping | **PROVISIONAL ALIGNMENT** | Formalize compiler mapping in PR D |
| **turbulence** | macro reference | referenced | safety boundary | semantic `0..1` draft range | renderer/prototype ceiling `0..0.65` | **OPEN** | Ratify semantic domain vs downstream safety ceiling |
| **policy_risk** | governance | canonical field | Governor A authority | downstream safety is separate | precursor | **CONSISTENT** | No semantic ownership conflict detected |
| **trace_seed** | runtime | canonical | determinism | absent | absent | **CONSISTENT** | No contradiction detected |
| **lineage** | architecture | canonical | enforced | propagated | absent | **CONSISTENT** | Preserve existing lineage rules |
| **Renderer authority** | boundary | downstream | governed | governed output | prototype | **CONSISTENT** | Renderer remains non-semantic |

---

## 6. P0 Open Decisions

### 6.1 IntentState Vocabulary

Presence IR currently defines:

`IDLE | PROCESSING | RESPONDING | ERROR`

Manifest Contract and Phase 0.1 currently use:

`IDLE | LISTENING | PROCESSING | RESPONDING | WARNING | ERROR | NIRODHA`

Governor semantics also reference `NIRODHA` as a critical safety state/action outcome.

#### Resolution pathways

1. **Unification**
   Extend the canonical IntentState vocabulary to cover all required states.

2. **Separation**
   Preserve a compact semantic wire vocabulary and model richer
   manifestation/operational states downstream.

3. **Hybrid**
   Preserve a canonical core vocabulary and explicitly represent
   additional operational states through governed metadata.

**Decision status:** OPEN

**Required action:** Ratify one model in PR B.

---

### 6.2 Turbulence Domain Separation

Current documents use different ranges/roles:

- Manifest Contract: semantic turbulence `0..1` (draft)
- Phase 0.1: renderer/prototype safety ceiling `0..0.65`

This Matrix DOES NOT ratify a new range.

A possible future architecture is to separate:

```text
semantic domain
        ↓
Governor B / renderer safety ceiling
```

but this is only a proposed resolution path.

**Decision status:** OPEN

**Required action:** Ratify semantic domain and downstream safety ceiling in PR B.

---

### 6.3 PresenceVector Numeric Domains

The active Presence IR contract identifies the PresenceVector fields but does not yet provide fully normative mathematical domains for:
- x
- y
- z
- phase
- confidence
- energy
- coherence
- policy_risk

**Decision status:** OPEN

**Required action:** Define and ratify exact numeric domains in PR B. Do NOT introduce temporary values in this Matrix.

---

### 6.4 SAD Pipeline Representation

The SAD provides macro-level architecture while child specifications provide more detailed sequencing involving:
`Perceptual Compiler` → `ManifestContractCandidate` → `Governor B` → `GovernedManifestContract`

This difference is not automatically a contradiction.

**Decision status:** PROVISIONAL ALIGNMENT / OPEN

**Required action:** Align the SAD representation with the active child contracts through references rather than duplicating wire-level definitions.

---

## 7. Already-Consistent Decisions

The following concepts currently show no cross-document contradiction:

- **IntentContext.phase**: Advisory progress scalar in `[0,1]`.
- **Governor A / Governor B split**: Semantic/policy authority remains separate from downstream perceptual/resource/device safety.
- **policy_risk**: Governor A is the authoritative governance stage for this semantic/policy risk value.
- **Lineage**: Single-parent lineage and existing trace/state sequencing remain authoritative.
- **uint64 transport**: JSON transport uses decimal-string representation at the transport boundary.
- **Integrity**: BLAKE3-256 is used where specified by the active canonicalization/hash rules.
- **trace_seed**: Trace-level determinism seed remains distinct from Visual State and Manifest Contract fields.
- **Renderer authority**: Canvas2D and WebGPU are manifestation backends and do not hold semantic authority.

---

## 8. The Three Meanings of phase

The token `phase` MUST NOT be conflated across layers.

### 8.1 IntentContext.phase
An advisory progress scalar describing how far the current semantic process has advanced.

### 8.2 PresenceVector.phase
A periodic / oscillatory phase angle used as a physical/temporal signal.
It is NOT the semantic state enum.

### 8.3 semantic_state.phase
An operational semantic state representation in the Manifest Contract layer.

#### Mapping rule

```text
IntentContext.state
        │
        │ semantic / perceptual mapping
        ▼
ManifestContract.semantic_state.phase

IntentContext.phase
        │
        └── advisory progress only

PresenceVector.phase
        │
        └── periodic waveform phase only
```

These meanings MUST remain separate.

---

## 9. Phase 0.1 Precursor Status

Phase 0.1 is a non-conformant prototype precursor.

It is useful as:
- historical provenance
- reference rendering surface
- experimental implementation evidence

It has:
- no authority over Presence IR
- no authority over Governor A/B
- no authority over Manifest Contract

Prototype behavior MUST NOT be promoted into canonical contracts without explicit ratification.

---

## 10. Freeze Gate Requirements

Before Phase 1 implementation is authorized:

- [ ] IntentState vocabulary ratified
- [ ] PresenceVector numeric domains ratified
- [ ] turbulence semantic range and downstream safety ceiling separated
- [ ] three meanings of phase remain non-overlapping
- [ ] Governor A/B jurisdiction boundaries finalized
- [ ] PresenceIREnvelope payload fully mapped
- [ ] ManifestContract boundary does not redefine semantic authority
- [ ] SAD references child contracts consistently
- [ ] Phase 0.1 remains explicitly non-conformant
- [ ] no historical schema has been silently promoted
- [ ] no renderer-local state has been promoted into canonical semantics
