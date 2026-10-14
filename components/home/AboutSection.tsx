import {
  ArrowUpRight,
  Globe2,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const capabilities = [
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
];

export function AboutSection() {
  return (
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
          first sketch to the final interaction, we build with the people using
          your product in mind.
        </p>
        <a className="text-link" href="#contact">
          Meet your next project <ArrowUpRight size={17} />
        </a>
      </Reveal>
      <div className="capabilities">
        {capabilities.map((c, i) => (
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
  );
}
