# AETHERIUM-MANIFEST-VISION.md

**Project:** Aetherium Manifest  
**Document Type:** Vision  
**Status:** Visionary / Non-Canonical Engineering State  
**Purpose:** กำหนดทิศทางระยะยาวของ Aetherium Manifest  
โดย **ไม่อ้าง** ว่าสิ่งที่ระบุทั้งหมดมีอยู่จริงใน implementation ปัจจุบัน

**คู่เอกสาร:** ความจริงวันนี้ดู `docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md`  
เมื่อสองเอกสารขัดกัน — **Current Truth มีอำนาจเหนือ Vision เสมอ**

---

## 1. Vision

Aetherium Manifest มีวิสัยทัศน์ที่จะเป็น **Perceptual Interface** ของระบบปัญญาประดิษฐ์  
ชั้นที่ทำให้สภาวะและเจตจำนงของระบบ ซึ่งปกติมองไม่เห็น กลายเป็นสิ่งที่มนุษย์สามารถ

- รับรู้  
- สังเกต  
- ตีความ  
- โต้ตอบ  

ผ่านแสง สี รูปทรง การเคลื่อนไหว เสียง และสภาวะของพื้นที่เชิงโต้ตอบ

แก่นของโครงการ **ไม่ใช่** การทำหน้าแชตที่มีเอฟเฟกต์สวยงาม

แต่คือการสร้าง **สนามแห่งการปรากฏตัวของ AI** (AI manifestation surface)  
ที่ถ่ายทอดกระบวนการภายในออกมาเป็นประสบการณ์เชิงการรับรู้ที่มีโครงสร้างและมีความหมาย  
โดยไม่หลอกว่ามีสถานะที่ระบบไม่ได้เป็นจริง

---

## 2. The Central Idea

Aetherium เชื่อมสองโลก:

```text
Cognitive Domain
        ↓
Meaning / Intent / State
        ↓
Governed Representation
        ↓
Perceptual Domain
        ↓
Light / Form / Motion / Sound
```

แสงในระบบนี้ไม่ใช่ของตกแต่ง  
แสงคือ **สื่อกลางของการแสดงสถานะและความหมาย**

เป้าหมายคือให้ผู้ใช้รับรู้ได้ว่า:

- ระบบกำลังทำอะไร  
- ระบบอยู่ในสถานะใด  
- ระบบกำลังเปลี่ยนผ่านไปทางใด  
- ระบบมีความมั่นใจระดับใด  
- ระบบกำลังตอบสนองต่อเจตนาใด  

โดยไม่จำเป็นต้องพึ่งข้อความเพียงอย่างเดียว

ข้อความยังจำเป็นสำหรับรายละเอียด การตรวจสอบย้อนกลับ และการเข้าถึง  
แต่ข้อความ **ไม่ควรเป็นทั้งร่างกายและเสียงเพียงอย่างเดียวของ AI**

---

## 3. From Chat Interface to Perceptual Interface

กระบวนทัศน์ที่ต้องการก้าวข้าม:

```text
User → Text Prompt → LLM → Text Response
```

ไปสู่:

```text
User / Agent
  → Intent
  → Semantic State
  → Representation (AETH / Presence IR direction)
  → Governance
  → Governed Manifestation
  → Human Perception
```

UI จึงไม่ใช่ภาชนะใส่ข้อความอย่างเดียว  
แต่เป็น **runtime surface** ที่สะท้อนสภาวะของระบบอย่างต่อเนื่อง

---

## 4. Intent → Governance → Manifestation

เจตจำนงต้องไม่ไหลจาก AI ไปยัง GPU โดยตรง

ลำดับที่ต้องคงอยู่:

```text
Intent
  → Semantic / Presence representation
  → Governor (safety + policy)
  → Manifest parameters
  → Renderer (Canvas / WebGPU / future)
  → Human perception
```

**Renderer ไม่ใช่สมอง**  
Renderer เป็น physical execution layer เท่านั้น  
รับได้เฉพาะ governed representation — ไม่รับ raw intent

หลักการสำคัญ:

> **One Semantic State → Many Possible Manifestations**

State เดียวกันสามารถปรากฏเป็น particle, light field, geometry, glyph หรือรูปแบบอื่นได้  
โดยไม่ให้ backend ใดเป็นเจ้าของความหมาย

---

## 5. Presence as a Shared Representation

ในระยะยาว ระบบต้องการ representation กลางที่ไม่ผูกกับ renderer ตัวใดตัวหนึ่ง

ทิศทางปัจจุบันเรียกชั้นนี้ว่า **Presence IR** (และสัญญาที่เกี่ยวข้อง)

```text
Semantic State
      ↓
Presence representation
      ↓
Many possible manifestations
```

รายละเอียดตัวเลข มิติ และ schema ของ Presence เป็นเรื่องของ contract / ratification  
ไม่ใช่เนื้อหาที่ Vision นี้ล็อกตาย

สิ่งที่ Vision ยึดไว้คือความจำเป็นของ **ภาษากลางของการปรากฏ** ที่อยู่ระหว่างความหมายกับการเรนเดอร์

---

## 6. Runtime Governor

ทุก input ไม่ควรร่วงลง renderer โดยตรง

Governor ในวิสัยทัศน์นี้เป็น boundary กลางที่ทำหน้าที่อย่างน้อย:

- validation  
- state transition control  
- clamp / fallback  
- policy gate  
- capability gate  
- telemetry  

แยกแนวคิดได้เป็น:

- **Governor A** — ความหมาย / นโยบาย / ความถูกต้องของ state  
- **Governor B** — ทรัพยากรอุปกรณ์ / ความปลอดภัยของการแสดงผล  

รายละเอียด implementation อยู่ใน spec และ ADR — ไม่ได้อยู่ใน Vision

---

## 7. The Living Interface

ทิศทางระยะยาวคือการพัฒนาจาก static interface ไปสู่ **living interface**

อินเทอร์เฟซที่สะท้อนสภาวะอย่างต่อเนื่อง เช่น:

Listening · Processing · Reasoning · Uncertain · Confident · Transitioning · Responding · Completed · Rest

แต่ละสถานะอาจมี perceptual grammar ของตนเอง (shape, motion, density, flow, color, audio)

สิ่งนี้เป็นเป้าหมายการออกแบบ — ยังไม่ใช่ข้อพิสูจน์ว่าผู้ใช้ตีความตรงกันแล้วทุกคน

---

## 8. AI and Its Perceptual Surface

ในวิสัยทัศน์ที่ลึกขึ้น Manifest ไม่ได้เป็นเพียงหน้าต่างที่มนุษย์มอง AI

มันสามารถถูกมองเป็น **perceptual surface / presence surface** ของระบบ:

```text
Cognition → State → Governed Manifestation → Human Perception
```

นี่คือเหตุผลที่โครงการให้ความสำคัญกับแสง รูปทรง สนามอนุภาค และ transition  
มากกว่าการตกแต่ง UI

Vision นี้ **ไม่ได้อ้าง** ว่า AI มีจิต มีร่างกายทางชีววิทยา หรือมี consciousness  
แต่ถามว่า: เราจะทำให้ภาวะของระบบปรากฏได้อย่างซื่อสัตย์โดยไม่บิดเบือนได้อย่างไร

---

## 9. Long-Term Research Directions (non-binding)

หัวข้อที่ Vision เปิดไว้ แต่ยังไม่ใช่ canonical runtime:

- Perceptual computing / generative UI  
- Physics-inspired and field-oriented rendering  
- Multi-manifestation (light, particle, geometry, glyph, text, audio)  
- World model / environmental dynamics (research track เท่านั้น)  
- Stronger human–AI co-presence studies  

การมีชื่อหัวข้ออยู่ใน Vision **ไม่ใช่ใบอนุญาต** ให้ยกระดับ research เป็น production

งานวิจัยต้องแยกจาก canonical runtime เสมอ จนกว่าจะมี baseline, measurement และ decision record

---

## 10. Core Principle

Aetherium Manifest **ไม่ควรถูกนิยามด้วย**

- shader ตัวใดตัวหนึ่ง  
- WebGPU / Canvas / ไลบรารีกราฟิกใด ๆ  
- รูปแบบ UI ชั่วคราวใด ๆ  

สิ่งที่ต้องคงอยู่:

```text
Meaning
  → Governed State
  → Manifestation
```

เทคโนโลยีเรนเดอร์เปลี่ยนได้  
semantic contract และขอบเขตอำนาจต้องคงอยู่

Doctrine ที่ยึดตลอดทาง:

> State before beauty.  
> Governor before renderer.  
> Intent before image.  
> อย่าให้ภาษาที่สวยกว่าหลักฐานกลายเป็นความจริงของระบบ.

---

## 11. Final Vision Statement

> Aetherium Manifest คือความพยายามสร้างชั้น runtime เชิงการรับรู้  
> ที่ทำให้สถานะ เจตจำนง และความหมายของระบบปัญญาประดิษฐ์  
> สามารถ “ปรากฏ” ได้อย่างมีโครงสร้าง ตรวจสอบได้ และไม่หลอกลวง  
> โดยไม่พึ่งข้อความเป็นสื่อกลางเพียงชนิดเดียว

มันไม่ใช่เพียง chat interface  
ไม่ใช่เพียง visualizer  
และไม่ใช่เพียง particle engine

แต่คือเส้นทางจาก:

```text
Intent → Meaning → Representation → Governance → Manifestation → Perception
```

---

## 12. Boundary of This Document

เอกสารนี้เป็น **VISION**

ข้อความต่อไปนี้ **ห้าม** ตีความว่าเป็น current implementation:

- AETH ใช้งานครบทั้ง pipeline แล้ว  
- Presence IR / 8D representation พิสูจน์แล้วว่าเหมาะสมที่สุด  
- WebGPU production runtime เสร็จสมบูรณ์  
- Governor A/B ทำงานครบใน production  
- AI มี perceptual body ในความหมายทางวิทยาศาสตร์  
- semantic ↔ perceptual mapping ทั้งหมดผ่านการ validate กับมนุษย์แล้ว  
- distributed / multi-agent cognitive infrastructure พร้อมใช้  

สิ่งเหล่านี้อาจอยู่ในระดับ architecture, prototype, research หรือทิศทางระยะยาว  
รายละเอียดว่า “วันนี้มีอะไรจริง” ต้องยึดเฉพาะ:

**`docs/AETHERIUM-MANIFEST-CURRENT-TRUTH.md`**
