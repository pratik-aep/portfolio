"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/data/site";
import { ContactChannels } from "@/components/ui/ContactChannels";
import { LocalTime } from "./LocalTime";

// Process only; no promises about response times.
const NEXT_STEPS = [
  {
    title: "You send a brief",
    text: "A few lines about the idea, the problem or the product.",
  },
  {
    title: "We reply",
    text: "With questions, first thoughts and how we would approach it.",
  },
  {
    title: "A first call to scope it",
    text: "We agree on goals, scope and the shape of the work together.",
  },
];

/**
 * Dark left panel of the contact page. The headline rises line by line
 * with the same timing as the homepage hero; skipped for reduced motion.
 */
export function ContactIntro() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.2 })
          .from(".contact-intro .eyebrow", { y: 12, opacity: 0, duration: 0.9 })
          .from(
            ".contact-intro .hero-line > span",
            { yPercent: 105, duration: 1.2, stagger: 0.12 },
            "-=0.6",
          )
          .from(
            ".contact-intro-lede",
            { y: 18, opacity: 0, duration: 1 },
            "-=0.8",
          )
          .from(
            ".next-steps li, .contact-intro-meta > *",
            { y: 16, opacity: 0, duration: 0.9, stagger: 0.09 },
            "-=0.7",
          );
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="contact-intro" ref={root}>
      <span className="eyebrow">The next good idea</span>
      <h1>
        <span className="hero-line">
          <span>Let&apos;s make</span>
        </span>
        <span className="hero-line">
          <span>something</span>
        </span>
        <span className="hero-line">
          <span className="muted">that matters.</span>
        </span>
      </h1>
      <p className="contact-intro-lede">
        Have a challenge in mind? Tell us what you&apos;re thinking. Great
        products start with a conversation.
      </p>

      <div className="next-steps">
        <h2 className="eyebrow">What happens next</h2>
        <ol>
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="next-step-number" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="contact-intro-meta">
        {site.availability && (
          <p className="availability">
            <span className="availability-dot" aria-hidden />
            {site.availability}
          </p>
        )}
        <LocalTime />
        <ContactChannels tone="inverse" />
      </div>
    </div>
  );
}
