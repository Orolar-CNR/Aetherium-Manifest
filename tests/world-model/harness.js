/**
 * Research Harness for Environmental Dynamics World Model
 * Research Experiment: Deterministic Numerical Integration & Bounded Approximation Error
 *
 * Classification: RESEARCH | NON-CANONICAL | EXPERIMENTAL | RESEARCH-ONLY
 */

/**
 * Shared Low-Level Vector Utilities
 */
export function addVector(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function scaleVector(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

export function subtractVector(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function cloneState(state) {
  return {
    position: [...state.position],
    velocity: [...state.velocity],
    acceleration: [...state.acceleration]
  };
}

/**
 * 3. Analytical Oracle (Closed-Form Constant-Acceleration Model)
 * P_gt(t) = P0 + V0 * t + 0.5 * A * t^2
 * V_gt(t) = V0 + A * t
 */
export function calculateAnalyticalOracle(initialState, time) {
  const p0 = initialState.position;
  const v0 = initialState.velocity;
  const a = initialState.acceleration;

  const position = [
    p0[0] + v0[0] * time + 0.5 * a[0] * time * time,
    p0[1] + v0[1] * time + 0.5 * a[1] * time * time,
    p0[2] + v0[2] * time + 0.5 * a[2] * time * time
  ];

  const velocity = [
    v0[0] + a[0] * time,
    v0[1] + a[1] * time,
    v0[2] + a[2] * time
  ];

  const acceleration = [...a];

  return { position, velocity, acceleration };
}

/**
 * 4. Experimental Numerical Model (Semi-Implicit Euler Integrator)
 * V_new = V_current + A * timestep
 * P_new = P_current + V_new * timestep
 */
export function simulateExperimentalState(initialState, timestep, substeps) {
  let p = [...initialState.position];
  let v = [...initialState.velocity];
  const a = [...initialState.acceleration];

  for (let i = 0; i < substeps; i++) {
    // Semi-Implicit Euler
    v[0] = v[0] + a[0] * timestep;
    v[1] = v[1] + a[1] * timestep;
    v[2] = v[2] + a[2] * timestep;

    p[0] = p[0] + v[0] * timestep;
    p[1] = p[1] + v[1] * timestep;
    p[2] = p[2] + v[2] * timestep;
  }

  const elapsedTime = timestep * substeps;

  return {
    position: p,
    velocity: v,
    acceleration: a,
    elapsedTime
  };
}

/**
 * 8 & 9. Differential Comparator & Verification Logic
 */
export function evaluateDifferentialComparison(fixture) {
  const { scenarioId, initialState, targetTime, timestep, substeps, tolerances } = fixture;

  // 7. Time Consistency Check
  const achievedTime = timestep * substeps;
  const timeDiff = Math.abs(achievedTime - targetTime);
  const timeTolerance = tolerances.time?.absolute ?? 1e-9;

  if (timeDiff > timeTolerance) {
    throw new Error(
      `Invalid experiment configuration: achievedTime (${achievedTime}) differs from targetTime (${targetTime}) beyond tolerance (${timeTolerance})`
    );
  }

  const analyticalState = calculateAnalyticalOracle(initialState, targetTime);
  const predictedState = simulateExperimentalState(initialState, timestep, substeps);

  // Position error (L-infinity norm)
  const dx = Math.abs(analyticalState.position[0] - predictedState.position[0]);
  const dy = Math.abs(analyticalState.position[1] - predictedState.position[1]);
  const dz = Math.abs(analyticalState.position[2] - predictedState.position[2]);
  const positionError = Math.max(dx, dy, dz);

  // Velocity error (L-infinity norm)
  const vx = Math.abs(analyticalState.velocity[0] - predictedState.velocity[0]);
  const vy = Math.abs(analyticalState.velocity[1] - predictedState.velocity[1]);
  const vz = Math.abs(analyticalState.velocity[2] - predictedState.velocity[2]);
  const velocityError = Math.max(vx, vy, vz);

  const posTol = tolerances.position.absolute;
  const velTol = tolerances.velocity.absolute;

  const positionStatus = positionError <= posTol ? 'WITHIN_TOLERANCE' : 'VIOLATION_DETECTED';
  const velocityStatus = velocityError <= velTol ? 'WITHIN_TOLERANCE' : 'VIOLATION_DETECTED';
  const overallStatus = (positionStatus === 'WITHIN_TOLERANCE' && velocityStatus === 'WITHIN_TOLERANCE')
    ? 'WITHIN_TOLERANCE'
    : 'VIOLATION_DETECTED';

  return {
    scenarioId: scenarioId || 'unknown',
    status: overallStatus,
    positionStatus,
    velocityStatus,
    positionError,
    velocityError,
    positionTolerance: posTol,
    velocityTolerance: velTol,
    achievedTime,
    targetTime,
    timestep,
    substeps,
    initialState,
    analyticalState,
    predictedState
  };
}

/**
 * 12 & 13. Convergence Experiment
 */
export function runConvergenceExperiment(initialState, targetTime, timesteps, tolerances) {
  const results = [];

  for (let i = 0; i < timesteps.length; i++) {
    const dt = timesteps[i];
    const rawSubsteps = targetTime / dt;
    const substeps = Math.round(rawSubsteps);

    if (Math.abs(rawSubsteps - substeps) > 1e-7) {
      throw new Error(`Non-integer substeps (${rawSubsteps}) for targetTime ${targetTime} and timestep ${dt}`);
    }

    const evalResult = evaluateDifferentialComparison({
      scenarioId: `convergence-dt-${dt}`,
      initialState,
      targetTime,
      timestep: dt,
      substeps,
      tolerances
    });

    let observedRate = null;
    if (i > 0) {
      const prev = results[i - 1];
      if (prev.positionError > 0 && evalResult.positionError > 0 && prev.timestep !== dt) {
        observedRate = Math.log(prev.positionError / evalResult.positionError) / Math.log(prev.timestep / dt);
      }
    }

    results.push({
      ...evalResult,
      observedRate
    });
  }

  return results;
}
