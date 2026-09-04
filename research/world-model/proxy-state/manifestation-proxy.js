/**
 * Environmental Dynamics Runtime - Manifestation Proxy Compiler (Research Only)
 */

import { roundDP } from '../world-state/world-state.js';

export function compileManifestationProxy(worldState) {
  const { timestamp, global_energy, coherence, entropy, fields, disturbances } = worldState;

  // 1. Calculate bounding spatial region
  let centerX = 0.5;
  let centerY = 0.5;
  let extentX = 0.2;
  let extentY = 0.2;

  if (disturbances.length > 0) {
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    let totalWeight = 0;
    let sumX = 0, sumY = 0;

    disturbances.forEach(d => {
      const [x, y] = d.position;
      const w = d.amplitude;
      sumX += x * w;
      sumY += y * w;
      totalWeight += w;

      minX = Math.min(minX, x - 0.1);
      maxX = Math.max(maxX, x + 0.1);
      minY = Math.min(minY, y - 0.1);
      maxY = Math.max(maxY, y + 0.1);
    });

    if (totalWeight > 0) {
      centerX = sumX / totalWeight;
      centerY = sumY / totalWeight;
    }
    extentX = Math.max(0.1, (maxX - minX) / 2);
    extentY = Math.max(0.1, (maxY - minY) / 2);
  } else if (fields.length > 0) {
    centerX = fields[0].center[0];
    centerY = fields[0].center[1];
    extentX = fields[0].radius;
    extentY = fields[0].radius;
  }

  // 2. Determine morphology
  let morphology = 'quiescent_ambient';
  if (fields.some(f => f.type === 'directional_flow')) {
    morphology = 'directional_flow';
  } else if (disturbances.length >= 2) {
    morphology = 'interference_pattern';
  } else if (fields.some(f => f.type === 'radial_expansion')) {
    morphology = 'radial_expansion';
  } else if (global_energy > 0.5) {
    morphology = 'vortex_ring';
  }

  // 3. Flow vector calculation
  let flowX = 0;
  let flowY = 0;
  fields.forEach(f => {
    if (f.type === 'directional_flow') {
      flowX += 0.2 * f.intensity;
      flowY -= 0.1 * f.intensity;
    }
  });

  // 4. Visual hints compilation
  const primaryHueShift = roundDP((global_energy * 180) % 360);
  const turbulence = roundDP(entropy * 0.8 + (1 - coherence) * 0.2);
  const particleCountScale = roundDP(0.5 + global_energy * 1.5);
  const persistence = roundDP(1.0 + coherence * 3.0);

  return {
    version: '0.1.0',
    timestamp: roundDP(timestamp),
    region: {
      center: [roundDP(centerX), roundDP(centerY)],
      extent: [roundDP(extentX), roundDP(extentY)]
    },
    density: roundDP(Math.max(0, Math.min(1, global_energy * 0.8 + 0.2))),
    flow: [roundDP(flowX), roundDP(flowY)],
    coherence: roundDP(coherence),
    morphology,
    persistence,
    visual_hints: {
      primary_hue_shift: primaryHueShift,
      turbulence,
      particle_count_scale: particleCountScale
    }
  };
}
