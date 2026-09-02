"use strict";

/*
 * AETHERIUM LIGHT MANIFEST
 *
 * Phase 0.1 / Phase 0.2
 * Manifest Interaction Surface & Reference Renderer
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
    ariaLabelInput: "บอกสิ่งที่ต้องการ",
    ariaLabelButton: "ส่งเจตจำนง",
    feedbackAcknowledged: "รับรู้แล้ว",
    feedbackManifesting: "กำลังเปลี่ยนคำขอให้เป็นการปรากฏ",
    voiceListening: "กำลังรับฟัง…",
    voiceError: "ไม่สามารถรับเสียงได้"
  },
  en: {
    placeholder: "Send intent...",
    ariaLabelInput: "Express intent",
    ariaLabelButton: "Send intent",
    feedbackAcknowledged: "Acknowledged",
    feedbackManifesting: "Transforming request into manifestation",
    voiceListening: "Listening...",
    voiceError: "Voice input unavailable"
  }
};
const currentLocale = "th";

const canvas = document.getElementById("manifestCanvas");
const urlParams = typeof window !== "undefined" && window.location ? new URLSearchParams(window.location.search) : null;
const isDebugMode = urlParams ? (urlParams.get("debug") === "1" || urlParams.get("debug") === "true") : false;
const requestedRenderer = urlParams ? (urlParams.get("renderer") || "auto") : "auto";
const seedParam = urlParams ? urlParams.get("seed") : null;
const rendererSeed = seedParam !== null && !Number.isNaN(parseInt(seedParam, 10)) ? parseInt(seedParam, 10) : 1337;

// DOM Elements
const form = document.getElementById("intentForm");
const input = document.getElementById("intentInput");
const button = document.getElementById("resonanceButton");
const voiceButton = document.getElementById("voiceButton");
const responseSignal = document.getElementById("responseSignal");
const composerState = document.getElementById("composerState");

const diagnosticsDrawer = document.getElementById("diagnosticsDrawer");
const openDiagnostics = document.getElementById("openDiagnostics");
const closeDiagnostics = document.getElementById("closeDiagnostics");
const sysLog = document.getElementById("sysLog");

if (input) {
  input.placeholder = LOCALIZATION[currentLocale].placeholder;
  input.setAttribute("aria-label", LOCALIZATION[currentLocale].ariaLabelInput);
}
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

let fpsCounter = 0;
let lastFpsUpdate = performance.now();
let currentFps = 60;

/* ---------------------------------------------------------
 * Execution Log Stream (Diagnostics)
 * --------------------------------------------------------- */

function logSystem(msg) {
  if (!sysLog) return;
  const div = document.createElement("div");
  div.className = "log-line active";
  div.textContent = `> ${msg}`;
  sysLog.appendChild(div);

  while (sysLog.children.length > 12) {
    sysLog.removeChild(sysLog.firstChild);
  }

  Array.from(sysLog.children).forEach((child) => child.classList.remove("active"));
  div.classList.add("active");
  sysLog.scrollTop = sysLog.scrollHeight;
}

function updateDiagnosticsUI() {
  const diag = renderer?.getDiagnostics ? renderer.getDiagnostics() : rendererDiagnostics;

  const mBackend = document.getElementById("m-backend");
  if (mBackend) mBackend.textContent = diag?.backend || "Canvas2D";

  const mParticles = document.getElementById("m-particles");
  if (mParticles) mParticles.textContent = (diag?.particleCount || 0).toLocaleString();

  const mFps = document.getElementById("m-fps");
  if (mFps) mFps.textContent = currentFps.toString();

  const mPhase = document.getElementById("m-phase");
  if (mPhase) mPhase.textContent = state.phase;

  const mStress = document.getElementById("m-stress");
  if (mStress) mStress.textContent = (state.entropy * 0.5).toFixed(2);

  const mEntropy = document.getElementById("m-entropy");
  if (mEntropy) mEntropy.textContent = state.entropy.toFixed(2);

  const mCoherence = document.getElementById("m-coherence");
  if (mCoherence) mCoherence.textContent = state.coherence.toFixed(2);

  const mArousal = document.getElementById("m-arousal");
  if (mArousal) mArousal.textContent = state.energy.toFixed(2);

  const mConf = document.getElementById("m-conf");
  if (mConf) mConf.textContent = state.confidence.toFixed(2);

  const mRisk = document.getElementById("m-risk");
  if (mRisk) mRisk.textContent = "0.00";
}

/* ---------------------------------------------------------
 * User Feedback & Signals
 * --------------------------------------------------------- */

let responseSignalTimer = null;
let composerStateTimer = null;

function setComposerStateText(text = "") {
  if (!composerState) return;
  composerState.textContent = text;
  composerState.classList.toggle("show", Boolean(text));
}

function showResponseSignal(text) {
  if (!responseSignal) return;
  responseSignal.textContent = text;
  responseSignal.classList.add("show");

  window.clearTimeout(responseSignalTimer);
  responseSignalTimer = window.setTimeout(() => {
    responseSignal.classList.remove("show");
  }, 2200);
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

  if (includesAny(normalized, ["สามเหลี่ยม", "สร้าง", "สร้างให้", "generate", "create", "ออกแบบ", "design"])) {
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

  if (includesAny(normalized, ["พายุ", "วุ่นวาย", "vortex", "storm", "turbulence"])) {
    return {
      phase: "PROCESSING",
      shape: "wave",
      hue: 280,
      energy: 0.90,
      density: 0.80,
      turbulence: 0.60,
      coherence: 0.50,
      confidence: 0.80
    };
  }

  if (includesAny(normalized, ["หยุด", "พัก", "ดับ", "สงบ", "sleep", "rest", "nirodha"])) {
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

  if (includesAny(normalized, ["อันตราย", "ผิดพลาด", "พัง", "error", "warning", "danger"])) {
    return {
      phase: "WARNING",
      shape: "wave",
      hue: 12,
      energy: 0.92,
      density: 0.62,
      turbulence: 0.65,
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

function submitIntent(text) {
  const clean = text.trim();
  if (!clean) return;

  logSystem(`[INPUT] intent received: "${clean}"`);

  showResponseSignal(LOCALIZATION[currentLocale].feedbackAcknowledged);
  setComposerStateText(LOCALIZATION[currentLocale].feedbackManifesting);

  applyIntent(clean);

  window.clearTimeout(composerStateTimer);
  composerStateTimer = window.setTimeout(() => {
    setComposerStateText("");
  }, 1200);

  if (input) input.focus();
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

    logSystem(`[STATE] updated phase=${governed.phase} shape=${governed.shape} hue=${governed.hue}`);
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

/* ---------------------------------------------------------
 * Web Speech API Integration
 * --------------------------------------------------------- */

let recognition = null;
let isListening = false;

function stopVoice() {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch (_) {}
}

function setListeningState(listening) {
  isListening = listening;
  if (!voiceButton) return;
  voiceButton.classList.toggle("listening", listening);
  voiceButton.setAttribute("aria-label", listening ? "หยุดรับเสียง" : "เริ่มรับเสียง");
  setComposerStateText(listening ? LOCALIZATION[currentLocale].voiceListening : "");
}

function setupWebSpeech() {
  if (!voiceButton) return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceButton.style.display = "none";
    voiceButton.setAttribute("aria-hidden", "true");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = currentLocale === "th" ? "th-TH" : "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onstart = () => {
    setListeningState(true);
    logSystem("[VOICE] recognition started");
  };

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    if (input) input.value = transcript;

    const last = event.results[event.results.length - 1];
    if (last && last.isFinal) {
      const phrase = transcript.trim();
      setListeningState(false);
      if (phrase) {
        if (input) input.value = "";
        submitIntent(phrase);
      }
    }
  };

  recognition.onerror = (err) => {
    setListeningState(false);
    setComposerStateText("");
    showResponseSignal(LOCALIZATION[currentLocale].voiceError);
    logSystem(`[VOICE] error: ${err.error || "unknown"}`);
  };

  recognition.onend = () => {
    setListeningState(false);
    logSystem("[VOICE] recognition ended");
  };

  voiceButton.addEventListener("click", () => {
    if (isListening) {
      stopVoice();
      return;
    }
    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition failed to start:", e);
    }
  });
}

/* ---------------------------------------------------------
 * Diagnostics Drawer Controls
 * --------------------------------------------------------- */

function openDiagnosticsDrawer() {
  if (!diagnosticsDrawer) return;
  diagnosticsDrawer.classList.add("open");
  diagnosticsDrawer.setAttribute("aria-hidden", "false");
  if (closeDiagnostics) closeDiagnostics.focus();
  logSystem("[DIAG] drawer opened");
}

function closeDiagnosticsDrawer() {
  if (!diagnosticsDrawer) return;
  diagnosticsDrawer.classList.remove("open");
  diagnosticsDrawer.setAttribute("aria-hidden", "true");
  if (input) input.focus();
}

function setupDiagnosticsDrawer() {
  if (openDiagnostics) openDiagnostics.addEventListener("click", openDiagnosticsDrawer);
  if (closeDiagnostics) closeDiagnostics.addEventListener("click", closeDiagnosticsDrawer);

  if (diagnosticsDrawer) {
    diagnosticsDrawer.addEventListener("click", (e) => {
      if (e.target === diagnosticsDrawer) closeDiagnosticsDrawer();
    });
  }
}

/* ---------------------------------------------------------
 * Keyboard Navigation & Shortcuts
 * --------------------------------------------------------- */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (diagnosticsDrawer && diagnosticsDrawer.classList.contains("open")) {
      closeDiagnosticsDrawer();
    } else if (input) {
      input.focus();
    }
  }
});

/* ---------------------------------------------------------
 * Rendering & Animation Loop
 * --------------------------------------------------------- */

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
      const rawText = input.value;
      input.value = "";
      submitIntent(rawText);
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
  updateDiagnosticsUI();

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
  logSystem(`[BOOT] Manifest surface initialized (${diag.backend})`);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resizeCanvas, { passive: true });

setupWebSpeech();
setupDiagnosticsDrawer();

initializeRenderer().catch((error) => {
  console.error("Renderer initialization failed; falling back to Canvas2D.", error);
  renderer = createCanvasRenderer({ canvas, rendererSeed, reducedMotion });
  renderer.initialize().then(() => {
    resizeCanvas();
    applyIntent("");
    logSystem("[BOOT] Fallback Canvas2D initialized");
    requestAnimationFrame(frame);
  });
});
