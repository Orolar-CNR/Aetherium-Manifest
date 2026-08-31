# Architecture Decision Record: Turbulence Domain & Downstream Safety Ceiling Separation

* **Title**: Turbulence Domain & Downstream Safety Ceiling Separation
* **Status**: DRAFT — PENDING RATIFICATION
* **Date**: 2026-08-31
* **Context**: Identified in [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.2. Manifest Contract v0.1 drafts define semantic turbulence in the normalized float range `[0.0, 1.0]`, while Phase 0.1 prototype normalizer clamps turbulence at a safety ceiling of `0.65` to prevent visual disintegration or harsh flickering.

---

## Decision Drivers

1. **Semantic Expressiveness**: Upstream intent and semantic models require the full normalized `[0.0, 1.0]` mathematical range to represent high-energy or intense chaotic fluid phenomena.
2. **Perceptual & Hardware Safety**: Downstream renderers and display devices (governed by Governor B) must enforce physical safety limits (photosensitivity, visual stability, hardware performance constraints) without distorting upstream intent definition.
3. **Architectural Decoupling**: Upstream intent layers must not be hardcoded with renderer-specific or display-tier safety constraints.

---

## Evaluation of Options

### Option A: Global Clamping at 0.65 Across All Layers
* **Description**: Restrict the canonical `turbulence` schema definition everywhere to `[0.0, 0.65]`.
* **Pros**: Eliminates range mismatch.
* **Cons**: Improperly folds downstream rendering safety limits into canonical upstream intent semantics; artificial ceiling limits expressiveness.

### Option B: Unrestricted 1.0 Passed Directly to Renderer
* **Description**: Allow `turbulence` values up to `1.0` to reach the particle renderer directly without downstream safety intervention.
* **Pros**: Unconstrained output.
* **Cons**: Risk of extreme particle instability, visual artifacting, or violation of photosensitivity guidelines.

### Option C: Dual-Layer Separation (Semantic Domain vs. Downstream Safety Ceiling)
* **Description**: Define canonical semantic turbulence as `[0.0, 1.0]` across Presence IR and Manifest Contract. Enforce safety ceilings (such as `0.65` in reference profile or device-dependent limits) downstream at the Governor B / Renderer Adapter boundary.
* **Pros**: Preserves semantic intent purity (`[0.0, 1.0]`); respects Governor B authority over perceptual safety and device capabilities; clear separation of concerns.
* **Cons**: Requires explicit mapping transform at the Governor B / Renderer boundary.

---

## Recommended Lean

**Option C (Dual-Layer Separation)** is the recommended path for PR B Contract Ratification.

* **Upstream Semantic Range**: Canonical `turbulence` ∈ `[0.0, 1.0]` (Presence IR & Manifest Contract).
* **Downstream Safety Ceiling**: Governor B / Renderer Adapter applies profile-specific or tier-specific scaling/clamping (e.g., max effective manifestation turbulence = `0.65` for default Canvas2D/WebGPU reference profiles).

---

## Consequences

### If Accepted:
- Presence IR and Manifest Contract specifications will explicitly state `turbulence` ∈ `[0.0, 1.0]`.
- Governor B specifications will be updated to explicitly define downstream perceptual clamping / transfer function logic for turbulence according to active device safety profiles.
- Phase 0.1 reference renderer clamping behavior (`0.65`) will be formally categorized as a reference implementation profile constraint, not a global semantic limit.

### If Rejected:
- Upstream schemas will remain restricted to `0.65`, limiting future high-capability hardware rendering modes.

---

## Out of Scope

- Implementing dynamic transfer functions in `webgpu-renderer.js` prior to Phase 1.
- Altering existing `visual-state.js` test cases in Phase 0.1.

---

## References

- [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.2
- [Governor v0.1 Spec](../governance/AETHERIUM-GOVERNOR-SPEC.md)
- [Manifest Contract v0.1 Spec](../contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md)
