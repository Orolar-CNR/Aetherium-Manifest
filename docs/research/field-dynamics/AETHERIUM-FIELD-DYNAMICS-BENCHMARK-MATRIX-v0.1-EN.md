# AETHERIUM FIELD DYNAMICS BENCHMARK MATRIX

**Document Version:** 0.1
**Date:** 2026-09-01
**Status:** EVALUATION FRAMEWORK | NOT PRODUCTION METRICS

---

## 1. Excluded Metrics

To prevent evaluation instability and low reproducibility:

> **STRICT PROHIBITION / EXCLUDED EVALUATION METRICS:**
> The following metrics are strictly prohibited from being used as decision criteria:
>
> * ❌ **"Beauty / Aesthetics"**
> * ❌ **"Naturalness"**
> * ❌ **"Visual Intelligence"**

---

## 2. Baseline Identity Metadata

To guarantee reproducibility and traceability, every **Benchmark Entry** must include the following baseline metadata:

* **`baseline_id`**: Reference identifier for the baseline dataset.
* **`experiment_id`**: Reference identifier for the associated experiment.
* **`renderer_version`**: Version of the backend (Particle or Field).
* **`seed`**: Random seed value used for simulation.
* **`state_id`**: Reference identifier for the tested **Manifest State**.
* **`parameter_set`**: Mapped numeric parameter values.
* **`entity_count`**: Number of entities (Particle count or Field resolution).
* **`simulation_time`**: Simulation duration and time step parameters.
* **`hardware_profile`**: GPU/CPU hardware specification profile used during testing.
* **`browser_profile`**: Web Environment specification profile.

---

## 3. Objective Measurements

Direct numerical measurements collected directly from the system without human interpretation:

| Category | Metric | Measurement Objective |
| :--- | :--- | :--- |
| **Computational** | Frame time (ms) | Processing duration per frame |
| **Computational** | p50 / p95 frame time | Frame rate stability and percentiles |
| **Computational** | GPU workload / throughput | Processing workload on the GPU |
| **Computational** | Memory footprint | Memory utilization rate |
| **Scalability** | Performance degradation | Scaling limits (1k / 10k / 100k entities) |
| **Determinism** | Output hash matching | Ability to produce identical outputs given identical seed/state |
| **Simulation** | Divergence / Drift | Equation divergence over simulation time |
| **Simulation** | Accumulation error | Cumulative error in Fluid/Particle systems |

---

## 4. Evaluation Measurements

Metrics converted from subjective perception into measurable variables via human evaluation protocols:

| Category | Metric | Measurement Objective |
| :--- | :--- | :--- |
| **Manifestation** | Spatial coherence | Ability to maintain cluster spatial structure |
| **Manifestation** | Motion smoothness | Continuity of motion flow |
| **Manifestation** | Morphology stability | Structural stability under perturbation |
| **Controllability** | ∆State vs ∆Dynamics response | Response fidelity (e.g. whether Δenergy alters motion intensity as expected) |
| **Perceptual** | Recognition accuracy (%) | Accuracy percentage in identifying the correct **Semantic State** |
| **Perceptual** | Response time (ms) | Decision speed in perceiving meaning |
| **Perceptual** | User confidence score (1-5) | Observer confidence level rating |

---

## 5. Cross-Backend Manifestation Consistency

Evaluation framework testing the **"One Semantic State, Many Manifestations"** philosophy by categorizing consistency between Particle Backend and Field Backend into three tiers:

1. **Numerical Consistency:** Degree of mathematical parameter alignment at minimal bounds.
2. **Visual/Structural Consistency:** Comparability of spatial morphology and flow direction.
3. **Perceptual Consistency:** Alignment in human interpretation of underlying state meaning (e.g., energy, coherence, state).

---

## 6. Perceptual Evaluation Protocol (Draft)

Standardized protocol for gathering **Evaluation Measurements**:

1. **Present manifestation** to observer (blinded to the underlying backend type).
2. **Prompt observer to select** the **Semantic State** that best matches the visual observation.
3. **System records:** **Accuracy**, **Response Time**, and prompts for user **Confidence Score**.
