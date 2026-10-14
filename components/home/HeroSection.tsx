"use client";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";

export function HeroSection() {
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(
          ".hero .eyebrow, .hero-line span, .hero-subtitle, .scroll-cue",
          {
            y: 26,
            opacity: 0,
            duration: 0.85,
            stagger: 0.11,
            ease: "power3.out",
            delay: 0.12,
          },
        );
      }, hero);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="hero container" ref={hero}>
      <span className="eyebrow">
        SOFTWARE DEVELOPMENT <span className="eyebrow-dot">·</span> DIGITAL
        EXPERIENCES
      </span>
      <h1>
        <span className="hero-line">
          <span>We build digital products</span>
        </span>
        <span className="hero-line">
          <span>that solve real problems.</span>
        </span>
      </h1>
      <p className="hero-subtitle">
        We turn ambitious ideas into beautifully designed websites,
        <br className="desktop-break" /> applications, and powerful digital
        solutions.
      </p>
      <a className="scroll-cue" href="#experience">
        <span>SCROLL TO EXPLORE</span>
        <span className="scroll-arrow">
          <ArrowDown size={18} />
        </span>
      </a>
      <div className="hero-bottom">
        <span>IDEAS INTO REALITY.</span>
        <span>DESIGN + ENGINEERING</span>
      </div>
    </section>
  );
}
