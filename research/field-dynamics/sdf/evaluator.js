/**
 * Research Candidate: Dynamic Multi-Layer SDF Field Evaluator
 * Status: RESEARCH / NON-CANONICAL
 *
 * Evaluates multi-layer SDF fields and computes field gradients using finite difference.
 */

import { SDFPrimitives } from './primitives.js';

export class SDFFieldEvaluator {
  /**
   * Evaluate a single layer specification at point p = [x, y, z] and time t.
   */
  static evaluateLayer(p, layerSpec, t = 0) {
    if (!layerSpec || layerSpec.active === false) return Infinity;

    // Apply translation / motion if specified
    let pos = [p[0], p[1], p[2]];
    if (layerSpec.translation) {
      const tx = layerSpec.translation[0] + (layerSpec.oscillate ? Math.sin(t * layerSpec.oscillate[0]) * layerSpec.oscillate[1] : 0);
      const ty = layerSpec.translation[1] + (layerSpec.oscillate ? Math.cos(t * layerSpec.oscillate[0]) * layerSpec.oscillate[1] : 0);
      const tz = layerSpec.translation[2];
      pos = SDFPrimitives.translate(pos, [tx, ty, tz]);
    }

    const type = layerSpec.type || 'sphere';
    switch (type) {
      case 'sphere':
        return SDFPrimitives.sphere(pos, layerSpec.radius || 1.0);
      case 'box':
        return SDFPrimitives.box(pos, layerSpec.halfExtents || [1.0, 1.0, 1.0]);
      case 'torus':
        return SDFPrimitives.torus(pos, layerSpec.torusRadii || [1.0, 0.25]);
      case 'composite_smooth': {
        const d1 = this.evaluateLayer(pos, layerSpec.child1, t);
        const d2 = this.evaluateLayer(pos, layerSpec.child2, t);
        return SDFPrimitives.smoothUnion(d1, d2, layerSpec.smoothFactor || 0.5);
      }
      default:
        return SDFPrimitives.sphere(pos, 1.0);
    }
  }

  /**
   * Evaluate multi-layer SDF with support for degradation strategies:
   * FULL, REDUCED_DETAIL, SIMPLIFIED, SYMBOLIC, MINIMAL_SAFE_FIELD
   */
  static evaluateMultiLayer(p, config, t = 0, degradationLevel = 'FULL') {
    if (degradationLevel === 'MINIMAL_SAFE_FIELD') {
      return SDFPrimitives.sphere(p, 0.5);
    }

    if (degradationLevel === 'SYMBOLIC') {
      return SDFPrimitives.sphere(p, 1.0);
    }

    const layers = config.layers || {};

    if (degradationLevel === 'SIMPLIFIED') {
      // Evaluate only simplified foreground layer or default sphere
      if (layers.foreground) {
        return this.evaluateLayer(p, { type: 'sphere', radius: layers.foreground.radius || 1.0, translation: layers.foreground.translation }, t);
      }
      return SDFPrimitives.sphere(p, 1.0);
    }

    let d = Infinity;

    // Foreground layer
    if (layers.foreground) {
      const dFg = this.evaluateLayer(p, layers.foreground, t);
      d = SDFPrimitives.union(d, dFg);
    }

    // Background layer (ignored in REDUCED_DETAIL if specified, or computed with lower weight)
    if (layers.background && degradationLevel !== 'REDUCED_DETAIL') {
      const dBg = this.evaluateLayer(p, layers.background, t);
      d = SDFPrimitives.smoothUnion(d, dBg, 0.8);
    }

    // Accent layer (ignored in REDUCED_DETAIL and SIMPLIFIED)
    if (layers.accent && degradationLevel === 'FULL') {
      const dAcc = this.evaluateLayer(p, layers.accent, t);
      d = SDFPrimitives.smoothUnion(d, dAcc, 0.3);
    }

    return Number.isFinite(d) ? d : SDFPrimitives.sphere(p, 1.0);
  }

  /**
   * Compute gradient \nabla d(p) using central finite differences.
   * Returns normalized directional gradient vector [gx, gy, gz].
   */
  static computeGradient(p, config, t = 0, degradationLevel = 'FULL', eps = 0.001) {
    const dx = this.evaluateMultiLayer([p[0] + eps, p[1], p[2]], config, t, degradationLevel) -
               this.evaluateMultiLayer([p[0] - eps, p[1], p[2]], config, t, degradationLevel);
    const dy = this.evaluateMultiLayer([p[0], p[1] + eps, p[2]], config, t, degradationLevel) -
               this.evaluateMultiLayer([p[0], p[1] - eps, p[2]], config, t, degradationLevel);
    const dz = this.evaluateMultiLayer([p[0], p[1], p[2] + eps], config, t, degradationLevel) -
               this.evaluateMultiLayer([p[0], p[1], p[2] - eps], config, t, degradationLevel);

    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-9) return [0, 0, 0];
    return [dx / len, dy / len, dz / len];
  }
}
