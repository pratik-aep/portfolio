"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ridge lines from farthest to nearest. Each layer drifts at its own rate
// for a gentle parallax; atmospheric perspective makes far layers lighter.
const RIDGES = [
  {
    d: "M0 214 L118 168 L206 192 L322 118 L428 170 L536 136 L650 66 L758 146 L876 104 L986 156 L1098 92 L1218 148 L1328 116 L1446 176 L1600 132 V360 H0 Z",
    fill: "#eff1f3",
    drift: -36,
  },
  {
    d: "M0 262 L138 206 L258 240 L376 186 L516 236 L640 180 L758 226 L898 166 L1036 232 L1176 196 L1316 246 L1458 200 L1600 236 V360 H0 Z",
    fill: "#e5e8eb",
    drift: -20,
  },
  {
    d: "M0 312 C200 268 330 298 480 278 S760 246 900 288 S1200 266 1350 298 S1520 282 1600 292 V360 H0 Z",
    fill: "#dadee3",
    drift: -8,
  },
];

/**
 * A quiet monochrome panorama that closes the featured work: rendered in
 * SVG, so it is crisp at any width and carries no licensing questions.
 */
export function Horizon() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<SVGPathElement>(".horizon-ridge").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 0 },
            {
              y: Number(el.dataset.drift),
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <div className="horizon" ref={root} aria-hidden>
      <svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice">
        {RIDGES.map((r) => (
          <path
            key={r.fill}
            className="horizon-ridge"
            d={r.d}
            fill={r.fill}
            data-drift={r.drift}
          />
        ))}
      </svg>
    </div>
  );
}
