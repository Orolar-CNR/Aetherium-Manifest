# Architecture Decision Record: IntentState Vocabulary Reconciliation

* **Title**: IntentState Vocabulary Reconciliation (4-State vs. 7-State vs. NIRODHA)
* **Status**: DRAFT — PENDING RATIFICATION
* **Date**: 2026-08-31
* **Context**: Identified in [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.1. Presence IR v0.1 defines a 4-state enum (`IDLE | PROCESSING | RESPONDING | ERROR`), while Manifest Contract v0.1, Phase 0.1 prototype, and Governor specifications reference a 7-state vocabulary (`IDLE | LISTENING | PROCESSING | RESPONDING | WARNING | ERROR | NIRODHA`).

---

## Decision Drivers

1. **State Completeness**: The manifestation layer and prototype require intermediate operational states (`LISTENING`, `WARNING`) and a explicit terminal emergency kill-switch state (`NIRODHA`).
2. **Governor Integrity**: Governor A requires `NIRODHA` as an authoritative safety action state to immediately cease active manifestation output upon severe policy violation or safety breach.
3. **Contract Coherence**: Eliminating discrepancies between Presence IR wire protocol and downstream Manifest Contract without creating lossy wire mappings.

---

## Evaluation of Options

### Option A: Pure Minimalist Wire (Keep 4-State in Presence IR)
* **Description**: Preserve Presence IR wire as 4 states (`IDLE | PROCESSING | RESPONDING | ERROR`). Map `LISTENING` → `PROCESSING`, `WARNING` → `RESPONDING`, and `NIRODHA` → `ERROR` with extra metadata.
* **Pros**: Simple wire contract for Presence IR.
* **Cons**: Lossy semantic mapping; Governor A kill-switch actions (`NIRODHA`) lose distinct protocol-level identity; downstream layers must infer real state from secondary attributes.

### Option B: Full Unification (Unify Presence IR & Manifest Contract to 7 States)
* **Description**: Expand canonical Presence IR `IntentState` enum to include all 7 states: `IDLE`, `LISTENING`, `PROCESSING`, `RESPONDING`, `WARNING`, `ERROR`, `NIRODHA`.
* **Pros**: 1:1 mapping across all layers; zero loss of state context; explicit `NIRODHA` terminal state at wire level.
* **Cons**: Slightly expands Presence IR state enum scope.

### Option C: Hybrid Model (Core 4 Wire States + Governed Operational Extension Metadata)
* **Description**: Keep 4 core states on the wire but add a governed `operational_state` metadata field for extended states.
* **Pros**: Preserves backward compatibility if 4-state wire parsers exist.
* **Cons**: Adds redundant metadata overhead and complexity across compilers.

---

## Recommended Lean

**Option B (Full Unification)** is the recommended path for PR B Contract Ratification.

* **Unified Vocabulary**: `IDLE | LISTENING | PROCESSING | RESPONDING | WARNING | ERROR | NIRODHA`
* **NIRODHA Role**: Explicitly designated as Governor A's terminal emergency action outcome (immediate system safety freeze and minimal physical manifestation output).

---

## Consequences

### If Accepted:
- Presence IR v0.1 specification (`docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`) will be updated to include `LISTENING`, `WARNING`, and `NIRODHA` in `IntentState`.
- Manifest Contract v0.1 and Presence IR will share an identical core state vocabulary.
- Governor A specifications will explicitly reference `NIRODHA` as a valid wire state.

### If Rejected:
- Presence IR will remain limited to 4 states, requiring adapters to translate `LISTENING`, `WARNING`, and `NIRODHA` into auxiliary payload metadata fields.

---

## Out of Scope

- Modifying runtime/ or schema code before formal PR B ratification.
- Defining renderer-specific animation curve behavior for states.

---

## References

- [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.1
- [Presence IR v0.1 Spec](../contracts/AETHERIUM-PRESENCE-IR-SPEC.md)
- [Governor v0.1 Spec](../governance/AETHERIUM-GOVERNOR-SPEC.md)
