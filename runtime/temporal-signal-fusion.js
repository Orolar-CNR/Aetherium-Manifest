/**
 * Aetherium Phase 0.x Temporal Signal Fusion Layer
 *
 * Normalizes multi-modal human interaction signals (pointer, touch, motion, voice, text, attachment)
 * into structured signal envelopes and correlates them deterministically into Interaction Episodes.
 *
 * Truth Governance Boundary:
 * PHASE 0.x INTERACTION INFRASTRUCTURE / CANDIDATE DESIGN
 * This module operates upstream of the Phase-0 Local Interpreter.
 * It is NOT a Phase 1 Presence Runtime or Governor A/B execution engine.
 */

let sequenceCounter = 0;

/**
 * Normalizes a raw input event into a canonical Phase 0.x Signal Envelope.
 *
 * @param {Object} raw Raw signal object or DOM event wrapper
 * @param {Object} [viewport] Optional { width, height } for coordinate normalization
 * @returns {Object} Normalized signal envelope
 */
export function normalizeSignal(raw, viewport = { width: typeof window !== "undefined" ? window.innerWidth : 800, height: typeof window !== "undefined" ? window.innerHeight : 600 }) {
  const ingestTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  let eventTime = raw.event_time;
  if (typeof eventTime !== "number") {
    if (typeof raw.timeStamp === "number" && raw.timeStamp > 0) {
      eventTime = raw.timeStamp;
    } else {
      eventTime = ingestTime;
    }
  }

  const signalType = raw.signal_type || raw.type || "unknown";

  let source = raw.source;
  if (!source) {
    if (signalType.startsWith("pointer")) source = "pointer";
    else if (signalType.startsWith("touch")) source = "touch";
    else if (signalType.startsWith("voice")) source = "voice";
    else if (signalType.startsWith("text")) source = "text";
    else if (signalType.startsWith("motion")) source = "motion";
    else if (signalType.startsWith("attachment")) source = "attachment";
    else source = "unknown";
  }

  let coordinates = null;
  if (typeof raw.x === "number" && typeof raw.y === "number") {
    const w = Math.max(1, viewport.width || 1);
    const h = Math.max(1, viewport.height || 1);
    coordinates = {
      x: raw.x,
      y: raw.y,
      normalized_x: Number((raw.x / w).toFixed(4)),
      normalized_y: Number((raw.y / h).toFixed(4))
    };
  } else if (raw.coordinates) {
    coordinates = { ...raw.coordinates };
  }

  sequenceCounter++;

  return {
    signal_id: `sig-${Math.floor(eventTime)}-${sequenceCounter}`,
    signal_type: signalType,
    source,
    event_time: eventTime,
    ingest_time: ingestTime,
    coordinates,
    text: raw.text || raw.transcript || null,
    metadata: raw.metadata || {},
    sequence: sequenceCounter
  };
}

/**
 * Creates a new Interaction Episode.
 *
 * @param {Object} initialSignal Normalized signal envelope
 * @returns {Object} InteractionEpisode
 */
export function createInteractionEpisode(initialSignal) {
  const episodeId = `ep-${Math.floor(initialSignal.event_time)}-${Math.floor(Math.random() * 10000)}`;

  const episode = {
    episode_id: episodeId,
    status: "OPEN",
    start_event_time: initialSignal.event_time,
    end_event_time: initialSignal.event_time,
    signals: [initialSignal],
    spatial_context: null,
    primary_text: initialSignal.text || null,
    temporal_confidence: 1.0
  };

  updateEpisodeSpatialContext(episode);
  return episode;
}

/**
 * Recalculates spatial context (centroid, path length, max distance) for an episode.
 *
 * @param {Object} episode InteractionEpisode
 */
export function updateEpisodeSpatialContext(episode) {
  const coordSignals = episode.signals.filter(s => s.coordinates !== null);
  if (coordSignals.length === 0) {
    episode.spatial_context = null;
    return;
  }

  const first = coordSignals[0].coordinates;
  let sumX = 0;
  let sumY = 0;
  let pathLength = 0;
  let maxDist = 0;

  for (let i = 0; i < coordSignals.length; i++) {
    const c = coordSignals[i].coordinates;
    sumX += c.x;
    sumY += c.y;

    const distFromInitial = Math.hypot(c.x - first.x, c.y - first.y);
    if (distFromInitial > maxDist) maxDist = distFromInitial;

    if (i > 0) {
      const prev = coordSignals[i - 1].coordinates;
      pathLength += Math.hypot(c.x - prev.x, c.y - prev.y);
    }
  }

  episode.spatial_context = {
    initial_x: first.x,
    initial_y: first.y,
    centroid_x: Number((sumX / coordSignals.length).toFixed(2)),
    centroid_y: Number((sumY / coordSignals.length).toFixed(2)),
    max_distance: Number(maxDist.toFixed(2)),
    path_length: Number(pathLength.toFixed(2))
  };
}

/**
 * TemporalSignalFusion pipeline managing incoming signals and active episodes.
 */
export class TemporalSignalFusion {
  constructor(options = {}) {
    this.temporalWindowMs = options.temporalWindowMs || 1500;
    this.spatialRadiusPx = options.spatialRadiusPx || 180;
    this.viewportGetter = options.viewportGetter || (() => ({ width: typeof window !== "undefined" ? window.innerWidth : 800, height: typeof window !== "undefined" ? window.innerHeight : 600 }));

    this.activeEpisode = null;
    this.committedEpisodes = [];

    this.onEpisodeCommitted = options.onEpisodeCommitted || null;
    this.onEarlyManifestation = options.onEarlyManifestation || null;
  }

  /**
   * Ingests a raw signal event, normalizes it, triggers early manifestation if appropriate,
   * and correlates it into an Interaction Episode.
   *
   * @param {Object} rawSignal
   * @returns {{ signal: Object, episode: Object }}
   */
  ingest(rawSignal) {
    const viewport = this.viewportGetter();
    const signal = normalizeSignal(rawSignal, viewport);

    // Trigger Early Manifestation callback if available
    if (this.onEarlyManifestation && (signal.source === "pointer" || signal.source === "touch")) {
      this.onEarlyManifestation(signal);
    }

    let targetEpisode = this.activeEpisode;

    if (!targetEpisode || targetEpisode.status !== "OPEN") {
      // If signal is voice/text and there is a recently committed episode within temporalWindowMs, attach to recent episode
      if ((signal.source === "voice" || signal.source === "text") && this.committedEpisodes.length > 0) {
        const recent = this.committedEpisodes[this.committedEpisodes.length - 1];
        if (signal.event_time - recent.end_event_time <= this.temporalWindowMs) {
          recent.signals.push(signal);
          recent.end_event_time = signal.event_time;
          if (signal.text) recent.primary_text = signal.text;
          if (this.onEpisodeCommitted) this.onEpisodeCommitted(recent);
          return { signal, episode: recent };
        }
      }
      this.activeEpisode = createInteractionEpisode(signal);
      targetEpisode = this.activeEpisode;
    } else {
      const isCorrelated = this.shouldCorrelate(targetEpisode, signal);
      if (isCorrelated) {
        targetEpisode.signals.push(signal);
        targetEpisode.end_event_time = signal.event_time;
        updateEpisodeSpatialContext(targetEpisode);

        if (signal.text) {
          targetEpisode.primary_text = signal.text;
        }

        if (signal.signal_type.endsWith(".cancel")) {
          targetEpisode.status = "CANCELLED";
        }
      } else {
        this.commitActiveEpisode();
        this.activeEpisode = createInteractionEpisode(signal);
        targetEpisode = this.activeEpisode;
      }
    }

    if (targetEpisode.status === "OPEN" && this.shouldAutoCommit(targetEpisode, signal)) {
      this.commitActiveEpisode();
    }

    return { signal, episode: targetEpisode };
  }

  /**
   * Deterministic correlation check between an active episode and a new signal.
   */
  shouldCorrelate(episode, signal) {
    const timeDelta = signal.event_time - episode.end_event_time;
    if (timeDelta > this.temporalWindowMs) {
      return false;
    }

    const lastSignal = episode.signals[episode.signals.length - 1];
    if ((signal.source === "pointer" || signal.source === "touch") && (lastSignal.source === "pointer" || lastSignal.source === "touch")) {
      if (signal.signal_type.endsWith(".move") || signal.signal_type.endsWith(".up") || signal.signal_type.endsWith(".end") || signal.signal_type.endsWith(".cancel")) {
        return true;
      }
    }

    if (signal.source === "voice" || signal.source === "text") {
      if (timeDelta <= this.temporalWindowMs) {
        return true;
      }
    }

    if (signal.coordinates && episode.spatial_context) {
      const distFromCentroid = Math.hypot(
        signal.coordinates.x - episode.spatial_context.centroid_x,
        signal.coordinates.y - episode.spatial_context.centroid_y
      );
      if (distFromCentroid <= this.spatialRadiusPx) {
        return true;
      }
    }

    return timeDelta <= (this.temporalWindowMs * 0.5);
  }

  /**
   * Checks whether the current signal triggers immediate episode commit.
   */
  shouldAutoCommit(episode, signal) {
    if (signal.signal_type === "text.input" || signal.signal_type === "text.submit") {
      return true;
    }
    if (signal.signal_type === "voice.final") {
      return true;
    }
    if (signal.signal_type === "pointer.up" || signal.signal_type === "touch.end") {
      return true;
    }
    return false;
  }

  /**
   * Commits the active episode, moving it to committed list and invoking callbacks.
   */
  commitActiveEpisode() {
    if (!this.activeEpisode) return null;

    if (this.activeEpisode.status === "OPEN") {
      this.activeEpisode.status = "COMMITTED";
    }

    const committed = this.activeEpisode;
    this.committedEpisodes.push(committed);

    if (this.onEpisodeCommitted) {
      this.onEpisodeCommitted(committed);
    }

    this.activeEpisode = null;
    return committed;
  }

  /**
   * Explicitly cancels the active episode.
   */
  cancelActiveEpisode() {
    if (!this.activeEpisode) return null;
    this.activeEpisode.status = "CANCELLED";
    const cancelled = this.activeEpisode;
    this.activeEpisode = null;
    return cancelled;
  }
}
