# Aetherium Governor Specification v0.1

## 1. Overview and Purpose

The Aetherium Governor system establishes the runtime safety and semantic policy enforcement architecture for the Aetherium Light Manifest system. It enforces two distinct, non-overlapping lines of defense:
- **Governor A**: Guarantees semantic validity, structural integrity, and policy-risk evaluation.
- **Governor B**: Guarantees perceptual safety, resource allocation compliance, and hardware/device adaptation.

---

## 2. Policy Risk Authority Semantics

When user intent is parsed and evaluated:
* **AGNS Non-Authoritative Input**: An external or upstream semantic parser (e.g. AGNS) MAY supply an estimated policy-risk rating (`policy_risk`).
* **Independent Governor A Authority**: Governor A **MUST independently evaluate or verify** the effective `policy_risk` using its active Governor A policy ruleset.
* **Final Semantic Decision**: An AGNS-supplied `policy_risk` MUST NOT be authoritative by itself. Governor A remains the **sole and final authority** for evaluating policy risk and issuing the binding semantic governance decision.

---

## 3. Governor A / Governor B Architectural Split

Governor A and Governor B serve orthogonal safety responsibilities and MUST NOT be merged into a single monolithic component.

### 3.1 Authority Boundaries Table

| Domain / Responsibility | Responsible Authority | Key Enforced Functions & Parameters |
| :--- | :--- | :--- |
| **Semantic & Physical Validity** | **Governor A** | • Type and structural validation<br>• Range constraints & boundary clamping<br>• Semantic correctness & phase transitions<br>• Independent `policy_risk` evaluation<br>• Trace lineage verification (`parent_trace_id`)<br>• Integrity hash verification (`BLAKE3-256`)<br>• NIRODHA semantic kill-switch |
| **Perceptual & Resource Safety** | **Governor B** | • Renderer capability profile matching<br>• Device performance tier adaptation<br>• Particle & memory resource budgets<br>• Photosensitivity & flicker safety policy<br>• Perceptual safety compliance<br>• Manifest Contract integrity enforcement |

---

## 4. Governance Action Vocabulary & Worked Examples

When evaluating candidate states, the Governor issues exactly one governance action label from the closed 7-action vocabulary.

### 4.1 VALIDATE
* **Definition**: Candidate state fully complies with all schema, range, and policy constraints without modification.
* **Worked Example**: Governor A receives the following `PresenceVectorCandidate` under the canonical Presence IR contract:

  ```json
  {
    "intent": {
      "state": "RESPONDING",
      "phase": 0.72
    },
    "vector": {
      "x": 0.20,
      "y": -0.10,
      "z": 0.30,
      "phase": 4.20,
      "confidence": 0.91,
      "energy": 0.70,
      "coherence": 0.88,
      "policy_risk": 0.04
    }
  }
  ```

  Governor A validates the candidate against the canonical Presence IR schema, confirms the intent and vector fields are well-formed and within bounds, independently verifies the effective `policy_risk`, and emits the candidate unchanged with action `VALIDATE`.

### 4.2 CLAMP
* **Definition**: Restricts a single field's value to its defined schema bounds (field-level bounding).
* **Worked Example**: Candidate specifies `energy: 1.4` (where schema max limit is `1.0`). Governor A bounds `energy` to `1.0`, retains all other valid fields, and emits the adjusted state with action `CLAMP`.

### 4.3 DAMPEN
* **Definition**: Reduces overall subsystem output parameters while preserving original semantic intent (subsystem-level perceptual/resource reduction).
* **Worked Example**: Candidate requests a particle budget of `1,000,000` particles, but the target device renderer profile has a maximum capacity of `20,000`. Governor B dampens the effective particle budget to `20,000` while preserving the core visual morphology and semantic intent, emitting action `DAMPEN`.

### 4.4 FALLBACK
* **Definition**: Candidate state is unparseable, corrupt, or structurally invalid, requiring substitution with a certified, known-safe state.
* **Worked Example**: Candidate payload is missing the mandatory `shape` property or contains corrupt JSON syntax. Governor A replaces the payload with the canonical `IDLE` resting state (`phase: "IDLE"`, `shape: "sphere"`, `hue: 190`, `energy: 0.18`) and emits action `FALLBACK`.

### 4.5 REJECT
* **Definition**: Candidate state violates core semantic governance policy (e.g. prohibited phase transition or unauthorized command). No governed output frame is emitted.
* **Worked Example**: An unauthenticated request attempts to trigger a restricted phase transition during a locked state. Governor A rejects the candidate entirely, suppresses frame output, and logs action `REJECT`.

### 4.6 SUSPEND
* **Definition**: Upstream trace execution requires temporary holding or safety interlock evaluation. Governance processing for the trace is temporarily paused.
* **Worked Example**: Upstream trace receives an ambiguous safety interlock trigger. Governor A holds the state unchanged, pausing state progression until interlock verification completes, emitting action `SUSPEND`.

### 4.7 TERMINATE
* **Definition**: A critical safety policy breach occurs or an explicit NIRODHA semantic kill command is received, permanently closing the trace.
* **Worked Example**: A severe safety interlock breach or explicit NIRODHA kill-switch request is detected. Governor A immediately closes the trace lifetime permanently, transitions the system to the terminal `NIRODHA` state, and emits action `TERMINATE`.

---

## 5. Relationship to Phase 0.1 Prototype

* **Non-Conformant Prototype Precursor**: The Phase 0.1 visual state validator / normalizer (`runtime/visual-state.js`) is **NOT** a compliant Governor A implementation.
* **Current Precursor Scope**: Phase 0.1 provides basic precursor functionality restricted to:
  1. Structural type checking
  2. Simple range clamping (`clampVisualState` / `createVisualState`)
  3. Default population
* **Future Work**: Full Governor A policies (including BLAKE3 integrity hashing, `parent_trace_id` verification, independent policy risk engines, and formal action emission) belong to post-Phase-0.1 runtime releases.
