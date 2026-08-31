# AETHERIUM BASELINE METADATA SCHEMA

**Document Version:** 0.1
**Date:** 2026-09-01
**Status:** RESEARCH TOOLING | BASELINE DATASET SPEC

---

เอกสารฉบับนี้กำหนดโครงสร้าง **JSON Schema** สำหรับบันทึกชุดข้อมูลจาก **WebGPU Particle PoC** เพื่อใช้เป็น **Baseline Dataset** สำหรับการวิจัย **Field Dynamics**

> **SCHEMA USAGE DOCTRINE:**
> ไฟล์ Schema ดิบสแตนด์อโลนถูกจัดเก็บไว้ที่ `docs/research/field-dynamics/baseline-metadata.schema.json` เพื่อให้ระบบและชุดเครื่องมือสามารถนำไปใช้วัดผลและตรวจสอบความถูกต้อง (**Validation**) ของข้อมูล **Baseline Identity Metadata** ได้ทันที

---

## 1. JSON Schema Definition (การนิยามโครงสร้าง JSON Schema)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Aetherium Baseline Identity Metadata",
  "description": "โครงสร้างข้อมูลผลลัพธ์มาตรฐานจาก WebGPU Particle PoC เพื่อรองรับความสามารถในการทำซ้ำ (Reproducibility) และการประเมินผล (Benchmarking)",
  "type": "object",
  "required": [
    "baseline_id",
    "experiment_id",
    "timestamp",
    "environment",
    "inputs",
    "execution",
    "metrics",
    "output_characteristics"
  ],
  "properties": {
    "baseline_id": {
      "type": "string",
      "description": "รหัสระบุตัวตนเฉพาะสำหรับการบันทึก Baseline นี้ (เช่น UUID)"
    },
    "experiment_id": {
      "type": "string",
      "description": "รหัสอ้างอิงถึงการทดลองวิจัยที่เกี่ยวข้อง (เช่น 'EXP-FIELD-DYNAMICS-01')"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "environment": {
      "type": "object",
      "description": "ข้อมูลจำเพาะของ Hardware และ Browser Profile",
      "properties": {
        "renderer_version": { "type": "string" },
        "gpu_adapter": { "type": "string" },
        "user_agent": { "type": "string" },
        "device_pixel_ratio": { "type": "number" }
      },
      "required": ["renderer_version", "gpu_adapter"]
    },
    "inputs": {
      "type": "object",
      "description": "ชุดข้อมูลนำเข้าที่ MUST (ต้อง) เหมือนกันทุกประการข้ามแต่ละ Backend",
      "properties": {
        "seed": { "type": "number" },
        "state_id": { "type": "string", "description": "รหัสอ้างอิง Semantic State" },
        "manifest_state": {
          "type": "object",
          "description": "ค่า Semantic State ดิบ (เช่น energy, coherence)",
          "additionalProperties": { "type": "number" }
        },
        "numeric_parameters": {
          "type": "object",
          "description": "ค่าพารามิเตอร์การแสดงผลเชิงตัวเลขที่ถูกแปลงมาจาก State",
          "additionalProperties": { "type": "number" }
        }
      },
      "required": ["seed", "state_id", "manifest_state", "numeric_parameters"]
    },
    "execution": {
      "type": "object",
      "description": "การกำหนดค่าสำหรับการจำลอง (Simulation) และการ Render",
      "properties": {
        "entity_count": { "type": "integer" },
        "simulation_time_ms": { "type": "number" },
        "frame_count": { "type": "integer" },
        "time_step_dt": { "type": "number" }
      },
      "required": ["entity_count", "simulation_time_ms", "frame_count"]
    },
    "metrics": {
      "type": "object",
      "description": "การวัดผลประสิทธิภาพเชิงวัตถุวิสัย (Objective performance measurements)",
      "properties": {
        "avg_fps": { "type": "number" },
        "frame_time_p50_ms": { "type": "number" },
        "frame_time_p95_ms": { "type": "number" },
        "gpu_compute_time_ms": { "type": "number" }
      },
      "required": ["frame_time_p50_ms", "frame_time_p95_ms"]
    },
    "output_characteristics": {
      "type": "object",
      "description": "รอยเท้าเชิงตัวเลข (Numerical footprint) ของการแสดงผลสำหรับตรวจสอบ Determinism และ Consistency",
      "properties": {
        "snapshot_hash": {
          "type": "string",
          "description": "ค่า Hash ของ Position Buffer ณ จุดสิ้นสุดของเวลาจำลอง"
        },
        "spatial_bounds": {
          "type": "object",
          "properties": {
            "min": { "type": "array", "items": { "type": "number" } },
            "max": { "type": "array", "items": { "type": "number" } }
          }
        },
        "avg_velocity_magnitude": { "type": "number" }
      }
    }
  }
}
```

---

## 2. Example Data Payload (ตัวอย่างข้อมูล Payload)

```json
{
  "baseline_id": "base-4f9c-b12a-8991320ef45a",
  "experiment_id": "EXP-FIELD-DYNAMICS-01",
  "timestamp": "2026-09-01T10:00:00Z",
  "environment": {
    "renderer_version": "v0.5.2-particle-baseline",
    "gpu_adapter": "Apple M2 Max",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...",
    "device_pixel_ratio": 2
  },
  "inputs": {
    "seed": 16982435,
    "state_id": "STATE_TURBULENT_AWAKENING",
    "manifest_state": {
      "energy": 0.85,
      "coherence": 0.20,
      "turbulence": 0.90
    },
    "numeric_parameters": {
      "base_speed": 4.5,
      "noise_scale": 1.2,
      "agitation_force": 3.8,
      "dissipation_rate": 0.05
    }
  },
  "execution": {
    "entity_count": 100000,
    "simulation_time_ms": 5000,
    "frame_count": 300,
    "time_step_dt": 0.016
  },
  "metrics": {
    "avg_fps": 59.8,
    "frame_time_p50_ms": 1.2,
    "frame_time_p95_ms": 1.5,
    "gpu_compute_time_ms": 0.8
  },
  "output_characteristics": {
    "snapshot_hash": "a8f5f167f44f4964e6c998dee827110c",
    "spatial_bounds": {
      "min": [-10.5, -8.2, -5.0],
      "max": [11.2, 9.1, 5.5]
    },
    "avg_velocity_magnitude": 2.45
  }
}
```
