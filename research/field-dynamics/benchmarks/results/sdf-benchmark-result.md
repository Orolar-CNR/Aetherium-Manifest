# Aetherium Dynamic SDF Morphology Benchmark Report

**Status:** RESEARCH / NON-CANONICAL
**Timestamp:** 2026-09-04T10:22:38.502Z
**Git Commit:** `1c66f7ebf5e892d736370aba3e25cd19cce084f1`
**Environment:** node v22.22.1 (linux x64)
**Device / Runtime Information:** Linux 6.8.0 | CPUs: 4 x Intel(R) Xeon(R) Processor @ 2.30GHz | Total Mem: 7959 MB

---

## 1. Executive Summary

- **Determinism Result:** `PASS`
- **SDF Resolution:** `UNAVAILABLE`
- **SDF Layer Count:** `3`

---

## 2. Resource Scaling Experiments

| Profile | Particle Count | Frame Time | p50 Frame Time | p95 Frame Time | Memory Usage | Degradation | Observed Result |
|---|---|---|---|---|---|---|---|
| LOW | 20,000 | 85.469 ms | 82.241 ms | 96.413 ms | 5.82 MB | FULL | Average frame time 85.469 ms with morphology error 0.6358 |
| MID | 100,000 | 400.945 ms | 399.035 ms | 422.925 ms | 7.31 MB | FULL | Average frame time 400.945 ms with morphology error 0.6353 |
| HIGH | 250,000 | 1003.487 ms | 960.528 ms | 1461.536 ms | 8.32 MB | FULL | Average frame time 1003.487 ms with morphology error 0.635 |

---

## 3. Degradation Strategy Experiments

| Degradation Config | Particle Count | Frame Time | p50 Frame Time | p95 Frame Time | Memory Usage | Observed Result |
|---|---|---|---|---|---|---|
| FULL | 100,000 | 383.118 ms | 382.43 ms | 392.035 ms | 7.32 MB | Average frame time 383.118 ms with morphology error 0.6832 |
| REDUCED_DETAIL | 100,000 | 164.775 ms | 164.856 ms | 168.504 ms | 4.88 MB | Average frame time 164.775 ms with morphology error 1.1307 |
| SIMPLIFIED | 100,000 | 118.337 ms | 116.007 ms | 141.241 ms | 11.37 MB | Average frame time 118.337 ms with morphology error 1.237 |
| SYMBOLIC | 100,000 | 70.456 ms | 68.834 ms | 85.882 ms | 10.65 MB | Average frame time 70.456 ms with morphology error 1.237 |
| MINIMAL_SAFE_FIELD | 100,000 | 72.633 ms | 71.58 ms | 86.632 ms | 9.93 MB | Average frame time 72.633 ms with morphology error 1.6546 |

---

## 4. Determinism Verification

- **Seed:** `999`
- **Particle Count:** `10000`
- **Determinism Result:** `PASS`
- **Observed Result:** `Deterministic state sum match: 18417656`
