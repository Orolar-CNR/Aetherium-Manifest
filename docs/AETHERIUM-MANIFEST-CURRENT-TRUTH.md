# AETHERIUM-MANIFEST-CURRENT-TRUTH.md

**Project:** Aetherium Manifest  
**Document Type:** Current Engineering Truth  
**Status:** Current-State Record  
**Purpose:** บันทึกเฉพาะสิ่งที่ repository และหลักฐาน executable รองรับว่าเป็นสภาพปัจจุบัน  
ไม่ยกระดับ vision, proposal, หรือ research ให้กลายเป็น implementation fact

**Authority rule:** เมื่อเอกสารขัดกัน ให้ยึดลำดับนี้  
Observed repository behavior → Executable tests → Locked contracts → Architecture specs → Research → Vision

---

## 1. Identity (วันนี้)

Aetherium Manifest ในปัจจุบันคือ:

**Browser-based perceptual interface prototype**  
ที่แปลง semantic / visual state ให้กลายเป็นแสงและการเคลื่อนไหวของอนุภาค  
พร้อมทิศทางสถาปัตยกรรมสู่ manifestation runtime ที่มี governance

ยัง **ไม่ใช่** Cognitive OS, production WebGPU engine, หรือระบบที่มี Governor runtime ครบวงจร

---

## 2. What is executable in this repository today

หลักฐานจาก tree ปัจจุบัน (main / package `0.2.0`):

### 2.1 Surface
- `index.html` — หน้าเว็บ static + ES modules
- `app.js` — Phase-0 interpreter, backend selection, animation loop
- `styles.css` — dark aesthetic / layout

รันได้ด้วยการเปิดไฟล์หรือ `npm run serve` (HTTP static server)

### 2.2 Visual State contract (Phase 0.1)
- `contracts/visual-state.schema.json`
- `runtime/visual-state.js` — create / validate / normalize
- `tests/visual-state.test.js` + fixtures ใน `tests/fixtures/visual-states/`

### 2.3 Dual renderer (Phase 0.2)
| Path | Files |
|------|--------|
| Canvas2D reference | `runtime/reference-renderer.js`, `renderer/canvas-renderer.js` |
| WebGPU PoC | `renderer/webgpu-renderer.js`, `runtime/webgpu/*`, shaders `.wgsl` |
| Backend choice | `renderer/backend-selection.js` (`auto` / `webgpu` / `canvas`) |
| Adapter boundary | `manifestation/webgpu-adapter.js` (Visual State → numeric GPU params เท่านั้น) |
| Interface / diagnostics | `renderer/renderer-interface.js` |

คุณสมบัติที่พิสูจน์แล้วในโค้ด:
- เลือก backend ตาม `?renderer=`
- Canvas2D fallback เมื่อ WebGPU ไม่พร้อมหรือ init ล้มเหลว
- `rendererSeed` บังคับ (deterministic init)
- ไม่ส่ง raw intent เข้า shader
- ไม่มี per-frame GPU→CPU particle readback ใน path หลัก

### 2.4 Tests ที่รันได้
```bash
npm test
# visual-state + webgpu adapter + shader invariants
```

### 2.5 Documentation ที่อยู่ใน repo และสอดคล้องสถานะ
| เอกสาร | บทบาท |
|--------|--------|
| `docs/architecture/AETHERIUM-CONTRACT-CONSISTENCY-MATRIX-v0.1.md` | Phase 0.3 reconciliation |
| `docs/decisions/ADR-DRAFT-P0-0*.md` + index | P0 drafts รอ ratification |
| `docs/renderer/AETHERIUM-WEBGPU-PARTICLE-PROOF.md` | ขอบเขต WebGPU PoC |
| `docs/renderer/AETHERIUM-WEBGPU-PARTICLE-ACCEPTANCE.md` | เกณฑ์รับ PoC |
| `docs/testing/AETHERIUM-REFERENCE-RENDERER-CONFORMANCE.md` | Canvas2D reference |
| `docs/contracts/*`, `docs/governance/*`, SAD | specification / direction |
| `docs/research/field-dynamics/*` | **RESEARCH CANDIDATE เท่านั้น** |

---

## 3. Architecture direction (specified, not fully implemented)

ทิศทางที่เอกสารย้ำซ้ำและต้องรักษา:

```text
Intent
  → Semantic / Visual State
  → Governor (A/B)
  → Presence IR / Manifest representation
  → Adapter
  → Renderer (Canvas2D | WebGPU | future)
```

กฎที่ใช้อยู่แล้วในโค้ด WebGPU path:
- Renderer ต้องไม่รับ raw intent
- รับได้เฉพาะ governed / mapped numeric parameters ผ่าน adapter

กฎที่ยังอยู่ในชั้น spec มากกว่า runtime:
- Presence IR เป็น wire/canonical candidate
- Governor A/B เป็น behavior contract
- Manifest Contract เป็น perceptual wire draft
- AETH / Perceptual Compiler เป็น pipeline direction

**Specified ≠ Implemented**

---

## 4. What does NOT exist as runtime fact yet

ห้ามอ้างว่ามีครบหรือ production-ready:

| หัวข้อ | สถานะจริง |
|--------|-----------|
| Presence Runtime (Candidate → Envelope) | ยังไม่เริ่มโค้ด runtime |
| Governor A/B executable policy engine | มี spec + ADR; ยังไม่มี runtime module ครบ |
| AETH language / compiler | design / direction |
| Perceptual Compiler | design / direction |
| HTTP API (`/api/v1/...`) | ไม่มีใน tree |
| Database (baselines, governance_logs) | ไม่มีใน tree |
| WebSocket / FastAPI gateway | ไม่มีใน tree นี้ |
| Field Dynamics backend | research docs เท่านั้น |
| Scientifically validated 8D manifold | ไม่ใช่ engineering fact |
| Proven universal human-readable visual language | ยังไม่มี perceptual study รองรับ |
| Multi-agent / distributed cognitive network | อยู่นอกขอบเขตปัจจุบัน |

---

## 5. Phase status (ตรง README / tree)

| Phase | Status |
|-------|--------|
| 0.0 Light Output Proof | ✅ |
| 0.1 Visual State Contract | ✅ |
| 0.2 Canvas2D Reference Renderer | ✅ |
| 0.2 WebGPU Particle PoC | ✅ |
| 0.3 Contract Consistency Matrix | ✅ (เอกสาร) |
| P0 ADR drafts | ✅ (DRAFT — pending ratification) |
| Contract Freeze Gate | ⏳ รอ ratification |
| Phase 1 Presence Runtime | 🛑 ยังไม่เริ่ม |

---

## 6. Research vs canonical

ทุกอย่างภายใต้ `docs/research/` รวมถึง Field Dynamics:
- สถานะ: **RESEARCH CANDIDATE**
- ห้าม treat เป็น canonical runtime requirement
- ห้าม merge เข้า main authority โดยไม่มี baseline + measurement + decision record

---

## 7. Current doctrine (บังคับใช้)

1. **State before beauty**  
2. **Governor before renderer**  
3. **Intent before image**  
4. อย่า canonicalize mapping ก่อนมี reproducible baseline และ perceptual evidence  
5. อย่าให้ภาษาใน vision ชนะหลักฐานใน repository  

ลำดับหลักฐานเมื่อขัดกัน:

```text
1. พฤติกรรมที่รันได้ใน repo + ผลทดสอบ
2. Contract / schema ที่ล็อกแล้ว
3. ADR ที่รับแล้ว
4. Architecture specification
5. Research proposal
6. Vision
```

---

## 8. One-sentence current truth

> Aetherium Manifest วันนี้คือ experimental browser perceptual runtime ที่พิสูจน์แล้วว่า Visual State เดียวกันสามารถถูก manifest ได้ทั้ง Canvas2D และ WebGPU ผ่าน adapter โดยมี contract matrix และ ADR P0 พร้อมสำหรับขั้นตอน ratification — แต่ยังไม่มี Presence Runtime, Governor executable ครบวงจร, API, หรือ database และยังไม่ใช่ Cognitive OS

---

## 9. Boundary of this document

เอกสารนี้ต้องถูกอัปเดตเมื่อ:
- มี executable module ใหม่ที่ผ่าน test
- มี contract ถูก ratify / freeze
- มีการถอดหรือแทนที่ path เดิม

ห้ามแก้เอกสารนี้เพื่อ “ให้ดูใกล้ vision ขึ้น” โดยไม่มีหลักฐานใน repository
