"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrubs a `--tone` custom property from 0 to 1 as the element scrolls
 * into view; the element's CSS mixes its colours with it (see `.cta`).
 * Skipped under reduced motion, where the CSS default (1) applies.
 *
 * Usage:
 *   <ToneShift as="section" className="cta" id="contact">…</ToneShift>
 */
export function ToneShift({
  as: Tag = "div",
  className,
  id,
  children,
}: {
  as?: "div" | "section";
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        root.current,
        { "--tone": 0 },
        {
          "--tone": 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            end: "top 45%",
            scrub: true,
          },
        },
      );
      return () => tween.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <Tag
      ref={root as React.RefObject<HTMLDivElement>}
      className={className}
      id={id}
    >
      {children}
    </Tag>
  );
}
