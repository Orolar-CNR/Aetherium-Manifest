# AETHERIUM-CANONICAL-IR-AND-SEMANTIC-INVARIANTS-v0.1

**Document type:** Engineering / Research Specification Candidate  
**Version:** 0.1  
**Status:** `DRAFT — NOT NORMATIVE`  
**Implementation status:** `NOT ESTABLISHED BY THIS DOCUMENT`  
**Approval status:** `PENDING REVIEW`  
**Intended location:** `docs/contracts/AETHERIUM-CANONICAL-IR-AND-SEMANTIC-INVARIANTS-v0.1.md`  
**Scope:** Canonical IR envelope, semantic invariants, Governor decision semantics, NIRODHA safety state, and verification criteria.

> **Status warning:** This file defines a candidate contract. Its `MUST` / `MUST NOT` language describes requirements proposed for this specification; it does not assert that the current repository implements them. Do not mark a requirement implemented or verified until code location, executable tests, and reproducible evidence are available.

---

## 0. Purpose

Aetherium needs a machine-checkable contract between interpreted intent and perceptual manifestation. The contract must allow the system to evaluate, at minimum:

1. **Semantic Fidelity (RQ1):** whether the governed intermediate representation preserves the semantic class and constraints selected upstream.
2. **State-to-Render Consistency (RQ2):** whether renderer-facing parameters conform to the approved IR within declared tolerances.
3. **Human Interpretability (RQ3):** whether people interpret a manifestation as intended. This is an empirical research question, not something that schema validation alone can prove.

The core architectural rule is:

```text
Intent / Evidence
    → AETH Contract
    → Canonical IR Candidate
    → Deterministic Validation
    → Governor Decision
    → Authorized Runtime Mapping
    → Renderer / GPU
    → Observed Manifestation
    → Fidelity Evidence and User Feedback
```

**The Renderer MUST NOT receive raw intent or ungoverned model output.** The Renderer receives only a governed render envelope or a bounded safety-transition command. Renderer code and shaders MUST NOT become authorities for semantic interpretation or policy authorization.

## 1. Status, scope, and compatibility

### 1.1 What this document specifies

This document separates five contracts:

- **A. Schema:** typed, versioned IR data and validation rules.
- **B. Invariant Registry:** semantic and safety conditions that must be checked before authorization.
- **C. Governor Decision Contract:** the only authority that accepts, defers, rejects, or enters a safe state.
- **D. NIRODHA State Contract:** fail-safe behavior and bounded visual transition to a safe rest state.
- **E. Verification Criteria:** test levels, evidence requirements, and criteria for reporting results.

### 1.2 Explicit non-goals

This document does not:

- claim that the complete Canonical IR, Governor, NIRODHA, GPU readback, or memory wipe is already implemented;
- define a physical simulation or prove that visual symbolism has universal meaning;
- replace a frozen Phase 0.x Visual State Contract or reopen Phase 0 without evidence of a defect;
- authorize a production Presence IR Runtime, AETH compiler, Perceptual Compiler, or World Model by itself;
- treat a successful hash calculation as proof that the hashed semantics are correct;
- treat low luminosity, visual settling, or cache-entry deletion as proof of memory sanitization.

### 1.3 Relationship to existing Aetherium terminology

The project corpus describes the intended authority flow as `Intent → AETH → Presence IR → Governor → Renderer`, and states that Presence IR should be the common state source rather than allowing the UI, AI, or shader to invent their own authoritative state. The project also has more than one draft representation of Presence IR and Visual Parameters.

To avoid silently replacing an existing contract, this specification defines a **Canonical IR Envelope v0.1** around the proposed Presence state and its epistemic, action, and manifestation constraints. It does not declare every field in this candidate to be part of the eight-dimensional P8 vector. The P8 core and the additional envelope fields have separate roles.

Where an existing frozen Phase 0.x contract specifies a narrower range or a different field name, that contract remains authoritative for Phase 0.x. Integration requires an explicit adapter and conformance evidence; this document is not permission to silently change that contract.

---

# A. Schema — Canonical IR Envelope v0.1

## A1. Design requirements

The IR MUST be structured data, not an unconstrained prose description. It MUST have a schema version, typed fields, finite numeric values, explicit enums, provenance references, and a deterministic validation path.

- A missing value MUST NOT be silently replaced by a guessed value.
- `NaN`, positive infinity, and negative infinity MUST be rejected.
- Unknown enum values MUST be rejected or mapped to a declared `UNKNOWN` value by an explicit versioned adapter; they MUST NOT be guessed by the renderer.
- Clamping is allowed only where a declared contract permits it. A semantic-critical value MUST NOT be silently clamped into an apparently valid state.
- The IR candidate and the Governor decision MUST be separate objects. A candidate cannot assert that it has authorized itself.
- Evidence and intent references SHOULD be identifiers or content-addressed references rather than raw private user text, unless storing the text is explicitly required and permitted.

## A2. Logical data model

The v0.1 envelope consists of the following sections:

| Section | Purpose | Authority |
|---|---|---|
| `schemaVersion` | Versioned contract identity | Schema registry |
| `identity` | State, trace, and lineage identifiers | Runtime / trace producer |
| `semantics` | Declared semantic class and references to intent/evidence | Upstream interpreter; treated as a candidate claim until validated |
| `presence` | Canonical presence state | Presence IR producer, subject to Governor validation |
| `epistemic` | Contradiction, novelty, and method metadata for confidence | Evaluator / interpreter metadata |
| `action` | Operation class, reversibility, and confirmation binding | Action/intent interpreter; Governor independently enforces policy |
| `manifestation` | Proposed visual topology and normalized field parameters | AETH / mapping layer, subject to Governor limits |
| `kinematics` | Optional explicit velocity contract for Q1 tests | Spatial model or test fixture |
| `provenance` | Producer/version and evidence references | Trace/evidence subsystem |

### A2.1 Presence state

The proposed Presence core uses the established project vocabulary:

- `position`: normalized spatial anchor `(x, y, z)` in `[-1, 1]`;
- `intentPhase`: `IDLE`, `LISTENING`, `THINKING`, `RESPONDING`, `WARNING`, `ERROR`, or `NIRODHA`;
- `confidence`: normalized epistemic certainty `e_c ∈ [0, 1]`;
- `intentIntensity`: normalized intent intensity;
- `semanticCoherence`: normalized coherence;
- `policyRisk`: normalized aggregate risk.

Other project drafts mention fields such as energy, entropy, and turbulence. In this specification, renderer-facing density, light intensity, and turbulence are placed under `manifestation`; they MUST NOT be presented as additional P8 dimensions without a separately versioned decision.

### A2.2 Epistemic fields

- `presence.confidence` is the single stored value used as `e_c`. Do not store a second independent `certainty` value that can disagree with it.
- `epistemic.contradictionLevel` is `e_x ∈ [0, 1]`.
- `epistemic.novelty` is `e_n ∈ [0, 1]`.
- `epistemic.certaintyMethod` identifies how confidence was produced. A model-reported or heuristic score MUST NOT be represented as a calibrated probability unless calibration evidence supports that claim.
- A threshold for contradiction-driven `DEFER` / `REJECT` is not frozen by this document; it is a versioned policy configuration decision.

### A2.3 Action and reversibility

```ts
type ActionReversibility =
  | "REVERSIBLE"
  | "PARTIALLY_REVERSIBLE"
  | "IRREVERSIBLE"
  | "UNKNOWN";

type OperationClass = "NONE" | "NON_DESTRUCTIVE" | "DESTRUCTIVE";
type ConfirmationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "CONFIRMED"
  | "EXPIRED"
  | "REVOKED";
```

A confirmation is valid only for the exact action digest/parameters, the relevant user/session authority, and the allowed time window. A changed action payload invalidates a prior confirmation. A confirmation alone is not authorization: the Governor must reevaluate the candidate and current policy.

### A2.4 Manifestation fields

`manifestation` declares the desired perceptual form. It is not a renderer command and does not authorize execution.

Candidate v0.1 enums are proposed, not frozen:

- Topology: `SPHERE`, `VORTEX`, `CRACKED_SHELL`, `NEBULA`, `ORBITAL_FIELD`, `LINE`, `WAVE`, `UNSPECIFIED`.
- Closure: `OPEN`, `CLOSED`, `UNKNOWN`.
- Flow: `INWARD`, `OUTWARD`, `ORBITAL`, `HOLDING_ORBIT`, `STATIC`.

The exact topology registry and the set `Σ_closed` MUST be frozen before an invariant implementation can be called normative. `structuralIntegrity < 1` alone is not a sufficient test for whether a rendered topology is closed.

### A2.5 TypeScript reference interface

This is a readable type-level reference. Runtime validation is still required; TypeScript types alone do not validate received JSON.

```ts
export type IntentPhase =
  | "IDLE" | "LISTENING" | "THINKING" | "RESPONDING"
  | "WARNING" | "ERROR" | "NIRODHA";

export type SemanticClass =
  | "ANALYSIS" | "RELATION" | "DESTRUCTIVE_ACTION" | "UNKNOWN";

export type ActionReversibility =
  | "REVERSIBLE" | "PARTIALLY_REVERSIBLE" | "IRREVERSIBLE" | "UNKNOWN";

export type OperationClass = "NONE" | "NON_DESTRUCTIVE" | "DESTRUCTIVE";
export type ConfirmationStatus =
  | "NOT_REQUIRED" | "PENDING" | "CONFIRMED" | "EXPIRED" | "REVOKED";

export type Topology =
  | "SPHERE" | "VORTEX" | "CRACKED_SHELL" | "NEBULA"
  | "ORBITAL_FIELD" | "LINE" | "WAVE" | "UNSPECIFIED";
export type ShapeClosure = "OPEN" | "CLOSED" | "UNKNOWN";
export type FlowDirection = "INWARD" | "OUTWARD" | "ORBITAL" | "HOLDING_ORBIT" | "STATIC";

export interface Vec3 { x: number; y: number; z: number }
export interface CanonicalIREnvelopeV01 {
  schemaVersion: "aetherium.canonical-ir/0.1";
  identity: {
    stateId: string;
    traceId: string;
    parentStateId: string | null;
  };
  semantics: {
    semanticClass: SemanticClass;
    intentRef: string;
    evidenceRefs: string[];
  };
  presence: {
    position: Vec3;                 // each component [-1, 1]
    intentPhase: IntentPhase;
    confidence: number;             // e_c ∈ [0, 1]
    intentIntensity: number;        // [0, 1]
    semanticCoherence: number;      // [0, 1]
    policyRisk: number;             // [0, 1]
  };
  epistemic: {
    contradictionLevel: number;     // e_x ∈ [0, 1]
    novelty: number;                // e_n ∈ [0, 1]
    certaintyMethod:
      | "CALIBRATED_ESTIMATOR" | "EXTERNAL_EVALUATOR"
      | "MODEL_REPORTED" | "HEURISTIC" | "UNKNOWN";
    calibrationRef: string | null;
  };
  action: {
    operationClass: OperationClass;
    reversibility: ActionReversibility;
    confirmation: {
      required: boolean;
      status: ConfirmationStatus;
      confirmationRef: string | null;
      actionDigest: string | null;
      expiresAt: string | null;     // RFC 3339 date-time when present
    };
  };
  manifestation: {
    topology: Topology;
    closure: ShapeClosure;
    flowDirection: FlowDirection;
    lightIntensity: number;         // normalized [0, 1]
    particleDensity: number;        // normalized [0, 1]
    turbulence: number;             // normalized [0, 1] in this envelope only
    structuralIntegrity: number;    // normalized [0, 1]
    permittedMorphings: Array<"SCALE" | "ROTATE" | "DISPERSE" | "COHERE" | "TOPOLOGY_CHANGE">;
  };
  kinematics?: {
    coordinateFrame: string;
    velocityUnit: string;
    spatialVelocity: Vec3;
  };
  provenance: {
    producerId: string;
    producerVersion: string;
    evidenceBundleRef: string | null;
  };
}
```

**Range compatibility note:** The `[0, 1]` turbulence range above is normalized for the envelope. It does not override narrower backend limits in a frozen contract (for example, a Phase 0.x renderer limit). The adapter must validate, map, and record any permitted clamp rather than silently changing semantic meaning.

## A3. Draft JSON Schema (Draft 2020-12)

This schema formalizes the structural contract for `aetherium.canonical-ir/0.1`. It does not replace the cross-field semantic validator in Section B. The schema is draft until enum registries, ID formats, and the project validation library are reviewed.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:aetherium:canonical-ir:0.1",
  "title": "Aetherium Canonical IR Envelope v0.1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion", "identity", "semantics", "presence",
    "epistemic", "action", "manifestation", "provenance"
  ],
  "properties": {
    "schemaVersion": { "const": "aetherium.canonical-ir/0.1" },
    "identity": { "$ref": "#/$defs/identity" },
    "semantics": { "$ref": "#/$defs/semantics" },
    "presence": { "$ref": "#/$defs/presence" },
    "epistemic": { "$ref": "#/$defs/epistemic" },
    "action": { "$ref": "#/$defs/action" },
    "manifestation": { "$ref": "#/$defs/manifestation" },
    "kinematics": { "$ref": "#/$defs/kinematics" },
    "provenance": { "$ref": "#/$defs/provenance" }
  },
  "$defs": {
    "idString": { "type": "string", "minLength": 1, "maxLength": 256 },
    "nullableId": { "type": ["string", "null"], "minLength": 1, "maxLength": 256 },
    "unitScalar": { "type": "number", "minimum": 0, "maximum": 1 },
    "coordinate": { "type": "number", "minimum": -1, "maximum": 1 },
    "vec3": {
      "type": "object",
      "additionalProperties": false,
      "required": ["x", "y", "z"],
      "properties": {
        "x": { "$ref": "#/$defs/coordinate" },
        "y": { "$ref": "#/$defs/coordinate" },
        "z": { "$ref": "#/$defs/coordinate" }
      }
    },
    "identity": {
      "type": "object",
      "additionalProperties": false,
      "required": ["stateId", "traceId", "parentStateId"],
      "properties": {
        "stateId": { "$ref": "#/$defs/idString" },
        "traceId": { "$ref": "#/$defs/idString" },
        "parentStateId": { "$ref": "#/$defs/nullableId" }
      }
    },
    "semantics": {
      "type": "object",
      "additionalProperties": false,
      "required": ["semanticClass", "intentRef", "evidenceRefs"],
      "properties": {
        "semanticClass": {
          "enum": ["ANALYSIS", "RELATION", "DESTRUCTIVE_ACTION", "UNKNOWN"]
        },
        "intentRef": { "$ref": "#/$defs/idString" },
        "evidenceRefs": {
          "type": "array", "uniqueItems": true,
          "items": { "$ref": "#/$defs/idString" }
        }
      }
    },
    "presence": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "position", "intentPhase", "confidence", "intentIntensity",
        "semanticCoherence", "policyRisk"
      ],
      "properties": {
        "position": { "$ref": "#/$defs/vec3" },
        "intentPhase": {
          "enum": ["IDLE", "LISTENING", "THINKING", "RESPONDING", "WARNING", "ERROR", "NIRODHA"]
        },
        "confidence": { "$ref": "#/$defs/unitScalar" },
        "intentIntensity": { "$ref": "#/$defs/unitScalar" },
        "semanticCoherence": { "$ref": "#/$defs/unitScalar" },
        "policyRisk": { "$ref": "#/$defs/unitScalar" }
      }
    },
    "epistemic": {
      "type": "object",
      "additionalProperties": false,
      "required": ["contradictionLevel", "novelty", "certaintyMethod", "calibrationRef"],
      "properties": {
        "contradictionLevel": { "$ref": "#/$defs/unitScalar" },
        "novelty": { "$ref": "#/$defs/unitScalar" },
        "certaintyMethod": {
          "enum": ["CALIBRATED_ESTIMATOR", "EXTERNAL_EVALUATOR", "MODEL_REPORTED", "HEURISTIC", "UNKNOWN"]
        },
        "calibrationRef": { "$ref": "#/$defs/nullableId" }
      }
    },
    "action": {
      "type": "object",
      "additionalProperties": false,
      "required": ["operationClass", "reversibility", "confirmation"],
      "properties": {
        "operationClass": { "enum": ["NONE", "NON_DESTRUCTIVE", "DESTRUCTIVE"] },
        "reversibility": { "enum": ["REVERSIBLE", "PARTIALLY_REVERSIBLE", "IRREVERSIBLE", "UNKNOWN"] },
        "confirmation": { "$ref": "#/$defs/confirmation" }
      }
    },
    "confirmation": {
      "type": "object",
      "additionalProperties": false,
      "required": ["required", "status", "confirmationRef", "actionDigest", "expiresAt"],
      "properties": {
        "required": { "type": "boolean" },
        "status": { "enum": ["NOT_REQUIRED", "PENDING", "CONFIRMED", "EXPIRED", "REVOKED"] },
        "confirmationRef": { "$ref": "#/$defs/nullableId" },
        "actionDigest": { "$ref": "#/$defs/nullableId" },
        "expiresAt": { "type": ["string", "null"], "format": "date-time" }
      }
    },
    "manifestation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "topology", "closure", "flowDirection", "lightIntensity",
        "particleDensity", "turbulence", "structuralIntegrity", "permittedMorphings"
      ],
      "properties": {
        "topology": {
          "enum": ["SPHERE", "VORTEX", "CRACKED_SHELL", "NEBULA", "ORBITAL_FIELD", "LINE", "WAVE", "UNSPECIFIED"]
        },
        "closure": { "enum": ["OPEN", "CLOSED", "UNKNOWN"] },
        "flowDirection": { "enum": ["INWARD", "OUTWARD", "ORBITAL", "HOLDING_ORBIT", "STATIC"] },
        "lightIntensity": { "$ref": "#/$defs/unitScalar" },
        "particleDensity": { "$ref": "#/$defs/unitScalar" },
        "turbulence": { "$ref": "#/$defs/unitScalar" },
        "structuralIntegrity": { "$ref": "#/$defs/unitScalar" },
        "permittedMorphings": {
          "type": "array", "uniqueItems": true,
          "items": { "enum": ["SCALE", "ROTATE", "DISPERSE", "COHERE", "TOPOLOGY_CHANGE"] }
        }
      }
    },
    "kinematics": {
      "type": "object",
      "additionalProperties": false,
      "required": ["coordinateFrame", "velocityUnit", "spatialVelocity"],
      "properties": {
        "coordinateFrame": { "$ref": "#/$defs/idString" },
        "velocityUnit": { "$ref": "#/$defs/idString" },
        "spatialVelocity": {
          "type": "object",
          "additionalProperties": false,
          "required": ["x", "y", "z"],
          "properties": {
            "x": { "type": "number" },
            "y": { "type": "number" },
            "z": { "type": "number" }
          }
        }
      }
    },
    "provenance": {
      "type": "object",
      "additionalProperties": false,
      "required": ["producerId", "producerVersion", "evidenceBundleRef"],
      "properties": {
        "producerId": { "$ref": "#/$defs/idString" },
        "producerVersion": { "$ref": "#/$defs/idString" },
        "evidenceBundleRef": { "$ref": "#/$defs/nullableId" }
      }
    }
  }
}
```

### A3.1 Runtime validation notes

- JSON Schema `type: "number"` ordinarily covers JSON numbers, but implementations receiving in-memory JavaScript objects MUST still reject `NaN` and infinities explicitly.
- JSON Schema structural validation does not by itself enforce the conditional invariants such as `confidence < 0.5` forbidding a closed topology, or a destructive operation requiring a valid confirmation.
- `kinematics` is optional for general candidate states but mandatory for Q1 velocity-conformance tests; absence means Q1 is `NOT_TESTABLE`, not passed.
- ID formats in this draft are deliberately conservative. Replace them with the project’s agreed format during schema freeze.
- The JSON Schema artifact SHOULD be extracted into a versioned companion file and run in CI once the registry is approved.

---

# B. Invariant Registry

## B1. Enforcement rule

Every invariant MUST have a stable ID, severity, executable predicate, expected failure disposition, and tests. The validator MUST return structured violations rather than only a Boolean. A candidate with a violated hard invariant MUST NOT be sent to the normal renderer path.

Recommended result shape:

```ts
interface InvariantViolation {
  invariantId: string;
  severity: "HARD" | "SOFT";
  path: string;
  reasonCode: string;
  message: string;
}
interface ValidationReport {
  schemaVersion: string;
  candidateStateId: string;
  valid: boolean;
  violations: InvariantViolation[];
  warnings: string[];
  validatorVersion: string;
}
```

## B2. Initial registry

| ID | Invariant | Executable condition | Failure disposition |
|---|---|---|---|
| `IR-001` | Structural validity | All required fields, types, enums, finite values, and ranges pass schema validation. | `REJECT` malformed candidate; enter safe handling if the malformed candidate affects an active stream. |
| `SEM-001` | Honest uncertainty | If `presence.confidence < 0.5`, topology MUST NOT belong to `Σ_closed`, and `manifestation.closure` MUST NOT be `CLOSED`. | `REJECT` candidate or `DEFER` for regenerated candidate; normal render prohibited. |
| `SEM-002` | Unknown certainty is not certainty | `certaintyMethod == UNKNOWN` or absent calibration evidence MUST NOT be described as a calibrated probability. If the governing policy requires calibrated certainty, result is `DEFER`. | `DEFER` or policy-defined `REJECT`; do not infer evidence. |
| `SEM-003` | Contradiction is handled explicitly | If contradiction exceeds configured threshold `θx`, Governor MUST select a configured `DEFER` / `REJECT` path; it MUST NOT silently accept. `θx` is versioned policy configuration, not frozen here. | `DEFER` or `REJECT`. |
| `ACT-001` | Destructive-action holding | For `operationClass == DESTRUCTIVE` without a currently valid matching confirmation, flow MUST be `HOLDING_ORBIT`; action execution is forbidden and decision cannot be `ACCEPT` for execution. | `DEFER`; reject attempted action execution. |
| `ACT-002` | Confirmation is action-bound | Confirmation reference, action digest, authority/session, and expiry must match the current request. Any material change or expiry invalidates confirmation. | `DEFER` for reconfirmation or `REJECT` stale confirmation. |
| `ACT-003` | Unknown reversibility is not implicit permission | `reversibility == UNKNOWN` for a destructive or high-impact action cannot be treated as reversible or automatically authorized. | `DEFER` / `REJECT` according to policy. |
| `GOV-001` | Governor sovereignty | Only a Governor-issued, current authorization may create a normal render envelope. Raw intent/model output cannot bypass the Governor. | Block render; emit policy violation event. |
| `GOV-002` | Decision binds exact candidate | A decision is bound to the candidate digest, policy bundle/version, capability profile, and relevant state sequence. Any change invalidates the authorization. | Reject stale/mismatched decision. |
| `GOV-003` | No self-authorization | The candidate IR cannot set its own authorization result or override fields reserved to the Governor. | Schema/semantic reject. |
| `REN-001` | State-to-render fidelity | Observed renderer-facing parameters must meet the configured per-parameter tolerances and aggregate fidelity criteria; hard invariants remain non-compensatory. | Fail conformance; prevent promotion to verified status. |
| `SAFE-001` | NIRODHA blocks unsafe updates | While quarantined or in safe-rest mode, unauthorized semantic/action updates cannot alter the active state. Only bounded, pre-authorized safety-transition parameters may evolve. | Re-enter fail-safe; record violation. |
| `AUD-001` | Integrity is not semantics | A matching digest/hash does not waive schema or invariant validation. Validation and hash verification are separate checks. | Reject any pipeline that treats hash success as invariant success. |
| `AUD-002` | Traceable decision | Every accept/defer/reject/NIRODHA transition must emit a decision event bound to candidate ID/digest, policy version, reason codes, and previous event reference where available. | Verification failure; authorization may not be considered auditable. |

## B3. Formal core invariants

Let `IR` be a candidate; `e_c := IR.presence.confidence`; `e_x := IR.epistemic.contradictionLevel`; `Σ_closed` be the versioned closed-topology set; `Confirmed(a)` mean a valid, current confirmation is bound to the exact destructive action `a`.

### Honest uncertainty

\[
 e_c < 0.5 \Rightarrow
 (IR.manifestation.topology \notin \Sigma_{closed})
 \land (IR.manifestation.closure \neq CLOSED)
\]

The rule is strict: exactly `0.5` does not trigger this invariant by itself. That boundary is deliberate in v0.1 and must have a dedicated boundary test. The topology registry must be frozen before production conformance can be claimed.

### Destructive operation hold

\[
 IR.action.operationClass = DESTRUCTIVE \land \neg Confirmed(a)
 \Rightarrow
 (IR.manifestation.flowDirection = HOLDING\_ORBIT)
 \land (ActionExecution = FORBIDDEN)
\]

User confirmation is a necessary condition, not sufficient authorization. The Governor must revalidate the candidate, action scope, policy, and capabilities after confirmation.

### Contradiction threshold

\[
 e_x \geq \theta_x \Rightarrow Decision \in \{DEFER, REJECT\}
\]

`θx` must be configured and versioned. This draft deliberately does not invent a universal numeric threshold.

## B4. Semantic Checksum and digest separation

The term **Semantic Checksum** means the combined evidence that:

1. the candidate passed schema validation;
2. the candidate passed the applicable invariant registry;
3. the validated candidate is bound to a deterministic digest and Governor decision;
4. the render envelope refers to that same approved candidate and mapping version.

These are separate proof obligations. A content hash can detect changes when canonicalization and verification are correct; it cannot prove that a semantic assertion is true or an invariant is satisfied.

The canonical serialization and hash algorithm are **not frozen by this document**. The project has discussed BLAKE3-256 and SHA-256 in different contexts; the normative choice must be made in a separate Hash Profile / ADR. Until that choice is frozen and implemented consistently, cross-runtime digest reproducibility is `NOT VERIFIED`.

---

# C. Governor Decision Contract

## C1. Role and authority

The Governor is the final authorization boundary between the candidate IR and renderer execution. Its duties include schema validation, invariant checks, policy checks, capability checks, transition validation, authorized mapping selection, safe fallback, and decision telemetry.

The Governor MUST NOT rely on the renderer to infer semantics, decide whether a destructive action is safe, or recover missing epistemic evidence.

## C2. Decision enum

```ts
type GovernorDecision = "ACCEPT" | "DEFER" | "REJECT" | "NIRODHA";
```

- **`ACCEPT`**: candidate passed required schema/invariants/policy/capability checks. This authorizes only the scoped effects named in the decision; it does not authorize unrelated actions.
- **`DEFER`**: required evidence, confirmation, or context is missing or ambiguous. No normal action is executed. The candidate may be held in a bounded, access-controlled pending area if policy permits.
- **`REJECT`**: candidate violates a hard rule or policy. It is not forwarded to normal manifestation. A rejected event may trigger NIRODHA according to failure policy.
- **`NIRODHA`**: enter the safe-state protocol because a critical uncertainty, contradiction, policy rejection, invariant violation, or runtime integrity failure meets a configured trigger.

A `REJECT` decision and entry into `NIRODHA` are related but not synonymous: the policy defines which rejections require the runtime safe-state transition.

## C3. Decision input

At minimum, the Governor receives:

- candidate IR and schema version;
- candidate digest under a configured hash profile;
- invariant validation report;
- current policy bundle/version;
- runtime capability profile (device/backend/resource constraints);
- current state sequence and any active quarantine latch;
- confirmation evidence for gated operations;
- relevant context/evidence references with access and freshness metadata.

Missing mandatory fields must lead to a defined `DEFER` or `REJECT`, never a silent default acceptance.

## C4. Decision output

A Governor Decision Record SHOULD contain:

```ts
interface GovernorDecisionRecord {
  decisionId: string;
  candidateStateId: string;
  candidateDigest: string;
  decision: "ACCEPT" | "DEFER" | "REJECT" | "NIRODHA";
  reasonCodes: string[];
  invariantReportRef: string;
  policyBundleVersion: string;
  capabilityProfileVersion: string;
  approvedMappingVersion: string | null;
  decisionSequence: number;
  expiresAt: string | null;
}
```

A production implementation may add signatures, actor identity, trusted timestamps, or external audit references. Their absence must be recorded rather than implied.

## C5. Required decision order

The decision pipeline is ordered to prevent downstream layers from granting authority retroactively:

1. Parse and validate schema.
2. Reject non-finite, malformed, unsupported, or stale values.
3. Evaluate hard semantic invariants.
4. Evaluate epistemic/contradiction policy.
5. Evaluate action reversibility and confirmation binding.
6. Evaluate safety, accessibility, hardware, and capability policy.
7. Validate state transition and current NIRODHA/quarantine status.
8. If permitted, issue an authorization bound to the exact candidate and mapping version.
9. Emit an auditable decision event.
10. Only then may the authorized mapping be submitted to the renderer.

A failed step cannot be bypassed by a later layer. A renderer fallback can reduce capability or transition to a safe display; it cannot upgrade `DEFER` or `REJECT` to `ACCEPT`.

## C6. Decision transition rules

- `ACCEPT` is candidate-, scope-, policy-version-, and capability-version-specific.
- Any material mutation of the candidate after acceptance requires revalidation and a new decision.
- `DEFER` must not execute a protected action. Pending items must have explicit retention/expiry rules.
- `REJECT` must not be presented visually as successful completion.
- `NIRODHA` blocks ordinary state updates until the exit criteria in Section D are satisfied.
- If the Governor itself cannot make a reliable decision, the system must fail closed for protected actions and enter the configured safe path.

---

# D. NIRODHA State Contract

## D1. Purpose

NIRODHA represents a fail-safe state: the system stops making unsafe or unsupported semantic/action transitions instead of guessing. Its visual expression should communicate suspension and stabilization without presenting a false success signal.

The visual language is subordinate to the safety state. A calm-looking field is not evidence that the runtime is safe; safety depends on the Governor and runtime controls.

## D2. Separate action-stream revocation from visual settling

A literal immediate stop of all rendering updates conflicts with the requirement to damp motion toward a stable visual rest state. v0.1 therefore separates two channels:

1. **Semantic/action stream:** revoke or block unauthorized updates immediately.
2. **Safety-transition channel:** allow only a bounded, deterministic, pre-authorized transition to the safe rest state. This channel cannot originate new intent, resume a rejected action, or change policy authorization.

If no trusted safety-transition implementation is available, the fallback is a static safe frame, blank frame, or backend-native minimal state according to the configured policy. Do not rely on an unconstrained animation to reach safety.

## D3. Proposed state machine

```text
NORMAL
  | critical trigger
  v
QUARANTINED  -- immediately block ordinary updates/actions
  |
  | safe transition is supported and authorized
  v
SAFE_TRANSITION  -- bounded and deterministic visual damping only
  |
  | transition completes or times out
  v
SAFE_REST
  |
  | explicit recovery request + fresh validation + Governor approval
  v
RECOVERY_PENDING
  |
  | recovery conditions pass
  v
NORMAL
```

Any failure while quarantined or transitioning returns to `SAFE_REST` (or the configured static/blank fail-safe). No timeout or animation completion by itself authorizes a return to `NORMAL`.

## D4. Trigger conditions

The following are candidate triggers; exact thresholds and policy are versioned configuration:

- Governor `REJECT` where policy classifies the event as critical;
- confidence below a configured critical threshold;
- contradiction at/above a configured critical threshold;
- a hard invariant violation in an active pipeline;
- mismatched/stale authorization or a detected attempt to bypass the Governor;
- runtime integrity failure that makes the active state untrustworthy.

A `DEFER` does not automatically require NIRODHA in every case. Trigger severity must be policy-defined and recorded.

## D5. Entry actions

On entering `QUARANTINED`, the runtime MUST:

1. latch the reason and originating trace/state identifier;
2. block ordinary semantic and action updates;
3. revoke or invalidate pending authorizations affected by the trigger;
4. reject protected action execution;
5. prevent stale model output from replacing the safe state;
6. emit a decision/event record, subject to privacy and retention rules;
7. choose only a configured safe-transition or static fallback path.

## D6. Safe-transition constraints

A safe transition MUST be bounded by a maximum duration or step count, deterministic under the declared seed/configuration, and limited to approved presentation parameters (for example, reduce turbulence and motion amplitude). It MUST NOT:

- execute a user action;
- increase authority or infer new intent;
- change the semantic class to imply completion;
- bypass Governor validation;
- accept ordinary model updates before recovery;
- use intense flashing, uncontrolled strobing, or unbounded turbulence.

Exact damping curves, duration, residual particle behavior, and accessibility limits must be supplied by a versioned renderer safety profile. They are unresolved parameters in v0.1.

## D7. Safe-rest properties

`SAFE_REST` is a runtime status, not a semantic topology. Its contract is:

- ordinary semantic/action updates are blocked;
- no protected action is running because of the quarantined candidate;
- the visual output is static or follows an explicitly bounded safety profile;
- the system does not claim the request succeeded;
- the triggering reason and recovery requirement remain inspectable through an approved diagnostic channel;
- the state is observable in telemetry even if the visual renderer fails.

## D8. Exit and recovery

Exit from NIRODHA requires an explicit recovery path. At minimum:

1. identify and resolve the triggering condition;
2. construct a fresh candidate or revalidate the appropriate current state;
3. rerun schema, invariant, policy, and capability checks;
4. obtain a new Governor decision;
5. verify that no stale authorization or queued action can replay;
6. append the recovery event to the audit trail.

A user confirmation does not by itself clear NIRODHA. A timeout does not by itself clear NIRODHA.

---

# E. Verification Criteria

## E1. Verification levels

Verification must be reported at the layer actually tested. Passing a lower layer cannot be used as proof of a higher one.

| Level | Subject | Minimum evidence | Does not prove |
|---|---|---|---|
| `V0_SCHEMA` | Types, required fields, ranges, enums, non-finite rejection | Executed schema/validator tests with invalid fixtures | Semantic correctness or runtime behavior |
| `V1_SEMANTIC` | Invariant correctness and decision behavior | Positive, negative, and boundary fixtures; structured violation reports | That Renderer follows the approved state |
| `V2_GOVERNOR` | Authorization boundary, stale binding, override behavior | Integration tests through the actual Governor implementation | Actual GPU output fidelity unless observed |
| `V3_RENDER` | State-to-render mapping | Parameters read at renderer boundary and/or trusted GPU readback, with tolerances | Human interpretation |
| `V4_RUNTIME` | NIRODHA, lifecycle, resource release | Runtime event traces, resource ownership/release evidence, recovery tests | Universal memory erasure outside tested scope |
| `V5_HUMAN` | User interpretation and trust calibration | Pre-registered study protocol, response data, coding agreement, uncertainty analysis | Technical correctness of the pipeline by itself |

## E2. Required test classes

Every invariant and Governor transition should include:

- **Positive test:** valid candidate is handled as specified.
- **Negative test:** violated candidate is rejected/deferred and cannot bypass controls.
- **Boundary test:** exact threshold, just below, and just above.
- **Mutation test:** change one protected field after authorization; old authorization must no longer apply.
- **Determinism test:** same canonical input, policy/config versions, and seed produce the same decision/mapping within the declared deterministic scope.
- **Fault-injection test:** simulate malformed input, missing evidence, renderer initialization/readback failure, stale decision, and interrupted safety transition.

A test harness must test the actual implementation under test. A hard-coded expected result or a synthetic Boolean flag is not runtime evidence.

## E3. Q1 — Kinetic mapping verification

**Question:** Do spatial velocity and renderer-facing particle velocity conform to the declared mapping contract?

Preconditions:

- source velocity, units, coordinate frame, mapping version, and sample/tick are declared;
- renderer output or the real renderer-facing buffer can be inspected;
- tolerance `ε_v` is specified before execution.

For a strict 1:1 mapping in the same coordinate frame and unit:

\[
\Delta_v = \|v_{observed} - v_{expected}\|_2, \qquad PASS \iff \Delta_v \leq \epsilon_v
\]

If coordinate transforms, scaling, or unit conversion are intended, the contract must specify them explicitly and compare against the transformed expected value. “Scalar multiple of the expected vector” is not sufficient to prove 1:1 mapping.

Minimum cases: zero vector, positive/negative axes, non-axis-aligned vector, frame/unit conversion if supported, non-finite input, mismatched length/dimension, and observed buffer mismatch. If no trustworthy observation point exists, Q1 is `NOT_TESTABLE` rather than passed.

## E4. Q6 — Governor override sovereignty

**Question:** Can a model-originated command bypass or overwrite a policy decision or active NIRODHA latch?

Minimum integration cases:

1. Below, at, and above configured policy thresholds.
2. A destructive action with no confirmation remains in `HOLDING_ORBIT`; protected execution does not occur.
3. A valid confirmation is bound to the exact action; modifying action arguments invalidates it.
4. After a critical Governor decision, a subsequent ordinary model command cannot restore normal rendering or execute the blocked action.
5. A stale decision, altered candidate digest, changed policy version, or changed capability profile is rejected.
6. An invalid safety-transition command cannot weaken the safe state.
7. Observed renderer-facing state matches the state authorized by the Governor.

A red color or a visual warning alone is not evidence that the Governor override works. The proof must show the actual decision path, blocked action/command, authorization binding, and observed renderer state.

## E5. Q8 — Runtime lifecycle and wipe claims

Q8 must be split into separate claims:

- **Q8-A `DECAY_VERIFIED`:** an intensity/luminosity value follows its declared temporal function.
- **Q8-B `RESOURCE_RELEASE_VERIFIED`:** owned resources are actually released or detached according to the relevant runtime/API lifecycle.
- **Q8-C `MEMORY_SANITIZATION_VERIFIED`:** a precisely scoped data-removal/sanitization claim has evidence appropriate to the memory layer and threat model.

A formula such as `L(t) = L0 exp(-λt)` can verify Q8-A only. A flag set by the harness when `L < threshold` does not prove Q8-B or Q8-C. Deleting a JavaScript reference, clearing a cache entry, or calling a GPU resource destruction API also does not by itself prove that no copy exists in all runtime, driver, or hardware memory.

Before runtime tests, define a resource inventory with owner, memory domain, lifecycle API, expected release signal, retention period, and observable evidence. Report memory domains that cannot be inspected as `UNAVAILABLE` / `NOT_VERIFIED`; do not infer successful sanitization.

## E6. Fidelity metrics

### Semantic Fidelity (`F1`)

For a labeled golden corpus:

\[
F_1 = \frac{\text{correctly classified eligible cases}}{\text{all eligible cases}}
\]

Also report per-class precision/recall or confusion matrix. A single aggregate score must not conceal failure on destructive-action or critical-uncertainty cases. The corpus label policy and eligibility rules must be fixed before scoring.

### State-to-Render Consistency (`F2`)

For each parameter `j`, define a positive scale `s_j` and weight `w_j` before testing:

\[
\delta_j = \frac{|\hat{\theta}_j - \theta_j|}{s_j}, \quad
D = \sum_j w_j\delta_j, \quad
w_j \ge 0,\quad \sum_j w_j = 1
\]

Given a predeclared tolerance `D_max > 0`:

\[
F_2 = \max\left(0, 1 - \frac{D}{D_{max}}\right)
\]

The parameter set, unit conversions, scales, weights, sampling point, and `D_max` must be versioned and pre-registered. Hard invariants are **non-compensatory**: any hard invariant violation fails the conformance case regardless of a high aggregate `F2`.

### Human Interpretability (`F3`)

Report the rate of responses matching the pre-defined intended semantic class, per-class results, baseline/guess rate, sample characteristics, confidence intervals, and inter-rater agreement where open responses are coded. Cohen’s kappa may be reported for suitable categorical coding. Do not infer universal visual meaning from a single small or homogeneous sample.

## E7. Evidence record

Each executed test result SHOULD record:

```json
{
  "specVersion": "0.1",
  "testId": "Q6-04",
  "testLevel": "V2_GOVERNOR",
  "status": "PASS | FAIL | NOT_TESTABLE | UNAVAILABLE",
  "gitCommit": "<commit-or-UNAVAILABLE>",
  "testRunner": "<command-and-version>",
  "timestamp": "<RFC3339>",
  "fixtureId": "<fixture-id>",
  "candidateDigest": "<digest-or-UNAVAILABLE>",
  "policyBundleVersion": "<version>",
  "mappingVersion": "<version-or-null>",
  "expected": "<machine-readable expectation>",
  "observed": "<machine-readable observation>",
  "metrics": {},
  "failureReasons": [],
  "artifactRefs": []
}
```

The example is a report shape, not evidence that any test has run. Never fabricate a commit, output, measurement, or successful status. A file existing is not evidence that its tests executed; a test executing is not evidence that it passed; passing a test is not proof beyond its stated layer and scope.

## E8. Status promotion criteria

| Status | Required conditions |
|---|---|
| `DRAFT` | Contract is under discussion; open decisions remain. |
| `SPECIFICATION_READY` | Schema, invariants, failure semantics, and test criteria are precise enough to implement. |
| `COMPUTATIONALLY_VERIFIED` | V0/V1 tests have executed reproducibly for the declared scope. |
| `INTEGRATION_VERIFIED` | Actual Governor/Renderer path has been exercised with inspectable evidence. |
| `RUNTIME_VERIFIED` | Runtime lifecycle/safety behaviors have been exercised under the declared platform and failure model. |
| `NORMATIVE_APPROVAL_PENDING` | Evidence package is available for review; not yet approved. |
| `NORMATIVE` | Explicit architecture/governance approval recorded with version and scope. |

No status is implied by this document. At present, this document itself remains `DRAFT — NOT NORMATIVE`.

---

# F. Open decisions required before specification freeze

The following decisions are intentionally not guessed in v0.1. Each must receive an owner, rationale, chosen value, and test before freeze:

1. **Topology registry:** exact `Topology` enum and definitive membership of `Σ_closed`.
2. **Confidence semantics:** whether `confidence` is model-reported, externally assessed, calibrated, or method-dependent; calibration protocol and evidence format.
3. **Contradiction policy:** definition of contradiction classes, threshold(s) `θx`, and which classes cause `DEFER`, `REJECT`, or NIRODHA.
4. **Action taxonomy:** what counts as `DESTRUCTIVE`, how action digests are constructed, confirmation authority, expiry, and revocation.
5. **NIRODHA triggers:** critical thresholds, `REJECT` severity mapping, transition duration/step bound, static fallback, and recovery rules.
6. **Renderer fidelity profile:** parameter sampling points, per-parameter tolerances, coordinate frames/units, `s_j`, weights, and `D_max`.
7. **Hash profile:** canonical serialization, digest algorithm, versioning, and any interoperability policy. BLAKE3-256/SHA-256 discussions must be resolved explicitly.
8. **Runtime/resource scope for Q8:** memory domains and threat model for each claim; supported runtime/driver observability; retention/deletion proof requirements.
9. **Schema artifact:** selected JSON Schema/runtime validator, identifier formats, extension policy, and schema CI tests.
10. **Phase compatibility:** adapter and conformance plan for any frozen Phase 0.x Visual State Contract; this draft does not authorize changing its ranges or behavior.

---

# G. Minimum acceptance checklist for v0.1 review

Before this document can be marked `SPECIFICATION_READY`, reviewers must confirm all of the following:

- [ ] Canonical IR Envelope is clearly distinguished from the P8 core and from renderer-specific parameters.
- [ ] Every required field has a type, range/enum, and source/owner.
- [ ] `confidence` is stored once and mapped consistently to `e_c`.
- [ ] `Σ_closed` and the topology registry are defined.
- [ ] Destructive operations require action-bound confirmation and subsequent Governor reevaluation.
- [ ] `DEFER`, `REJECT`, and `NIRODHA` have distinct, testable meanings.
- [ ] A Governor decision binds to candidate digest, policy version, capability profile, and mapping version.
- [ ] NIRODHA blocks semantic/action updates while permitting only bounded safety-transition behavior.
- [ ] Hash verification is separate from schema/invariant validation.
- [ ] Q1, Q6, and Q8 contain positive, negative, boundary, and failure-path tests.
- [ ] Q8 resource release and memory sanitization are treated as different claims.
- [ ] Verification status is reported at the actual evidence level; unsupported claims use `NOT_VERIFIED`, `NOT_TESTABLE`, or `UNAVAILABLE`.
- [ ] Open decisions in Section F have owners or are explicitly retained as blockers.

## Proposed next step

Review and resolve the open decisions in Section F, beginning with the topology registry / `Σ_closed`, confidence semantics, and NIRODHA transition contract. Then create the executable JSON Schema and invariant validator plus a negative-test fixture set in a research/specification branch. Keep this document and its tests separate from any claim of production implementation until the real Governor and Renderer paths can be exercised.
