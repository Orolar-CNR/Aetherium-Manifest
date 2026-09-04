# Aetherium Manifest

Dynamic SDF & Resource-Constrained Morphological Rendering — Research Note v0.1

Status: RESEARCH / NON-CANONICAL
Purpose: Evaluate feasibility and identify experiments required for figurative morphological rendering under constrained hardware.
Implementation Status: NOT IMPLEMENTED AS DESCRIBED
Canonical Runtime Status: NOT ESTABLISHED

---

1. Abstract

รายงานฉบับนี้ศึกษาความเป็นไปได้เชิงวิศวกรรมของการสร้างรูปทรงสัณฐานแบบรูปธรรม (figurative morphology) ด้วย Signed Distance Field (SDF) และอนุพันธ์ของ SDF สำหรับควบคุมการก่อรูปของอนุภาคแบบเรียลไทม์ภายใต้ Aetherium Manifest

ประเด็นศึกษาหลักประกอบด้วย:

1. ต้นทุนการคำนวณของ dynamic SDF
2. การใช้ gradient ของ SDF เพื่อควบคุมการเคลื่อนที่ของอนุภาค
3. การ composition หลายชั้นของ morphological fields
4. ผลของงบประมาณ GPU/CPU ต่อ fidelity ของ manifestation
5. วิธี degradation ที่รักษา semantic structure เมื่อทรัพยากรไม่เพียงพอ

รายงานนี้ ยังไม่ถือว่า SDF runtime, Governor B หรือ Dampening Transition Matrix เป็นระบบที่มีอยู่จริงใน repository ปัจจุบัน แต่ถือเป็น research candidate ที่ควรพิสูจน์ด้วย benchmark และ perceptual evaluation ก่อนนำไปยกระดับเป็น canonical architecture

หลักการนี้สอดคล้องกับ doctrine ของโครงการที่ไม่ควร canonicalize manifestation mapping ก่อนมี reproducible baseline และ perceptual evidence

---

2. Research Context

Aetherium Manifest มุ่งไปสู่การแสดงความหมายผ่านการปรากฏของแสง อนุภาค รูปทรง การเคลื่อนไหว และสภาพแวดล้อม มากกว่าการตอบกลับด้วยข้อความ

เอกสารของโครงการมีแนวคิดเรื่อง visual parameters เช่น:

- "base_shape"
- "particle_density"
- "turbulence"
- "flow_direction"
- "glow_intensity"
- "cohesion"

เพื่อให้ renderer สามารถแสดงสถานะที่มีโครงสร้างแทนการสุ่มเอฟเฟกต์

ดังนั้น SDF จึงสามารถถูกศึกษาในฐานะ candidate morphology backend สำหรับการสร้างรูปทรงหรือ boundary ที่อนุภาคสามารถ converge เข้าไปหาได้

แต่ ณ สถานะปัจจุบัน ยังไม่มีหลักฐานเพียงพอที่จะอ้างว่า SDF เป็นส่วนหนึ่งของ runtime canonical ที่กำลังทำงานอยู่

---

3. Research Question

คำถามหลักของการทดลองคือ:

«สามารถใช้ dynamic SDF เป็นกลไกกำหนด morphology ของ particle field แบบ real-time โดยยังรักษาความต่อเนื่องของ manifestation และอยู่ภายใน resource budget ของอุปกรณ์แต่ละระดับได้หรือไม่?»

คำถามย่อย:

RQ1 — Computational Cost

Dynamic SDF มีต้นทุนต่อ frame เท่าใด เมื่อ:

- resolution ของ field เพิ่มขึ้น
- จำนวน particle เพิ่มขึ้น
- จำนวน SDF layers เพิ่มขึ้น
- field ถูก recompute ทุก frame

RQ2 — Morphological Fidelity

gradient ของ SDF สามารถทำให้ particle field converge ไปยังรูปทรงที่ผู้ใช้สามารถรับรู้ได้จริงหรือไม่?

RQ3 — Layer Composition

การแยก foreground/background SDF fields สามารถลดต้นทุนได้โดยยังคง semantic salience ของ foreground หรือไม่?

RQ4 — Graceful Degradation

เมื่อ resource budget ลดลง ระบบสามารถลดรายละเอียดโดยยังรักษา semantic identity ของ manifestation ได้หรือไม่?

---

4. Proposed Morphological Model

โมเดลที่เสนอสำหรับการทดลอง:

Semantic / Morphological Target
            ↓
        SDF Field
            ↓
       Distance d(x)
            ↓
       Gradient ∇d(x)
            ↓
 Particle attraction / deformation
            ↓
       Morphological Field

สำหรับ boundary ของวัตถุโดยทั่วไป ค่า:

d(x) = 0

สามารถใช้เป็น boundary representation ได้

และ gradient:

∇d(x)

สามารถถูกทดลองใช้เป็นทิศทางในการปรับตำแหน่งของอนุภาค

อย่างไรก็ตาม สมการและวิธีการดังกล่าวัังเป็น experimental implementation hypothesis ของ Aetherium และยังไม่ได้รับการยืนยันว่าเป็นวิธี manifestation ที่ดีที่สุด

---

5. Multi-Layer SDF Hypothesis

การแบ่ง morphology ออกเป็นหลาย field เป็นแนวทางที่ควรทดลอง เช่น:

Manifestation
│
├── Background Field
│
├── Primary Object Field
│
└── Accent / Detail Field

สมมติฐานคือไม่จำเป็นต้องใช้ fidelity สูงสุดกับทุกส่วนของฉาก

ตัวอย่าง:

Background
→ low-detail field

Primary object
→ high-detail field

Accent
→ selective high-density field

เป้าหมายของการทดลองไม่ใช่การสร้างภาพที่ละเอียดที่สุด แต่คือการหาวิธีจัดสรร computation ให้ส่วนที่สำคัญเชิงการรับรู้ได้รับทรัพยากรมากกว่า

---

6. Resource-Constrained Rendering

เอกสาร RFC ปัจจุบันของ Aetherium มี resource profiles ที่สามารถใช้เป็น reference targets สำหรับการทดลอง:

Profile| max_particles| สถานะ
LOW| 20,000| SHOULD
MID| 100,000| SHOULD
HIGH| 250,000| SHOULD
ULTRA| 1,000,000| REFERENCE v0.1

ตัวเลขเหล่านี้เป็น resource-policy references ในสเปก ไม่ใช่ benchmark evidence ว่าอุปกรณ์จริงสามารถรักษา performance ตามตัวเลขดังกล่าวได้

ดังนั้นรายงาน ไม่ควรกล่าวว่า

«Tier 1 สามารถเรนเดอร์ 1,000,000 particles ได้จริง»

หรือ

«Tier 3 ไม่สามารถสร้าง figurative morphology ได้»

จนกว่าจะมี benchmark บนอุปกรณ์จริงรองรับ

---

7. Revised Degradation Hypothesis

เมื่อ resource budget ต่ำลง ระบบสามารถทดลอง degradation ตามลำดับ:

FULL MORPHOLOGY
      ↓
REDUCED DETAIL
      ↓
SIMPLIFIED MORPHOLOGY
      ↓
SYMBOLIC / ABSTRACT MORPHOLOGY
      ↓
MINIMAL SAFE FIELD

แนวคิดสำคัญคือ:

«ลดรายละเอียดก่อนลด semantic identity»

ตัวอย่างเช่น จาก:

complete figurative scene

อาจลดลงเป็น:

primary silhouette

แล้วจึง:

simplified geometric structure

และท้ายที่สุด:

minimal light field

นี่ควรถูกพิสูจน์ด้วย perceptual evaluation ไม่ควรถือว่า "simplified photic skeleton" เป็นผลลัพธ์ที่เหมาะสมโดยอัตโนมัติ

---

8. Governor / Dampening Status

แนวคิดเรื่อง Governor และ resource-based degradation มีอยู่ใน architecture corpus ของ Aetherium โดย Governor ถูกวางเป็น boundary ที่สามารถ validate, clamp, fallback, policy-block และ capability-gate ก่อน renderer

อย่างไรก็ตาม:

Dampening Transition Matrix ของ Governor B ยังควรถูกจัดเป็น research/design proposal

ไม่ควรเขียนว่า:

«Governor B ได้ตรวจสอบและลด particle budget บนอุปกรณ์ Tier 3 แล้ว»

จนกว่าจะมี implementation และ test evidence

ชื่อที่แนะนำสำหรับงานวิจัยช่วงนี้คือ:

«Resource-Aware Morphology Dampening Policy»

แทนที่จะเรียกเป็น runtime component ที่มีอยู่แล้ว

---

9. Safety Considerations

ระบบ Aetherium มีข้อกำหนดเชิงแนวคิดเกี่ยวกับ:

- flicker control
- motion sensitivity
- reduced-motion behavior
- uncontrolled strobe prevention
- entropy / turbulence control
- hardware degradation

ซึ่งสอดคล้องกับแนวคิด safety-aware visualization และ low-end survival law ใน corpus

แต่ไม่ควรอ้างว่า:

«SDF dampening ป้องกัน photosensitivity ได้แล้ว»

หรือ:

«thermal throttling ถูกป้องกันแล้ว»

เพียงเพราะลด particle count

สิ่งที่ถูกต้องกว่า:

«Resource-aware degradation สามารถเป็นกลไกหนึ่งที่ช่วยลด computational load และอาจช่วยลดความรุนแรงของ visual actuation บางรูปแบบ แต่ผลด้าน thermal behavior และ photosensitivity ต้องได้รับการทดสอบแยกต่างหาก»

---

10. Relation to 8D Presence IR

งานวิจัยนี้ไม่ควร redefine 8D Presence IR ใหม่

ตาม canonical proposal ปัจจุบัน:

P8 = [x, y, z, φ, c, ι, κ, ρ]

โดย:

- "x,y,z" = spatial coordinates
- "φ" = intent phase
- "c" = confidence
- "ι" = intent intensity
- "κ" = semantic coherence
- "ρ" = policy risk

โดยเฉพาะ "φ" ไม่ควรถูกนิยามในรายงานนี้ว่าเป็น physical oscillation phase

SDF ควรถือเป็น downstream morphology mechanism ที่รับ state/contract ที่ผ่านชั้นที่เหมาะสม ไม่ใช่การ redefine canonical semantic state

---

11. Experimental Architecture

โครงสร้างที่เหมาะสำหรับการทดลองคือ:

Experimental Semantic Target
            ↓
       SDF Generator
            ↓
       SDF Composition
            ↓
     Particle Morphology
            ↓
     Resource Controller
            ↓
      Renderer Backend
            ↓
    Perceptual Evaluation

จากนั้นเก็บ telemetry เช่น:

frame_time
p50_frame_time
p95_frame_time
particle_count
field_resolution
sdf_layer_count
gpu_time
cpu_time
memory_usage
morphology_error
spatial_coherence
recognition_accuracy
response_latency

แนวทาง benchmark ของ Aetherium เองก็เสนอให้แยก computational, scalability, determinism, numerical/simulation, manifestation และ perceptual metrics ออกจากกัน

---

12. Experimental Acceptance Criteria

ยังไม่ควรตั้ง acceptance criteria ว่า:

1M particles = successful
20K particles = failed

แต่ควรตั้งเป็นคำถามที่วัดได้ เช่น:

Computational

p95 frame time ≤ target

Morphological

shape deviation ≤ threshold

Stability

no divergence
no runaway particle growth

Perceptual

human recognition accuracy ≥ threshold

Semantic Preservation

เมื่อ resource budget ลดลง:

semantic recognition
ต้องลดลงช้ากว่า
visual fidelity

นี่จะทดสอบหลักการ:

«semantic identity should survive degradation»

แทนที่จะสมมติว่ารูปแบบ fallback หนึ่งแบบต้องเป็นคำตอบที่ดีที่สุด

---

13. Current Truth Boundary

เอกสารฉบับนี้ MUST NOT be interpreted as evidence that the following components currently exist as production runtime:

- Dynamic SDF Runtime
- Multi-Layer SDF Composer
- Governor B implementation
- Dampening Transition Matrix implementation
- Automatic Tier 1/Tier 3 morphological fallback
- Figurative SDF synthesis pipeline

สถานะของสิ่งเหล่านี้:

RESEARCH / DESIGN CANDIDATE

ไม่ใช่:

CURRENT ENGINEERING REALITY

ปัจจุบัน Phase 0.x ยังคงมีแกนหลักเป็น Visual State Contract, renderer implementations และ local heuristic interpretation ตามขอบเขตที่กำหนดไว้

---

14. Conclusion

Dynamic SDF เป็น candidate technology ที่มีเหตุผลเพียงพอสำหรับการทดลองใน Aetherium Manifest โดยเฉพาะเมื่อเป้าหมายคือการสร้าง morphology ที่ควบคุมได้ด้วย distance field และ gradient

อย่างไรก็ตาม รายงานนี้ ยังไม่สรุปว่า Dynamic SDF เป็นวิธีที่ดีที่สุด และไม่สรุปว่า hardware tier ใด “ไม่สามารถ” แสดงรูปทรงบางประเภทได้ในเชิงเด็ดขาด

ข้อสรุปที่เหมาะสมในปัจจุบันคือ:

Dynamic SDF is a viable research candidate for controlled morphological manifestation, but its computational cost, scalability, determinism, and perceptual value must be established experimentally before it can become part of Aetherium's canonical runtime architecture.

แนวทาง degradation ควรถูกออกแบบโดยยึดหลัก:

Preserve semantic identity
before
preserving visual detail

และการตัดสินใจสุดท้ายควรมาจาก:

Benchmark Evidence
+
Perceptual Evidence
+
Runtime Safety Evidence

ไม่ใช่จากสมมติฐานทางสถาปัตยกรรมเพียงอย่างเดียว

---

## Reproducibility

Benchmark command:
`npm run benchmark:sdf`

Output directory:
`research/field-dynamics/benchmarks/results/`

Expected output:
`research/field-dynamics/benchmarks/results/*.json`
`research/field-dynamics/benchmarks/results/*.md`
