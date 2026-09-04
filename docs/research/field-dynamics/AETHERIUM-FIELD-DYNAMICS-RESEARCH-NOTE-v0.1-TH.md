# AETHERIUM FIELD DYNAMICS RESEARCH NOTE

**Document Version:** 0.1
**Date:** 2026-09-01
**Status:** RESEARCH CANDIDATE | NOT CANONICAL | NOT IMPLEMENTATION SPEC

---

## 1. Research Status Vocabulary (คำศัพท์และสถานะวิจัย)

เพื่อป้องกันความสับสนทางสถาปัตยกรรม เอกสารฉบับนี้และกระบวนการวิจัยที่เกี่ยวข้องจะยึดถือคำศัพท์และสถานะดังต่อไปนี้อย่างเคร่งครัด:

* **RESEARCH CANDIDATE**: แนวคิดที่กำลังถูกศึกษา (ยังไม่ใช่ส่วนหนึ่งของระบบจริง)
* **EXPERIMENTAL**: โค้ดหรือสถาปัตยกรรมที่สร้างขึ้นเพื่อการทดสอบเท่านั้น
* **MEASURED**: ผลลัพธ์ที่ได้จากการวัดค่าทางสถิติหรือตัวเลข
* **OBSERVED**: ผลลัพธ์ที่ได้จากการสังเกตหรือการรับรู้ของมนุษย์
* **HYPOTHESIS**: สมมติฐานที่ต้องได้รับการพิสูจน์
* **SUPPORTED / REFUTED / INCONCLUSIVE**: สถานะของสมมติฐานหลังผ่านการทดลอง
* **CANONICAL**: กฎหรือสถาปัตยกรรมหลักของ Aetherium ที่ผ่านการอนุมัติแล้ว

> **CORE DOCTRINE: Measured ≠ Canonical**
> *(สิ่งที่วัดผลได้จากการทดลอง ไม่ได้หมายความว่าจะกลายเป็นกฎของสถาปัตยกรรมแบบ **Canonical** เสมอไป)*

---

## 2. Research Objective (วัตถุประสงค์การวิจัย)

เพื่อศึกษาและเปรียบเทียบสถาปัตยกรรม **Field Dynamics** ในฐานะ **RESEARCH CANDIDATE** สำหรับ Aetherium Manifestation Runtime โดยมีเป้าหมายเพื่อทดสอบสมมติฐานหลักที่ว่า **Manifest State** เดียวกัน สามารถแสดงออก (Manifest) ผ่านระบบ Dynamics ที่แตกต่างกันได้ (**Dual-Dynamics Philosophy**) โดยไม่สูญเสียความหมายดั้งเดิม

---

## 3. Explicit Non-Goals (สิ่งที่ไม่ใช่เป้าหมาย)

> **STRICT NON-GOALS / ข้อห้ามทางสถาปัตยกรรม:**
> งานวิจัยชิ้นนี้ **ไม่มี**ความพยายามหรือวัตถุประสงค์ที่จะกระทำสิ่งต่อไปนี้โดยเด็ดขาด:
>
> * ❌ **ทดแทนหรือยกเลิก**การใช้ **Particle Baseline** ที่มีอยู่เดิม
> * ❌ **นิยามหรือเปลี่ยนแปลง**โครงสร้างของ **Visual State Contract**
> * ❌ **ดัดแปลงหรือแทรกแซง** **Presence IR**
> * ❌ **ดัดแปลง** **Manifest Contract**
> * ❌ **กำหนดกฎ**การจับคู่ความหมาย (**Canonical** semantic → field mappings) อย่างถาวร
> * ❌ **พิสูจน์**ว่าระบบจำลองของไหล (Fluid Simulation) มีความเหนือกว่า **Particle Dynamics**
> * ❌ **นำเสนอ** Field Renderer เพื่อใช้งานในระดับ Production

---

## 4. Core Research Questions (คำถามวิจัยหลัก)

การทดลองทั้งหมดจะต้องถูกออกแบบมาเพื่อตอบคำถามเหล่านี้:

* **RQ1 (Equivalence):** **Particle Dynamics** กับ **Field Dynamics** สามารถสร้าง manifestation ที่เทียบเคียงกันจาก **Manifest State** เดียวกันได้หรือไม่?
* **RQ2 (Characteristics):** **Field Dynamics** ให้คุณสมบัติด้าน motion, continuity และ coherence ที่แตกต่างจาก **Particle Dynamics** อย่างไร?
* **RQ3 (Computational Cost):** ต้นทุนการคำนวณ (Compute/Memory/Bandwidth) ของทั้งสองวิธีแตกต่างกันอย่างไรในระดับสเกลต่างๆ?
* **RQ4 (Perceptual Consistency):** มนุษย์สามารถเรียนรู้และตีความความแตกต่างของ manifestation จากทั้งสองระบบได้สม่ำเสมอเพียงใด?
* **RQ5 (Determinism):** สามารถรักษาคุณสมบัติ **Determinism** ภายใต้ state + seed เดียวกันในสถาปัตยกรรมที่ต่างกันได้หรือไม่?

---

## 5. Research Hypotheses (สมมติฐานการวิจัย)

* **H1:** **Field Dynamics** อาจให้ความต่อเนื่องทางพื้นที่ (spatial continuity) ที่สูงกว่า **Particle Dynamics** ภายใต้ข้อมูลนำเข้า manifestation ที่เทียบเท่ากัน
* **H2:** **Particle Dynamics** อาจมีความซับซ้อนในการพัฒนาระบบ (implementation complexity) ที่ต่ำกว่าสำหรับปริมาณงาน baseline ในปัจจุบัน
* **H3:** การพัฒนาระบบ dynamics ที่แตกต่างกัน สามารถรักษาการตีความเชิงความหมายที่เทียบเท่ากันภายใต้ **Manifest State** เดียวกันได้
* **H4:** ความเท่าเทียมกันในการรับรู้ของผู้ใช้ (Perceptual equivalence) ไม่สามารถสรุปได้จากความเหมือนกันเชิงตัวเลขเพียงอย่างเดียว

---

## 6. Separation of Variables (การควบคุมตัวแปร)

เพื่อให้การเปรียบเทียบมีความยุติธรรมและวัดผลได้จริง การทดสอบระหว่างสถาปัตยกรรมทั้งสองจะต้องใช้ **Identical Inputs** (ชุดข้อมูลนำเข้าที่เหมือนกันทุกประการ):

```text
[ Identical Inputs ]
  ├── Same Manifest State
  ├── Same Seed
  ├── Same Time Conditions
  └── Same Numeric Parameter Set
         │
         ├──→ [ Particle Dynamics (Baseline) ] ──→ Output A
         │
         └──→ [ Field Dynamics (Experiment) ] ──→ Output B
```

---

## 7. Architectural Constraints (ข้อจำกัดทางสถาปัตยกรรม)

> **ARCHITECTURAL CONSTRAINTS:**
>
> * **Preserve Baseline:** การศึกษาทั้งหมดต้องดำเนินการบนสมมติฐานว่า **WebGPU Particle PoC** ปัจจุบันคือ **Baseline Renderer** หลักที่ห้ามถูกแทรกแซง
> * **Renderer as Downstream:** **Shader** ต้องทำหน้าที่ประมวลผลการคำนวณ (**Execution Layer**) เท่านั้น ห้ามใส่ตรรกะการตีความความหมาย (**Semantic Authority**) ลงใน **Shader** เด็ดขาด

---

## Reproducibility

Benchmark command:
`npm run benchmark:sdf`

Output directory:
`research/field-dynamics/benchmarks/results/`

Expected output:
`research/field-dynamics/benchmarks/results/*.json`
`research/field-dynamics/benchmarks/results/*.md`
