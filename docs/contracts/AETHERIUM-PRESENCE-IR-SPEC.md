# Aetherium Presence Intermediate Representation (Presence IR) Specification v0.1

## 1. Overview and Purpose

Presence Intermediate Representation (Presence IR) v0.1 defines the canonical wire-contract format for representing user intent, state progression, and governance attributes within the Aetherium Light Manifest system. It establishes a deterministic, platform-agnostic data structure transmitted between intent interpreters, governance engines, and perceptual renderers.

---

## 2. Presence IR v0.1 Data Structure & Wire Specification

### 2.1 Lineage and Parent Trace Identification

* **Single-Parent Lineage (v0.1)**:
  Presence IR v0.1 supports exactly one parent trace reference:
  ```typescript
  parent_trace_id: string | null
  ```
  - For root execution traces, `parent_trace_id` MUST be `null`.
  - For child execution traces, `parent_trace_id` MUST be a non-empty string referencing the parent `trace_id`.
  - Multi-parent lineage is **strictly prohibited** in v0.1.

* **Future Extension Point**:
  Multi-parent lineage is reserved for future specifications using:
  ```typescript
  parent_trace_ids: string[]
  ```
  *Breaking Change Policy*: Transitioning from `parent_trace_id` (single parent) to `parent_trace_ids` (multi-parent array) constitutes a breaking wire-contract change and **requires an IR MAJOR version bump** (e.g. Presence IR v1.0).

---

### 2.2 IntentContext.phase Semantics

The `phase` field within `IntentContext` specifies presentation timing guidance:

```typescript
interface IntentContext {
  phase: string;
  // additional contextual metadata...
}
```

* **Advisory & Non-Authoritative**: `IntentContext.phase` is explicitly **advisory, non-authoritative, and serves solely as a presentation timing hint**.
* **Downstream Adaptability**: Downstream perceptual rendering implementations MAY choose to ignore or modify `IntentContext.phase` for:
  - Performance optimization
  - Device capability constraints
  - Accessibility requirements
  - Adaptive presentation rendering
* **Governance Boundary Guarantee**:
  - Ignoring `IntentContext.phase` MUST NOT be treated or flagged as a governance bypass.
  - However, ignoring `IntentContext.phase` MUST NOT permit bypass of:
    1. Governor A validation
    2. Governor B perceptual safety enforcement
    3. Type/range validation
    4. Lineage verification
    5. Integrity hash verification
    6. Policy enforcement

---

### 2.3 Wire Transport Format for uint64 Fields

All `uint64` wire fields in Presence IR (such as timestamps, state sequence ticks, or counter fields) MUST adhere to strict JSON serialization rules:

* **Decimal String Wire Transport**:
  All `uint64` wire fields MUST be transported over JSON as base-10 decimal strings.

  *Valid Examples*:
  ```json
  "0"
  "1"
  "18446744073709551615"
  ```

* **Rejection Rules**:
  Parsers MUST reject any of the following representations for `uint64` fields:
  - Negative numeric strings (e.g., `"-1"`)
  - Fractional decimal strings (e.g., `"1.5"`, `"1.0"`)
  - Exponent / scientific notation (e.g., `"1e10"`, `"1.84e19"`)
  - Raw JSON numeric literals (e.g., `18446744073709551615` or `100`), due to potential JavaScript IEEE-754 double precision overflow.

* **Boundary Conversion**:
  String conversion occurs exclusively at the transport serialization / deserialization boundary. Internal runtime implementations MAY represent these fields using native 64-bit unsigned integer types (`BigInt` in JavaScript/TypeScript, `uint64` in Go/Rust/C++) appropriate to the host execution platform.

---

## 3. State Version Semantics

* **Per-Trace Monotonicity**: `state_version` is a strictly monotonically increasing counter scoped per `trace_id`.

  *Examples*:
  - Trace A sequence: `0 → 1 → 2 → 3`
  - Trace B sequence: `0 → 1 → 2`

* **No Global Sequence**: `state_version` does NOT imply or require a global or cross-trace ordering sequence.

* **Gap Detection & Resynchronization**:
  If an ordered consumer receives frames out of order or with missing versions (e.g., receiving `state_version` 2 directly after `state_version` 0):
  - The consumer **MUST NOT silently accept** or process `state_version` 2.
  - The consumer MUST reject the frame and/or initiate the defined resynchronization behavior (e.g. requesting state snapshot or trace reset).

---

## 4. Determinism Requirements

Presence IR processing and governance evaluation MUST maintain pure determinism across all conformant implementations.

* **Deterministic Transformation**:
  Identical combinations of:
  - Candidate state
  - User intent payload
  - Governor policy version (`policy_version`)
  - Trace seed (`trace_seed`)

  MUST yield the **exact same governance decision and canonical state**.

* **Wall-Clock Exception**: `timestamp_ns` is the sole permitted wall-clock exception in the frame envelope.

* **Exclusion of Non-Deterministic Inputs**: Any other source of pseudo-randomness, environmental noise, or hardware variation MUST be explicitly seeded via `trace_seed` or excluded from governance state calculations.

---

## 5. Integrity Hash and Canonicalization Profile v0.1

To guarantee tamper-resistance and verification across distributed nodes, Presence IR defines a canonical hashing standard.

* **Algorithm**: `BLAKE3-256` producing a 256-bit digest (hex-encoded string).

* **Canonicalization Profile v0.1 Standard**:
  1. Lexicographically sorted JSON keys (ASCII order).
  2. UTF-8 character encoding.
  3. Elimination of all insignificant whitespace (compact JSON serialization).
  4. Numeric floating point truncation to 6 decimal places (`precision_dp = 6`).

* **Runtime Isolation Note**:
  - The Canonicalization Profile serializer is a specification contract requirement for future runtime implementations.
  - Serializers and BLAKE3 library dependencies **MUST NOT be introduced into the Phase-0.1 browser application**.
  - Phase-0.1 remains a lightweight, zero-dependency browser prototype.

---

## 6. Relationship to Phase 0.1 Prototype

* **Non-Conformant Precursor**: Phase 0.1 is **NOT** a Presence IR implementation and is **NOT** a compliant Governor A runtime.
* **Scope Boundary**: Phase 0.1 is a visual-state prototype precursor restricted to:
  1. Type validation
  2. Range enforcement
  3. Basic default normalization
* **No Retrofitting**: Features such as `trace_id`, `tick`, `parent_trace_id`, `integrity_hash`, or BLAKE3 checksums MUST NOT be retrofitted into Phase-0.1 runtime code (`runtime/visual-state.js` or `app.js`).

---

## 7. Open Questions

The following open questions remain unresolved and are tracked for post-v0.1 decision cycles:

1. **Governor B Renderer Profile Source**: Should `renderer_profile` be statically configured per deployment target or dynamically negotiated at runtime connection time?
2. **SUSPEND Maximum Duration**: What is the maximum timeout duration for a `SUSPEND` action before auto-escalating to `TERMINATE` or `FALLBACK`?
3. **Manifest Contract Required Fields**: Which structural fields in the Manifest Contract are strictly required vs optional across non-browser perceptual hardware targets?
