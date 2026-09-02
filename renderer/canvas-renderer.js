import { getParticleBudget, initializeParticles } from "../runtime/reference-renderer.js";
import { createRendererDiagnostics } from "./renderer-interface.js";

export function createCanvasRenderer({ canvas, context, rendererSeed = null, reducedMotion = false } = {}) {
  let ctx = context, width = 0, height = 0, dpr = 1, particles = [], particleCount = 0, manifestationState = {}, frameDelta = 0.016;
  let activeRipples = [];
  let lastPointerPos = null;

  return {
    supports: () => true,
    async initialize() { if (!ctx && canvas) ctx = canvas.getContext("2d", { alpha: true, desynchronized: true }); return this; },
    resize({ width: w, height: h, dpr: nextDpr }) { width = w; height = h; dpr = nextDpr; if (ctx) ctx.setTransform(dpr,0,0,dpr,0,0); const n = getParticleBudget(width,height); if (n !== particleCount) { particleCount = n; particles = initializeParticles(n, rendererSeed); } },
    setManifestationState(nextState, { deltaTime = 0.016 } = {}) { manifestationState = nextState; frameDelta = deltaTime; },

    triggerEarlyManifestation(signal) {
      if (!signal || !signal.coordinates) return;
      const { x, y } = signal.coordinates;
      const hue = manifestationState.hue !== undefined ? manifestationState.hue : 190;

      if (signal.signal_type.endsWith(".down") || signal.signal_type.endsWith(".start")) {
        activeRipples.push({
          x,
          y,
          radius: 5,
          maxRadius: 180 + (manifestationState.energy || 0.5) * 60,
          alpha: 0.85,
          hue,
          speed: reducedMotion ? 1.5 : 3.5
        });
      } else if (signal.signal_type.endsWith(".move")) {
        if (!lastPointerPos || Math.hypot(x - lastPointerPos.x, y - lastPointerPos.y) > 12) {
          activeRipples.push({
            x,
            y,
            radius: 2,
            maxRadius: 65,
            alpha: 0.50,
            hue,
            speed: reducedMotion ? 1.0 : 2.5
          });
          lastPointerPos = { x, y };
        }
      }
    },

    render({ time = performance.now(), interactionStrength = 0 } = {}) {
      if (!ctx) return; const centerX = width/2, centerY = height/2; ctx.clearRect(0,0,width,height);
      const auraSize = 90 + manifestationState.energy * 220; const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, auraSize);
      gradient.addColorStop(0, `hsla(${manifestationState.hue}, 100%, 70%, ${0.07 + manifestationState.energy * 0.05})`);
      gradient.addColorStop(0.5, `hsla(${manifestationState.hue}, 100%, 60%, ${0.025 + manifestationState.energy * 0.025})`); gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient; ctx.fillRect(0,0,width,height); ctx.save(); ctx.globalCompositeOperation = "lighter";
      const dims = { width, height, centerX, centerY }; for (const p of particles) { p.update(time, frameDelta, manifestationState, dims, interactionStrength); p.draw(ctx, manifestationState, dims, time); } ctx.restore();

      // Render Early Manifestation Ripples
      if (activeRipples.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = activeRipples.length - 1; i >= 0; i--) {
          const r = activeRipples[i];
          r.radius += r.speed * (frameDelta * 60);
          r.alpha *= 0.94;

          if (r.alpha > 0.01 && r.radius < r.maxRadius) {
            const grad = ctx.createRadialGradient(r.x, r.y, Math.max(0, r.radius - 12), r.x, r.y, r.radius + 12);
            grad.addColorStop(0, `hsla(${r.hue}, 100%, 80%, 0)`);
            grad.addColorStop(0.5, `hsla(${r.hue}, 100%, 85%, ${r.alpha})`);
            grad.addColorStop(1, `hsla(${r.hue}, 100%, 80%, 0)`);
            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.arc(r.x, r.y, r.radius + 12, 0, Math.PI * 2);
            ctx.fill();
          } else {
            activeRipples.splice(i, 1);
          }
        }
        ctx.restore();
      }

      const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 0.002) * 0.08; const radius = (5 + manifestationState.energy * 18) * pulse; const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 5);
      glow.addColorStop(0, `hsla(${manifestationState.hue}, 100%, 100%, 0.75)`); glow.addColorStop(0.25, `hsla(${manifestationState.hue}, 100%, 75%, 0.30)`); glow.addColorStop(1, "rgba(0,0,0,0)"); ctx.beginPath(); ctx.fillStyle = glow; ctx.arc(centerX, centerY, radius * 5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.fillStyle = `hsla(${manifestationState.hue}, 100%, 96%, 0.95)`; ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.fill();
    },
    dispose() { particles = []; activeRipples = []; },
    getDiagnostics() { return createRendererDiagnostics({ backend: "canvas", particleCount, qualityTier: "Phase-0.2", initializationStatus: ctx ? "ready" : "unavailable" }); }
  };
}
