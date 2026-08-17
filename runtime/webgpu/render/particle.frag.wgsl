@fragment
fn main(@location(0) alpha: f32) -> @location(0) vec4<f32> {
  return vec4<f32>(0.25, 0.92, 1.0, alpha);
}
