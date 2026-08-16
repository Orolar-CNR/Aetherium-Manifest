"use strict";

/*
 * AETHERIUM LIGHT MANIFEST
 *
 * Phase 0.1 / Phase 0.2
 * Prototype Semantic Interpreter / Phase-0 Intent Interpreter
 * Reference Renderer Conformance Surface
 */

import { createVisualState } from "./runtime/visual-state.js";
import {
  getParticleBudget,
  initializeParticles,
  ReferenceParticle
} from "./runtime/reference-renderer.js";

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
let ctx = null;

try {
  if (canvas) {
    ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });
  } else {
    console.error("Error: Canvas element with ID manifestCanvas not found.");
  }
} catch (e) {
  console.error("Critical Failure: Unable to initialize Canvas 2D context.", e);
}

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

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Check url for ?debug=1 or ?debug=true
const urlParams = typeof window !== "undefined" && window.location ? new URLSearchParams(window.location.search) : null;
const isDebugMode = urlParams ? (urlParams.get("debug") === "1" || urlParams.get("debug") === "true") : false;
const seedParam = urlParams ? urlParams.get("seed") : null;
const initialSeed = seedParam !== null && !isNaN(parseInt(seedParam, 10)) ? parseInt(seedParam, 10) : null;

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

let PARTICLE_COUNT = getParticleBudget(window.innerWidth, window.innerHeight);
let particles = initializeParticles(PARTICLE_COUNT, initialSeed);

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
  debugOverlayEl.innerHTML = `
    <strong>[AETHERIUM DIAGNOSTIC]</strong><br/>
    Phase: ${state.phase}<br/>
    Shape: ${state.shape} (target: ${state.targetShape})<br/>
    Target Values: H:${Math.round(state.targetHue)} E:${state.targetEnergy.toFixed(2)} D:${state.targetDensity.toFixed(2)} T:${state.targetTurbulence.toFixed(2)} C:${state.targetCoherence.toFixed(2)}<br/>
    Current Values: H:${Math.round(state.hue)} E:${state.energy.toFixed(2)} D:${state.density.toFixed(2)} T:${state.turbulence.toFixed(2)} C:${state.coherence.toFixed(2)}<br/>
    Particle Budget: ${PARTICLE_COUNT}<br/>
    FPS: ${currentFps}<br/>
    Renderer Mode: Canvas2D Reference (Phase 0.2)
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
    burst(1.0 + governed.energy * 1.5);
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

const bursts = [];

function burst(power) {
  bursts.push({ radius: 10, power, life: 1 });
  if (bursts.length > 8) bursts.shift();
}

function updateBursts() {
  if (!ctx) return;
  ctx.save();
  for (const item of bursts) {
    item.radius += item.power * 8;
    item.life *= reducedMotion ? 0.90 : 0.94;
    ctx.beginPath();
    ctx.arc(centerX, centerY, item.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${state.hue}, 100%, 70%, ${item.life * 0.14})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  for (let i = bursts.length - 1; i >= 0; i--) {
    if (bursts[i].life < 0.02) bursts.splice(i, 1);
  }
  ctx.restore();
}

function render() {
  if (!ctx) return;
  const time = performance.now();

  ctx.clearRect(0, 0, width, height);

  const auraSize = 90 + state.energy * 220;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, auraSize);

  gradient.addColorStop(0, `hsla(${state.hue}, 100%, 70%, ${0.07 + state.energy * 0.05})`);
  gradient.addColorStop(0.5, `hsla(${state.hue}, 100%, 60%, ${0.025 + state.energy * 0.025})`);
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const dims = { width, height, centerX, centerY };
  for (const particle of particles) {
    particle.update(time, frameDelta, state, dims, interactionStrength);
    particle.draw(ctx, state, dims, time);
  }

  ctx.restore();

  drawCore();
  updateBursts();
}

function drawCore() {
  if (!ctx) return;
  const pulse = reducedMotion ? 1 : 1 + Math.sin(performance.now() * 0.002) * 0.08;
  const radius = (5 + state.energy * 18) * pulse;

  const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 5);
  glow.addColorStop(0, `hsla(${state.hue}, 100%, 100%, 0.75)`);
  glow.addColorStop(0.25, `hsla(${state.hue}, 100%, 75%, 0.30)`);
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(centerX, centerY, radius * 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = `hsla(${state.hue}, 100%, 96%, 0.95)`;
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
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

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  centerX = width / 2;
  centerY = height / 2;
  pointerX = centerX;
  pointerY = centerY;

  const newBudget = getParticleBudget(width, height);
  if (newBudget !== PARTICLE_COUNT) {
    PARTICLE_COUNT = newBudget;
    particles = initializeParticles(PARTICLE_COUNT, initialSeed);
  }
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
window.addEventListener("pointerdown", (event) => { updatePointer(event.clientX, event.clientY); burst(0.75); }, { passive: true });

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

let frameDelta = 0.016;

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
  render();

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

resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });

applyIntent("");
requestAnimationFrame(frame);
