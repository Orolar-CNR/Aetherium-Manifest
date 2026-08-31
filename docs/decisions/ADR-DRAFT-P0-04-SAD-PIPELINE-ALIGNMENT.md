# Architecture Decision Record: SAD Pipeline Architecture Alignment

* **Title**: System Architecture Document (SAD) Execution Pipeline Alignment
* **Status**: DRAFT — PENDING RATIFICATION
* **Date**: 2026-08-31
* **Context**: Identified in [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.4. Macro-level pipeline representations in SAD v4.2 §2 omit intermediate compiler and governance stages defined in downstream child specifications (`Presence IR v0.1`, `Governor v0.1`, and `Manifest Contract v0.1`).

---

## Decision Drivers

1. **Architectural Authority Hierarchy**: As the top-level architectural authority, SAD v4.2 must accurately reflect the complete sequence of intermediate transformations without contradicting child specification boundaries.
2. **Governance Enforcement Transparency**: Clearly delineating Governor A (semantic policy/validity) and Governor B (perceptual safety/device tier) in the main pipeline diagram is critical for system safety compliance.
3. **Traceability**: Ensuring single-parent trace ID propagation and lineage verification across every stage from input intent to GPU rendering.

---

## Evaluation of Options

### Option A: Retain Abstract Macro Pipeline Diagram in SAD
* **Description**: Keep SAD §2 diagram in high-level simplified form (`Intent → Presence IR → Manifest Contract → Renderer`).
* **Pros**: Simple high-level overview.
* **Cons**: Obscures Governor A and Governor B split; creates confusion about where `Perceptual Compiler` and `PresenceIREnvelope` exist in the runtime sequence.

### Option B: Expand SAD Execution Pipeline Sequence
* **Description**: Explicitly align SAD v4.2 §2 pipeline diagram and narrative to reference the exact, normative governed sequence established across child specifications.
* **Pros**: Complete cross-document harmony; unambiguous pipeline authority flow; clear delineation of Governor A vs Governor B.
* **Cons**: Minor update required to SAD v4.2 §2 diagram text.

---

## Recommended Lean

**Option B (Expand SAD Execution Pipeline Sequence)** is the recommended path for PR B Contract Ratification.

### Ratified Pipeline Sequence Alignment

```text
User Intent / Semantic Input
             ↓
     AETH Compiler
             ↓
  PresenceVectorCandidate
             ↓
        Governor A
   (Semantic validity, policy_risk verification, NIRODHA check)
             ↓
    PresenceIREnvelope
             ↓
    Perceptual Compiler
             ↓
 ManifestContractCandidate
             ↓
        Governor B
   (Perceptual safety, flicker policy, device performance tiering)
             ↓
 GovernedManifestContract
             ↓
  Renderer / Manifestation Runtime
   (WebGPU Compute Shaders / Canvas2D Reference)
```

---

## Consequences

### If Accepted:
- SAD v4.2 §2 pipeline diagram and narrative will be updated in PR B to include Governor A, Governor B, `PresenceIREnvelope`, and `Perceptual Compiler`.
- The SAD authority hierarchy will remain intact while fully incorporating child specification sequence details.
- Developer and auditor clarity will be significantly improved regarding where semantic vs perceptual governance occurs.

### If Rejected:
- SAD §2 will remain high-level and abstract, requiring readers to cross-reference multiple child specifications to reconstruct the true execution sequence.

---

## Out of Scope

- Modifying the underlying responsibilities of Governor A or Governor B.
- Implementation of Phase 1 Presence Runtime execution classes.

---

## References

- [Contract Consistency Matrix v0.1](../architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md) §6.4
- [SAD v4.2 Spec](../architecture/AETHERIUM-MANIFEST-SAD-v4.2.md)
- [Governor v0.1 Spec](../governance/AETHERIUM-GOVERNOR-SPEC.md)
- [Manifest Contract v0.1 Spec](../contracts/AETHERIUM-MANIFEST-CONTRACT-SPEC.md)
