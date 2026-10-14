"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        // The cue steps back as the laptop takes over.
        gsap.to(".scroll-cue", {
          opacity: 0,
          y: 16,
          ease: "none",
          scrollTrigger: {
            trigger: hero.current,
            start: "top top",
            end: "35% top",
            scrub: true,
          },
        });
      }, hero);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="hero container" ref={hero}>
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
      <a className="scroll-cue" href="#experience">
        <span>Scroll to explore</span>
        <span className="scroll-line" aria-hidden />
      </a>
    </section>
  );
}
