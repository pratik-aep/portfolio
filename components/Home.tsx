"use client";
import { useEffect, useRef } from "react";
import {
  ArrowDown,
  Globe2,
  Smartphone,
  Sparkles,
  Layers3,
  ArrowUpRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { Reveal } from "./Motion";
import { FeaturedProjects } from "./Projects";
import Contact from "./Contact";
const LaptopExperience = dynamic(() => import("./LaptopExperience"), {
  ssr: false,
  loading: () => (
    <div
      className="scene-placeholder"
      aria-label="Loading interactive showcase"
    />
  ),
});
export default function Home() {
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
    <main id="main">
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
      <LaptopExperience />
      <FeaturedProjects />
      <section className="about container" id="about">
        <Reveal className="about-intro">
          <span className="eyebrow">A SMALL TEAM. A COMPLETE PERSPECTIVE.</span>
          <h2>
            Good design meets
            <br />
            <span className="muted">serious engineering.</span>
          </h2>
          <p>
            We connect thoughtful design with considered development. From the
            first sketch to the final interaction, we build with the people
            using your product in mind.
          </p>
          <a className="text-link" href="#contact">
            Meet your next project <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <div className="capabilities">
          {[
            {
              icon: Globe2,
              title: "Web experiences",
              text: "Fast, accessible websites and platforms with purpose in every detail.",
            },
            {
              icon: Smartphone,
              title: "Applications",
              text: "Intuitive digital tools that turn complex workflows into simple experiences.",
            },
            {
              icon: Sparkles,
              title: "AI-powered solutions",
              text: "Thoughtful applications of machine learning, grounded in a useful problem.",
            },
            {
              icon: Layers3,
              title: "Custom digital products",
              text: "From connected systems to immersive 3D. Built around your challenge.",
            },
          ].map((c, i) => (
            <Reveal key={c.title}>
              <div className="capability">
                <c.icon size={21} strokeWidth={1.5} />
                <span className="capability-number">0{i + 1}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <Contact />
    </main>
  );
}
