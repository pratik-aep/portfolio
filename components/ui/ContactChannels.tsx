import { CalendarDays, FileDown } from "lucide-react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { SocialLinks } from "./SocialLinks";

/**
 * "Book a call", "Download résumé" and social icons, each shown only when
 * configured in data/site.ts. Renders nothing if none are set.
 *
 * Usage: <ContactChannels /> (light) or <ContactChannels tone="inverse" />.
 */
export function ContactChannels({
  tone = "default",
}: {
  tone?: "default" | "inverse";
}) {
  const { bookingUrl } = site;
  // A local file (e.g. "/resume.pdf" in public/) needs the base path.
  const resumeUrl = site.resumeUrl.startsWith("/")
    ? asset(site.resumeUrl as `/${string}`)
    : site.resumeUrl;
  const hasSocials =
    Object.values(site.socials).some(Boolean) || Boolean(site.email);
  if (!bookingUrl && !resumeUrl && !hasSocials) return null;
  return (
    <div className={`contact-channels contact-channels-${tone}`}>
      {(bookingUrl || resumeUrl) && (
        <div className="contact-channels-actions">
          {bookingUrl && (
            <a
              className="channel-link"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarDays size={16} strokeWidth={1.75} aria-hidden />
              Book a call
            </a>
          )}
          {resumeUrl && (
            <a className="channel-link" href={resumeUrl} download>
              <FileDown size={16} strokeWidth={1.75} aria-hidden />
              Download résumé
            </a>
          )}
        </div>
      )}
      <SocialLinks tone={tone} />
    </div>
  );
}
