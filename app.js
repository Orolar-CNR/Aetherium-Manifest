"use strict";

/*
 * AETHERIUM LIGHT MANIFEST
 *
 * Phase 0.1
 * Prototype Semantic Interpreter / Phase-0 Intent Interpreter
 *
 * Input:
 *   User intent
 *
 * Internal:
 *   Phase-0 Intent Interpreter (Prototype Semantic Interpreter)
 *   Visual State Governor
 *   Runtime Governor
 *
 * Output:
 *   Light
 *   Particle formation
 *   Motion
 *   Morphology
 *
 * NOTE: This is a Phase-0.1 Visual Proof-of-Concept.
 * This implementation does NOT contain LLM reasoning, backend cognition,
 * AETH compiler, Presence IR runtime, or production governor.
 * No textual response renderer exists in this layer.
 */

import { createVisualState } from "./runtime/visual-state.js";
// Note: validateVisualState/clampVisualState were imported but never called here.
// The runtime governor for this app is exercised entirely through createVisualState
// (see applyIntent() below), so only that is imported.

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
const currentLocale = "th"; // Defaults to Thai, but structured for easy future translation support.

const canvas = document.getElementById("manifestCanvas");
let ctx = null;

try {
  if (canvas) {
    ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });
  } else {
    console.error("Error: Canvas element with ID 'manifestCanvas' not found.");
  }
} catch (e) {
  console.error("Critical Failure: Unable to initialize Canvas 2D context.", e);
}

const form = document.getElementById("intentForm");
const input = document.getElementById("intentInput");

// Initialize localized placeholder and labels safely
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


/* ---------------------------------------------------------
 * Particle
 * --------------------------------------------------------- */

class Particle {

  constructor(index) {

    this.index = index;

    this.seed = Math.random();

    this.angle =
      Math.random() *
      Math.PI *
      2;

    this.radius =
      Math.random();

    this.depth =
      Math.random();

    this.size =
      0.65 +
      Math.random() *
      1.8;

    this.alpha =
      0.25 +
      Math.random() *
      0.70;

    this.x = 0;
    this.y = 0;

    this.vx = 0;
    this.vy = 0;

    this.tx = 0;
    this.ty = 0;
  }

  update(time, dt) {

    const normalizedIndex =
      this.index / PARTICLE_COUNT;

    const phase =
      state.phase;

    const turbulence =
      state.turbulence;

    const energy =
      state.energy;

    const density =
      state.density;

    const coherence =
      state.coherence;

    let radius =
      (
        35 +
        normalizedIndex *
        220
      ) *
      (0.45 + density);

    if (phase === "IDLE") {
      radius *= 0.72;
    }

    if (phase === "LISTENING") {
      radius *=
        0.72 +
        interactionStrength *
        0.55;
    }

    if (phase === "PROCESSING") {
      radius *=
        0.75 +
        energy *
        0.85;
    }

    if (phase === "RESPONDING") {
      radius *=
        0.70 +
        coherence *
        0.80;
    }

    if (phase === "WARNING") {
      radius *=
        0.75 +
        0.35 *
        Math.sin(time * 0.01);
    }

    if (phase === "ERROR") {
      radius *=
        1.1 +
        Math.abs(
          Math.sin(time * 0.004)
        ) *
        0.5;
    }

    if (phase === "NIRODHA") {
      radius *= 0.18;
    }

    let tx = 0;
    let ty = 0;

    switch (state.shape) {

      case "triangle":
        [tx, ty] =
          triangleField(
            this.index,
            PARTICLE_COUNT,
            radius,
            time
          );
        break;

      case "spiral":
        [tx, ty] =
          spiralField(
            this.index,
            PARTICLE_COUNT,
            radius,
            time
          );
        break;

      case "line":
        [tx, ty] =
          lineField(
            this.index,
            PARTICLE_COUNT,
            radius,
            time
          );
        break;

      case "wave":
        [tx, ty] =
          waveField(
            this.index,
            PARTICLE_COUNT,
            radius,
            time
          );
        break;

      case "sphere":
      default:
        [tx, ty] =
          sphereField(
            this.angle,
            this.radius,
            radius,
            time
          );
        break;
    }

    const noiseX =
      Math.sin(
        time * 0.0014 +
        this.seed * 40 +
        normalizedIndex * 13
      );

    const noiseY =
      Math.cos(
        time * 0.0011 +
        this.seed * 20 +
        normalizedIndex * 17
      );

    tx +=
      noiseX *
      turbulence *
      30;

    ty +=
      noiseY *
      turbulence *
      30;

    const dx =
      centerX +
      tx -
      this.x;

    const dy =
      centerY +
      ty -
      this.y;

    const stiffness =
      2.0 +
      coherence *
      4.0;

    this.vx +=
      dx *
      stiffness *
      dt;

    this.vy +=
      dy *
      stiffness *
      dt;

    this.vx *=
      1 -
      Math.min(
        0.92,
        7.0 * dt
      );

    this.vy *=
      1 -
      Math.min(
        0.92,
        7.0 * dt
      );

    this.vx +=
      noiseX *
      energy *
      18 *
      dt;

    this.vy +=
      noiseY *
      energy *
      18 *
      dt;

    this.x +=
      this.vx;

    this.y +=
      this.vy;
  }

  draw() {

    if (!ctx) return;

    if (
      state.phase ===
      "NIRODHA"
    ) {
      return;
    }

    const distance =
      Math.hypot(
        this.x - centerX,
        this.y - centerY
      );

    const distanceFactor =
      Math.max(
        0.15,
        1 -
        distance /
        Math.max(
          width,
          height
        )
      );

    let alpha =
      this.alpha *
      state.glow *
      (
        0.35 +
        distanceFactor *
        0.75
      );

    if (
      state.phase ===
      "WARNING"
    ) {
      alpha *=
        0.55 +
        Math.abs(
          Math.sin(
            performance.now() *
            0.006
          )
        ) *
        0.55;
    }

    if (
      state.phase ===
      "ERROR"
    ) {
      alpha *=
        0.45 +
        Math.random() *
        0.55;
    }

    const hue =
      state.hue +
      (
        this.index %
        20
      ) *
      2.0;

    const lightness =
      72 +
      Math.sin(
        this.index
      ) *
      12;

    ctx.beginPath();

    ctx.fillStyle =
      `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}


/* ---------------------------------------------------------
 * Responsive Particle Budget
 * --------------------------------------------------------- */

function getParticleBudget() {

  const area =
    window.innerWidth *
    window.innerHeight;

  if (area < 350000) {
    return 900;
  }

  if (area < 700000) {
    return 1400;
  }

  return 2200;
}

const PARTICLE_COUNT =
  getParticleBudget();

const particles =
  Array.from(
    {
      length:
        PARTICLE_COUNT
    },
    (_, index) =>
      new Particle(index)
  );


/* ---------------------------------------------------------
 * Phase-0 Intent Interpreter (Prototype Semantic Interpreter)
 *
 * Local heuristic only. No actual AI reasoning engine in Phase 0.
 * --------------------------------------------------------- */

function interpretIntent(text) {

  const normalized =
    text
      .trim()
      .toLowerCase();

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

  if (
    includesAny(
      normalized,
      [
        "ฟัง",
        "ฟังฉัน",
        "ฟังเสียง",
        "listen",
        "hello",
        "สวัสดี"
      ]
    )
  ) {

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

  if (
    includesAny(
      normalized,
      [
        "คิด",
        "วิเคราะห์",
        "เหตุผล",
        "reason",
        "think",
        "analyze"
      ]
    )
  ) {

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

  if (
    includesAny(
      normalized,
      [
        "สร้าง",
        "สร้างให้",
        "generate",
        "create",
        "ออกแบบ",
        "design"
      ]
    )
  ) {

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

  if (
    includesAny(
      normalized,
      [
        "หยุด",
        "พัก",
        "หลับ",
        "sleep",
        "rest",
        "nirodha"
      ]
    )
  ) {

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

  if (
    includesAny(
      normalized,
      [
        "อันตราย",
        "ผิดพลาด",
        "error",
        "warning",
        "danger"
      ]
    )
  ) {

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

  if (
    normalized.includes(
      "→"
    ) ||
    normalized.includes(
      "ไป"
    ) ||
    normalized.includes(
      "ส่ง"
    )
  ) {

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

  /*
   * Unknown intent:
   * keep the system alive,
   * produce a neutral manifestation.
   */

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


/* ---------------------------------------------------------
 * Apply State
 * --------------------------------------------------------- */

function applyIntent(text) {

  try {
    const candidate =
      interpretIntent(text);

    const governed =
      createVisualState(
        candidate
      );

    state.phase =
      governed.phase;

    state.targetShape =
      governed.shape;

    state.targetHue =
      governed.hue;

    state.targetEnergy =
      governed.energy;

    state.targetDensity =
      governed.density;

    state.targetTurbulence =
      governed.turbulence;

    state.targetCoherence =
      governed.coherence;

    state.confidence =
      governed.confidence;

    /*
     * Interaction pulse.
     */

    interactionStrength = 1;

    /*
     * Small physical shockwave.
     */

    burst(
      1.0 +
      governed.energy *
      1.5
    );
  } catch (e) {
    console.error("Exception handled during intent interpretation & state governance:", e);
    // Safe fallback to IDLE
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
 * Morphology Transition
 * --------------------------------------------------------- */

function updateState(dt) {

  const smoothing =
    reducedMotion
      ? 0.05
      : 1 -
        Math.pow(
          0.001,
          dt
        );

  state.energy +=
    (
      state.targetEnergy -
      state.energy
    ) *
    smoothing;

  state.density +=
    (
      state.targetDensity -
      state.density
    ) *
    smoothing;

  state.turbulence +=
    (
      state.targetTurbulence -
      state.turbulence
    ) *
    smoothing;

  state.coherence +=
    (
      state.targetCoherence -
      state.coherence
    ) *
    smoothing;

  state.hue = lerpAngle(
    state.hue,
    state.targetHue,
    smoothing
  );

  if (
    state.shape !==
    state.targetShape
  ) {

    /*
     * Morphology switch is intentionally
     * state-driven rather than renderer-driven.
     */

    state.shape =
      state.targetShape;
  }

  interactionStrength *=
    reducedMotion
      ? 0.92
      : 0.88;
}


/* ---------------------------------------------------------
 * Burst System
 * --------------------------------------------------------- */

const bursts = [];

function burst(power) {

  bursts.push({
    radius: 10,
    power,
    life: 1
  });

  if (
    bursts.length >
    8
  ) {
    bursts.shift();
  }
}

function updateBursts() {

  if (!ctx) return;

  ctx.save();

  for (
    const item of bursts
  ) {

    item.radius +=
      item.power *
      8;

    item.life *=
      reducedMotion
        ? 0.90
        : 0.94;

    ctx.beginPath();

    ctx.arc(
      centerX,
      centerY,
      item.radius,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      `hsla(
        ${state.hue},
        100%,
        70%,
        ${item.life * 0.14}
      )`;

    ctx.lineWidth =
      1.5;

    ctx.stroke();
  }

  for (
    let i =
      bursts.length - 1;
    i >= 0;
    i--
  ) {

    if (
      bursts[i].life <
      0.02
    ) {
      bursts.splice(i, 1);
    }
  }

  ctx.restore();
}


/* ---------------------------------------------------------
 * Field Functions
 * --------------------------------------------------------- */

function sphereField(
  angle,
  normalizedRadius,
  radius,
  time
) {

  const wave =
    Math.sin(
      time * 0.0012 +
      angle * 3.0
    ) *
    7;

  const r =
    normalizedRadius *
    radius +
    wave;

  return [
    Math.cos(angle) * r,
    Math.sin(angle) * r
  ];
}


function triangleField(
  index,
  count,
  radius,
  time
) {

  const p =
    index /
    count;

  const segment =
    Math.floor(
      p * 3
    );

  const local =
    (
      p * 3
    ) % 1;

  const R =
    radius *
    0.72;

  const points = [
    [
      0,
      -R
    ],
    [
      R * 0.86,
      R * 0.50
    ],
    [
      -R * 0.86,
      R * 0.50
    ]
  ];

  const a =
    points[
      segment
    ];

  const b =
    points[
      (segment + 1) % 3
    ];

  const wobble =
    Math.sin(
      time * 0.001 +
      index
    ) *
    state.turbulence *
    8;

  return [
    lerp(
      a[0],
      b[0],
      local
    ) + wobble,

    lerp(
      a[1],
      b[1],
      local
    ) + wobble
  ];
}


function spiralField(
  index,
  count,
  radius,
  time
) {

  const p =
    index /
    count;

  const turns =
    5.5;

  const angle =
    p *
    Math.PI *
    2 *
    turns +
    time *
    0.0007;

  const r =
    radius *
    p *
    0.70;

  return [
    Math.cos(angle) * r,
    Math.sin(angle) * r
  ];
}


function lineField(
  index,
  count,
  radius,
  time
) {

  const p =
    index /
    count;

  const x =
    (
      p -
      0.5
    ) *
    radius *
    2.2;

  const wave =
    Math.sin(
      p * 16 +
      time * 0.002
    ) *
    state.turbulence *
    45;

  return [
    x,
    wave
  ];
}


function waveField(
  index,
  count,
  radius,
  time
) {

  const p =
    index /
    count;

  const x =
    (
      p -
      0.5
    ) *
    radius *
    2.0;

  const y =
    Math.sin(
      p * 18 +
      time * 0.003
    ) *
    radius *
    0.42;

  return [
    x,
    y
  ];
}


/* ---------------------------------------------------------
 * Render
 * --------------------------------------------------------- */

function render() {

  if (!ctx) return;

  const time =
    performance.now();

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  /*
   * Background aura.
   */

  const auraSize =
    90 +
    state.energy *
    220;

  const gradient =
    ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      auraSize
    );

  gradient.addColorStop(
    0,
    `hsla(
      ${state.hue},
      100%,
      70%,
      ${0.07 + state.energy * 0.05}
    )`
  );

  gradient.addColorStop(
    0.5,
    `hsla(
      ${state.hue},
      100%,
      60%,
      ${0.025 + state.energy * 0.025}
    )`
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  /*
   * Particles.
   */

  ctx.save();

  ctx.globalCompositeOperation =
    "lighter";

  for (
    const particle of particles
  ) {

    particle.update(
      time,
      frameDelta
    );

    particle.draw();
  }

  ctx.restore();

  /*
   * Central resonance.
   */

  drawCore();

  /*
   * Energy bursts.
   */

  updateBursts();
}


/* ---------------------------------------------------------
 * Resonance Core
 * --------------------------------------------------------- */

function drawCore() {

  if (!ctx) return;

  const pulse =
    reducedMotion
      ? 1
      : 1 +
        Math.sin(
          performance.now() *
          0.002
        ) *
        0.08;

  const radius =
    (
      5 +
      state.energy *
      18
    ) *
    pulse;

  const glow =
    ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius * 5
    );

  glow.addColorStop(
    0,
    `hsla(
      ${state.hue},
      100%,
      100%,
      0.75
    )`
  );

  glow.addColorStop(
    0.25,
    `hsla(
      ${state.hue},
      100%,
      75%,
      0.30
    )`
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.beginPath();

  ctx.fillStyle =
    glow;

  ctx.arc(
    centerX,
    centerY,
    radius * 5,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.fillStyle =
    `hsla(
      ${state.hue},
      100%,
      96%,
      0.95
    )`;

  ctx.arc(
    centerX,
    centerY,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* ---------------------------------------------------------
 * Resize
 * --------------------------------------------------------- */

function resizeCanvas() {

  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  width =
    window.innerWidth;

  height =
    window.innerHeight;

  if (canvas) {
    canvas.width =
      Math.floor(
        width * dpr
      );

    canvas.height =
      Math.floor(
        height * dpr
      );

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;
  }

  if (ctx) {
    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  centerX =
    width / 2;

  centerY =
    height / 2;

  pointerX =
    centerX;

  pointerY =
    centerY;
}


/* ---------------------------------------------------------
 * Pointer / Touch
 * --------------------------------------------------------- */

function updatePointer(
  clientX,
  clientY
) {

  pointerX =
    clientX;

  pointerY =
    clientY;

  const dx =
    pointerX -
    centerX;

  const dy =
    pointerY -
    centerY;

  const distance =
    Math.hypot(
      dx,
      dy
    );

  interactionStrength =
    Math.min(
      1,
      distance /
      Math.max(
        width,
        height
      )
    );
}

window.addEventListener(
  "pointermove",
  (event) => {

    updatePointer(
      event.clientX,
      event.clientY
    );
  },
  {
    passive: true
  }
);

window.addEventListener(
  "pointerdown",
  (event) => {

    updatePointer(
      event.clientX,
      event.clientY
    );

    burst(0.75);
  },
  {
    passive: true
  }
);


/* ---------------------------------------------------------
 * Form
 * --------------------------------------------------------- */

if (form) {
  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      if (input) {
        applyIntent(
          input.value
        );

        input.select();
      }
    }
  );
}


/* ---------------------------------------------------------
 * Keyboard
 * --------------------------------------------------------- */

if (input) {
  input.addEventListener(
    "keydown",
    (event) => {

      /*
       * Enter submits.
       * Shift+Enter remains available
       * for future multiline behavior.
       */

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        if (form) {
          form.requestSubmit();
        }
      }
    }
  );
}


/* ---------------------------------------------------------
 * Animation Loop
 * --------------------------------------------------------- */

let frameDelta = 0.016;

function frame(now) {

  const elapsed =
    Math.min(
      0.05,
      (
        now -
        lastTime
      ) /
      1000
    );

  frameDelta =
    elapsed;

  lastTime =
    now;

  updateState(
    elapsed
  );

  render();

  requestAnimationFrame(
    frame
  );
}


/* ---------------------------------------------------------
 * Helpers
 * --------------------------------------------------------- */

function lerp(
  a,
  b,
  t
) {

  return (
    a +
    (
      b -
      a
    ) *
    t
  );
}


function lerpAngle(
  a,
  b,
  t
) {

  let delta =
    (
      b -
      a +
      540
    ) % 360 -
    180;

  return (
    a +
    delta *
    t
  );
}


function includesAny(
  text,
  values
) {

  return values.some(
    value =>
      text.includes(
        value
      )
  );
}


/* ---------------------------------------------------------
 * Boot
 * --------------------------------------------------------- */

resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas,
  {
    passive: true
  }
);

/*
 * Initial formation.
 */
applyIntent("");

requestAnimationFrame(
  frame
);
