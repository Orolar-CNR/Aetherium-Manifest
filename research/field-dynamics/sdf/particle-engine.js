/**
 * Research Candidate: SDF-Guided Particle Simulation Engine
 * Status: RESEARCH / NON-CANONICAL
 *
 * Simulates particle dynamics driven by SDF gradients ∇d(x) towards d(x)=0 isosurface.
 */

import { SDFFieldEvaluator } from './evaluator.js';

export class SDFParticleEngine {
  constructor(particleCount = 1000, seed = 42) {
    this.particleCount = particleCount;
    this.seed = seed;
    this.positions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);
    this.resetWithSeed(seed);
  }

  /**
   * Deterministic Linear Congruential Generator (LCG) for reproducible particle initialization.
   */
  resetWithSeed(seed) {
    this.seed = seed;
    let state = seed >>> 0;
    const lcg = () => {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    };

    for (let i = 0; i < this.particleCount; i++) {
      // Uniform distribution within bounding sphere of radius 3.0
      const u = lcg();
      const v = lcg();
      const w = lcg();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(w) * 3.0;

      this.positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      this.positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.positions[i * 3 + 2] = r * Math.cos(phi);

      this.velocities[i * 3 + 0] = (lcg() - 0.5) * 0.1;
      this.velocities[i * 3 + 1] = (lcg() - 0.5) * 0.1;
      this.velocities[i * 3 + 2] = (lcg() - 0.5) * 0.1;
    }
  }

  /**
   * Advance simulation by 1 step (dt) against the specified SDF field config.
   */
  step(sdfConfig, dt = 0.016, timeStep = 0, degradationLevel = 'FULL', attractionGain = 5.0, damping = 0.85) {
    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const p = [this.positions[idx], this.positions[idx + 1], this.positions[idx + 2]];

      // Compute SDF distance and gradient
      const dist = SDFFieldEvaluator.evaluateMultiLayer(p, sdfConfig, timeStep * dt, degradationLevel);
      const grad = SDFFieldEvaluator.computeGradient(p, sdfConfig, timeStep * dt, degradationLevel);

      // Force towards isosurface d(x) = 0: F = -grad * dist * gain
      const fx = -grad[0] * dist * attractionGain;
      const fy = -grad[1] * dist * attractionGain;
      const fz = -grad[2] * dist * attractionGain;

      // Update velocity with damping
      this.velocities[idx] = (this.velocities[idx] + fx * dt) * damping;
      this.velocities[idx + 1] = (this.velocities[idx + 1] + fy * dt) * damping;
      this.velocities[idx + 2] = (this.velocities[idx + 2] + fz * dt) * damping;

      // Update position
      this.positions[idx] += this.velocities[idx] * dt;
      this.positions[idx + 1] += this.velocities[idx + 1] * dt;
      this.positions[idx + 2] += this.velocities[idx + 2] * dt;
    }
  }

  /**
   * Compute average distance error of particles relative to d(x)=0 boundary (morphological error).
   */
  computeMorphologyError(sdfConfig, timeStep = 0, degradationLevel = 'FULL') {
    let totalDistSq = 0;
    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const p = [this.positions[idx], this.positions[idx + 1], this.positions[idx + 2]];
      const dist = SDFFieldEvaluator.evaluateMultiLayer(p, sdfConfig, timeStep * 0.016, degradationLevel);
      totalDistSq += dist * dist;
    }
    return Math.sqrt(totalDistSq / this.particleCount);
  }

  /**
   * Export deterministic state hash for determinism / reproducibility checking.
   */
  exportSnapshot(precision = 6) {
    const factor = Math.pow(10, precision);
    let sampleSum = 0;
    for (let i = 0; i < this.positions.length; i++) {
      sampleSum += Math.round(this.positions[i] * factor);
    }
    return {
      particleCount: this.particleCount,
      seed: this.seed,
      sampleSum: sampleSum,
      firstParticle: [
        Math.round(this.positions[0] * factor) / factor,
        Math.round(this.positions[1] * factor) / factor,
        Math.round(this.positions[2] * factor) / factor
      ]
    };
  }
}
