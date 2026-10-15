import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { shareMetadata } from "@/data/site";

const description =
  "Tell us about your website, application or AI idea. Great products start with a conversation.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  ...shareMetadata({ path: "/contact/", title: "Contact", description }),
};

// Two-tone split: dark intro panel (left / top) and the form on white.
export default function ContactPage() {
  return (
    <main id="main" className="contact-split">
      <div className="contact-panel">
        <div className="contact-panel-inner">
          <ContactIntro />
        </div>
      </div>
      <section className="contact-main" aria-labelledby="brief-heading">
        <div className="contact-atmosphere" aria-hidden />
        <div className="contact-main-inner">
          <h2 id="brief-heading" className="eyebrow">
            Your brief
          </h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
