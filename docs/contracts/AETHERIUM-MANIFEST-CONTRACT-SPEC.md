# Aetherium Manifest Contract Specification v0.1

## 1. Status

* **Document Version**: v0.1
* **Status**: SPECIFICATION DRAFT — READY FOR REVIEW
* **Implementation Target**: None (Specification Design Only)
* **Predecessor Standards**: Presence IR Spec v0.1, Governor Spec v0.1
* **Upstream Producer**: Perceptual Compiler
* **Downstream Consumer**: Governor B (for Candidate) / Renderer (for Governed Contract)

---

## 2. Purpose

The Aetherium Manifest Contract defines the formal wire-contract specification produced downstream by the Perceptual Compiler and consumed by Governor B (as a Candidate) and ultimately the Renderer (as a Governed Manifest Contract).

It translates abstract, multi-dimensional semantic state vectors (Presence IR) into stable, hardware-agnostic perceptual and physical manifestation parameters. It establishes a deterministic boundary between high-level cognitive intent and local rendering mechanics.

---

## 3. Architectural Position

The canonical pipeline of the Aetherium Light Manifest architecture is structured as follows:

```
User Intent
    ↓
Intent Interpreter / AGNS
    ↓
PresenceVectorCandidate
    ↓
Governor A
    ↓
PresenceIREnvelope
    ↓
Perceptual Compiler
    ↓
ManifestContractCandidate
    ↓
Governor B
    ↓
Governed ManifestContract
    ↓
Renderer
```

### Architectural Guarantees & Invariants
* The **Renderer MUST NOT** consume raw user intent.
* The **Renderer MUST NOT** consume `PresenceVectorCandidate`.
* The **Renderer MUST NOT** consume ungoverned `ManifestContractCandidate`.
* The **Renderer MAY ONLY** consume a fully governed `GovernedManifestContract` carrying a valid, verified `contract_hash` issued by Governor B.

---

## 4. Terminology

* **Perceptual Compiler**: The core synthesis engine that transforms upstream `PresenceIREnvelope` payloads into perceptual physical manifestation instructions (`ManifestContractCandidate`).
* **ManifestContractCandidate**: An ungoverned, unvalidated, and potentially unsafe draft contract emitted directly by the Perceptual Compiler.
* **GovernedManifestContract**: A validated, resource-adapted, perceptually safe, and policy-evaluated contract certified by Governor B, bearing an integrity `contract_hash`.
* **Governor B**: The downstream governance authority responsible for device profile adaptation, resource budgeting, photosensitivity/flicker safety, and perceptual safety enforcement.
* **Renderer**: The physical or digital rendering subsystem (e.g. Canvas 2D, WebGPU, spatial volumetric display) that converts governed manifest parameters into perceivable light, motion, and form.
* **Renderer Profile**: A device-specific capability descriptor provided to Governor B detailing hardware resource constraints (e.g. max particle count, target frame rate, memory budget).

---

## 5. Candidate vs Governed Contract

| Attribute | ManifestContractCandidate | GovernedManifestContract |
| :--- | :--- | :--- |
| **Origin** | Emitted by Perceptual Compiler | Emitted by Governor B |
| **Safety Certification** | Unverified / Potentially Unsafe | Perceptually & Resource Safe |
| **Resource Allocation** | Requested / Unbounded | Clamped / Dampened / Bound |
| **Contract Integrity Hash** | Absent / Null | Mandatory (`contract_hash` present) |
| **Consumer Acceptance** | Consumed ONLY by Governor B | Consumed by Renderer / Transport |

> **INVARIANT:** Renderer execution MUST reject any incoming contract payload where `governance.action` is missing or where `contract_hash` fails BLAKE3-256 verification.

---

## 6. Contract Structure

The Manifest Contract consists of 11 distinct conceptual groups serialized as a canonical JSON object:

```json
{
  "manifest_contract_version": "0.1.0",
  "identity": { ... },
  "lineage": { ... },
  "semantic_state": { ... },
  "morphology": { ... },
  "motion": { ... },
  "appearance": { ... },
  "resource_budget": { ... },
  "accessibility": { ... },
  "uncertainty": { ... },
  "governance": { ... },
  "contract_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 7. Field Definitions

All fields defined in the Manifest Contract schema are categorized by status: `CANONICAL`, `PROVISIONAL`, `IMPLEMENTATION-SUPPORTED`, or `OPEN`.

### 7.1 Identity Group (`identity`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `manifest_id` | string | Yes | UUID v4 | Unique identifier for this manifest frame instance | Perceptual Compiler | Governor B / Renderer | Governor A / B | CANONICAL |
| `sequence_tick` | string | Yes | uint64 decimal string | Strictly monotonic tick counter for manifest frame sequence | Perceptual Compiler | Governor B / Renderer | Governor A | CANONICAL |
| `timestamp_ns` | string | Yes | uint64 decimal string | Unix epoch timestamp in nanoseconds when candidate was compiled | Perceptual Compiler | Governor B / Renderer | Governor A | CANONICAL |

### 7.2 Lineage Group (`lineage`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `parent_presence_id` | string | Yes | UUID v4 / string | Direct reference to the upstream Presence IR `trace_id` | Perceptual Compiler | Governor B | Governor A | CANONICAL |
| `presence_version` | string | Yes | semver string | Semver of the upstream Presence IR specification | Perceptual Compiler | Governor B | Governor A | CANONICAL |
| `parent_manifest_id` | string / null | Yes | UUID v4 / null | Previous manifest ID in continuous stream (null for initial frame) | Perceptual Compiler | Governor B / Renderer | Governor B | PROVISIONAL |

### 7.3 Semantic State Group (`semantic_state`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `phase` | string | Yes | `IDLE`, `LISTENING`, `PROCESSING`, `RESPONDING`, `WARNING`, `ERROR`, `NIRODHA` | Macroscopic operational phase inherited from Presence IR | Perceptual Compiler | Governor B / Renderer | Governor A | CANONICAL |
| `intent_class` | string | Optional | ASCII string | High-level intent classification label passed downstream | Perceptual Compiler | Governor B / Renderer | Governor A | PROVISIONAL |

### 7.4 Morphology Group (`morphology`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `primary_shape` | string | Yes | `sphere`, `triangle`, `spiral`, `line`, `wave`, custom | Macro geometric layout guideline for particle field synthesis | Perceptual Compiler | Governor B / Renderer | Governor B | PROVISIONAL |
| `shape_purity` | number | Optional | `0.0` .. `1.0` | Degree of adherence to primary shape vs field dispersion | Perceptual Compiler | Renderer | Governor B | PROVISIONAL |
| `symmetry_order` | number | Optional | integer `>= 0` | Radial or axial symmetry order multiplier | Perceptual Compiler | Renderer | Governor B | OPEN |

### 7.5 Motion Group (`motion`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `velocity_scale` | number | Yes | `0.0` .. `1.0` | Global speed multiplier for kinetic particle movement | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `turbulence` | number | Yes | `0.0` .. `1.0` | Max Perlin/Simplex noise displacement amplitude | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `flow_direction` | number | Optional | `0.0` .. `360.0` | Directional flow angle in degrees (vector field bias) | Perceptual Compiler | Renderer | Governor B | PROVISIONAL |
| `oscillation_hz` | number | Optional | `0.0` .. `120.0` | Frequency of macro pulse or wave oscillation | Perceptual Compiler | Governor B / Renderer | Governor B | PROVISIONAL |
| `transition_duration_ms` | number | Optional | `>= 0` | Guidance duration for interpolating to this target state | Perceptual Compiler | Renderer | Governor B | PROVISIONAL |

### 7.6 Appearance Group (`appearance`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `primary_hue` | number | Yes | `0.0` .. `360.0` | Dominant perceptual color angle on HSL color wheel | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `luminance` | number | Yes | `0.0` .. `1.0` | Perceptual lightness/brightness scale | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `density` | number | Yes | `0.0` .. `1.0` | Spatial tightness and visual mass field concentration | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `coherence` | number | Yes | `0.0` .. `1.0` | Physical attraction/stiffness towards structural target | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `chroma_spread` | number | Optional | `0.0` .. `180.0` | Secondary hue variance / color spectrum spread | Perceptual Compiler | Renderer | Governor B | OPEN |

### 7.7 Resource Budget Group (`resource_budget`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `requested_particle_budget` | string | Yes | uint64 decimal string | Target count of particles requested for manifestation | Perceptual Compiler | Governor B | Governor B | CANONICAL |
| `effective_particle_budget` | string | Yes (in Governed) | uint64 decimal string | Governor B certified particle limit for renderer execution | Governor B | Renderer | Governor B | CANONICAL |
| `render_cost_tier` | string | Optional | `LOW`, `MEDIUM`, `HIGH`, `ULTRA` | High-level complexity request for shader/effect pipelines | Perceptual Compiler | Governor B / Renderer | Governor B | PROVISIONAL |
| `max_frame_rate` | number | Optional | `1.0` .. `240.0` | Target rendering frame rate cap (FPS) | Perceptual Compiler | Governor B / Renderer | Governor B | OPEN |

### 7.8 Accessibility Group (`accessibility`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `reduced_motion_requested` | boolean | Yes | `true` / `false` | Request for dampened kinetic transitions and lower turbulence | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `photosensitivity_risk_level` | string | Yes | `LOW`, `MEDIUM`, `HIGH` | Evaluated risk rating for rapid luminance/flicker shifts | Perceptual Compiler | Governor B | Governor B | CANONICAL |
| `max_flicker_frequency_hz` | number | Optional | `0.0` .. `60.0` | Safety threshold for high-frequency strobe/flicker guard | Governor B | Renderer | Governor B | PROVISIONAL |

### 7.9 Uncertainty Group (`uncertainty`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `confidence` | number | Yes | `0.0` .. `1.0` | Confidence of upstream semantic/cognitive interpretation | Upstream / Compiler | Governor B / Renderer | Governor A / B | CANONICAL |
| `uncertainty` | number | Yes | `0.0` .. `1.0` | Uncertainty introduced by perceptual compilation process | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |
| `coherence` | number | Yes | `0.0` .. `1.0` | Internal physical consistency of perceptual manifestation | Perceptual Compiler | Governor B / Renderer | Governor B | CANONICAL |

### 7.10 Governance Metadata Group (`governance`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `governance_action` | string | Yes (in Governed) | `VALIDATE`, `CLAMP`, `DAMPEN`, `FALLBACK`, `REJECT`, `SUSPEND`, `TERMINATE` | Evaluated action issued by Governor B | Governor B | Renderer | Governor B | CANONICAL |
| `policy_version` | string | Yes | semver string | Active Governor B safety policy version applied | Governor B | Renderer | Governor B | CANONICAL |
| `applied_modifications` | array of strings | Optional | list of field names | List of fields modified/clamped/dampened by Governor B | Governor B | Audit Log / Renderer | Governor B | PROVISIONAL |

### 7.11 Contract Hash (`contract_hash`)

| Field | Type | Required | Range | Meaning | Producer | Consumer | Governance Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `contract_hash` | string | Yes (in Governed) | 64 hex characters | BLAKE3-256 canonical integrity digest of governed fields | Governor B | Renderer | Governor B | CANONICAL |

---

## 8. Semantic vs Renderer-local Boundary

The Manifest Contract MUST contain ONLY stable semantic and perceptual parameters. Renderer-local implementation mechanics MUST remain completely local to the renderer instance.

```
Semantic Intent (Presence IR)
        ↓
Manifest Contract (Perceptual Abstraction)
        ↓
Renderer-Local Realization (Hardware Mechanics)
```

### Prohibited Implementation-Only Details
The following parameters are strictly **forbidden** from being placed in the Manifest Contract:
* Raw particle coordinate or velocity object arrays (`particle[i].x`, `particle[i].y`)
* Per-frame particle positions or memory pointers
* Random seeds for individual particle instances
* HTML5 Canvas context state (`ctx.fillStyle`, `ctx.globalCompositeOperation`)
* WebGPU / WebGL buffer pointers, vertex arrays, or pipeline state objects
* Implementation-specific shader constant uniforms (`u_resolution`, `u_time`)

### Conversion Example
* **Manifest Contract Semantic Parameter**: `density = 0.75`
* **Renderer-Local Derived Realization**:
  - `particle_count = floor(effective_particle_budget * density) = 15,000`
  - `spawn_rate = 500 / sec`
  - `alpha_multiplier = 0.85`
  - `spatial_dispersion_radius = 240px`

---

## 9. Morphology

Morphology defines the macroscopic geometric field guide for particle layout and structural formation.

### Vocabulary Status Breakdown

| Morphology | Status | Description |
| :--- | :--- | :--- |
| `sphere` | **PROVISIONAL** | Radial spherical coordinate field (derived from Phase 0.1 prototype). |
| `triangle` | **PROVISIONAL** | Three-sided polygonal vector coordinate field (derived from Phase 0.1 prototype). |
| `spiral` | **PROVISIONAL** | Logarithmic radial spiral coordinate pathing (derived from Phase 0.1 prototype). |
| `line` | **PROVISIONAL** | Linear distribution field along horizontal/vertical axes (derived from Phase 0.1 prototype). |
| `wave` | **PROVISIONAL** | Sinusoidal continuous wave distribution field (derived from Phase 0.1 prototype). |

> **ARCHITECTURE RULE:** Phase 0.1 morphology vocabulary is designated as **PROVISIONAL / PROTOTYPE VOCABULARY**. No prototype morphology shall be silently promoted to CANONICAL without formal architectural ratification.

---

## 10. Motion

Motion parameters represent physical kinetic intent rather than renderer frame-by-frame interpolation algorithms.

* **Semantic Motion Intent**: Declares target velocity scales, noise/turbulence ceilings, and directional flow vectors.
* **Renderer Interpolation (Local)**: The renderer maintains its own transient state (e.g. exponential smoothing, linear interpolation `lerp`, spring physics) to smoothly transition current render state towards the target Manifest Contract state over time.

---

## 11. Appearance

Appearance parameters capture perceptual visual meaning independent of concrete color space encodings.

* **Perceptual Meaning First**: High-level visual qualities (`primary_hue`, `luminance`, `density`, `coherence`) describe perceptual experience.
* **Representation Flexibility**: The renderer translates perceptual appearance values into device-supported color spaces (e.g., sRGB, Display P3, Rec.2020) and pipeline formats (HSL, HSV, RGB floats).

---

## 12. Resource Budget

Resource budgeting decouples requested semantic complexity from physical hardware capabilities.

```
Manifest Contract Candidate
  (Requests: requested_particle_budget = 1,000,000)
        ↓
Governor B + Target Renderer Profile
  (Profile Cap: max_particles = 20,000)
        ↓
Governed Manifest Contract
  (Effective: effective_particle_budget = 20,000, Action = DAMPEN)
```

* **Requested Resource Budget**: Set by Perceptual Compiler based on intent complexity.
* **Renderer Profile**: Device-specific input provided to Governor B detailing hardware limits.
* **Effective Resource Budget**: Certified boundary emitted in Governed Manifest Contract.

---

## 13. Accessibility / Perceptual Safety

The Manifest Contract exposes perceptual requirements necessary for Governor B safety evaluation.

* **Manifest Requirements**: Includes flags like `reduced_motion_requested` and evaluated `photosensitivity_risk_level`.
* **Governance Policy Separation**: Safety limits (e.g., maximum flicker frequency of 3Hz for photosensitive epilepsy prevention) are defined within Governor B policy rulesets, NOT hardcoded into manifest instances.

---

## 14. Uncertainty / Confidence / Coherence

To prevent redundancy and ambiguity, the three honesty and consistency metrics are defined with distinct semantic scopes:

1. **`confidence`**: Measure of accuracy and certainty of the upstream cognitive/semantic intent interpretation (`0.0` .. `1.0`).
2. **`uncertainty`**: Measure of noise or loss introduced during the perceptual compilation transformation from Presence IR to Manifest Contract (`0.0` .. `1.0`).
3. **`coherence`**: Measure of internal physical consistency and structural tightness of the compiled perceptual manifestation (`0.0` .. `1.0`).

> **NOTE:** Exact mathematical formulation and formulaic relationships between these three values remain **OPEN / TBD**.

---

## 15. Governance Metadata

Governed Manifest Contracts MUST include sufficient provenance and metadata to trace execution lineage back to upstream Presence IR without duplicating Governor A semantic fields.

* **Lineage Tracking**: Includes `parent_presence_id` and `parent_manifest_id`.
* **Governor B Attestation**: Includes `governance_action` (`VALIDATE`, `CLAMP`, `DAMPEN`, etc.), `policy_version`, and `applied_modifications`.

---

## 16. Governor B Actions

Governor B evaluates incoming `ManifestContractCandidate` objects and emits a `GovernedManifestContract` stamped with exactly one action from the closed 7-action vocabulary:

| Action | Domain Impact & Description |
| :--- | :--- |
| **VALIDATE** | Candidate complies with all resource, accessibility, and safety budgets without adjustment. |
| **CLAMP** | Individual field bounds exceeded and bounded to schema limits (e.g., `luminance: 1.2` → `1.0`). |
| **DAMPEN** | Overall resource/perceptual budget scaled down for hardware limits (e.g., particles `1,000,000` → `20,000`). |
| **FALLBACK** | Candidate structurally invalid or unsafe; replaced with canonical safe resting manifest (`IDLE`). |
| **REJECT** | Severe policy violation; candidate suppressed, no governed frame emitted. |
| **SUSPEND** | Temporary safety interlock or resource hold; frame emission paused. |
| **TERMINATE** | Critical safety breach or NIRODHA kill-switch; trace permanently closed. |

> **GOVERNANCE BOUNDARY:** Governor B actions MUST NOT alter semantic intent. Semantic state transitions (e.g. `RESPONDING` → `NIRODHA`) belong strictly to Governor A.

---

## 17. Canonical Serialization

To produce a deterministic binary representation for hashing, Governed Manifest Contracts MUST adhere to Canonicalization Profile v0.1:

1. **JSON Key Ordering**: Lexicographically sorted ASCII order for all key-value pairs.
2. **Encoding**: UTF-8 character encoding.
3. **Whitespace**: Elimination of all unquoted whitespace (compact JSON string).
4. **Floating Point Precision**: Numeric floating point numbers rounded to 6 decimal places (`precision_dp = 6`).
5. **uint64 Transport**: Transported as base-10 decimal strings.

---

## 18. Integrity Hash

* **Algorithm**: `BLAKE3-256` producing a 32-byte (64 hex character) cryptographic digest.
* **Hash Input Boundary**: Computed over the canonical serialized representation of all fields in the `GovernedManifestContract` EXCEPT the `contract_hash` key itself.
* **Verification**: Renderers MUST recompute and verify `contract_hash` prior to rendering.

---

## 19. Versioning

The Manifest Contract specification uses Semantic Versioning (`manifest_contract_version` = `MAJOR.MINOR.PATCH`):

* **MAJOR**: Breaking wire-contract changes (e.g. field removals, structural group renames, type changes).
* **MINOR**: Backward-compatible additive changes (e.g. adding new optional fields, ratifying new canonical morphologies).
* **PATCH**: Clarifications, documentation updates, or non-wire specification corrections.

---

## 20. Phase 0.1 Relationship

Phase 0.1 Visual State Contract is a lightweight browser prototype precursor.

```
Phase 0.1 Visual State (Prototype Precursor)
        │ [Conceptual Mapping Only]
        ▼
Future Canonical Pipeline (Presence IR → Manifest Contract)
```

### Conceptual Group Mapping

| Phase 0.1 Prototype Field | Manifest Contract Conceptual Group |
| :--- | :--- |
| `phase` | `semantic_state` |
| `shape` | `morphology` |
| `hue` | `appearance` |
| `energy` | `motion` |
| `density` | `appearance` / `resource_budget` |
| `turbulence` | `motion` |
| `coherence` | `appearance` / `uncertainty` |
| `confidence` | `uncertainty` |

> **CRITICAL BOUNDARY:** Phase 0.1 Visual State is **NOT** a Manifest Contract. No field-by-field automated migration, runtime code change, or schema modification is introduced in Phase 0.1.

---

## 21. Security / Safety Invariants

1. **Renderer Insulation**: Renderer MUST reject ungoverned candidates or contracts with invalid `contract_hash`.
2. **Deterministic Governance**: Identical candidate + renderer profile + policy version MUST yield identical governed contract output.
3. **Immutability**: Governor B evaluation MUST NOT mutate candidate inputs in-place; a new `GovernedManifestContract` must be emitted.
4. **Photosensitivity Interlock**: Rapid luminance oscillation exceeding policy thresholds MUST be dampened or rejected by Governor B.

---

## 22. Open Questions

The following specification design questions remain explicitly **OPEN / UNRESOLVED** and are tracked for post-v0.1 ratification:

1. **Exact `resource_budget` Schema**: Should particle budget be specified purely as scalar counts or include spatial distribution density functions?
2. **Renderer Profile Source**: How is device renderer capability profile transmitted to Governor B (e.g. static configuration file vs dynamic WebGL capability handshake)?
3. **Accessibility Policy Ownership**: Should user accessibility preferences (e.g., reduced motion) be injected at AGNS intent level or directly into Governor B profile?
4. **Motion Sensitivity Location**: Does `motion_sensitivity` policy belong inside the Manifest Contract payload or as an isolated policy parameter in Governor B?
5. **Numeric Semantics of Uncertainty**: What is the formal mathematical formula relating `confidence`, `uncertainty`, and `coherence`?
6. **Manifest Lineage Depth**: Does Manifest Contract require a multi-parent lineage array similar to future Presence IR, or is single-parent `parent_manifest_id` sufficient?
7. **`contract_hash` Input Boundary**: Should timestamp `timestamp_ns` be included in the hashed payload or excluded to allow re-evaluation caching?
8. **Trace `state_version` Tracking**: Does Manifest Contract require its own monotonic `manifest_version_tick` separate from Presence IR `sequence_tick`?

---

## 23. References

1. `AETHERIUM-PRESENCE-IR-SPEC.md` — Aetherium Presence Intermediate Representation Specification v0.1
2. `AETHERIUM-GOVERNOR-SPEC.md` — Aetherium Governor Specification v0.1
3. `PHASE-0.1-VISUAL-STATE-CONTRACT.md` — Aetherium Visual State Contract — Phase 0.1 Documentation
4. `contracts/visual-state.schema.json` — Phase 0.1 Visual State JSON Schema
