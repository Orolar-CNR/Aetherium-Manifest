# Architecture Decision Record: PresenceVector Numeric Domains & Disambiguation of Phase Tokens

* **Title**: PresenceVector Numeric Domains & Disambiguation of Phase Tokens
* **Status**: DRAFT — PENDING RATIFICATION
* **Date**: 2026-08-31
* **Context**: Identified in [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.3 & §8. Active Presence IR specifications define `PresenceVector` fields but lack explicit normative mathematical domains for numeric parameters. Furthermore, the token `phase` is used across multiple architectural contexts with distinct meanings.

---

## Decision Drivers

1. **Deterministic Execution**: Mathematical determinism across compilers, Governor rules, and GPU adapters requires exact numeric range boundaries and normalization rules.
2. **Ambiguity Elimination**: The token `phase` appears in `IntentContext.phase`, `PresenceVector.phase`, and `ManifestContract.semantic_state.phase`, causing potential semantic confusion if conflated.
3. **Validation Rigor**: Explicit numeric limits enable compile-time and runtime validation in Governor A.

---

## Evaluation of Options

### Option A: Loose Unbounded Floating-Point Types
* **Description**: Leave fields as unconstrained IEEE 754 floating-point numbers without explicit min/max boundaries.
* **Pros**: No spec changes needed.
* **Cons**: Risk of overflow/underflow, NaN injection, non-deterministic cross-platform evaluation, and Governor validation loopholes.

### Option B: Normative Standardized Bounded Numeric Domains
* **Description**: Formally define normative closed bounds for every numeric attribute in `PresenceVector` and explicitly codify the 3 non-overlapping meanings of `phase`.
* **Pros**: Complete mathematical clarity; strict validation; deterministic cross-platform behavior.
* **Cons**: Requires strict range checking at Presence IR parser boundaries.

---

## Recommended Lean

**Option B (Normative Standardized Bounded Numeric Domains)** is the recommended path for PR B Contract Ratification.

### 1. Ratified PresenceVector Numeric Domains

| Field | Type / Domain | Canonical Range | Description / Constraints |
|---|---|---|---|
| `x` | `float64` | `[-1.0, 1.0]` | Unitless normalized spatial position X |
| `y` | `float64` | `[-1.0, 1.0]` | Unitless normalized spatial position Y |
| `z` | `float64` | `[-1.0, 1.0]` | Unitless normalized spatial position Z |
| `phase` | `float64` | `[0.0, 2π)` | Periodic / oscillatory phase angle in radians (`0.0 ≤ phase < 6.283185307179586`) |
| `confidence` | `float64` | `[0.0, 1.0]` | Normalized confidence score |
| `energy` | `float64` | `[0.0, 1.0]` | Normalized semantic energy |
| `coherence` | `float64` | `[0.0, 1.0]` | Normalized particle field tightness / structural coherence |
| `policy_risk` | `float64` | `[0.0, 1.0]` | Normalized policy risk score evaluated/verified by Governor A |

### 2. Disambiguation of the Three Phase Tokens

1. **`IntentContext.phase`**: Advisory progress scalar in `[0.0, 1.0]` describing execution progress of an intent sequence.
2. **`PresenceVector.phase`**: Oscillatory phase angle in radians `[0.0, 2π)` used for periodic physical/temporal wave dynamics.
3. **`ManifestContract.semantic_state.phase`**: Operational semantic state enumeration token (e.g., `"RESPONDING"`).

These three meanings MUST NOT be conflated, combined, or mapped directly to one another without explicit compiler transformation rules.

---

## Consequences

### If Accepted:
- Presence IR specification (`docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`) will be updated with normative tables for `PresenceVector` numeric bounds.
- Schema validators for Presence IR will strictly enforce these numeric bounds.
- Documentation will explicitly warn against conflating the three `phase` tokens.

### If Rejected:
- Numeric fields will remain unconstrained on the wire, increasing risk of renderer divergence or out-of-bounds calculations.

---

## Out of Scope

- Floating-point precision rounding rules (governed by the canonical determinism protocol 6DP).

---

## References

- [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.3, §8
- [Presence IR v0.1 Spec](../contracts/AETHERIUM-PRESENCE-IR-SPEC.md)
