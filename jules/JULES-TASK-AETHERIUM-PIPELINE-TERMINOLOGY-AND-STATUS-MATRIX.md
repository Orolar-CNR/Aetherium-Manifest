# Jules Task Order — Aetherium Pipeline Terminology & Status Matrix v0.1

## Task mode

**DOCS_ONLY.** Documentation reconciliation and architecture decision recording only.

**Target repository:** `Orolar-CNR/Aetherium-Manifest`

**Decision status:** `ACCEPTED_WITH_LIMITATIONS` for documentation and First-Slice planning only.

**Implementation authorization:** `NOT GRANTED` by this task.

## 1. Objective

Inspect the repository's current documentation and create one evidence-backed source of truth for the terminology, status, and boundaries of the Aetherium-Manifest pipelines. Record the selected near-term engineering direction without implying that any unimplemented architecture exists at runtime.

Create these two documents, using the repository's existing documentation directory conventions if they exist:

1. `AETHERIUM-PIPELINE-TERMINOLOGY-AND-STATUS-MATRIX-v0.1.md`
2. `ADR-PIPELINE-DIRECTION-001.md`

Do not create duplicates in multiple directories. If the repository has no clear convention, use `docs/architecture/` for the matrix and `docs/decisions/` for the ADR.

## 2. Decisions to record

### D1 — Phase 0 remains frozen

Preserve Phase 0.x as `FROZEN_WITH_DEFERRED_ITEMS`. Do not modify Phase 0 runtime contracts or renderer behavior as part of this task. Treat the seven Phase 0 visual states as:

`IDLE`, `LISTENING`, `PROCESSING`, `RESPONDING`, `WARNING`, `ERROR`, `NIRODHA`.

Do not redefine `NIRODHA` as a Governor decision. In Phase 0 it is a Visual State. `REJECT` is a decision/outcome term where defined by a Governor contract; it may cause a transition to `NIRODHA` only if an explicit contract says so. These concepts are not synonyms.

### D2 — Selected near-term First Slice

Record this as the selected engineering direction for the next slice:

`PresenceVectorCandidate → Minimal Governor A → PresenceIREnvelope → Conformance / Fixture Tests`

This is a documentation/planning decision, not evidence that the sequence is implemented. The matrix and ADR must say that implementation status must be verified from repository evidence independently.

Do not silently reorder this slice. If a repository source explicitly conflicts with this sequence, document the exact conflict and source location; do not resolve it by inventing implementation details.

### D3 — Full target pipeline stays research-only for now

Treat the following as a future/target architecture proposal, not the active First-Slice implementation path:

`Human Signal → AGNS → AETH → Presence IR → Governor → Manifestation Runtime`

Do not add AGNS, an AGNS adapter, semantic-hypothesis producer, LLM semantic-producer integration, Transition Engine, Governor B, or GPU-runtime integration to the First Slice unless a current, explicitly approved in-repository contract already requires it. Record the existence of such ideas without promoting them to implementation scope.

### D4 — AGNS role boundary

The accepted principle is limited to this: AGNS may propose a semantic interpretation; it does not authorize manifestation and must not command the Renderer directly. Uncertainty must be preserved rather than converted into invented certainty. A semantic candidate must not be treated as an authorized runtime state automatically.

Do not assert that AGNS has a particular API, schema, adapter, or implementation unless the repository contains evidence for it.

### D5 — Do not canonicalize either 8D set in this task

Keep these as distinct, non-equivalent sets pending a separate evidence-backed decision:

**Proposed PresenceVector field set in the supplied Draft Presence IR Registry:**
`x`, `y`, `z`, `intent_phase`, `confidence`, `energy`, `coherence`, `policy_risk`.

**Previously discussed 8D Manifold/research parameter set:**
`D1_Comp_Stress`, `D2_Entropy_Ratio`, `D3_Semantic_Coherence`, `D4_Temporal_Turbulence`, `D5_Token_Density`, `D6_Fracture_Risk`, `D7_Semantic_Symmetry`, `D8_Temporal_Decay`.

Do not merge, rename-map, or declare either set to be the canonical First-Slice schema. Label the former as a proposed PresenceVector schema if supported by repository/attached-document evidence; label the latter as a separate legacy/research model only if repository evidence supports that classification. If its status cannot be established, use `NOT_ESTABLISHED` and cite that gap.

Do not implement or expand a Dimension Registry in this task.

### D6 — Preserve ambiguous AETH usages without conflating them

The available project context uses `AETH` in at least three ways:

1. A contract/standard concept.
2. A declarative `IF–THEN–BECAUSE` manifestation-rule language.
3. A Python `compile_intent` implementation/function reference.

Search the repository and list each verified usage with exact source path and a short context. Do not assume these are the same artifact or three stages of one pipeline unless a source explicitly establishes that relationship. Until such evidence exists, mark the term as `AMBIGUOUS / NOT CANONICALIZED` and keep AETH integration out of the First Slice.

### D7 — Keep Canonical IR and PresenceIREnvelope distinct

Do not assume `Canonical IR`, `Presence IR`, `PresenceVectorCandidate`, `PresenceIREnvelope`, and any `Visual State Contract` are interchangeable. For each term, record:

- source-backed definition;
- role and pipeline location, if defined;
- current implementation status supported by evidence;
- relationship to the other terms (`DEFINED`, `PROPOSED`, `UNKNOWN`, or `CONFLICTING`).

Do not import an external or separately drafted `AETHERIUM-CANONICAL-IR-AND-SEMANTIC-INVARIANTS-v0.1.md` into canonical project documentation merely because it was discussed in conversation. First check whether that file exists in this repository and what status its repository history/content gives it.

### D8 — Transition Engine and Governor A/B

Do not treat `Transition Engine` as an established component unless a current repository source defines it. Record `NOT_ESTABLISHED` if no such evidence is located.

Distinguish the First-Slice `Minimal Governor A` from any broader research/target definitions of Governor A and Governor B. Do not infer that Governor B is implemented or included in the First Slice.

## 3. Repository inspection instructions

Before editing:

1. Inspect repository status and top-level structure.
2. Read existing architecture docs, Phase 0 freeze/current-truth docs, First-Slice/ADR docs, Presence IR/8D registry drafts, AETH references, AGNS references, and testing docs relevant to the terms above.
3. Preserve pre-existing user changes. Do not overwrite or reformat unrelated files.
4. Treat names in diagrams or prose as evidence that a concept is discussed, not evidence that it is implemented.
5. Prefer local repository sources. If a referenced source is absent, record `NOT_FOUND_IN_REPOSITORY`; do not fabricate its content.
6. Use path/section/line references where practical. When line numbers are unstable or unavailable, use exact file path and heading.

If a PDF or document cited by another file is not present in the repository, record that the reference exists but the source was not locally available; do not treat the citation alone as verification.

## 4. Required contents of the terminology matrix

The matrix must include at least these columns:

- Term / Artifact
- Source-backed definition
- Phase / scope
- Evidence source (path + heading/lines where practical)
- Truth classification
- Implementation status
- Approval/canonical status
- First-Slice inclusion (`IN_SCOPE`, `OUT_OF_SCOPE`, `DEFERRED`, or `UNKNOWN`)
- Conflict / open issue

Include rows for, at minimum:

- Phase 0.x Visual State Contract
- Seven Phase 0 visual states
- PresenceVectorCandidate
- Minimal Governor A
- PresenceIREnvelope
- Presence IR / Canonical IR
- Both 8D field sets
- AGNS
- Each verified meaning/use of AETH
- Governor A and Governor B as separate terms if sources distinguish them
- NIRODHA
- REJECT / ACCEPT / DEFER if present in source contracts
- Transition Engine
- Renderer / Canvas2D / WebGPU where needed to make phase boundaries clear
- AGNS Adapter / semantic-hypothesis producer integration

Use only status labels that can be explained in the document. Keep truth classification separate from implementation status and approval status. Prefer established repository vocabulary; if adding `NOT_ESTABLISHED` or `NOT_FOUND_IN_REPOSITORY`, define it explicitly.

## 5. Required contents of the ADR

The ADR must include:

- Status: `ACCEPTED_WITH_LIMITATIONS` for documentation/First-Slice planning only.
- Context and problem statement: competing terminology/pipelines risk unintentional canonicalization.
- Decision: select the First Slice exactly as `PresenceVectorCandidate → Minimal Governor A → PresenceIREnvelope → Conformance / Fixture Tests`.
- Explicitly deferred scope: AGNS integration, ambiguous AETH integration, final 8D dimension registry, Governor B integration, Transition Engine, GPU/Renderer integration unless required by a separate already-approved contract.
- Phase 0 freeze preservation.
- Rationale and consequences.
- Alternatives considered, including immediately adopting the full target pipeline and selecting one 8D set now; state why these are not selected at this stage.
- Open questions that need new evidence or a distinct decision record.
- Implementation authorization: `NOT GRANTED BY THIS ADR`.
- Verification note: document creation does not establish that any component is implemented or tested.

## 6. Truth/evidence discipline

Apply these rules strictly:

- A name in a specification is not proof of implementation.
- A schema is not proof of runtime behavior.
- A test file is not proof that tests ran.
- A reported test pass is not independently verified unless evidence is present.
- `IMPLEMENTED` should only be used where actual implementation and relevant execution/integration evidence are present, according to the repository's own truth rules.
- If evidence is incomplete, mark `NOT_VERIFIED`, `NOT_ESTABLISHED`, or the repository's defined equivalent and explain what evidence is missing.
- Distinguish `SPECIFIED_NOT_IMPLEMENTED`, `UNDEFINED`, `UNVERIFIED`, and `IMPLEMENTED` if these labels are part of the repository's documented truth taxonomy.
- Do not invent certainty values, numerical thresholds, schema fields, API names, rules, or mappings.

## 7. Strict scope limits

Allowed:

- Read repository files and history/status metadata.
- Add only the two documents described above.
- Make factual references to existing docs, with paths/headings.
- Run a Markdown/link/lint check only if the repository already has a relevant tool and it does not install dependencies or alter runtime artifacts.

Forbidden:

- Modify source code, shaders, runtime logic, package manifests, lockfiles, tests, fixtures, or existing canonical contracts.
- Implement AGNS, AETH, Governor, Presence IR, Transition Engine, or a Dimension Registry.
- Change Phase 0 contracts or visual states.
- Rename or delete existing documents.
- Promote research-only features into canonical contracts.
- Install dependencies, run formatters across the repository, perform destructive commands, commit, push, open a PR, or change repository settings.
- Claim tests ran if they did not.

If the new docs would conflict with an existing canonical document, do not edit the canonical document in this task. Record the conflict in the matrix and ADR.

## 8. Acceptance criteria

The task is complete only if:

1. Exactly the two planned documentation files are added, with directory paths adapted to existing conventions.
2. The selected First Slice is written identically in the matrix and ADR.
3. Phase 0 freeze and NIRODHA-as-Visual-State are preserved.
4. The two 8D sets are visibly separate and neither is declared canonical.
5. AETH's three usages are evidenced individually or marked as not found; they are not silently unified.
6. Canonical IR and PresenceIREnvelope are not assumed equivalent.
7. AGNS/Transition Engine/Governor B remain out of First-Slice scope unless source evidence says otherwise; any such evidence must be cited and explained.
8. Implementation and verification claims are grounded in repository evidence.
9. No implementation files or existing documents are changed.
10. The final report names the files created, summarizes evidence-backed decisions and unresolved conflicts, and lists checks actually performed. If a check was not run, say so.

## 9. Final report format

Return a concise report with:

- `Decision recorded`
- `Files created`
- `Key conflicts found`
- `Implementation files changed: NONE`
- `Tests/checks run` (accurately list or state none)
- `Remaining blockers`

Do not ask for clarification unless repository evidence makes it impossible to produce the two DOCS_ONLY artifacts. When something is unknown, document it explicitly rather than guessing.
