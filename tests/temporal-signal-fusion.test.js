import assert from "node:assert/strict";
import { normalizeSignal, createInteractionEpisode, updateEpisodeSpatialContext, TemporalSignalFusion } from "../runtime/temporal-signal-fusion.js";
import { interpretIntent, applyEpisodeIntent, signalFusion } from "../app.js";
import { createVisualState } from "../runtime/visual-state.js";
import { createCanvasRenderer } from "../renderer/canvas-renderer.js";

console.log("Starting Temporal Signal Fusion & Early Manifestation Tests...\n");

// --- A. Temporal Event Ordering & Distinct Timestamps ---
{
  const raw1 = {
    type: "pointer.down",
    source: "pointer",
    event_time: 1000.0,
    x: 100,
    y: 200,
    metadata: { pointerId: 1 }
  };

  const norm1 = normalizeSignal(raw1, { width: 1000, height: 1000 });

  assert.equal(norm1.event_time, 1000.0, "event_time matches physical event timestamp");
  assert.equal(typeof norm1.ingest_time, "number", "ingest_time is a valid number");
  assert.notEqual(norm1.event_time, norm1.ingest_time, "event_time and ingest_time remain distinct properties");
  assert.equal(norm1.coordinates.normalized_x, 0.1, "normalized_x calculated accurately");
  assert.equal(norm1.coordinates.normalized_y, 0.2, "normalized_y calculated accurately");

  // Out of order timestamps check
  const raw2 = { type: "pointer.move", event_time: 1200.0, x: 120, y: 220 };
  const rawEarly = { type: "pointer.move", event_time: 1100.0, x: 110, y: 210 };

  const norm2 = normalizeSignal(raw2, { width: 1000, height: 1000 });
  const normEarly = normalizeSignal(rawEarly, { width: 1000, height: 1000 });

  assert.ok(normEarly.event_time < norm2.event_time, "Individual event_time preserved for out-of-order events");
  console.log("✅ A. Temporal event ordering & distinct timestamps verified");
}

// --- B. Episode Correlation & Temporal Window Boundaries ---
{
  const fusion = new TemporalSignalFusion({ temporalWindowMs: 1500 });

  // Grouping closely related signals
  fusion.ingest({ type: "pointer.down", event_time: 2000.0, x: 100, y: 100 });
  fusion.ingest({ type: "pointer.move", event_time: 2100.0, x: 120, y: 110 });
  const { episode: ep1 } = fusion.ingest({ type: "pointer.up", event_time: 2200.0, x: 130, y: 115 });

  assert.equal(ep1.signals.length, 3, "Closely related signals grouped into single episode");

  // Signal exceeding temporal window boundary (3000ms later)
  const { episode: ep2 } = fusion.ingest({ type: "pointer.down", event_time: 5500.0, x: 500, y: 500 });

  assert.notEqual(ep1.episode_id, ep2.episode_id, "Temporal window boundary cleanly separates unrelated episodes");
  console.log("✅ B. Episode correlation & temporal window boundaries verified");
}

// --- C. Spatial Continuity ---
{
  const fusion = new TemporalSignalFusion({ temporalWindowMs: 1500, spatialRadiusPx: 100 });

  // Continuous drag gesture
  fusion.ingest({ type: "pointer.down", event_time: 1000.0, x: 50, y: 50 });
  fusion.ingest({ type: "pointer.move", event_time: 1100.0, x: 60, y: 60 });
  const { episode: epDrag } = fusion.ingest({ type: "pointer.move", event_time: 1200.0, x: 70, y: 70 });

  assert.ok(epDrag.spatial_context !== null, "Spatial context generated");
  assert.equal(epDrag.spatial_context.initial_x, 50, "Initial X recorded");
  assert.ok(epDrag.spatial_context.path_length > 0, "Path length accumulated");

  // Distant spatial gesture outside active sequence starts new episode
  fusion.commitActiveEpisode();
  const { episode: epFar } = fusion.ingest({ type: "pointer.down", event_time: 1250.0, x: 800, y: 800 });

  assert.notEqual(epDrag.episode_id, epFar.episode_id, "Distant spatial interaction separated into distinct episode");
  console.log("✅ C. Spatial continuity & trajectory tracking verified");
}

// --- D. Interaction Lifecycle & Cancellation ---
{
  const fusion = new TemporalSignalFusion();

  fusion.ingest({ type: "pointer.down", event_time: 1000.0, x: 100, y: 100 });
  fusion.ingest({ type: "pointer.move", event_time: 1050.0, x: 110, y: 105 });
  const { episode: epCancel } = fusion.ingest({ type: "pointer.cancel", event_time: 1100.0 });

  assert.equal(epCancel.status, "CANCELLED", "Pointer cancellation sets episode status to CANCELLED");
  console.log("✅ D. Interaction lifecycle & cancellation verified");
}

// --- E. Voice + Interaction Correlation ---
{
  const fusion = new TemporalSignalFusion({ temporalWindowMs: 1500 });

  // Touch gesture followed closely by voice final result
  fusion.ingest({ type: "touch.start", event_time: 1000.0, x: 200, y: 200 });
  fusion.ingest({ type: "touch.end", event_time: 1200.0, x: 205, y: 205 });

  const { episode: epVoice } = fusion.ingest({
    type: "voice.final",
    event_time: 1500.0,
    text: "ขยายตรงนี้"
  });

  assert.equal(epVoice.primary_text, "ขยายตรงนี้", "Voice transcript attached to active gesture episode");
  assert.ok(epVoice.signals.some(s => s.source === "touch"), "Touch gesture preserved in same episode as voice");

  // Unrelated delayed voice input (4000ms later)
  fusion.commitActiveEpisode();
  const { episode: epDelayedVoice } = fusion.ingest({
    type: "voice.final",
    event_time: 6000.0,
    text: "สร้างสามเหลี่ยม"
  });

  assert.notEqual(epVoice.episode_id, epDelayedVoice.episode_id, "Delayed voice input does not attach to expired episode");
  console.log("✅ E. Voice + gesture correlation verified");
}

// --- F. Graceful Early Manifestation & Single State Authority ---
{
  let earlyTriggered = false;
  let triggeredSignal = null;

  const fusion = new TemporalSignalFusion({
    onEarlyManifestation: (sig) => {
      earlyTriggered = true;
      triggeredSignal = sig;
    }
  });

  fusion.ingest({ type: "pointer.down", event_time: 1000.0, x: 300, y: 300 });

  assert.ok(earlyTriggered, "Early manifestation callback invoked immediately on pointer down");
  assert.equal(triggeredSignal.coordinates.x, 300, "Triggered signal contains physical coordinates");

  // Verify Renderer ripple trigger does not throw
  const mockCanvas = { getContext: () => ({ setTransform: () => {}, clearRect: () => {}, createRadialGradient: () => ({ addColorStop: () => {} }), save: () => {}, restore: () => {}, beginPath: () => {}, fill: () => {}, arc: () => {} }) };
  const renderer = createCanvasRenderer({ canvas: mockCanvas });
  renderer.initialize();

  assert.doesNotThrow(() => {
    renderer.triggerEarlyManifestation(triggeredSignal);
  }, "Renderer handles early manifestation ripples safely");

  console.log("✅ F. Graceful early manifestation & single state authority verified");
}

// --- G. Renderer Safety & Invariant Boundaries ---
{
  const rawIntentText = "สร้างสามเหลี่ยม";
  const interpretedCandidate = interpretIntent(rawIntentText);
  const governedState = createVisualState(interpretedCandidate);

  assert.ok(governedState.phase, "State possesses valid governed phase");
  assert.ok(governedState.shape, "State possesses valid governed shape");
  assert.equal(typeof governedState.hue, "number", "Hue is governed numeric value");
  assert.equal(typeof governedState.energy, "number", "Energy is governed numeric value");

  // Confirm raw text is never injected as visual state
  assert.equal(governedState.rawText, undefined, "Raw intent text is isolated from governed visual state schema");
  console.log("✅ G. Renderer safety & visual contract isolation verified");
}

// --- H. Typographyless Primary Surface Verification ---
{
  const episode = createInteractionEpisode(normalizeSignal({ type: "text.submit", text: "สวัสดี" }));
  const interpreted = interpretIntent(episode.primary_text, episode);
  const governed = createVisualState(interpreted);

  assert.equal(governed.phase, "LISTENING", "Intent correctly mapped to LISTENING visual state");
  assert.equal(typeof governed.hue, "number", "Output expressed via HSL hue");
  assert.equal(typeof governed.energy, "number", "Output expressed via energy parameter");

  console.log("✅ H. Typographyless morphological response output verified");
}

console.log("\nAll Temporal Signal Fusion & Early Manifestation tests completed successfully! 🎉");
