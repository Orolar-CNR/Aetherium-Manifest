---
title: "Phase 1 Presence IR Integration Planning v0.1"
document_id: "48173"
document_type: "Technical Research Note"
status: "RESEARCH CANDIDATE — NOT CANONICAL"
created: "2026-10-11"
intended_repository_path: "docs/research/PHASE-1-PRESENCE-IR-INTEGRATION-PLANNING-v0.1.md"
implementation_authorized: false
creator_approval_required: true
---

# Phase 1 Presence IR Integration Planning v0.1

**Document ID:** 48173  
**Decision profile:** CEA-DVP, limited to the protocol text supplied in the decision request  
**Authority:** Research / Planning only; does not ratify contracts or authorize runtime changes  
**Scope:** AETHERIUM-GENESIS / Aetherium Manifest — Phase 1 planning  

## A. Decision Summary

**Decision:** `ACCEPTED_WITH_LIMITATIONS`

**Scope:** Accept the planning objective and candidate architecture for investigating Presence IR integration. This decision does not authorize edits to canonical contracts, `runtime/visual-state.js`, WebGPU shaders, or other runtime code. It does not ratify a new definition of 8D Presence IR.

**Truth Classification:** `MIXED`
- `VERIFIED_WITHIN_REVIEWED_ARCHIVE`: The archived Presence IR specification declares a `PresenceVector` with eight numeric fields; the source files and tests listed in Evidence Record exist in the reviewed archive.
- `INFERRED`: A separate manifestation mapping boundary is the appropriate candidate location for translating governed state into renderer-safe parameters.
- `UNVERIFIED`: Whether the reviewed archive matches repository revision `875d230b77f243cc7614982b7306ec8295e11231`; the complete normative semantics and ranges of all eight fields; any 8D-to-particle mapping; real-browser WebGPU execution, performance, and perceptual validity.

**Implementation Status:** `DEFERRED` — no implementation changes were made.

**Architecture Status:** `VALID AS A CANDIDATE, WITH LIMITATIONS` — the separation of semantic governance from manifestation is consistent with the reviewed architecture. Directly wiring a supposed generic “8D” vector into the current shader is not yet justified.

**Verification Status:** `PARTIALLY VERIFIED` — `npm test` passed against the supplied archive. These tests do not constitute proof of GPU execution in a browser, hardware performance, or perceptual validity.

**Evidence Sufficiency:** `SUFFICIENT FOR PHASE 1 PLANNING ONLY`; insufficient for canonical contract changes, runtime implementation, production readiness, or claims of perceptual correctness.

**Creator Approval Required:** `YES` — see Section H.

## B. Claims Accepted

Only the following claims are supported by identifiable evidence in the reviewed archive or by the explicit project constraints in the request.

1. **Presence IR v0.1 already declares eight `PresenceVector` fields.** The archived `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md` declares `x`, `y`, `z`, `phase`, `confidence`, `energy`, `coherence`, and `policy_risk`, each typed as `number` in its TypeScript wire-contract sketch. It is inaccurate to claim that no contract document mentions an eight-field vector at all.

2. **The eight field names alone do not settle the full semantic and numeric contract.** The archived specification does not provide a complete normative range table beside the wire structure. `docs/decisions/ADR-DRAFT-P0-03-PRESENCE-VECTOR-RANGES.md` proposes meanings and numeric domains, but its status is `DRAFT — PENDING RATIFICATION`. `docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md` likewise says normative domains remain open and must not be silently ratified by the matrix.

3. **The repository distinguishes materially different meanings of “8D.”** `docs/architecture/AETHERIUM-RUNTIME-INTEGRATION-MATRIX-v0.2.md`, Section 6, contrasts a historical spatial/semantic vector with another feature space containing `attention`, `motion`, `novelty`, `stability`, `emotion`, `intent`, `context`, and `temporal`. It states these variants are not the same schema and must not be merged. The currently specified Presence IR v0.1 wire contract takes precedence over historical variants unless a new contract decision is made.

4. **The Phase 0 Visual State and WebGPU path are not a Presence IR runtime.** In the reviewed archive, `docs/decisions/ADR-PRESENCE-IR-GOVERNOR-V0.1.md` and the Presence IR specification explicitly distinguish the Phase 0 prototype precursor from a conformant Presence IR / Governor runtime. The current Visual State contract must not be silently replaced by Presence IR semantics.

5. **The existing WebGPU path has a numeric manifestation boundary.** `manifestation/webgpu-adapter.js` maps Visual State values to renderer-oriented numeric parameters. The adapter outputs parameters such as `turbulence`, `intensity`, `coherence`, `particle_count`, `flow_direction`, `time`, `delta_time`, and `simulation_scale`; it does not accept a canonical Presence IR envelope as its declared input contract.

6. **The reviewed particle-update shader does not implement a generic 8D mapping.** `runtime/webgpu/compute/particle-update.wgsl` uses numeric uniforms for turbulence, intensity, coherence, flow direction, time, delta time, simulation scale, particle count, and viewport values. Its current acceleration combines flow, swirl, and noise. The reviewed shader does not declare or consume the eight Presence IR fields as such, and it does not expose explicit Attraction / Repulsion inputs matching the proposal’s description.

7. **The reviewed WebGPU fragment shader does not map Presence IR dimensions to color.** `runtime/webgpu/render/particle.frag.wgsl` returns a fixed RGB value with alpha supplied by the vertex shader. A variable color/luminescence mapping would therefore be a separate research hypothesis, not a demonstrated current capability in this snapshot.

8. **The supplied archive’s automated tests passed.** Running `npm test` in the unpacked archive completed successfully. The output reported 36 Visual State tests passed and 0 failed; WebGPU adapter/capability tests and shader-boundary tests passed; baseline snapshot, perceptual harness, temporal signal-fusion, and world-model research test suites also passed. These are test results for the archive, not proof of all target-revision behavior.

9. **Phase 0 must remain frozen under the project constraints supplied with this decision.** Planning work may document and evaluate candidates, but must not change the frozen Visual State contract or runtime unless contrary evidence and a separate approval path justify reopening it.

## C. Claims Rejected

1. **Reject the blanket classification `VERIFIED` for the entire proposal.** The proposal contains verified archive-level facts, architectural interpretations, and unresolved implementation/perceptual claims. They cannot share one undifferentiated truth label.

2. **Reject the claim that the eight dimensions are completely undefined everywhere.** Eight field names and `number` types are present in Presence IR v0.1. The defensible gap is narrower: normative numeric domains and unambiguous semantic definitions are not fully ratified in the reviewed contract; alternative “emotion/intent/context” dimensions are not interchangeable with the current wire schema.

3. **Reject treating the P0-03 draft ranges as canonical.** The file is marked pending ratification. Its recommendations may inform planning, but cannot be represented as an active normative contract solely because the draft contains a table.

4. **Reject treating historical feature space Variant B as the canonical Presence IR.** `attention`, `motion`, `novelty`, `stability`, `emotion`, `intent`, `context`, and `temporal` must remain research/encoder candidates unless a separately reviewed contract decision authorizes a new wire schema.

5. **Reject direct 8D-to-WGSL integration as implementation-ready.** The current mapping table, validation rules, semantic authority, error behavior, and perceptual hypothesis have not been established. In the reviewed snapshot, the adapter maps Visual State—not Presence IR—to GPU-safe parameters.

6. **Reject claims of verified runtime performance or perceptual validity.** Passing Node-based tests does not establish browser-level GPU execution, frame-time behavior under load, successful device/resource lifecycle, or whether human observers correctly perceive the intended distinctions.

7. **Reject any implication that this note was committed to the repository or that revision `875d230b77f243cc7614982b7306ec8295e11231` was verified.** Only a local draft was produced. The accessible archive carries the archive identifier `5d232575b5a60d3bb611eeef5458847dc18324c2`; it is not established to be the exact target revision.

## D. Claims Deferred / Unverified

1. **Target-revision identity.** The specific revision `875d230b77f243cc7614982b7306ec8295e11231` was not available for direct verification in this review. The provided archive has a different identifier and archived file dates around 2026-10-04. The archive’s older Current Truth document says the contract-freeze gate is pending, whereas the later project decision records Phase 0 as frozen on 2026-10-05. For current governance, use the later freeze decision; use this archive only as a bounded code snapshot.

2. **Full 8D schema semantics.** The existing v0.1 fields need an explicit, ratified definition of units, semantic meaning, valid ranges, normalization, handling of non-finite/missing values, and versioning. The draft numeric-domain table is a candidate, not ratification.

3. **Input feature-space selection.** A decision is required on whether Phase 1’s `PresenceVectorCandidate` uses the existing v0.1 eight fields, a derived research feature space, or an explicitly versioned encoder output. These options cannot be mixed implicitly.

4. **Mapping specification.** No validated mapping has been established from the governed envelope into `velocity`, `attraction`, `repulsion`, color, or luminescence. The mapping must define units, bounds, determinism, saturation, missing/invalid-value behavior, and which parameters are actually needed downstream.

5. **Governor behavior.** A minimum Governor A contract and rejection semantics must be specified before a candidate envelope can be treated as governed state. The Presence IR spec and ADR state that Phase 0 is not a conformant Governor runtime.

6. **Renderer integration.** Whether the best design is to extend a manifestation adapter, add a distinct Presence IR mapping adapter, or compile a governed state into a smaller manifestation profile remains a design decision. Current evidence favors keeping the semantic wire format out of WGSL and testing a dedicated mapping boundary first.

7. **Performance and LOGENESIS load.** No target-specific LOGENESIS workload, benchmark procedure, baseline, device matrix, or accepted performance threshold was supplied or run in this review.

8. **Perceptual validity.** There are no reported human-observer results establishing that a numeric mapping consistently communicates intent, confidence, risk, or other dimensions through light/particle behavior.

9. **Complete CEA-DVP reference protocol.** `references/protocol.md`, `CHANGELOG.md`, `evals/evals.json`, and `evals/triggers.json` were not present in the reviewed Aetherium repository archive. This decision therefore applies the CEA-DVP rules included in the request; it does not claim to have loaded or exhaustively applied unavailable reference-file details or every rule from an external plugin package.

## E. Evidence Record

### Sources inspected

- Supplied archive: `/mnt/data/Aetherium-Manifest-main-1.zip`
- Archive identifier shown in ZIP metadata: `5d232575b5a60d3bb611eeef5458847dc18324c2`
- Target revision stated in the decision input: `875d230b77f243cc7614982b7306ec8295e11231` — **not matched/verified against the supplied archive**.
- `README.md`
- `docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md`
- `docs/PHASE-0.1-VISUAL-STATE-CONTRACT.md`
- `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`
- `docs/decisions/ADR-PRESENCE-IR-GOVERNOR-V0.1.md`
- `docs/decisions/ADR-DRAFT-P0-03-PRESENCE-VECTOR-RANGES.md`
- `docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md`
- `docs/architecture/AETHERIUM-RUNTIME-INTEGRATION-MATRIX-v0.2.md`
- `docs/renderer/AETHERIUM-WEBGPU-PARTICLE-PROOF.md`
- `manifestation/webgpu-adapter.js`
- `runtime/visual-state.js`
- `runtime/webgpu/compute/particle-update.wgsl`
- `runtime/webgpu/render/particle.vert.wgsl`
- `runtime/webgpu/render/particle.frag.wgsl`
- `tests/fixtures/visual-states/*.json`

### Command and result

Command executed in the unpacked archive:

```bash
npm test
```

**Result:** Exit success. Visual State tests reported **36 passed, 0 failed**. WebGPU adapter/capability tests and shader-boundary tests passed. Baseline snapshot, perceptual harness, temporal signal-fusion, and world-model research tests passed.

### Verification limits

- Tests were run against the supplied archive, not a verified checkout of the target revision.
- The test suite’s success does not mean the GPU was executed in a real browser. `docs/renderer/AETHERIUM-WEBGPU-PARTICLE-PROOF.md` explicitly identifies the renderer as a proof of concept and states that Node tests do not validate actual GPU execution.
- No live-browser test, GPU device matrix, frame-time benchmark, LOGENESIS workload, or human perceptual study was run.
- No files in the archive were edited and no Git commit or remote repository change was made.

## F. Residual Uncertainty

- Which exact repository revision is authoritative for the next work item.
- Whether `x`, `y`, `z`, `phase`, `confidence`, `energy`, `coherence`, and `policy_risk` remain the intended Phase 1 candidate vector without modification.
- Whether the field domains proposed in ADR-DRAFT-P0-03 will be ratified, revised, or replaced.
- How the proposed candidate vector maps to the subset of visual parameters genuinely needed by a renderer.
- Whether Attraction / Repulsion and dynamic color/luminescence are necessary manifestations or overfitting to an unvalidated conceptual mapping.
- Which hardware, particle counts, scene durations, frame-time thresholds, and browser configurations constitute an acceptable benchmark.
- Whether the mapping produces statistically or operationally meaningful human perception of the intended state.

## G. Final Artifact — Planning Specification

### G1. Purpose

Define the work and evidence required to evaluate Phase 1 Presence IR integration while preserving Phase 0 and avoiding promotion of research hypotheses into canonical state or implementation facts.

### G2. Candidate architecture

```text
AI / Intent Source
        │
        ▼
PresenceVectorCandidate
        │
        ▼
Governor A (candidate; contract and rejection semantics required)
        │
        ▼
PresenceIREnvelope
        │
        ├── Schema / Type Validation
        ├── Numeric Domain Checks
        ├── Lineage / Version / Integrity Checks, where required by v0.1
        └── Conformance Fixtures
        │
        ▼
Manifestation Mapping Adapter (research candidate)
        │
        ▼
Validated Renderer-Safe Numeric Parameters
        │
        ▼
WebGPU Manifestation Backend
        │
        ▼
Light / Particle Manifestation
```

The diagram is a planning model, not a claim that each component currently exists as an executable Phase 1 pipeline. Raw intent, ungoverned candidates, and the full Presence IR envelope must not be passed directly into WGSL. The mapping boundary should emit only renderer-safe numeric parameters.

### G3. Work packages

**WP0 — Baseline and source identity**

- Obtain or check out the exact repository revision intended for Phase 1 planning.
- Record the commit hash, working-tree state, and hashes of the contracts and target files.
- Reconcile the archive’s pre-freeze status text with the later Phase 0 freeze record without reopening Phase 0.

**Exit evidence:** a traceable source manifest showing the exact revision and the applicable freeze decision.

**WP1 — Contract and feature-space audit**

- Treat Presence IR v0.1 as the existing wire-contract reference until a separate decision changes it.
- Compare every field against the P0-03 range draft and the consistency matrix.
- Separate wire fields from model-specific latent/encoder features. Do not mix the spatial/semantic vector with the historical `attention/motion/novelty/stability/emotion/intent/context/temporal` feature space.
- Document the unresolved domain and semantic decisions without modifying the canonical contract.

**Exit evidence:** a field-by-field table containing name, meaning, type, units, candidate range, source of definition, ratification status, and unresolved questions.

**WP2 — Governor A and envelope conformance design**

- Define candidate-envelope validity, rejection semantics, and which fields are authoritative versus advisory.
- Specify handling for missing fields, unknown fields, non-finite numbers, out-of-range values, invalid lineage/version data, and integrity-check failures as applicable to the chosen contract.
- Use deterministic fixtures for valid, boundary, malformed, and rejected cases.
- Do not retrofit Presence IR wire fields or integrity-hash dependencies into Phase 0 `runtime/visual-state.js`.

**Exit evidence:** conformance matrix and fixtures accepted for the Phase 1 candidate, with no Phase 0 contract changes.

**WP3 — Numeric mapping experiment design (not runtime implementation)**

- List the minimum renderer parameters required by the first experiment; avoid assuming all eight fields need a direct shader input.
- Specify each candidate mapping as an explicit function with input domain, output domain, units, clamp/saturation rule, determinism rule, invalid-input behavior, and a rationale.
- Keep color/luminescence, velocity, attraction, and repulsion as separate hypotheses until there is evidence to combine them.
- Compare at least a baseline mapping against one candidate mapping using fixed inputs and fixed seeds.
- Define expected invariants before observing results, including repeatability, bounded outputs, and separation of semantic state from device-driven adaptation.

**Exit evidence:** a reviewed experiment protocol and mapping fixture set. This work package does not authorize editing the Phase 0 Visual State implementation or WGSL shader.

**WP4 — Renderer integration test design**

- Test only the governed envelope-to-adapter boundary; do not send Presence IR objects or semantic labels into WGSL.
- Specify adapter contract tests, parameter-boundary tests, shader-invariant checks, and fallback behavior.
- Preserve Canvas2D as the Phase 0 reference surface. Treat WebGPU as a manifestation backend, not semantic authority.

**Exit evidence:** tests and assertions defined for a later, separately approved implementation.

**WP5 — Runtime, performance, and perceptual evaluation design**

- Define hardware/browser test matrix and workload (particle budgets, scene duration, warm-up, device loss/fallback cases, and repeat count).
- Record frame-time distribution, throughput, memory/resource behavior, dropped frames, shader/pipeline errors, and fallback events.
- Define a human evaluation protocol before running the experiment: intended state distinctions, task prompts, participant criteria, randomization/blinding where applicable, success metric, and failure conditions.
- Do not interpret a successful shader compile or Node test as evidence of perceptual validity.

**Exit evidence:** benchmark plan with baseline and acceptance thresholds, plus a separate perceptual protocol with observable success/failure criteria.

### G4. Acceptance criteria and verification levels

| Level | Acceptance criteria | Required evidence | What passing does not prove |
|---|---|---|---|
| 1. Contract Conformance | Field definitions, candidate ranges, validation, and rejection behavior are explicit and internally consistent; fixtures cover valid, boundary, malformed, and rejected inputs. | Versioned schema/matrix, deterministic fixtures, test report. | Does not prove the mapping is perceptually meaningful or fast. |
| 2. Mapping Correctness | Candidate mappings are deterministic, bounded, traceable to governed inputs, and meet predefined numeric invariants. | Mapping spec, reference implementation or hand-checkable fixtures, repeat-run comparison. | Does not authorize Phase 0 edits or prove GPU integration. |
| 3. Renderer Integration | Only validated numeric manifestation parameters cross the adapter boundary; adapter and shader contracts agree; fallback/error cases are tested. | Adapter/shader conformance results and browser execution evidence when implementation is separately approved. | Does not prove production readiness or perceptual validity. |
| 4. Runtime and Perceptual Evaluation | Performance meets pre-registered thresholds on specified devices; observed manifestations communicate targeted distinctions to human evaluators at the defined success level. | Browser/GPU benchmark data, environment metadata, perceptual-study results, failure log. | Does not automatically ratify a new contract or generalize to all devices/users. |

### G5. Constraints and non-goals

- Phase 0 remains `FROZEN_WITH_DEFERRED_ITEMS` under the later project decision.
- Phase 1 remains `OPEN / NOT STARTED`; this note is planning only.
- No edits to `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`, `runtime/visual-state.js`, `runtime/webgpu/compute/particle-update.wgsl`, renderer shaders, or active Phase 0 Visual State values are authorized by this note.
- No new 8D wire schema is canonicalized here.
- No conclusion that WebGPU, LOGENESIS, or any semantic-to-perceptual mapping meets production requirements is made.
- The system’s user-facing primary response remains light/particle manifestation under the Zero-UI Light Manifestation perspective. This Markdown research artifact is engineering documentation, not a proposal to make text the primary user-response channel.

### G6. Decision gates before implementation

Implementation may be proposed for separate approval only after:

1. The exact target repository revision and Phase 0 freeze reference are recorded.
2. The chosen eight-field feature space and its contract status are unambiguous.
3. Level 1 Contract Conformance acceptance criteria and fixtures pass.
4. Level 2 Mapping Correctness invariants and fixtures pass.
5. The implementation plan demonstrates that no frozen Phase 0 contract or runtime behavior needs to change—or requests a separate explicit exception if it does.
6. Creator approval is recorded for the exact files and scope to be changed.

Passing Levels 1 and 2 permits a new implementation proposal to be considered; it does not itself grant code-edit authority.

## H. Creator Approval Boundary

**CREATOR_APPROVAL_REQUIRED: YES**

The following actions require explicit creator approval:

1. **Repository artifact publication:** adding this note to `docs/research/PHASE-1-PRESENCE-IR-INTEGRATION-PLANNING-v0.1.md`, committing it, or opening a pull request. The file generated for review is a local draft only.
2. **Presence IR definition changes:** selecting, redefining, or ratifying the eight dimensions, their semantic meaning, numerical domains, normalization rules, or wire representation.
3. **Numeric mapping implementation:** creating or adopting an executable mapping implementation beyond a research-only specification/fixture, including mappings for velocity, attraction, repulsion, color, or luminescence.
4. **Canonical contract edits:** modifying `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md`, the Visual State contract, or a ratified ADR.
5. **Runtime edits:** changing `runtime/visual-state.js`, `runtime/webgpu/compute/particle-update.wgsl`, renderer shaders, adapters, or tests for the purpose of enabling 8D Presence IR.
6. **Phase 0 exception:** any change that would reopen, weaken, or reinterpret the frozen Phase 0 contract.

No approval for these actions is implied by `ACCEPTED_WITH_LIMITATIONS`. This note recommends planning and evidence collection only.

---

## Decision Record — Concise Form

```yaml
cea_dvp:
  decision: ACCEPTED_WITH_LIMITATIONS
  scope: phase_1_planning_only
  truth_classification: MIXED
  implementation_status: DEFERRED
  architecture_status: CANDIDATE_VALID_WITH_LIMITATIONS
  verification_status: PARTIALLY_VERIFIED_ON_SUPPLIED_ARCHIVE
  evidence_sufficiency: SUFFICIENT_FOR_PLANNING_ONLY
  creator_approval_required: true

phase_0:
  status: FROZEN_WITH_DEFERRED_ITEMS
  runtime_changes_authorized: false

phase_1:
  status: OPEN_NOT_STARTED
  canonical_contract_changes_authorized: false
  numeric_mapping_implementation_authorized: false
  webgpu_shader_changes_authorized: false

known_evidence_gaps:
  - exact_target_revision_not_verified
  - presence_vector_domains_not_ratified
  - 8d_mapping_not_verified
  - browser_webgpu_execution_not_verified
  - performance_benchmark_not_run
  - perceptual_validity_not_evaluated
```
