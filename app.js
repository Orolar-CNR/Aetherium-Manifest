"use strict";

/*
 * AETHERIUM LIGHT MANIFEST
 *
 * Phase 0.1 / Phase 0.2
 * Prototype Semantic Interpreter / Phase-0 Intent Interpreter
 * Reference Renderer Conformance Surface
 */

import { createVisualState } from "./runtime/visual-state.js";
import { createCanvasRenderer } from "./renderer/canvas-renderer.js";
import { createWebGPURenderer } from "./renderer/webgpu-renderer.js";
import { chooseRendererBackend } from "./renderer/backend-selection.js";
import { isWebGPUAvailable } from "./runtime/webgpu/capabilities.js";

// --- Localization Structure ---
const LOCALIZATION = {
  th: {
    placeholder: "ส่งเจตจำนง...",
    ariaLabelInput: "ส่งเจตจำนง",
    ariaLabelButton: "ส่งเจตจำนง"
  },
  en: {
    placeholder: "Send intent...",
    ariaLabelInput: "Send intent",
    ariaLabelButton: "Send intent"
  }
};
const currentLocale = "th";

const canvas = document.getElementById("manifestCanvas");
const urlParams = typeof window !== "undefined" && window.location ? new URLSearchParams(window.location.search) : null;
const isDebugMode = urlParams ? (urlParams.get("debug") === "1" || urlParams.get("debug") === "true") : false;
const requestedRenderer = urlParams ? (urlParams.get("renderer") || "auto") : "auto";
const seedParam = urlParams ? urlParams.get("seed") : null;
const rendererSeed = seedParam !== null && !Number.isNaN(parseInt(seedParam, 10)) ? parseInt(seedParam, 10) : 1337;

const form = document.getElementById("intentForm");
const input = document.getElementById("intentInput");

if (input) {
  input.placeholder = LOCALIZATION[currentLocale].placeholder;
  input.setAttribute("aria-label", LOCALIZATION[currentLocale].ariaLabelInput);
}
const button = document.getElementById("resonanceButton");
if (button) {
  button.setAttribute("aria-label", LOCALIZATION[currentLocale].ariaLabelButton);
  button.setAttribute("title", LOCALIZATION[currentLocale].ariaLabelButton);
}

let dpr = Math.min(window.devicePixelRatio || 1, 2);
let width = 0;
let height = 0;
let centerX = 0;
let centerY = 0;
let lastTime = performance.now();
let pointerX = 0;
let pointerY = 0;
let interactionStrength = 0;
let frameDelta = 0.016;
let renderer = null;
let rendererDiagnostics = null;

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------
 * Runtime State
 * --------------------------------------------------------- */

const state = {
  phase: "IDLE",
  confidence: 0.55,
  energy: 0.18,
  coherence: 0.88,
  entropy: 0.12,
  turbulence: 0.10,
  density: 0.55,
  glow: 0.72,
  shape: "sphere",
  hue: 190,
  targetHue: 190,
  targetEnergy: 0.18,
  targetDensity: 0.55,
  targetTurbulence: 0.10,
  targetCoherence: 0.88,
  targetShape: "sphere"
};

let debugOverlayEl = null;
let fpsCounter = 0;
let lastFpsUpdate = performance.now();
let currentFps = 60;

if (isDebugMode) {
  debugOverlayEl = document.createElement("div");
  debugOverlayEl.id = "aetherium-debug-overlay";
  debugOverlayEl.style.position = "fixed";
  debugOverlayEl.style.top = "12px";
  debugOverlayEl.style.left = "12px";
  debugOverlayEl.style.padding = "10px 14px";
  debugOverlayEl.style.background = "rgba(2, 2, 4, 0.85)";
  debugOverlayEl.style.border = "1px solid rgba(255, 255, 255, 0.15)";
  debugOverlayEl.style.borderRadius = "6px";
  debugOverlayEl.style.color = "#00f0ff";
  debugOverlayEl.style.fontFamily = "monospace";
  debugOverlayEl.style.fontSize = "12px";
  debugOverlayEl.style.lineHeight = "1.5";
  debugOverlayEl.style.pointerEvents = "none";
  debugOverlayEl.style.zIndex = "99999";
  debugOverlayEl.style.backdropFilter = "blur(8px)";
  document.body.appendChild(debugOverlayEl);
}

function updateDebugOverlay() {
  if (!debugOverlayEl) return;
  const diag = renderer?.getDiagnostics ? renderer.getDiagnostics() : rendererDiagnostics;
  debugOverlayEl.innerHTML = `
    <strong>[AETHERIUM DIAGNOSTIC]</strong><br/>
    Backend: ${diag?.backend || "uninitialized"}<br/>
    WebGPU Available: ${isWebGPUAvailable() ? "yes" : "no"}<br/>
    Particle Count: ${diag?.particleCount || 0}<br/>
    Quality Tier: ${diag?.qualityTier || "none"}<br/>
    Frame Time: ${(diag?.frameTimeMs || 0).toFixed(2)}ms<br/>
    Initialization: ${diag?.initializationStatus || "pending"}<br/>
    Fallback: ${diag?.fallbackReason || "none"}<br/>
    FPS: ${currentFps}
  `;
}

/* ---------------------------------------------------------
 * Phase-0 Intent Interpreter
 * --------------------------------------------------------- */

function interpretIntent(text) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return {
      phase: "IDLE",
      shape: "sphere",
      hue: 190,
      energy: 0.18,
      density: 0.50,
      turbulence: 0.08,
      coherence: 0.90,
      confidence: 0.60
    };
  }

  if (includesAny(normalized, ["ฟัง", "ฟังฉัน", "ฟังเสียง", "listen", "hello", "สวัสดี"])) {
    return {
      phase: "LISTENING",
      shape: "sphere",
      hue: 195,
      energy: 0.30,
      density: 0.52,
      turbulence: 0.18,
      coherence: 0.84,
      confidence: 0.82
    };
  }

  if (includesAny(normalized, ["คิด", "วิเคราะห์", "เหตุผล", "reason", "think", "analyze"])) {
    return {
      phase: "PROCESSING",
      shape: "spiral",
      hue: 268,
      energy: 0.76,
      density: 0.78,
      turbulence: 0.32,
      coherence: 0.74,
      confidence: 0.78
    };
  }

  if (includesAny(normalized, ["สร้าง", "สร้างให้", "generate", "create", "ออกแบบ", "design"])) {
    return {
      phase: "RESPONDING",
      shape: "triangle",
      hue: 215,
      energy: 0.86,
      density: 0.86,
      turbulence: 0.24,
      coherence: 0.88,
      confidence: 0.84
    };
  }

  if (includesAny(normalized, ["หยุด", "พัก", "หลับ", "sleep", "rest", "nirodha"])) {
    return {
      phase: "NIRODHA",
      shape: "sphere",
      hue: 230,
      energy: 0.02,
      density: 0.12,
      turbulence: 0.02,
      coherence: 0.95,
      confidence: 0.90
    };
  }

  if (includesAny(normalized, ["อันตราย", "ผิดพลาด", "error", "warning", "danger"])) {
    return {
      phase: "WARNING",
      shape: "wave",
      hue: 12,
      energy: 0.92,
      density: 0.62,
      turbulence: 0.70,
      coherence: 0.38,
      confidence: 0.90
    };
  }

  if (normalized.includes("→") || normalized.includes("ไป") || normalized.includes("ส่ง")) {
    return {
      phase: "RESPONDING",
      shape: "line",
      hue: 175,
      energy: 0.64,
      density: 0.72,
      turbulence: 0.20,
      coherence: 0.86,
      confidence: 0.72
    };
  }

  return {
    phase: "RESPONDING",
    shape: "sphere",
    hue: 205,
    energy: 0.42,
    density: 0.58,
    turbulence: 0.20,
    coherence: 0.72,
    confidence: 0.46
  };
}

function applyIntent(text) {
  try {
    const candidate = interpretIntent(text);
    const governed = createVisualState(candidate);

    state.phase = governed.phase;
    state.targetShape = governed.shape;
    state.targetHue = governed.hue;
    state.targetEnergy = governed.energy;
    state.targetDensity = governed.density;
    state.targetTurbulence = governed.turbulence;
    state.targetCoherence = governed.coherence;
    state.confidence = governed.confidence;

    interactionStrength = 1;

  } catch (e) {
    console.error("Exception handled during intent interpretation & state governance:", e);
    state.phase = "IDLE";
    state.targetShape = "sphere";
    state.targetHue = 190;
    state.targetEnergy = 0.18;
    state.targetDensity = 0.55;
    state.targetTurbulence = 0.10;
    state.targetCoherence = 0.88;
  }
}

function updateState(dt) {
  const smoothing = reducedMotion ? 0.05 : 1 - Math.pow(0.001, dt);

  state.energy += (state.targetEnergy - state.energy) * smoothing;
  state.density += (state.targetDensity - state.density) * smoothing;
  state.turbulence += (state.targetTurbulence - state.turbulence) * smoothing;
  state.coherence += (state.targetCoherence - state.coherence) * smoothing;
  state.hue = lerpAngle(state.hue, state.targetHue, smoothing);

  if (state.shape !== state.targetShape) {
    state.shape = state.targetShape;
  }

  interactionStrength *= reducedMotion ? 0.92 : 0.88;
}

function render(now) {
  if (!renderer) return;
  renderer.setManifestationState(state, { time: now * 0.001, deltaTime: frameDelta });
  renderer.render({ time: now, interactionStrength });
}

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  if (canvas) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  centerX = width / 2;
  centerY = height / 2;
  pointerX = centerX;
  pointerY = centerY;

  if (renderer) renderer.resize({ width, height, dpr });
}

function updatePointer(clientX, clientY) {
  pointerX = clientX;
  pointerY = clientY;
  const dx = pointerX - centerX;
  const dy = pointerY - centerY;
  const distance = Math.hypot(dx, dy);
  interactionStrength = Math.min(1, distance / Math.max(width, height));
}

window.addEventListener("pointermove", (event) => { updatePointer(event.clientX, event.clientY); }, { passive: true });
window.addEventListener("pointerdown", (event) => { updatePointer(event.clientX, event.clientY); }, { passive: true });

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input) {
      applyIntent(input.value);
      input.select();
    }
  });
}

if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (form) form.requestSubmit();
    }
  });
}

function frame(now) {
  const elapsed = Math.min(0.05, (now - lastTime) / 1000);
  frameDelta = elapsed;
  lastTime = now;

  fpsCounter++;
  if (now - lastFpsUpdate >= 500) {
    currentFps = Math.round((fpsCounter * 1000) / (now - lastFpsUpdate));
    fpsCounter = 0;
    lastFpsUpdate = now;
  }

  updateState(elapsed);
  render(now);

  if (isDebugMode) {
    updateDebugOverlay();
  }

  requestAnimationFrame(frame);
}

function lerpAngle(a, b, t) {
  let delta = (b - a + 540) % 360 - 180;
  return a + delta * t;
}

function includesAny(text, values) {
  return values.some(value => text.includes(value));
}

async function initializeRenderer() {
  const decision = chooseRendererBackend({ requested: requestedRenderer });
  renderer = decision.backend === "webgpu"
    ? createWebGPURenderer({ canvas, rendererSeed })
    : createCanvasRenderer({ canvas, rendererSeed, reducedMotion });
  await renderer.initialize();
  let diag = renderer.getDiagnostics();
  if (decision.backend === "webgpu" && diag.initializationStatus !== "ready") {
    renderer.dispose();
    renderer = createCanvasRenderer({ canvas, rendererSeed, reducedMotion });
    await renderer.initialize();
    diag = { ...renderer.getDiagnostics(), fallbackReason: diag.fallbackReason || decision.fallbackReason };
  }
  rendererDiagnostics = { ...diag, fallbackReason: diag.fallbackReason || decision.fallbackReason };
  resizeCanvas();
  applyIntent("");
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resizeCanvas, { passive: true });
initializeRenderer().catch((error) => {
  console.error("Renderer initialization failed; falling back to Canvas2D.", error);
  renderer = createCanvasRenderer({ canvas, rendererSeed, reducedMotion });
  renderer.initialize().then(() => { resizeCanvas(); applyIntent(""); requestAnimationFrame(frame); });
});
