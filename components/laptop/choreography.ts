import { monotoneSpline, type Keyframes } from "@/lib/monotone-spline";

// Scroll choreography for the laptop showcase. Progress runs 0→1 across the
// pinned scene; every animated property is sampled from its own spline.

export const CHANNELS = [
  "x",
  "y",
  "z",
  "rx",
  "ry",
  "rz",
  "scale",
  "lid",
  "power",
  "screen",
] as const;
export type Channel = (typeof CHANNELS)[number];
export type Pose = Record<Channel, number>;

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

// Each channel has its own keys so position, rotation, scale and screen
// overlap rather than all stopping on the same beat. Values are in scene
// units and radians; the comments mark the phase each key belongs to.
const TRACKS: Record<Channel, Keyframes> = {
  x: [
    [0, -8.4], // 01 arrival: far lower-left, off frame
    [0.08, -5.6],
    [0.15, -3.5],
    [0.25, -1.3], // 02 reveal: toward upper-middle
    [0.35, 0.5],
    [0.47, 2.4], // 03 orbit: swing right…
    [0.56, 1.6], // …and briefly back
    [0.66, 0.35], // 04 presentation: settle to centre
    [0.78, 0.04],
    [0.86, FINAL.x], // 05 final
    [1, FINAL.x],
  ],
  // The scene is still rising into view during arrival, so these heights
  // put the laptop in the viewport's lower-left, not the canvas's.
  y: [
    [0, -2.4],
    [0.08, -1.1],
    [0.15, -0.45],
    [0.25, 0.15],
    [0.33, 0.45],
    [0.47, 0.18],
    [0.56, -0.25],
    [0.68, -0.05],
    [0.86, FINAL.y],
    [0.92, FINAL.y],
    [1, 0.75], // exit: rise toward the next section
  ],
  z: [
    [0, -3.6],
    [0.15, -2.2],
    [0.3, -0.9],
    [0.42, -1.7], // orbit pushes back in depth…
    [0.52, -0.7],
    [0.66, 0.35], // …then the presentation pulls it close
    [0.86, FINAL.z],
    [0.92, FINAL.z],
    [1, 0.5],
  ],
  rx: [
    [0, 0.26], // ≈ 15°
    [0.15, 0.22],
    [0.3, 0.06],
    [0.42, -0.07],
    [0.5, 0.18],
    [0.6, 0.24],
    [0.74, 0.1],
    [0.86, FINAL.rx],
    [1, 0.05],
  ],
  ry: [
    [0, -0.7], // ≈ -40°
    [0.15, -0.6],
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
    [0, -0.21], // ≈ -12°
    [0.15, -0.16],
    [0.3, 0.05],
    [0.42, 0.12],
    [0.5, -0.06], // brief change of direction
    [0.6, -0.1],
    [0.74, -0.02],
    [0.86, FINAL.rz],
    [1, 0],
  ],
  scale: [
    [0, 0.56],
    [0.15, 0.72],
    [0.33, 0.96],
    [0.5, 0.92],
    [0.66, 0.96],
    [0.86, FINAL_SCALE],
    [0.92, FINAL_SCALE],
    [1, 0.88], // exit: modest shrink
  ],
  lid: [
    [0, LID_ARRIVAL],
    [0.05, LID_ARRIVAL],
    [0.2, LID_OPEN],
    [1, LID_OPEN],
  ],
  power: [
    [0, 0],
    [0.09, 0],
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
};

const CURVES = Object.fromEntries(
  CHANNELS.map((c) => [c, monotoneSpline(TRACKS[c])]),
) as Record<Channel, (p: number) => number>;

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

export function createPose(): Pose {
  return Object.fromEntries(CHANNELS.map((c) => [c, 0])) as Pose;
}

/** Samples every channel at `progress`, writing into `out`. */
export function evaluatePose(progress: number, profile: Profile, out: Pose) {
  for (const c of CHANNELS) out[c] = CURVES[c](progress);
  out.x *= profile.travel;
  out.scale *= profile.scale;
  out.ry *= profile.turn;
  out.rz *= profile.turn;
  return out;
}
