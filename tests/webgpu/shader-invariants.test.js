import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shaderPaths = [
  "../../runtime/webgpu/compute/particle-update.wgsl",
  "../../runtime/webgpu/render/particle.vert.wgsl",
  "../../runtime/webgpu/render/particle.frag.wgsl"
].map((shaderPath) => path.join(__dirname, shaderPath));
const forbidden = ["phase", "shape", "intent", "semantic", "governor", "policy", "LLM", "LISTENING", "PROCESSING", "RESPONDING", "WARNING", "ERROR", "NIRODHA", "AETH", "Presence"];

for (const shaderPath of shaderPaths) {
  const source = fs.readFileSync(shaderPath, "utf8");
  assert.match(source, /@(compute|vertex|fragment)/);
  for (const token of forbidden) {
    assert.strictEqual(source.includes(token), false, `${path.basename(shaderPath)} contains forbidden token ${token}`);
  }
}

console.log("✅ WebGPU shader boundary tests passed");
