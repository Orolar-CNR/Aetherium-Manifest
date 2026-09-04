# Aetherium-Manifest — Implementation Status Tracker
## Evidence-Based Template v0.1

> **Purpose**
>
> This tracker is the authoritative working template for distinguishing:
> `IMPLEMENTED` ≠ `SPECIFIED` ≠ `RESEARCH` ≠ `VISION`.
>
> Implementation status MUST be determined from executable repository evidence
> (source code + tests + runnable commands), not from architecture documents alone.

---

## 0. Truth Classification

| Status | Meaning | Evidence required |
|---|---|---|
| `IMPLEMENTED` | Exists in executable code and is exercised/verified | Source + tests or reproducible execution |
| `IMPLEMENTED_PARTIAL` | Some operational subset exists; important parts remain absent | Source + explicit gap list |
| `INTEGRATED` | Implemented and connected to the relevant runtime path | Source showing call/data path + test/execution evidence |
| `SPECIFIED_NOT_IMPLEMENTED` | Architecture/contract exists, but runtime implementation is absent | Specification document; no executable path |
| `RESEARCH_IMPLEMENTED_ISOLATED` | Experimental code exists and is intentionally isolated from production runtime | Research code + isolation evidence |
| `RESEARCH_SPECIFIED` | Research concept/document only | Research document |
| `VISION` | Long-term conceptual direction | Vision/design material only |
| `UNVERIFIED` | Claimed somewhere but repository evidence is insufficient | Claim without executable proof |
| `BLOCKED` | Intended implementation exists conceptually but cannot currently be verified/executed | Failure log + explicit blocker |

### Epistemic rule

> A component SHALL NOT be marked `IMPLEMENTED` merely because its name,
> schema, RFC, ADR, README, or architecture diagram exists.

---

# 1. Master Implementation Matrix

| ID | Component | Layer | Intended Role | Current Status | Evidence | Missing / Gap | Next Gate |
|---|---|---|---|---|---|---|---|
| AM-001 | Visual State Contract | Phase 0.1 | Governed visual state schema + validation | `IMPLEMENTED` | `contracts/visual-state.schema.json`, `runtime/visual-state.js`, tests | None material for current scope | Keep stable |
| AM-002 | Canvas2D Reference Renderer | Phase 0.2 | Deterministic reference manifestation renderer | `IMPLEMENTED` | `runtime/reference-renderer.js`, `renderer/canvas-renderer.js`, tests | Conformance scope should remain explicit | Baseline lock |
| AM-003 | WebGPU Particle PoC | Phase 0.2 | GPU particle manifestation backend | `IMPLEMENTED` | `renderer/webgpu-renderer.js`, WGSL, adapter, tests | Runtime profiling/production hardening not established | GPU acceptance |
| AM-004 | WebGPU → Visual State adapter | Phase 0.2 | Downstream numeric parameter mapping | `IMPLEMENTED` | `manifestation/webgpu-adapter.js`, tests | No semantic authority allowed | Preserve boundary |
| AM-005 | Backend Selection / fallback | Phase 0.2 | WebGPU/Canvas selection | `IMPLEMENTED` | `renderer/backend-selection.js`, app bootstrap, tests | Device-loss lifecycle not fully demonstrated | Add runtime fault tests |
| AM-006 | Local Phase-0 Interpreter | Phase 0.x | Message → visual candidate | `IMPLEMENTED` | `app.js::interpretIntent()` | Heuristic only; not AETH | Keep explicitly local |
| AM-007 | Visual State application path | Phase 0.x | Candidate → governed state → renderer | `IMPLEMENTED` | `app.js::applyEpisodeIntent`, `createVisualState` | No canonical Presence IR | Keep as Phase 0 path |
| AM-008 | Typographyless primary manifestation | Phase 0.x | Primary output via visual field | `IMPLEMENTED` | `app.js`, HTML/CSS, tests | Accessibility/diagnostics are still textual side channels | Keep side channels separate |
| AM-009 | Temporal Signal Fusion | Phase 0.x candidate | Normalize/correlate multimodal signals | `IMPLEMENTED_PARTIAL` | `runtime/temporal-signal-fusion.js`, tests | Motion/attachment are normalized but not fully wired as UI inputs; global sequence counter and random episode IDs reduce strict reproducibility | Harden determinism |
| AM-010 | Graceful Early Manifestation | Phase 0.x candidate | Immediate transient gesture response | `IMPLEMENTED_PARTIAL` | Canvas ripple path + tests | WebGPU method is currently a stub; transient path is renderer-local | Define transient authority |
| AM-011 | Web Speech input | Phase 0.x | Voice input channel | `IMPLEMENTED` | `app.js` Web Speech setup | Browser capability-dependent; not a portable speech subsystem | Keep optional |
| AM-012 | Presence IR v0.1 | Phase 1 | Canonical governed IR | `SPECIFIED_NOT_IMPLEMENTED` | `docs/contracts/AETHERIUM-PRESENCE-IR-SPEC.md` | No runtime envelope/compiler/governor | Phase-1 implementation |
| AM-013 | Presence Runtime | Phase 1 | Execute Presence IR lifecycle | `SPECIFIED_NOT_IMPLEMENTED` | architecture/spec docs | No runtime implementation | Phase 1 |
| AM-014 | Governor A runtime | Phase 1 | Semantic/policy governance | `SPECIFIED_NOT_IMPLEMENTED` | `docs/governance`, Presence IR spec | No executable governor engine | Phase 1 |
| AM-015 | Governor B runtime | Future | Perceptual/device/resource governance | `SPECIFIED_NOT_IMPLEMENTED` | governance/spec docs | No executable runtime | Future |
| AM-016 | AETH compiler | Phase 1 | Intent → Presence IR compilation | `SPECIFIED_NOT_IMPLEMENTED` | architecture/spec docs | No compiler implementation | Phase 1 |
| AM-017 | IntentCore integration | Cross-repo | Controlled ingress / coordination | `UNVERIFIED` | No integration code in Aetherium repo | No adapter/client/schema mapping | Integration Phase 1 |
| AM-018 | Dynamic SDF | Research | Field-dynamics experiment | `RESEARCH_IMPLEMENTED_ISOLATED` | `research/field-dynamics`, benchmark, tests | Not production renderer | Research gate |
| AM-019 | World Model / Environmental Dynamics | Research | Persistent environment state evolution | `RESEARCH_IMPLEMENTED_ISOLATED` | `research/world-model`, tests, benchmark | Not connected to Phase 0 renderer | Research gate |
| AM-020 | Nirodha | Concept / Phase 0 state | Reduced manifestation state | `IMPLEMENTED_PARTIAL` | Visual state fixture + interpreter mapping | No independent resource/homeostasis controller | Do not claim energy governor |
| AM-021 | Replay / lineage / BLAKE3 Presence IR | Future | Deterministic trace/replay | `SPECIFIED_NOT_IMPLEMENTED` | Presence IR spec | No canonical wire/runtime implementation | Phase 1+ |

---

# 2. Verified Current Aetherium Runtime

## 2.1 Actual executable path

```text
User text / browser interaction
        ↓
TemporalSignalFusion (for wired signals)
        ↓
InteractionEpisode
        ↓
app.js::interpretIntent()
        ↓
Visual State Candidate
        ↓
runtime/visual-state.js::createVisualState()
        ↓
Backend selection
    ┌───────────────┴────────────────┐
    ↓                                ↓
Canvas2D                       WebGPU
    ↓                                ↓
Reference/particle fields      WebGPU adapter
                                  ↓
                             Numeric GPU params
                                  ↓
                             WGSL compute/render
```

### Important boundary

The current code does **not** execute:

```text
Intent → AETH → Presence IR → Governor A/B → Manifestation Runtime
```

That is the Phase-1 architectural target, not the current executable path.

---

# 3. Test Evidence

### Aetherium verification command

```bash
npm test
```

Observed result from the supplied repository snapshot:

- Visual State Contract: PASS
- WebGPU adapter/capability tests: PASS
- WGSL shader invariants: PASS
- Baseline snapshot preservation: PASS
- Perceptual harness: PASS
- Temporal Signal Fusion: PASS
- World Model research tests: PASS

Observed aggregate result:

```text
32 initial contract/WebGPU assertions passed
Baseline snapshot tests passed
Perceptual evaluation passed
Temporal Signal Fusion tests passed
World Model research tests passed
```

### Interpretation

The passing suite demonstrates that the supplied snapshot has substantial executable Phase-0 and isolated research functionality.

It does **not** prove that Phase-1 Presence Runtime, AETH, Governor A/B, or IntentCore integration exists.

---

# 4. Important Status Corrections

## 4.1 Temporal Signal Fusion

Current implementation is real and tested, but should not be called a complete multimodal fusion runtime.

### Implemented

- signal normalization
- event/ingest timestamps
- source classification
- coordinate normalization
- episode creation
- temporal correlation
- spatial context
- voice/text correlation
- cancellation
- early-manifestation callback

### Not fully implemented

- actual motion sensor event wiring
- attachment processing
- a canonical cross-repository signal contract
- deterministic episode IDs
- globally reproducible sequence behavior
- WebGPU early manifestation

Recommended status:

```text
IMPLEMENTED_PARTIAL
```

---

## 4.2 Nirodha

The repository contains `NIRODHA` as a Visual State and maps input keywords to a low-energy visual configuration.

This proves:

```text
NIRODHA = supported visual state
```

It does NOT prove:

```text
NIRODHA = runtime energy governor / hardware homeostasis
```

Recommended status:

```text
IMPLEMENTED_PARTIAL
```

---

## 4.3 World Model

The World Model code is executable and tested, but intentionally resides under:

```text
research/world-model/
```

Therefore:

```text
RESEARCH_IMPLEMENTED_ISOLATED
```

not:

```text
CANONICAL_RUNTIME
```

---

## 4.4 Dynamic SDF

SDF implementation and benchmark tooling exist under:

```text
research/field-dynamics/
```

Therefore it is experimental evidence, not production renderer architecture.

Recommended status:

```text
RESEARCH_IMPLEMENTED_ISOLATED
```

---

## 4.5 Presence IR / Governor / AETH

The specifications are detailed and explicit, but the repository snapshot contains no executable implementation that realizes the full Phase-1 chain.

Recommended status for all three:

```text
SPECIFIED_NOT_IMPLEMENTED
```

---

# 5. Evidence Record Template

Copy this block for every component.

```yaml
id: AM-XXX
component: ""
layer: ""
intended_role: ""

status: IMPLEMENTED | IMPLEMENTED_PARTIAL | INTEGRATED |
        SPECIFIED_NOT_IMPLEMENTED | RESEARCH_IMPLEMENTED_ISOLATED |
        RESEARCH_SPECIFIED | VISION | UNVERIFIED | BLOCKED

repository_evidence:
  source_files: []
  test_files: []
  executable_command: ""
  observed_result: ""

runtime_path:
  upstream: []
  component: ""
  downstream: []

contract:
  schema_or_spec: ""
  version: ""
  authoritative: false

integration:
  connected_to_phase0_runtime: false
  connected_to_intentcore: false
  protocol: ""
  adapter: ""

limitations: []
missing_capabilities: []
next_gate: ""

last_verified:
commit: ""
date: ""
environment: ""
```

---

# 6. Definition of Done for `IMPLEMENTED`

A component may be promoted to `IMPLEMENTED` only when all are true:

- [ ] executable source exists
- [ ] component is reachable from an intended runtime path
- [ ] inputs and outputs are explicit
- [ ] contract/schema is identifiable
- [ ] at least one deterministic or reproducible test exists where applicable
- [ ] no contradictory higher-level truth boundary exists
- [ ] status is not inferred solely from documentation
- [ ] limitations are documented

For `INTEGRATED`, additionally:

- [ ] upstream caller exists
- [ ] downstream consumer exists
- [ ] data contract is mapped
- [ ] integration test exists
- [ ] failure/fallback behavior is defined

---

# 7. Release / Architecture Gates

### Gate A — Phase 0 Freeze

Required:

- [ ] Visual State Contract stable
- [ ] Canvas2D baseline preserved
- [ ] WebGPU PoC bounded as PoC
- [ ] Temporal Signal Fusion determinism hardened
- [ ] research tracks isolated
- [ ] truth matrix updated

### Gate B — IntentCore Integration

Required:

- [ ] Aetherium-facing IntentCore adapter
- [ ] canonical ingress envelope
- [ ] authentication/signature verification strategy
- [ ] explicit payload type/version
- [ ] trace/lineage mapping
- [ ] rejection/failure contract
- [ ] no direct renderer access
- [ ] integration tests

### Gate C — Phase 1 Presence Runtime

Required:

- [ ] AETH compiler
- [ ] Presence IR runtime schema validation
- [ ] Governor A
- [ ] governed transition path
- [ ] deterministic trace seed
- [ ] integrity verification
- [ ] renderer consumes only governed downstream representation
