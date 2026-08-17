struct Params {
  turbulence: f32, intensity: f32, coherence: f32, flow_direction: f32,
  time: f32, delta_time: f32, simulation_scale: f32, particle_count: f32,
  width: f32, height: f32, center_x: f32, center_y: f32,
  pad0: f32, pad1: f32, pad2: f32, pad3: f32,
};
struct VertexOut { @builtin(position) position: vec4<f32>, @location(0) alpha: f32 };
@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> params: Params;
@vertex
fn main(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOut {
  let corners = array<vec2<f32>, 6>(vec2<f32>(-1.0,-1.0), vec2<f32>(1.0,-1.0), vec2<f32>(-1.0,1.0), vec2<f32>(-1.0,1.0), vec2<f32>(1.0,-1.0), vec2<f32>(1.0,1.0));
  let p = positions[instance_index];
  let size = (0.004 + params.intensity * 0.007) * (0.7 + p.z * 0.8);
  var out: VertexOut;
  out.position = vec4<f32>(p.xy + corners[vertex_index] * size, 0.0, 1.0);
  out.alpha = 0.25 + params.coherence * 0.55;
  return out;
}
