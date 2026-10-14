import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** Closing invitation on the homepage; the form lives at /contact/. */
export function ContactCTA() {
  return (
    <section className="cta container" id="contact">
      <Reveal className="cta-inner">
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
        <Link className="button button-lg" href="/contact/">
          Let&apos;s Talk <ArrowUpRight size={18} />
        </Link>
      </Reveal>
    </section>
  );
}
