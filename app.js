"use strict";

/*
 * AETHERIUM LIGHT MANIFEST
 *
 * Phase 0.1 / Phase 0.2 / Phase 0.x
 * Manifest Interaction Surface & Reference Runtime
 */

import { createVisualState } from "./runtime/visual-state.js";
import { createCanvasRenderer } from "./renderer/canvas-renderer.js";
import { createWebGPURenderer } from "./renderer/webgpu-renderer.js";
import { chooseRendererBackend } from "./renderer/backend-selection.js";
import { isWebGPUAvailable } from "./runtime/webgpu/capabilities.js";
import { TemporalSignalFusion } from "./runtime/temporal-signal-fusion.js";

// --- Localization Structure ---
const LOCALIZATION = {
  th: {
    placeholder: "ส่งเจตจำนง...",
    ariaLabelInput: "บอกสิ่งที่ต้องการ",
    ariaLabelButton: "ส่งเจตจำนง",
    voiceListening: "กำลังรับฟัง…",
    voiceError: "ไม่สามารถรับเสียงได้"
  },
  en: {
    placeholder: "Send intent...",
    ariaLabelInput: "Express intent",
    ariaLabelButton: "Send intent",
    voiceListening: "Listening...",
    voiceError: "Voice input unavailable"
  }
};
const currentLocale = "th";

const canvas = typeof document !== "undefined" ? document.getElementById("manifestCanvas") : null;
const urlParams = typeof window !== "undefined" && window.location ? new URLSearchParams(window.location.search) : null;
const isDebugMode = urlParams ? (urlParams.get("debug") === "1" || urlParams.get("debug") === "true") : false;
const requestedRenderer = urlParams ? (urlParams.get("renderer") || "auto") : "auto";
const seedParam = urlParams ? urlParams.get("seed") : null;
const rendererSeed = seedParam !== null && !Number.isNaN(parseInt(seedParam, 10)) ? parseInt(seedParam, 10) : 1337;

// DOM Elements
const form = typeof document !== "undefined" ? document.getElementById("intentForm") : null;
const input = typeof document !== "undefined" ? document.getElementById("intentInput") : null;
const button = typeof document !== "undefined" ? document.getElementById("resonanceButton") : null;
const voiceButton = typeof document !== "undefined" ? document.getElementById("voiceButton") : null;
const responseSignal = typeof document !== "undefined" ? document.getElementById("responseSignal") : null;
const composerState = typeof document !== "undefined" ? document.getElementById("composerState") : null;

const diagnosticsDrawer = typeof document !== "undefined" ? document.getElementById("diagnosticsDrawer") : null;
const openDiagnostics = typeof document !== "undefined" ? document.getElementById("openDiagnostics") : null;
const closeDiagnostics = typeof document !== "undefined" ? document.getElementById("closeDiagnostics") : null;
const sysLog = typeof document !== "undefined" ? document.getElementById("sysLog") : null;

if (input) {
  input.placeholder = LOCALIZATION[currentLocale].placeholder;
  input.setAttribute("aria-label", LOCALIZATION[currentLocale].ariaLabelInput);
}
if (button) {
  button.setAttribute("aria-label", LOCALIZATION[currentLocale].ariaLabelButton);
  button.setAttribute("title", LOCALIZATION[currentLocale].ariaLabelButton);
}

let dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
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
  typeof window !== "undefined" &&
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
 * Temporal Signal Fusion Layer Initialization
 * --------------------------------------------------------- */

export const signalFusion = new TemporalSignalFusion({
  temporalWindowMs: 1500,
  spatialRadiusPx: 180,
  viewportGetter: () => ({ width, height }),
  onEarlyManifestation: (signal) => {
    if (renderer && typeof renderer.triggerEarlyManifestation === "function") {
      renderer.triggerEarlyManifestation(signal);
    }
  },
  onEpisodeCommitted: (episode) => {
    applyEpisodeIntent(episode);
  }
});

/* ---------------------------------------------------------
 * Execution Log Stream (Diagnostics Only)
 * --------------------------------------------------------- */

function logSystem(msg) {
  if (typeof document === "undefined" || !sysLog) return;
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
  if (typeof document === "undefined") return;
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
 * Typographyless Primary Surface
 * (Textual responses are eliminated on primary canvas)
 * --------------------------------------------------------- */

function setComposerStateText(text = "") {
  // Silent / accessibility-only update: no textual overlay on primary canvas
  if (!composerState) return;
  composerState.setAttribute("aria-label", text);
}

function showResponseSignal(text) {
  // Silent / accessibility-only update: no textual overlay on primary canvas
  if (!responseSignal) return;
  responseSignal.setAttribute("aria-label", text);
}

/* ---------------------------------------------------------
 * Phase-0 Intent Interpreter
 * --------------------------------------------------------- */

export function interpretIntent(text, episode = null) {
  const normalized = (text || "").trim().toLowerCase();

  let spatialEnergyBoost = 0;
  let spatialTurbulenceBoost = 0;
  let gestureShapeHint = null;

  if (episode && episode.spatial_context) {
    const { max_distance, path_length } = episode.spatial_context;
    if (path_length > 180 || max_distance > 150) {
      spatialEnergyBoost = 0.25;
      spatialTurbulenceBoost = 0.15;
      gestureShapeHint = "spiral";
    } else if (path_length > 60) {
      spatialEnergyBoost = 0.12;
      gestureShapeHint = "wave";
    }
  }

  if (!normalized && !gestureShapeHint) {
    return {
      phase: "IDLE",
      shape: "sphere",
      hue: 190,
      energy: Math.min(1.0, 0.18 + spatialEnergyBoost),
      density: 0.50,
      turbulence: 0.08,
      coherence: 0.90,
      confidence: 0.60
    };
  }

  if (includesAny(normalized, ["ฟัง", "ฟังฉัน", "ฟังเสียง", "listen", "hello", "สวัสดี"])) {
    return {
      phase: "LISTENING",
      shape: gestureShapeHint || "sphere",
      hue: 195,
      energy: Math.min(1.0, 0.30 + spatialEnergyBoost),
      density: 0.52,
      turbulence: 0.18 + spatialTurbulenceBoost,
      coherence: 0.84,
      confidence: 0.82
    };
  }

  if (includesAny(normalized, ["คิด", "วิเคราะห์", "เหตุผล", "reason", "think", "analyze"])) {
    return {
      phase: "PROCESSING",
      shape: gestureShapeHint || "spiral",
      hue: 268,
      energy: Math.min(1.0, 0.76 + spatialEnergyBoost),
      density: 0.78,
      turbulence: 0.32 + spatialTurbulenceBoost,
      coherence: 0.74,
      confidence: 0.78
    };
  }

  if (includesAny(normalized, ["สามเหลี่ยม", "สร้าง", "สร้างให้", "generate", "create", "ออกแบบ", "design"])) {
    return {
      phase: "RESPONDING",
      shape: "triangle",
      hue: 215,
      energy: Math.min(1.0, 0.86 + spatialEnergyBoost),
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
      energy: Math.min(1.0, 0.90 + spatialEnergyBoost),
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
      energy: Math.min(1.0, 0.92 + spatialEnergyBoost),
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
      energy: Math.min(1.0, 0.64 + spatialEnergyBoost),
      density: 0.72,
      turbulence: 0.20,
      coherence: 0.86,
      confidence: 0.72
    };
  }

  return {
    phase: "RESPONDING",
    shape: gestureShapeHint || "sphere",
    hue: 205,
    energy: Math.min(1.0, 0.42 + spatialEnergyBoost),
    density: 0.58,
    turbulence: 0.20 + spatialTurbulenceBoost,
    coherence: 0.72,
    confidence: 0.46
  };
}

function submitIntent(text) {
  const clean = text.trim();
  if (!clean) return;

  logSystem(`[INPUT] text signal submitted: "${clean}"`);

  signalFusion.ingest({
    signal_type: "text.submit",
    source: "text",
    event_time: typeof performance !== "undefined" ? performance.now() : Date.now(),
    text: clean
  });

  if (input) input.focus();
}

export function applyEpisodeIntent(episode) {
  try {
    const text = episode.primary_text || "";
    const candidate = interpretIntent(text, episode);
    const governed = createVisualState(candidate);

    state.phase = governed.phase;
    state.targetShape = governed.shape;
    state.targetHue = governed.hue;
    state.targetEnergy = governed.energy;
    state.targetDensity = governed.density;
    state.targetTurbulence = governed.turbulence;
    state.targetCoherence = governed.coherence;
    state.confidence = governed.confidence;

    interactionStrength = 1.0;

    logSystem(`[EPISODE] ${episode.episode_id} committed -> phase=${governed.phase} shape=${governed.shape} hue=${governed.hue}`);
  } catch (e) {
    console.error("Exception handled during episode intent governance:", e);
    state.phase = "IDLE";
    state.targetShape = "sphere";
    state.targetHue = 190;
    state.targetEnergy = 0.18;
    state.targetDensity = 0.55;
    state.targetTurbulence = 0.10;
    state.targetCoherence = 0.88;
  }
}

export function applyIntent(text) {
  const signal = {
    signal_type: "text.submit",
    source: "text",
    event_time: typeof performance !== "undefined" ? performance.now() : Date.now(),
    text
  };
  const { episode } = signalFusion.ingest(signal);
  if (episode) {
    signalFusion.commitActiveEpisode();
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
}

function setupWebSpeech() {
  if (!voiceButton) return;

  const SpeechRecognition =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

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
    signalFusion.ingest({
      signal_type: "voice.start",
      source: "voice",
      event_time: typeof performance !== "undefined" ? performance.now() : Date.now()
    });
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
        signalFusion.ingest({
          signal_type: "voice.final",
          source: "voice",
          event_time: typeof performance !== "undefined" ? performance.now() : Date.now(),
          text: phrase
        });
      }
    }
  };

  recognition.onerror = (err) => {
    setListeningState(false);
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

if (typeof document !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (diagnosticsDrawer && diagnosticsDrawer.classList.contains("open")) {
        closeDiagnosticsDrawer();
      } else if (input) {
        input.focus();
      }
    }
  });
}

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
  if (typeof window === "undefined") return;
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
  interactionStrength = Math.min(1, distance / Math.max(width || 1, height || 1));
}

// --- Pointer & Touch Event Handlers ---
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (event) => {
    updatePointer(event.clientX, event.clientY);
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
    signalFusion.ingest({
      signal_type: "pointer.move",
      source: "pointer",
      event_time: event.timeStamp || performance.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      metadata: { pointerId: event.pointerId, pointerType: event.pointerType }
    });
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    updatePointer(event.clientX, event.clientY);
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
    signalFusion.ingest({
      signal_type: "pointer.down",
      source: "pointer",
      event_time: event.timeStamp || performance.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      metadata: { pointerId: event.pointerId, pointerType: event.pointerType, button: event.button }
    });
  }, { passive: true });

  window.addEventListener("pointerup", (event) => {
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
    signalFusion.ingest({
      signal_type: "pointer.up",
      source: "pointer",
      event_time: event.timeStamp || performance.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      metadata: { pointerId: event.pointerId, pointerType: event.pointerType }
    });
  }, { passive: true });

  window.addEventListener("pointercancel", (event) => {
    signalFusion.ingest({
      signal_type: "pointer.cancel",
      source: "pointer",
      event_time: event.timeStamp || performance.now(),
      metadata: { pointerId: event.pointerId }
    });
  }, { passive: true });
}

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

  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(frame);
  }
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
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(frame);
  }
}

if (typeof window !== "undefined") {
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
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(frame);
      }
    });
  });
}
