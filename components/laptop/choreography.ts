import { monotoneSpline, type Keyframes } from "@/lib/monotone-spline";

// Scroll choreography for the laptop showcase. Progress runs 0→1 across the
// pinned scene, which starts at the top of the page behind the hero. The
// laptop, the camera and the lighting are all sampled from their own
// splines, so the whole film is deterministic and reverses exactly.

/** Evaluates a group of tracks; one monotone spline per channel. */
function trackGroup<C extends string>(tracks: Record<C, Keyframes>) {
  const keys = Object.keys(tracks) as C[];
  const curves = keys.map((k) => [k, monotoneSpline(tracks[k])] as const);
  return {
    create: () =>
      Object.fromEntries(keys.map((k) => [k, 0])) as Record<C, number>,
    sample(progress: number, out: Record<C, number>) {
      for (const [k, curve] of curves) out[k] = curve(progress);
      return out;
    },
  };
}

// Lid rotation from upright. -0.35 rad ≈ 110° between screen and keyboard.
export const LID_ARRIVAL = 0.42; // ≈ 66°: partly open, never a closed slab
export const LID_OPEN = -0.35;
export const FINAL = { x: 0, y: 0.12, z: 1.25, rx: 0.05, ry: -0.12, rz: 0 };
export const FINAL_SCALE = 1.0;

/** Story beats. Overlays (markers, callouts) key off these ranges. */
export const PHASES = [
  { id: "01", name: "Arrival", from: 0, to: 0.15 },
  { id: "02", name: "Reveal", from: 0.15, to: 0.35 },
  { id: "03", name: "Orbit", from: 0.35, to: 0.6 },
  { id: "04", name: "Presentation", from: 0.6, to: 0.85 },
  { id: "05", name: "Final", from: 0.85, to: 1.0001 },
] as const;

export function phaseAt(progress: number) {
  return PHASES.findIndex((p) => progress >= p.from && progress < p.to);
}

// ── Laptop ─────────────────────────────────────────────────────────────
// Each channel has its own keys so position, rotation, scale and screen
// overlap rather than all stopping on the same beat. Values are in scene
// units and radians; the comments mark the phase each key belongs to.
const laptop = trackGroup({
  // 01 arrival: starts just outside the lower-left corner, large and close
  // to the lens, sweeps in while the hero headline leaves, then pulls back
  // in depth into the reveal.
  x: [
    [0, -10],
    [0.04, -7],
    [0.09, -4.6],
    [0.15, -2.6],
    [0.25, -1.2], // 02 reveal: toward upper-middle
    [0.35, 0.5],
    [0.47, 2.4], // 03 orbit: swing right…
    [0.56, 1.6], // …and briefly back
    [0.66, 0.35], // 04 presentation: settle to centre
    [0.78, 0.04],
    [0.86, FINAL.x], // 05 final
    [1, FINAL.x],
  ],
  y: [
    [0, -6],
    [0.04, -4.2],
    [0.09, -2.4],
    [0.15, -1],
    [0.25, 0.1],
    [0.33, 0.45],
    [0.47, 0.18],
    [0.56, -0.25],
    [0.68, -0.05],
    [0.86, FINAL.y],
    [0.92, FINAL.y],
    [1, 0.75], // exit: rise toward the next section
  ],
  z: [
    [0, 0.8], // close to the lens…
    [0.09, 0.3],
    [0.15, -0.2],
    [0.3, -0.9], // …receding into the reveal
    [0.42, -1.7], // orbit pushes back in depth…
    [0.52, -0.7],
    [0.66, 0.35], // …then the presentation pulls it close
    [0.86, FINAL.z],
    [0.92, FINAL.z],
    [1, 0.5],
  ],
  rx: [
    [0, 0.36], // ≈ 20°
    [0.15, 0.24],
    [0.3, 0.06],
    [0.42, -0.07],
    [0.5, 0.18],
    [0.6, 0.24],
    [0.74, 0.1],
    [0.86, FINAL.rx],
    [1, 0.05],
  ],
  ry: [
    [0, -0.92], // ≈ -53°
    [0.15, -0.62],
    [0.3, -0.2],
    [0.42, 0.36],
    [0.52, 0.72], // widest turn, screen still readable
    [0.6, 0.3],
    [0.7, -0.28],
    [0.8, -0.16],
    [0.86, FINAL.ry],
    [1, -0.1],
  ],
  rz: [
    [0, -0.3], // ≈ -17°
    [0.15, -0.17],
    [0.3, 0.05],
    [0.42, 0.12],
    [0.5, -0.06], // brief change of direction
    [0.6, -0.1],
    [0.74, -0.02],
    [0.86, FINAL.rz],
    [1, 0],
  ],
  scale: [
    [0, 1],
    [0.09, 0.98],
    [0.15, 0.94],
    [0.33, 0.96],
    [0.5, 0.92],
    [0.66, 0.96],
    [0.86, FINAL_SCALE],
    [0.92, FINAL_SCALE],
    [1, 0.88], // exit: modest shrink
  ],
  lid: [
    [0, LID_ARRIVAL],
    [0.04, LID_ARRIVAL],
    [0.2, LID_OPEN],
    [1, LID_OPEN],
  ],
  power: [
    [0, 0],
    [0.08, 0],
    [0.22, 1],
    [1, 1],
  ],
  // Integer values index the project screens; fractions crossfade.
  screen: [
    [0, 0],
    [0.37, 0],
    [0.43, 1],
    [0.51, 1],
    [0.57, 2],
    [0.65, 2],
    [0.72, 3],
    [1, 3],
  ],
});

// ── Camera ─────────────────────────────────────────────────────────────
// The camera orbits a fixed target. `distance` is the dolly, `azimuth` the
// arc (radians, + = camera moves right), `elevation` the height (radians).
// `focus` (0→1) pulls focus off the background at the peak of the orbit:
// the DOM layers behind the laptop blur while the laptop stays sharp.
export const CAMERA = { fov: 30, target: { x: 0, y: 0.2, z: 0 } };

const camera = trackGroup({
  // Slow dolly-in across the story, a small pull-back as it exits.
  distance: [
    [0, 16.2],
    [0.15, 15.9],
    [0.35, 15.5],
    [0.55, 15.25],
    [0.86, 14.7],
    [0.92, 14.7],
    [1, 15.4],
  ],
  // A slight arc, counter to the laptop's swing, so its turns read larger.
  azimuth: [
    [0, 0.1],
    [0.2, 0.05],
    [0.47, -0.1],
    [0.62, -0.06],
    [0.86, 0],
    [1, 0],
  ],
  // Starts looking down on the arriving laptop, levels out to present it.
  elevation: [
    [0, 0.16],
    [0.2, 0.12],
    [0.45, 0.065],
    [0.62, 0.075],
    [0.86, 0.085],
    [1, 0.1],
  ],
  focus: [
    [0, 0],
    [0.38, 0],
    [0.46, 1],
    [0.54, 1],
    [0.63, 0],
    [1, 0],
  ],
});

// ── Light ──────────────────────────────────────────────────────────────
const light = trackGroup({
  // Key light builds as the laptop is revealed.
  key: [
    [0, 1.5],
    [0.15, 1.9],
    [0.3, 2.4],
    [0.6, 2.6],
    [0.86, 2.2],
    [1, 2],
  ],
  // A moving light from left (-1) to right (1) across the front. Its
  // highlight glides over the aluminium (and the glass sheen follows it).
  sweep: [
    [0, -1.1],
    [0.15, -0.8],
    [0.3, -0.2],
    [0.47, 0.5],
    [0.6, 0.8],
    [0.75, 1],
    [1, 1],
  ],
  sweepPower: [
    [0, 0.4],
    [0.12, 0.9],
    [0.3, 1],
    [0.6, 1],
    [0.86, 0.6],
    [1, 0.5],
  ],
  // The reveal, in two beats: a glint crosses the glass while the screen
  // is still waking (dark enough to show it)…
  glint: [
    [0, 0],
    [0.1, 0],
    [0.135, 1],
    [0.175, 0],
    [1, 0],
  ],
  glintPos: [
    [0, -1],
    [0.1, -1],
    [0.175, 1],
    [1, 1],
  ],
  // …then a short rim-light flash as the lid lands in the reveal pose.
  rim: [
    [0, 0],
    [0.165, 0],
    [0.2, 1],
    [0.25, 0],
    [1, 0],
  ],
  // The studio "lights up" during the reveal, with a brief lift on the
  // rim flash.
  env: [
    [0, 0.7],
    [0.12, 0.8],
    [0.2, 1.15],
    [0.27, 1],
    [1, 1],
  ],
});

export type Pose = ReturnType<typeof laptop.create>;
export type CameraPose = ReturnType<typeof camera.create>;
export type LightPose = ReturnType<typeof light.create>;

/**
 * Per-breakpoint adjustments. Smaller screens get shorter travel, gentler
 * turns and a smaller laptop rather than a uniformly shrunk desktop path.
 */
export type Profile = { travel: number; scale: number; turn: number };

export const DESKTOP_PROFILE: Profile = { travel: 1, scale: 1, turn: 1 };

export function profileFor(width: number, height: number): Profile {
  // Short laptop screens: keep the final pose inside the viewport.
  const short = height < 800 ? 0.92 : 1;
  if (width < 768) return { travel: 0.24, scale: 0.5, turn: 0.62 };
  if (width < 1100) return { travel: 0.66, scale: 0.84 * short, turn: 0.85 };
  return { travel: 1, scale: short, turn: 1 };
}

export const createPose = laptop.create;
export const createCameraPose = camera.create;
export const createLightPose = light.create;

/** Samples the laptop at `progress`, writing into `out`. */
export function evaluatePose(progress: number, profile: Profile, out: Pose) {
  laptop.sample(progress, out);
  out.x *= profile.travel;
  out.scale *= profile.scale;
  out.ry *= profile.turn;
  out.rz *= profile.turn;
  return out;
}

/** Samples the camera at `progress`; narrow screens arc less. */
export function evaluateCamera(
  progress: number,
  profile: Profile,
  out: CameraPose,
) {
  camera.sample(progress, out);
  out.azimuth *= profile.turn;
  return out;
}

/** Samples the lighting at `progress`. */
export function evaluateLight(progress: number, out: LightPose) {
  return light.sample(progress, out);
}
