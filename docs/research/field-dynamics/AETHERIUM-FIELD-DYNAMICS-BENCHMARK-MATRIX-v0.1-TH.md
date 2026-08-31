# AETHERIUM FIELD DYNAMICS BENCHMARK MATRIX

**Document Version:** 0.1
**Date:** 2026-09-01
**Status:** EVALUATION FRAMEWORK | NOT PRODUCTION METRICS

---

## 1. Excluded Metrics (ตัวชี้วัดที่ถูกสั่งห้าม)

เพื่อป้องกันการประเมินที่มีความผันผวนและไม่สามารถทำซ้ำได้ (Low Reproducibility)

> **STRICT PROHIBITION / ข้อห้ามเด็ดขาดในการวัดผล:**
> ตัวชี้วัดต่อไปนี้ **ห้าม** ถูกนำมาใช้เป็นเกณฑ์ในการตัดสินใจโดยเด็ดขาด:
>
> * ❌ **"ความสวยงาม"** (Beauty / Aesthetics)
> * ❌ **"ความเป็นธรรมชาติ"** (Naturalness)
> * ❌ **"ความฉลาดของภาพ"** (Visual Intelligence)

---

## 2. Baseline Identity Metadata

เพื่อรับประกันความสามารถในการทำซ้ำ (Reproducibility) และการสืบย้อนกลับ (Traceability) ทุกๆ การบันทึกผลการทดสอบ (**Benchmark Entry**) จะต้องแนบ Metadata พื้นฐานเหล่านี้เสมอ:

* **`baseline_id`**: รหัสอ้างอิงชุดข้อมูล Baseline
* **`experiment_id`**: รหัสอ้างอิงการทดลอง
* **`renderer_version`**: เวอร์ชันของ Backend (Particle หรือ Field)
* **`seed`**: ค่า Seed ที่ใช้ในการสุ่ม
* **`state_id`**: รหัสอ้างอิง **Manifest State** ที่ใช้ทดสอบ
* **`parameter_set`**: ค่า **Numeric parameters** ที่ถูกแปลงมา
* **`entity_count`**: จำนวนเอนทิตี (**Particle count** หรือ **Field resolution**)
* **`simulation_time`**: เวลาจำลอง (**Time step** / Duration)
* **`hardware_profile`**: ข้อมูลจำเพาะของ GPU/CPU ที่ใช้ทดสอบ
* **`browser_profile`**: ข้อมูลจำเพาะของ **Web Environment**

---

## 3. Objective Measurements (การวัดเชิงวัตถุวิสัย/เครื่องมือ)

ตัวชี้วัดเชิงตัวเลขที่ได้จากระบบโดยตรง ไม่ขึ้นอยู่กับการตีความของมนุษย์:

| Category | Metric | Measurement Objective |
| :--- | :--- | :--- |
| **Computational** | Frame time (ms) | ระยะเวลาประมวลผลต่อเฟรม |
| **Computational** | p50 / p95 frame time | ความเสถียรของเฟรมเรต |
| **Computational** | GPU workload / throughput | ภาระการทำงานของหน่วยประมวลผลกราฟิก |
| **Computational** | Memory footprint | อัตราการใช้หน่วยความจำ |
| **Scalability** | Performance degradation | ขีดจำกัดการขยายตัว (1k / 10k / 100k entities) |
| **Determinism** | Output hash matching | ความสามารถในการให้ผลลัพธ์เดิมเมื่อใช้ Seed/State เดิม |
| **Simulation** | Divergence / Drift | ความคลาดเคลื่อนของสมการเมื่อเวลาผ่านไป |
| **Simulation** | Accumulation error | ข้อผิดพลาดสะสมในระบบ Fluid/Particle |

---

## 4. Evaluation Measurements (การวัดเชิงประเมิน/การรับรู้)

ตัวชี้วัดที่แปลงสภาพจาก "ความรู้สึก" เป็น "ตัวแปรที่วัดได้" ผ่านกระบวนการทดสอบกับมนุษย์:

| Category | Metric | Measurement Objective |
| :--- | :--- | :--- |
| **Manifestation** | Spatial coherence | ความสามารถในการคงโครงสร้างพื้นที่ของกลุ่มก้อน |
| **Manifestation** | Motion smoothness | ความต่อเนื่องของการเคลื่อนไหว |
| **Manifestation** | Morphology stability | ความมั่นคงของรูปทรงเมื่อถูกรบกวน |
| **Controllability** | ∆State vs ∆Dynamics response | ความแม่นยำในการตอบสนอง (เช่น Δenergy ทำให้ motion intensity เปลี่ยนไปตามคาดหรือไม่) |
| **Perceptual** | Recognition accuracy (%) | เปอร์เซ็นต์ความถูกต้องในการระบุ **Semantic State** |
| **Perceptual** | Response time (ms) | ความเร็วในการตัดสินใจ/รับรู้ความหมาย |
| **Perceptual** | User confidence score (1-5) | ระดับความมั่นใจของผู้ทดสอบ |

---

## 5. Cross-Backend Manifestation Consistency

การประเมินเพื่อทดสอบปรัชญา **"One Semantic State, Many Manifestations"** โดยแบ่งระดับความสอดคล้องกัน (Consistency) ระหว่าง Particle Backend และ Field Backend ออกเป็น 3 ระดับ:

1. **Numerical Consistency:** ค่าพารามิเตอร์เชิงคณิตศาสตร์ขั้นต่ำมีความสอดคล้องกันมากน้อยเพียงใด?
2. **Visual/Structural Consistency:** โครงสร้างเชิงพื้นที่ (Morphology) และทิศทาง (Flow) มีลักษณะที่เทียบเคียงกันได้หรือไม่?
3. **Perceptual Consistency:** มนุษย์แปลความหมาย (อารมณ์, พลังงาน, สภาวะ) จากทั้งสอง Backend ออกมาได้ตรงกันหรือไม่?

---

## 6. Perceptual Evaluation Protocol (Draft)

ขั้นตอนมาตรฐานสำหรับการเก็บข้อมูลกลุ่ม **Evaluation Measurements**:

1. **แสดง Manifestation** แก่ผู้ทดสอบ (โดยปกปิดว่าเป็น Backend ชนิดใด)
2. **กำหนดให้ผู้ทดสอบเลือก** **Semantic State** ที่ตรงกับสิ่งที่มองเห็นมากที่สุด
3. **ระบบบันทึก:** **Accuracy** (ความถูกต้อง), **Response Time** (ระยะเวลาตัดสินใจ), และให้ผู้ทดสอบระบุ **Confidence Score**
