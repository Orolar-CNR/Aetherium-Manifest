# AETH-PRESENCE-GOVERNANCE-INVARIANTS-v0.1

**Document Name:** `AETH-PRESENCE-GOVERNANCE-INVARIANTS-v0.1`
**Classification:** `ARCHITECTURE / GOVERNANCE CONTRACT`
**Status:** `CANDIDATE`
**Implementation Status:** `NOT VERIFIED`
**Scope:** Governor, Presence IR, Canvas2D Simulator — Mode G
**Acceptance Gate:** Semantic Invariants, Governor Sovereignty, and Resource Release must pass tests before connecting Renderer.

---

## 1. Overview and Purpose

This Candidate Governance Contract specifies the hard semantic invariants and NIRODHA transition rules governing the interface between Presence Intermediate Representation (Presence IR) and the Manifestation Runtime (e.g. Canvas2D Simulator — Mode G).

In this architecture, **NIRODHA** is not merely a tranquil visual effect; it represents a formal state of manifestation suppression and safe governance rest enforced when input or system conditions fail to satisfy semantic and policy requirements.

---

## 2. Semantic Invariants & NIRODHA Transition Rules (Hard Invariants)

The Governor MUST validate and enforce these hard invariants before passing any manifestation state to the Renderer. Violation of these rules forces an immediate governance override or NIRODHA transition.

### Rule 1 (SEM-001): Honest Uncertainty
* **Condition:** `presence.confidence < 0.5`
* **Constraints:**
  * `governance.decision` MUST be set to `DEFER` or `REJECT_NIRODHA`.
  * `manifestation.structuralIntegrity` MUST be strictly `< 0.5` (prohibits fully closed or solid geometries).
  * `manifestation.topology` MUST be restricted strictly to `CRACKED_SHELL` or `NEBULA` only.

### Rule 2 (SAFE-001): Nirodha Damping
* **Condition:** `governance.decision === "REJECT_NIRODHA"` OR `presence.contradictionLevel > 0.7`
* **Constraints:**
  * `manifestation.flowDirection` MUST be clamped to `STATIC`.
  * `manifestation.turbulence` MUST be suppressed to strictly `< 0.1` (prohibits high-turbulence attention-seeking visuals in favor of stillness).
  * `manifestation.lightIntensity` MUST enter a dimming state (`< 0.3`).

### Rule 3 (GOV-001): Governor Sovereignty
* **Condition:** Execution boundary between Governor and Renderer.
* **Constraints:**
  * The Renderer MUST NOT have direct access to `presence` or `governance` data structures.
  * The Renderer receives exclusively the Governor-adjusted, clamped, and finalized `manifestation` object/fields.

---

## 3. Policy Discrepancy & Resolution Analysis

### 3.1 Analysis of Inconsistency
An ambiguity exists between acceptance criteria where a low confidence value (`confidence = 0.2`) stops turbulence, whereas Rule SEM-001 alone only constrains `structuralIntegrity` and `topology`. Rule SAFE-001 suppresses turbulence when `governance.decision === "REJECT_NIRODHA"` or `presence.contradictionLevel > 0.7`.

### 3.2 Adopted Resolution: Option A (Approach A)
This specification adopts **Option A (Maintain Existing Rule Structure with Policy Alignment)**:
* **`DEFER` Semantics:** Selected when confidence is low (`< 0.5`) but policy permits displaying an uncertain or incomplete state. The Governor enforces `structuralIntegrity < 0.5` and `topology ∈ {CRACKED_SHELL, NEBULA}`, while leaving motion dynamics governed by standard bounds.
* **`REJECT_NIRODHA` Semantics:** Selected when confidence is below critical threshold or when low confidence is paired with policy rejection rules requiring manifestation suppression. Setting `governance.decision = REJECT_NIRODHA` directly invokes SAFE-001 damping (`flowDirection = STATIC`, `turbulence < 0.1`, `lightIntensity < 0.3`).

Thus, for acceptance scenarios requiring low confidence (`confidence = 0.2`) to stop turbulence, the Governor policy evaluates the low confidence as requiring manifestation suppression (`REJECT_NIRODHA`), triggering SAFE-001 damping before parameters reach the Renderer.

---

## 4. Execution Pipeline Sequence

The runtime execution flow MUST follow a strict 5-stage pipeline:

1. **Presence IR Input:** Receive input containing `confidence`, `contradictionLevel`, and vector origin parameters.
2. **Governor Validation:** Check data types, numeric ranges, schema integrity, and required fields.
3. **Semantic Invariants Enforcement:** Apply SEM-001 and SAFE-001 in priority order.
4. **Finalized Manifestation State:** Clamp values, re-verify constraints, and lock the approved manifestation state object.
5. **Canvas2D Renderer Execution:** Render output reading exclusively from the finalized and locked manifestation state.

*Auditability Note:* If input fails validation or semantic invariants, the Governor MUST NOT forward unverified data to the Renderer and MUST log a traceably auditable rejection record.

---

## 5. Acceptance Criteria & Test Suite Specification

### 5.1 Acceptance Test Matrix

| Test ID | Input / Event Condition | Required Proved Result |
| :--- | :--- | :--- |
| `SEM-001-T1` | `presence.confidence = 0.2` | `governance.decision` is `DEFER` or `REJECT_NIRODHA`, `manifestation.structuralIntegrity < 0.5`, and `manifestation.topology` ∈ `{"CRACKED_SHELL", "NEBULA"}`. |
| `SAFE-001-T1` | `governance.decision = "REJECT_NIRODHA"` | `manifestation.flowDirection` is `STATIC`, `manifestation.turbulence < 0.1`, and `manifestation.lightIntensity < 0.3`. |
| `SAFE-001-T2` | `presence.contradictionLevel = 0.8` | Damping enforced (`flowDirection = STATIC`, `turbulence < 0.1`, `lightIntensity < 0.3`) regardless of governance decision. |
| `GOV-001-T1` | Renderer API Boundary Inspection | Renderer interface cannot access `presence` or `governance` fields directly. |
| `IDLE-001-T1` | Transition to `IDLE` State | Complete buffer and resource release (backing canvas, offscreen buffer, particle arrays, animation loop, event listeners); zero phantom or ghost data rendered. |
| `DET-001-T1` | Identical Input Re-execution | Produces identical Finalized Manifestation State deterministically under matching version and context. |

### 5.2 Resource Release Requirements for Canvas2D

To ensure clean state transitions and prevent memory leaks or phantom rendering during `IDLE` state transitions, the Canvas2D Simulator MUST release resources across all 5 operational resource types:

1. **Backing Canvas:** Clear the primary display context via `clearRect(0, 0, width, height)`.
2. **Offscreen Buffer:** Reset and clear offscreen buffer surfaces and temporary canvas allocations.
3. **Particle Arrays:** Truncate active particle lists, vector arrays, and point allocations to zero length.
4. **Animation Loop:** Explicitly cancel pending `requestAnimationFrame` IDs and stop render tick loops.
5. **Event Listeners:** Unregister resize, input, and frame event handlers attached during active rendering.

---

## 6. Contract Metadata Summary

* **Document Name:** `AETH-PRESENCE-GOVERNANCE-INVARIANTS-v0.1`
* **Classification:** `ARCHITECTURE / GOVERNANCE CONTRACT`
* **Status:** `CANDIDATE`
* **Implementation Status:** `NOT VERIFIED`
* **Scope:** Governor, Presence IR, Canvas2D Simulator — Mode G
* **Acceptance Gate:** Semantic Invariants, Governor Sovereignty, and Resource Release must pass tests before connecting Renderer.
