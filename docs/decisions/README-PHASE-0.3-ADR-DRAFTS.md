# Phase 0.3 — P0 Architecture Decision Records Index (Drafts)

## Overview

This directory contains the draft Architecture Decision Records (ADRs) required for **P0 Contract Ratification (PR B)** as identified in the [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md).

All records in this index are currently in **DRAFT — PENDING RATIFICATION** status and do NOT alter canonical specifications directly until formally ratified during the Phase 0.3 Contract Freeze Gate pass.

---

## P0 Draft ADR Index

| ID | Title | File | Status | Recommended Lean |
|---|---|---|---|---|
| **P0-01** | IntentState Vocabulary Reconciliation | [`ADR-DRAFT-P0-01-INTENTSTATE-VOCABULARY.md`](./ADR-DRAFT-P0-01-INTENTSTATE-VOCABULARY.md) | `DRAFT — PENDING RATIFICATION` | Hybrid / Unification (7 states + NIRODHA kill-switch terminal) |
| **P0-02** | Turbulence Domain Separation | [`ADR-DRAFT-P0-02-TURBULENCE-RANGE.md`](./ADR-DRAFT-P0-02-TURBULENCE-RANGE.md) | `DRAFT — PENDING RATIFICATION` | Dual-layer: Semantic `[0.0, 1.0]` vs. Downstream Safety Ceiling `0.65` |
| **P0-03** | PresenceVector Numeric Domains & Phase Meanings | [`ADR-DRAFT-P0-03-PRESENCE-VECTOR-RANGES.md`](./ADR-DRAFT-P0-03-PRESENCE-VECTOR-RANGES.md) | `DRAFT — PENDING RATIFICATION` | Spatial `[-1,1]`, Scalars `[0,1]`, Phase `[0, 2π)`, Disambiguate `phase` tokens |
| **P0-04** | SAD Pipeline Architecture Alignment | [`ADR-DRAFT-P0-04-SAD-PIPELINE-ALIGNMENT.md`](./ADR-DRAFT-P0-04-SAD-PIPELINE-ALIGNMENT.md) | `DRAFT — PENDING RATIFICATION` | Expand SAD §2 sequence to reflect full governed execution pipeline |

---

## Existing Ratified ADRs

* [`ADR-PRESENCE-IR-GOVERNOR-V0.1.md`](./ADR-PRESENCE-IR-GOVERNOR-V0.1.md) — Presence IR and Governor v0.1 Ratification Decisions (Status: `ACCEPTED FOR SPECIFICATION FREEZE`)
