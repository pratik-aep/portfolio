"use client";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Download,
  Loader2,
  Mail,
  RotateCcw,
} from "lucide-react";
import { site } from "@/data/site";

// How the brief is delivered, decided by what is configured:
// endpoint → POST to a form service; email → open a mail draft;
// neither → save the brief on the visitor's device (nothing is sent).
type Mode = "endpoint" | "mailto" | "download";
type Status = "idle" | "sending" | "success" | "error";
type Field = "name" | "email" | "brief";

const MODE: Mode = site.formEndpoint
  ? "endpoint"
  : site.email
    ? "mailto"
    : "download";
const SERVICES = ["Website", "Application", "AI solution", "Something else"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIMEOUT_MS = 15000;

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.brief.trim().length < 10)
    errors.brief = "A sentence or two about the idea helps (10+ characters).";
  return errors;
}

function briefText(service: string, v: Record<Field, string>) {
  return `Project enquiry — ${site.name}\n\nName: ${v.name}\nEmail: ${v.email}\nProject type: ${service}\n\n${v.brief}\n`;
}

function mailtoHref(service: string, v: Record<Field, string>) {
  const subject = encodeURIComponent(`${service} project enquiry`);
  const body = encodeURIComponent(briefText(service, v));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

async function postBrief(service: string, v: Record<Field, string>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(site.formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(site.formAccessKey && { access_key: site.formAccessKey }),
        subject: `${service} project enquiry — ${site.name}`,
        name: v.name.trim(),
        email: v.email.trim(),
        service,
        message: v.brief.trim(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message: unknown }).message)
          : "";
      throw new Error(
        message || `The form service returned ${response.status}.`,
      );
    }
  } finally {
    clearTimeout(timer);
  }
}

export function ContactForm() {
  const [service, setService] = useState(SERVICES[0]);
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    brief: "",
  });
  // Bots fill every field; people never see this one.
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    setDownloaded(false);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (MODE === "mailto") {
      window.location.href = mailtoHref(service, values);
      return;
    }
    if (MODE === "download") {
      const url = URL.createObjectURL(
        new Blob([briefText(service, values)], { type: "text/plain" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${site.name.toLowerCase()}-project-brief.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloaded(true);
      return;
    }
    // Endpoint mode.
    setStatus("sending");
    setFailure("");
    try {
      // Honeypot filled: act as if it worked, send nothing.
      if (!honeypot) await postBrief(service, values);
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      setStatus("error");
      setFailure(
        err instanceof Error && err.name === "AbortError"
          ? "The request timed out."
          : err instanceof Error && err.message
            ? err.message
            : "Something went wrong.",
      );
    }
  }

  const fieldProps = (field: Field) => ({
    name: field,
    value: values[field],
    "aria-invalid": Boolean(errors[field]) || undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });
  const fieldError = (field: Field) =>
    errors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <>
      {status === "success" ? (
        <div className="contact-success" role="status">
          <span className="success-mark" aria-hidden>
            <Check size={22} />
          </span>
          <h2 ref={successRef} tabIndex={-1}>
            Thank you, {values.name.trim().split(" ")[0]}.
          </h2>
          <p>
            Your brief is on its way. We&apos;ll reply to{" "}
            <strong>{values.email.trim()}</strong>.
          </p>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={submit}
          className="contact-form"
          noValidate
          aria-busy={status === "sending"}
        >
          <span className="form-label" id="service-label">
            What are we building?
          </span>
          <div
            className="service-options"
            role="group"
            aria-labelledby="service-label"
          >
            {SERVICES.map((s) => (
              <button
                type="button"
                className={service === s ? "selected" : ""}
                aria-pressed={service === s}
                key={s}
                onClick={() => setService(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="form-row">
            <label>
              Your name
              <input
                {...fieldProps("name")}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Alex Morgan"
                autoComplete="name"
                required
                maxLength={100}
              />
              {fieldError("name")}
            </label>
            <label>
              Email address
              <input
                {...fieldProps("email")}
                type="email"
                onChange={(e) => update("email", e.target.value)}
                placeholder="alex@company.com"
                autoComplete="email"
                required
                maxLength={200}
              />
              {fieldError("email")}
            </label>
          </div>
          <label>
            A little about your idea
            <textarea
              {...fieldProps("brief")}
              onChange={(e) => update("brief", e.target.value)}
              placeholder="The problem, the possibility, or the thing you wish existed…"
              rows={4}
              required
              maxLength={5000}
            />
            {fieldError("brief")}
          </label>
          <label className="honeypot" aria-hidden>
            Leave this empty
            <input
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>

          <div className="form-submit">
            <button
              className="button"
              type="submit"
              disabled={status === "sending"}
            >
              {MODE === "endpoint" &&
                (status === "sending" ? (
                  <>
                    Sending
                    <Loader2 size={17} className="spin" aria-hidden />
                  </>
                ) : (
                  <>
                    Send brief <ArrowUpRight size={17} aria-hidden />
                  </>
                ))}
              {MODE === "mailto" && (
                <>
                  Open email draft <Mail size={17} aria-hidden />
                </>
              )}
              {MODE === "download" && (
                <>
                  Save brief as a file <Download size={17} aria-hidden />
                </>
              )}
            </button>
            <p>
              {MODE === "endpoint" && "Your brief goes straight to our inbox."}
              {MODE === "mailto" &&
                "Opens your email app with your brief filled in."}
              {MODE === "download" &&
                "Online sending isn't set up yet. This saves your brief to your device; nothing is sent."}
            </p>
          </div>

          <div className="form-status" role="status" aria-live="polite">
            {status === "sending" && "Sending your brief…"}
            {downloaded && (
              <>
                <Check size={16} aria-hidden /> Brief saved to your device.
                Nothing has been sent.
              </>
            )}
          </div>
          {status === "error" && (
            <div className="form-error" role="alert">
              <p>
                <strong>Your brief didn&apos;t send.</strong> {failure} Your
                text is still here.
              </p>
              <div className="form-error-actions">
                <button type="submit" className="text-link">
                  <RotateCcw size={15} aria-hidden /> Try again
                </button>
                {site.email && (
                  <a className="text-link" href={mailtoHref(service, values)}>
                    <Mail size={15} aria-hidden /> Email it instead
                  </a>
                )}
              </div>
            </div>
          )}
        </form>
      )}
    </>
  );
}
