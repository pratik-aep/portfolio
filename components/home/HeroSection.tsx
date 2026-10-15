"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Opening frame. The laptop scene is pinned behind it (see
 * styles/showcase.css), so as the visitor scrolls the headline lifts and
 * fades while the laptop sweeps in.
 */
export function HeroSection() {
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Entry: eyebrow, headline line by line, subtitle, then the cue.
        // The navbar has its own CSS reveal that starts first.
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.2 })
          .from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.9 })
          .from(
            ".hero-line > span",
            { yPercent: 105, duration: 1.2, stagger: 0.12 },
            "-=0.6",
          )
          .from(".hero-subtitle", { y: 18, opacity: 0, duration: 1 }, "-=0.8")
          .from(".scroll-cue", { y: 10, opacity: 0, duration: 0.9 }, "-=0.6");
        const scrub = {
          trigger: hero.current,
          start: "top top",
          scrub: true,
        };
        // Exit: the whole block lifts away and fades while the laptop takes
        // the frame. A wrapper is animated so the entry tweens never clash.
        gsap.to(".hero-content", {
          y: -90,
          scale: 0.97,
          opacity: 0,
          ease: "power1.in",
          scrollTrigger: { ...scrub, end: "45% top" },
        });
        // The cue steps back first.
        gsap.to(".scroll-cue", {
          opacity: 0,
          y: 16,
          ease: "none",
          scrollTrigger: { ...scrub, end: "20% top" },
        });
      }, hero);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="hero container" ref={hero}>
      <div className="hero-content">
        <span className="eyebrow hero-eyebrow">Built to make an impact</span>
        <h1 className="hero-title">
          <span className="hero-line">
            <span>Engineering</span>
          </span>
          <span className="hero-line">
            <span>what&apos;s next.</span>
          </span>
        </h1>
        <p className="hero-subtitle">
          We design and build websites, applications, and intelligent digital
          experiences for a smarter tomorrow.
        </p>
        <a className="scroll-cue" href="#story">
          <span>Scroll to explore</span>
          <span className="scroll-line" aria-hidden />
        </a>
      </div>
      {/* Where "Scroll to explore" lands: partway into the laptop reveal
          (or the static showcase under reduced motion). */}
      <span id="story" className="hero-anchor" aria-hidden />
    </section>
  );
}
