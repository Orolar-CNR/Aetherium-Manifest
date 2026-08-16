/**
 * Mulberry32 PRNG
 * Fast, 32-bit deterministic PRNG with zero dependencies.
 * @param {number} seed 32-bit integer seed
 * @returns {function(): number} PRNG returning floating point in [0, 1)
 */
export function createPRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getParticleBudget(width, height) {
  const area = width * height;
  if (area < 350000) return 900;
  if (area < 700000) return 1400;
  return 2200;
}

export class ReferenceParticle {
  constructor(index, count, prng = Math.random) {
    this.index = index;
    this.count = count;
    this.seed = prng();
    this.angle = prng() * Math.PI * 2;
    this.radius = prng();
    this.depth = prng();
    this.size = 0.65 + prng() * 1.8;
    this.alpha = 0.25 + prng() * 0.70;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.tx = 0;
    this.ty = 0;
  }

  update(time, dt, state, dimensions, interactionStrength = 0) {
    if (this.count <= 0) return;
    const normalizedIndex = this.index / this.count;
    const { phase, turbulence, energy, density, coherence, shape } = state;
    const { centerX, centerY } = dimensions;

    let radius = (35 + normalizedIndex * 220) * (0.45 + density);

    if (phase === "IDLE") {
      radius *= 0.72;
    } else if (phase === "LISTENING") {
      radius *= 0.72 + interactionStrength * 0.55;
    } else if (phase === "PROCESSING") {
      radius *= 0.75 + energy * 0.85;
    } else if (phase === "RESPONDING") {
      radius *= 0.70 + coherence * 0.80;
    } else if (phase === "WARNING") {
      radius *= 0.75 + 0.35 * Math.sin(time * 0.01);
    } else if (phase === "ERROR") {
      radius *= 1.1 + Math.abs(Math.sin(time * 0.004)) * 0.5;
    } else if (phase === "NIRODHA") {
      radius *= 0.18;
    }

    let tx = 0;
    let ty = 0;

    switch (shape) {
      case "triangle":
        [tx, ty] = triangleField(this.index, this.count, radius, time, turbulence);
        break;
      case "spiral":
        [tx, ty] = spiralField(this.index, this.count, radius, time);
        break;
      case "line":
        [tx, ty] = lineField(this.index, this.count, radius, time, turbulence);
        break;
      case "wave":
        [tx, ty] = waveField(this.index, this.count, radius, time);
        break;
      case "sphere":
      default:
        [tx, ty] = sphereField(this.angle, this.radius, radius, time);
        break;
    }

    const noiseX = Math.sin(time * 0.0014 + this.seed * 40 + normalizedIndex * 13);
    const noiseY = Math.cos(time * 0.0011 + this.seed * 20 + normalizedIndex * 17);

    tx += noiseX * turbulence * 30;
    ty += noiseY * turbulence * 30;

    const dx = centerX + tx - this.x;
    const dy = centerY + ty - this.y;

    const stiffness = 2.0 + coherence * 4.0;

    this.vx += dx * stiffness * dt;
    this.vy += dy * stiffness * dt;

    this.vx *= 1 - Math.min(0.92, 7.0 * dt);
    this.vy *= 1 - Math.min(0.92, 7.0 * dt);

    this.vx += noiseX * energy * 18 * dt;
    this.vy += noiseY * energy * 18 * dt;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx, state, dimensions, now = 0) {
    if (!ctx) return;
    if (state.phase === "NIRODHA") return;

    const { centerX, centerY, width, height } = dimensions;
    const distance = Math.hypot(this.x - centerX, this.y - centerY);
    const distanceFactor = Math.max(0.15, 1 - distance / Math.max(width || 1, height || 1));

    let alpha = this.alpha * (state.glow !== undefined ? state.glow : 0.72) * (0.35 + distanceFactor * 0.75);

    if (state.phase === "WARNING") {
      alpha *= 0.55 + Math.abs(Math.sin(now * 0.006)) * 0.55;
    } else if (state.phase === "ERROR") {
      alpha *= 0.45 + (this.seed * 0.55);
    }

    const hue = state.hue + (this.index % 20) * 2.0;
    const lightness = 72 + Math.sin(this.index) * 12;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
    if (typeof ctx.arc === "function") {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    if (typeof ctx.fill === "function") {
      ctx.fill();
    }
  }
}

function sphereField(angle, normalizedRadius, radius, time) {
  const wave = Math.sin(time * 0.0012 + angle * 3.0) * 7;
  const r = normalizedRadius * radius + wave;
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function triangleField(index, count, radius, time, turbulence) {
  const p = count > 0 ? index / count : 0;
  const segment = Math.floor(p * 3);
  const local = (p * 3) % 1;
  const R = radius * 0.72;
  const points = [[0, -R], [R * 0.86, R * 0.50], [-R * 0.86, R * 0.50]];
  const a = points[segment % 3];
  const b = points[(segment + 1) % 3];
  const wobble = Math.sin(time * 0.001 + index) * turbulence * 8;
  return [
    lerp(a[0], b[0], local) + wobble,
    lerp(a[1], b[1], local) + wobble
  ];
}

function spiralField(index, count, radius, time) {
  const p = count > 0 ? index / count : 0;
  const turns = 5.5;
  const angle = p * Math.PI * 2 * turns + time * 0.0007;
  const r = radius * p * 0.70;
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function lineField(index, count, radius, time, turbulence) {
  const p = count > 0 ? index / count : 0;
  const x = (p - 0.5) * radius * 2.2;
  const wave = Math.sin(p * 16 + time * 0.002) * turbulence * 45;
  return [x, wave];
}

function waveField(index, count, radius, time) {
  const p = count > 0 ? index / count : 0;
  const x = (p - 0.5) * radius * 2.0;
  const y = Math.sin(p * 18 + time * 0.003) * radius * 0.42;
  return [x, y];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Initializes particles with optional seed for deterministic state.
 * @param {number} count Particle count
 * @param {number|null} seed Seed for PRNG (optional)
 * @returns {Array<ReferenceParticle>}
 */
export function initializeParticles(count, seed = null) {
  if (count <= 0) return [];
  const prng = seed !== null ? createPRNG(seed) : Math.random;
  return Array.from({ length: count }, (_, i) => new ReferenceParticle(i, count, prng));
}
