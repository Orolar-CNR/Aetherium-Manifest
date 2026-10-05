# PHASE 1 PLANNING GATE

**Project:** Aetherium Manifest  
**Document type:** Planning gate. Not an implementation. Not a Phase 0 change.  
**Date:** 2026-10-05  
**Status:** PLANNING ONLY  
**Phase 0:** FROZEN_WITH_DEFERRED_ITEMS — documentation closure only  
**Phase 1 runtime:** OPEN / NOT STARTED  

This gate defines how the first three Phase 1 contracts are checked before any runtime module is written.

Specification exists ≠ implementation exists.

---

## 1. Authority

Use this order:

1. Phase 0 freeze record (`docs/decisions/PHASE-0-CONTRACT-FREEZE-REVIEW.md`)
2. Ratified specification ADR `ADR-PRESENCE-IR-GOVERNOR-V0.1.md` (specification freeze only)
3. `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`
4. `docs/governance/AETHERIUM-GOVERNOR-SPEC.md`
5. Research and vision

Phase 0 Visual State remains the executable contract for the current prototype. This gate must not rewrite `contracts/visual-state.schema.json`, `runtime/`, `renderer/`, or `manifestation/`.

P0-03 and P0-04 stay deferred as Phase 0 decisions. Numeric domains and envelope rules below are Phase 1 planning checks. They are not retroactive Phase 0 truth.

---

## 2. Slice boundary

In scope for the first planning slice:

| Layer | Role in this gate | Runtime allowed now |
|---|---|---|
| PresenceVectorCandidate | Input candidate before governance | No |
| Minimal Governor A | Accept, clamp, reject, or terminate the candidate | No |
| PresenceIREnvelope | Governed wire object emitted only after Governor A | No |
| Conformance / fixture tests | Specified checks that a later implementation must pass | No test code in this round |

Out of scope. Do not design them into this slice and do not implement them:

- AETH Compiler
- Perceptual Compiler
- Governor B
- World Model production path
- Prediction runtime
- 8D runtime
- WebGPU or Canvas2D changes
- Mapping this envelope onto Visual State
- BLAKE3 production hashing beyond a fixture placeholder rule
- Multi-parent lineage

---

## 3. Pipeline under test

```text
PresenceVectorCandidate
        ↓
Minimal Governor A
        ↓
PresenceIREnvelope
        ↓
fixture / conformance verdict
```

No renderer sits after the envelope in this slice. An envelope is not light.

---

## 4. Layer 1 — PresenceVectorCandidate

A candidate is an untrusted input. It is not a governed frame.

Required fields for a structurally valid candidate:

```text
intent.state
intent.phase          advisory progress only, not Visual State phase
vector.x vector.y vector.z
vector.phase          oscillatory radians, not IntentContext.phase
vector.confidence
vector.energy
vector.coherence
vector.policy_risk    non-authoritative estimate
```

Planning checks. A later fixture suite must reject or classify these before runtime is accepted:

| Check | Required result |
|---|---|
| Missing `intent` or `vector` | Not a candidate. Governor A must not emit an envelope |
| Unknown field on the candidate object | Reject structural parse |
| `intent.state` outside the slice wire enum | Reject |
| `intent.phase` outside `[0.0, 1.0]` | Clamp or reject; must not be read as Visual State phase |
| `vector.phase` outside `[0.0, 2π)` | Clamp or reject; must not be copied into `intent.phase` |
| `x`, `y`, `z` outside `[-1.0, 1.0]` | Clamp or reject |
| `confidence`, `energy`, `coherence` outside `[0.0, 1.0]` | Clamp or reject |
| `policy_risk` outside `[0.0, 1.0]` | Clamp or reject; value remains non-authoritative |
| NaN, Infinity, numeric strings in numeric fields | Reject |

Slice wire enum for `intent.state`, taken from Presence IR v0.1 and not expanded here:

```text
IDLE | PROCESSING | RESPONDING | ERROR
```

`LISTENING`, `WARNING`, and `NIRODHA` are Phase 0 Visual State phases. They are not Presence IR IntentState values in this slice. A candidate that sends `NIRODHA` as `intent.state` fails the slice enum. A separate Governor A action may still terminate a trace. That action is not a seventh wire state.

P0-01 remains in force: Presence IR vocabulary alignment is deferred. This gate does not unify the enums.

---

## 5. Layer 2 — Minimal Governor A

Minimal Governor A in this slice is a pure function over one candidate plus trace context. It is not the full Governor spec.

Allowed actions in this slice:

| Action | When | Output |
|---|---|---|
| `VALIDATE` | Candidate is in domain and policy estimate is acceptable | Envelope with unchanged semantic fields |
| `CLAMP` | One or more numeric fields are out of domain and recoverable | Envelope with clamped fields and `normalization.clamped = true` |
| `REJECT` | Structural failure, forbidden enum, or policy denial | No envelope |
| `TERMINATE` | Explicit kill request on the trace context, not a Visual State write | No continuing envelope. Trace marked closed |

Deferred out of this minimal function:

- `DAMPEN` — Governor B / device budget. Not this slice.
- `FALLBACK` envelope synthesis with a placeholder BLAKE3 hash — specified in the Governor doc, not required to pass this gate.
- `SUSPEND` / interlock — later policy.
- Independent policy-risk engine beyond a deterministic fixture rule.
- Lineage walk across a stored trace database.

Deterministic policy rule for fixtures only:

```text
if candidate.vector.policy_risk > 0.85 then REJECT
else Governor A may VALIDATE or CLAMP
```

The supplied `policy_risk` is an estimate. The fixture rule is the stand-in verifier. It is not a production policy engine.

`TERMINATE` does not write `NIRODHA` into Presence IR `intent.state`. If a later slice needs that mapping, it requires its own contract decision. Phase 0 Visual State is not modified.

---

## 6. Layer 3 — PresenceIREnvelope

An envelope exists only as the output of `VALIDATE` or `CLAMP`. `REJECT` and `TERMINATE` do not produce one.

Required wire fields, matching Presence IR v0.1:

```text
ir_version
tick                  uint64 decimal string
state_version         uint64 decimal string
timestamp_ns          uint64 decimal string
trace_id
parent_trace_id       string or null; single parent only
trace_seed
intent.state
intent.phase
vector.*
normalization.clamped
normalization.policy_version
normalization.precision_dp
integrity_hash
```

Planning checks:

| Check | Required result |
|---|---|
| uint64 fields as JSON numbers | Reject |
| uint64 fields as negative, fractional, or exponent strings | Reject |
| Root trace with non-null `parent_trace_id` | Reject |
| Child trace with empty `parent_trace_id` | Reject |
| `parent_trace_ids` array | Reject in v0.1 |
| `state_version` gap on the same `trace_id` | Do not silently accept |
| `integrity_hash` missing | Reject |
| Envelope emitted after `REJECT` | Fail the fixture |

`integrity_hash` in this gate is a required field with a fixture comparison rule. Implementing BLAKE3 is not part of the planning gate. A later implementation must not claim production integrity until the hash profile is tested.

`intent.phase` on the envelope stays advisory. Downstream code must not treat ignoring it as a Governor bypass, and must not treat it as permission to skip Governor A.

---

## 7. Conformance fixtures to specify before runtime

These fixtures are the exit test list. They are not implemented in this document.

| ID | Input | Expected |
|---|---|---|
| F-01 | In-domain candidate, `policy_risk` 0.04 | `VALIDATE`, envelope, `clamped` false |
| F-02 | `energy` 1.4 | `CLAMP`, envelope energy 1.0, `clamped` true |
| F-03 | `intent.state` `NIRODHA` | `REJECT`, no envelope |
| F-04 | `policy_risk` 0.90 | `REJECT`, no envelope |
| F-05 | Missing `vector` | `REJECT`, no envelope |
| F-06 | `tick` as JSON number | Envelope rejected at wire check |
| F-07 | Same `trace_id`, `state_version` 0 then 2 | Gap not accepted |
| F-08 | Kill flag on trace context, otherwise valid candidate | `TERMINATE`, no continuing envelope, Visual State file unchanged |
| F-09 | `intent.phase` 0.72 and `vector.phase` 4.20 | Both preserved, not copied onto each other |
| F-10 | Two calls, same candidate and trace context | Identical action and identical normalized fields |

F-08 is the guard that this slice does not reopen Phase 0.

---

## 8. Exit criteria

The planning gate is passed only when all of the following are true:

1. The three layers above are accepted as the slice contract.
2. The fixture table is accepted as the conformance list.
3. No file under `runtime/`, `renderer/`, `manifestation/`, or `contracts/visual-state.schema.json` has changed.
4. AETH, Perceptual Compiler, Governor B, World Model, prediction, and 8D runtime remain absent from the slice.
5. Presence IR 4-state wire and Phase 0 7-state Visual State remain separate.

Passing this gate authorizes a later implementation task. It does not authorize that task by itself.

---

## 9. Implementation prohibition

This document does not add:

- a Presence IR parser
- a Governor A module
- an envelope builder
- fixture test code
- a mapping from envelope to Visual State

Next allowed implementation step, only after this gate is accepted: one pure module and the ten fixtures, still with no renderer and no Phase 0 edit.