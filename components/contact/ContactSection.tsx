"use client";
import { useState } from "react";
import { ArrowUpRight, Download, Check } from "lucide-react";
import { site } from "@/data/site";
export function ContactSection() {
  const [service, setService] = useState("Website");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [saved, setSaved] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Project enquiry — forgeD\n\nName: ${name}\nEmail: ${email}\nProject type: ${service}\n\n${brief}\n`;
    if (site.email) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${service} project enquiry`)}&body=${encodeURIComponent(text)}`;
    } else {
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "forged-project-brief.txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaved(true);
    }
  }
  return (
    <section id="contact" className="contact container">
      <div className="contact-copy">
        <span className="eyebrow">THE NEXT GOOD IDEA</span>
        <h2>
          Let&apos;s make
          <br />
          something
          <br />
          <span className="muted">that matters.</span>
        </h2>
        <p>
          Have a challenge in mind? Tell us what you&apos;re thinking. Great
          products start with a conversation.
        </p>
        <div className="contact-foot">
          <span className="tiny-plus">+</span> From a first idea to a finished
          product.
        </div>
      </div>
      <form onSubmit={submit} className="contact-form">
        <label className="form-label">What are we building?</label>
        <div className="service-options">
          {["Website", "Application", "AI solution", "Something else"].map(
            (s) => (
              <button
                type="button"
                className={service === s ? "selected" : ""}
                aria-pressed={service === s}
                key={s}
                onClick={() => {
                  setService(s);
                  setSaved(false);
                }}
              >
                {s}
              </button>
            ),
          )}
        </div>
        <div className="form-row">
          <label>
            Your name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              placeholder="Alex Morgan"
              autoComplete="name"
              required
              maxLength={100}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
              }}
              placeholder="alex@company.com"
              autoComplete="email"
              required
              maxLength={200}
            />
          </label>
        </div>
        <label>
          A little about your idea
          <textarea
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value);
              setSaved(false);
            }}
            placeholder="The problem, the possibility, or the thing you wish existed…"
            rows={4}
            required
            maxLength={5000}
          />
        </label>
        <div className="form-submit">
          <button className="button" type="submit">
            {site.email ? "Start a conversation" : "Download project brief"}
            {site.email ? <ArrowUpRight size={17} /> : <Download size={17} />}
          </button>
          <p>
            {site.email
              ? "Opens your email app with your brief."
              : "Your brief stays on your device. Contact email coming soon."}
          </p>
        </div>
        <div className="form-status" role="status">
          {saved && (
            <>
              <Check size={16} /> Brief downloaded. Nothing has been sent.
            </>
          )}
        </div>
      </form>
    </section>
  );
}
