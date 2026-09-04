/**
 * Research Candidate: Dynamic Signed Distance Field (SDF) Primitives
 * Status: RESEARCH / NON-CANONICAL
 *
 * Analytical 3D Signed Distance Functions and combination operators.
 */

export class SDFPrimitives {
  /**
   * Distance to a sphere centered at origin with radius r.
   */
  static sphere(p, r = 1.0) {
    const x = p[0], y = p[1], z = p[2];
    return Math.hypot(x, y, z) - r;
  }

  /**
   * Distance to an axis-aligned box centered at origin with half-extents b [bx, by, bz].
   */
  static box(p, b = [1.0, 1.0, 1.0]) {
    const dx = Math.abs(p[0]) - b[0];
    const dy = Math.abs(p[1]) - b[1];
    const dz = Math.abs(p[2]) - b[2];

    const ax = Math.max(dx, 0.0);
    const ay = Math.max(dy, 0.0);
    const az = Math.max(dz, 0.0);
    const outsideDist = Math.hypot(ax, ay, az);
    const insideDist = Math.min(Math.max(dx, Math.max(dy, dz)), 0.0);

    return outsideDist + insideDist;
  }

  /**
   * Distance to a torus centered at origin in the x-z plane.
   * t = [majorRadius, minorRadius]
   */
  static torus(p, t = [1.0, 0.25]) {
    const qx = Math.hypot(p[0], p[2]) - t[0];
    const qy = p[1];
    return Math.hypot(qx, qy) - t[1];
  }

  /**
   * Smooth union (smooth minimum) of distance d1 and d2 with smoothing factor k.
   */
  static smoothUnion(d1, d2, k = 0.5) {
    if (k <= 0) return Math.min(d1, d2);
    const h = Math.max(Math.min(0.5 + 0.5 * (d2 - d1) / k, 1.0), 0.0);
    return (d2 * (1.0 - h) + d1 * h) - k * h * (1.0 - h);
  }

  /**
   * Union of distance d1 and d2.
   */
  static union(d1, d2) {
    return Math.min(d1, d2);
  }

  /**
   * Intersection of distance d1 and d2.
   */
  static intersection(d1, d2) {
    return Math.max(d1, d2);
  }

  /**
   * Subtract d2 from d1.
   */
  static subtraction(d1, d2) {
    return Math.max(d1, -d2);
  }

  /**
   * Transform point p by translation t = [tx, ty, tz]
   */
  static translate(p, t) {
    return [p[0] - t[0], p[1] - t[1], p[2] - t[2]];
  }
}
