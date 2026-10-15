import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ToneShift } from "@/components/motion/ToneShift";

/** Closing invitation on the homepage, as an inverted dark section. */
export function ContactCTA() {
  return (
    <ToneShift as="section" className="cta" id="contact">
      <Reveal className="container">
        <div className="cta-content">
          <span className="eyebrow">Let&apos;s build something</span>
          <h2>
            Have an idea?
            <br />
            <span className="muted">Let&apos;s make it real.</span>
          </h2>
          <p>
            We partner with ambitious people to design and build meaningful
            digital experiences.
          </p>
          <Link className="button button-lg button-inverse" href="/contact/">
            Let&apos;s Talk <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </Reveal>
    </ToneShift>
  );
}
