const PARAMETER_BOUNDS = Object.freeze({
  turbulence: [0, 0.65], intensity: [0, 1], coherence: [0, 1], particle_count: [1, 100000],
  flow_direction: [-Math.PI * 2, Math.PI * 2], time: [0, Number.MAX_SAFE_INTEGER], delta_time: [0, 0.1], simulation_scale: [0.01, 10]
});

export function requireRendererSeed(rendererSeed) {
  if (!Number.isInteger(rendererSeed)) throw new TypeError("rendererSeed must be an explicit integer");
  return rendererSeed >>> 0;
}

export function clampParameter(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
  const [min, max] = PARAMETER_BOUNDS[name];
  return Math.max(min, Math.min(max, value));
}

export function visualStateToGpuManifestParameters(state, { particleCount, time = 0, deltaTime = 0.016, simulationScale = 1 } = {}) {
  return Object.freeze({
    turbulence: clampParameter("turbulence", state.turbulence ?? 0),
    intensity: clampParameter("intensity", state.energy ?? 0),
    coherence: clampParameter("coherence", state.coherence ?? 1),
    particle_count: Math.floor(clampParameter("particle_count", particleCount)),
    flow_direction: clampParameter("flow_direction", ((state.hue ?? 0) / 360) * Math.PI * 2),
    time: clampParameter("time", time),
    delta_time: clampParameter("delta_time", deltaTime),
    simulation_scale: clampParameter("simulation_scale", simulationScale)
  });
}

export function packGpuManifestUniforms(parameters, viewport = { width: 1, height: 1 }) {
  return new Float32Array([
    parameters.turbulence, parameters.intensity, parameters.coherence, parameters.flow_direction,
    parameters.time, parameters.delta_time, parameters.simulation_scale, parameters.particle_count,
    viewport.width, viewport.height, viewport.width / 2, viewport.height / 2,
    0, 0, 0, 0
  ]);
}

export function createInitialParticleData(count, rendererSeed) {
  let s = requireRendererSeed(rendererSeed);
  const next = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const data = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const a = next() * Math.PI * 2;
    const r = Math.sqrt(next());
    data[i * 4] = Math.cos(a) * r;
    data[i * 4 + 1] = Math.sin(a) * r;
    data[i * 4 + 2] = next();
    data[i * 4 + 3] = 1;
  }
  return data;
}
