export type Keyframes = [time: number, value: number][];

/**
 * Monotone cubic (Fritsch–Carlson) interpolation through keyframes sorted by
 * time. Velocity is continuous through every key, so motion never stops dead
 * between segments the way chained eased tweens do, and values never
 * overshoot their neighbours. End tangents are zero, so the curve eases in
 * and out at its boundaries.
 */
export function monotoneSpline(keys: Keyframes) {
  const t = keys.map((k) => k[0]);
  const v = keys.map((k) => k[1]);
  const n = t.length;
  const slopes = t
    .slice(0, -1)
    .map((_, i) => (v[i + 1] - v[i]) / (t[i + 1] - t[i]));
  const tangents = new Array<number>(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) continue;
    const h0 = t[i] - t[i - 1];
    const h1 = t[i + 1] - t[i];
    const w1 = 2 * h1 + h0;
    const w2 = h1 + 2 * h0;
    tangents[i] = (w1 + w2) / (w1 / slopes[i - 1] + w2 / slopes[i]);
  }
  return (x: number) => {
    if (x <= t[0]) return v[0];
    if (x >= t[n - 1]) return v[n - 1];
    let i = 0;
    while (x > t[i + 1]) i++;
    const h = t[i + 1] - t[i];
    const s = (x - t[i]) / h;
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * v[i] +
      (s3 - 2 * s2 + s) * h * tangents[i] +
      (-2 * s3 + 3 * s2) * v[i + 1] +
      (s3 - s2) * h * tangents[i + 1]
    );
  };
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function clampAbs(value: number, limit: number) {
  return Math.min(Math.max(value, -limit), limit);
}
