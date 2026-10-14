import { monotoneSpline, type Keyframes } from "@/lib/monotone-spline";

// Scroll choreography for the laptop showcase. Progress runs 0→1 across the
// scroll scene; every animated property is sampled from its own spline.

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

// Lid angle: 1.5 rad is closed, -0.15 rad is open (about 99°).
export const LID_CLOSED = 1.5;
export const LID_OPEN = -0.15;
export const FINAL = { x: 0, y: 0.18, z: 0.75, rx: 0.025, ry: -0.08, rz: 0.01 };

// Each channel has its own keys so position, rotation, lid and screen can
// overlap rather than all stopping on the same beat. Holds at the end give
// the final presentation a moment of stillness before the section exits.
const TRACKS: Record<Channel, Keyframes> = {
  x: [
    [0, -6.8],
    [0.12, -4.1],
    [0.24, -1.9],
    [0.4, 2.0],
    [0.5, 1.25],
    [0.62, -0.95],
    [0.74, -0.35],
    [0.86, FINAL.x],
    [1, FINAL.x],
  ],
  y: [
    [0, -4.6],
    [0.12, -2.2],
    [0.24, -0.7],
    [0.4, 0.55],
    [0.5, 0.1],
    [0.62, -0.1],
    [0.74, -0.08],
    [0.86, FINAL.y],
    [0.93, FINAL.y],
    [1, 0.55],
  ],
  z: [
    [0, -3.2],
    [0.24, -1.4],
    [0.4, -1.5],
    [0.5, -0.5],
    [0.62, 0.05],
    [0.86, FINAL.z],
    [0.93, FINAL.z],
    [1, 0.5],
  ],
  rx: [
    [0, 0.6],
    [0.14, 0.5],
    [0.3, 0.08],
    [0.4, -0.16],
    [0.52, 0.27],
    [0.62, 0.28],
    [0.76, 0.14],
    [0.86, FINAL.rx],
    [1, 0.03],
  ],
  ry: [
    [0, -1.05],
    [0.14, -0.82],
    [0.3, 0.12],
    [0.4, 0.64],
    [0.5, 1.08],
    [0.62, -0.44],
    [0.76, -0.24],
    [0.86, FINAL.ry],
    [1, -0.07],
  ],
  rz: [
    [0, -0.26],
    [0.14, -0.2],
    [0.3, 0.06],
    [0.4, 0.14],
    [0.5, -0.04],
    [0.62, -0.13],
    [0.76, -0.02],
    [0.86, FINAL.rz],
    [1, 0.01],
  ],
  scale: [
    [0, 0.48],
    [0.14, 0.62],
    [0.3, 0.8],
    [0.5, 0.88],
    [0.62, 0.93],
    [0.86, 1],
    [0.93, 1],
    [1, 0.93],
  ],
  lid: [
    [0, LID_CLOSED],
    [0.13, LID_CLOSED],
    [0.33, LID_OPEN],
    [1, LID_OPEN],
  ],
  power: [
    [0, 0],
    [0.2, 0],
    [0.34, 1],
    [1, 1],
  ],
  // Integer values index the project screens; fractions crossfade.
  screen: [
    [0, 0],
    [0.38, 0],
    [0.44, 1],
    [0.52, 1],
    [0.58, 2],
    [0.68, 2],
    [0.76, 3],
    [1, 3],
  ],
};

const CURVES = Object.fromEntries(
  CHANNELS.map((c) => [c, monotoneSpline(TRACKS[c])]),
) as Record<Channel, (p: number) => number>;

export type Profile = { travel: number; scale: number; turn: number };

export const DESKTOP_PROFILE: Profile = { travel: 1, scale: 1, turn: 1 };

// Smaller screens get shorter travel and gentler turns, not just a shrink.
export function profileFor(width: number): Profile {
  if (width < 768) return { travel: 0.36, scale: 0.56, turn: 0.68 };
  if (width < 1100) return { travel: 0.72, scale: 0.8, turn: 0.88 };
  return DESKTOP_PROFILE;
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
