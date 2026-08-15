# Architecture Decision Record: Presence IR and Governor v0.1 Ratification Decisions

* **Title**: Presence IR and Governor v0.1 Ratification Decisions
* **Status**: ACCEPTED FOR SPECIFICATION FREEZE
* **Date**: 2026-08-15
* **Context**: Specification freeze and contract alignment pass for the Aetherium Light Manifest system (Presence IR v0.1 and Governor v0.1).

---

## Ratified Decisions

### 1. Single-Parent Lineage in v0.1
Presence IR v0.1 supports exactly single-parent trace lineage using `parent_trace_id: string | null`. Multi-parent lineage is excluded from v0.1 and reserved as a future extension point (`parent_trace_ids: string[]`). Transitioning to multi-parent lineage constitutes a breaking wire-contract change and requires an IR MAJOR version bump.

### 2. IntentContext.phase is Advisory
`IntentContext.phase` is explicitly defined as advisory, non-authoritative, and serves purely as a presentation timing hint. Downstream renderers MAY adjust or ignore `IntentContext.phase` for performance, capability, accessibility, or adaptation without triggering governance bypass flags. However, ignoring `IntentContext.phase` MUST NOT permit bypass of Governor A, Governor B, validation, lineage verification, integrity hashing, or policy enforcement.

### 3. uint64 Uses Decimal-String JSON Transport
All `uint64` fields transmitted in Presence IR wire frames MUST be transported as base-10 decimal JSON strings (e.g., `"0"`, `"1"`, `"18446744073709551615"`). Parsers MUST reject negative numeric strings, fractional strings, exponent notation, or raw JSON numeric literals for uint64 fields. Type conversion occurs strictly at transport boundaries.

### 4. state_version is Monotonic Sequence per Trace
`state_version` is a strictly monotonically increasing counter scoped per `trace_id` (e.g. `0 → 1 → 2`). No global cross-trace sequence is implied. If an ordered consumer receives a frame with missing version increments (e.g., receiving `state_version` 2 directly after `0`), it MUST NOT silently accept the frame and MUST initiate resynchronization behavior.

### 5. Governor A Independently Verifies Policy Risk
AGNS or upstream interpreters MAY supply an estimated `policy_risk` score, but this value is non-authoritative. Governor A MUST independently evaluate or verify the effective policy risk using its active Governor A policy ruleset. Governor A is the final authority for semantic governance decisions.

### 6. Governor A and Governor B Remain Separate
Governor A (semantic and physical validity, range constraints, lineage, BLAKE3 checksums, policy risk, NIRODHA kill-switch) and Governor B (perceptual safety, device performance tier adaptation, particle budgets, photosensitivity/flicker policies, Manifest Contract integrity) remain distinct, non-overlapping governance layers and MUST NOT be merged.

### 7. Phase 0.1 Remains Non-Conformant Prototype Precursor
Phase 0.1 is explicitly ratified as a prototype precursor covering only basic type checking, numeric range clamping, and default normalization. Phase 0.1 is NOT a conformant Presence IR or Governor A/B implementation. Presence IR wire attributes (`trace_id`, `tick`, `integrity_hash`) and BLAKE3 dependencies MUST NOT be retrofitted into Phase 0.1 browser code.

---

## Consequences & Next Steps

- All contract specifications (`docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`, `docs/governance/AETHERIUM-GOVERNOR-SPEC.md`, `docs/architecture/AETHERIUM-MANIFEST-SAD-v4.2.md`) are aligned with these decisions.
- Specifications are formally **READY FOR FREEZE**.
- Future Phase 1 runtime implementation work will build upon these frozen contracts without modifying Phase 0.1 prototype execution.
