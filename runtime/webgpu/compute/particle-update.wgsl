struct Params {
  turbulence: f32,
  intensity: f32,
  coherence: f32,
  flow_direction: f32,
  time: f32,
  delta_time: f32,
  simulation_scale: f32,
  particle_count: f32,
  width: f32,
  height: f32,
  center_x: f32,
  center_y: f32,
  pad0: f32,
  pad1: f32,
  pad2: f32,
  pad3: f32,
};

@group(0) @binding(0) var<storage, read> in_position: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> in_velocity: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> out_position: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> out_velocity: array<vec4<f32>>;
@group(0) @binding(4) var<uniform> params: Params;

fn numeric_noise(x: f32) -> f32 {
  return fract(sin(x * 12.9898 + params.time * 0.017) * 43758.5453) * 2.0 - 1.0;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;
  if (index >= u32(params.particle_count)) { return; }
  let i = f32(index);
  let p = in_position[index];
  var v = in_velocity[index];
  let aspect = max(params.width / max(params.height, 1.0), 0.1);
  let flow = vec2<f32>(cos(params.flow_direction), sin(params.flow_direction));
  let swirl = vec2<f32>(-p.y, p.x) * (0.25 + params.coherence);
  let n = vec2<f32>(numeric_noise(i + p.z * 17.0), numeric_noise(i * 1.7 + p.z * 23.0));
  let acceleration = (flow * params.intensity + swirl + n * params.turbulence) * params.simulation_scale;
  v.xy = (v.xy + acceleration * params.delta_time) * (0.985 - params.coherence * 0.08);
  var next_position = p;
  next_position.xy = p.xy + v.xy * params.delta_time;
  let limit = vec2<f32>(aspect, 1.0) * 0.95;
  if (abs(next_position.x) > limit.x) { next_position.x = clamp(next_position.x, -limit.x, limit.x); v.x = -v.x * 0.55; }
  if (abs(next_position.y) > limit.y) { next_position.y = clamp(next_position.y, -limit.y, limit.y); v.y = -v.y * 0.55; }
  out_position[index] = next_position;
  out_velocity[index] = v;
}
