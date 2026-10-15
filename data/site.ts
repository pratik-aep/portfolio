// Site-wide configuration. Every contact channel is optional: the UI hides
// anything left empty, so placeholders never render as dead links.
//
// TODO(owner): fill in the real profiles and links below
// (see docs/CONTENT_TODO.md).

const env = (value: string | undefined) => value?.trim() || "";

export type SocialKey = "github" | "linkedin" | "x" | "email";

export const site = {
  name: "forgeD",
  description:
    "Websites, applications, AI-powered solutions and custom digital products, designed and built with care.",
  // Canonical origin + base path, used for metadata, sitemap and JSON-LD.
  url:
    env(process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://pratik-aep.github.io/portfolio",
  // Contact: the form posts to `formEndpoint`; `email` powers mailto links.
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  formEndpoint: env(process.env.NEXT_PUBLIC_FORM_ENDPOINT),
  // Web3Forms-style services need a public access key in the body.
  formAccessKey: env(process.env.NEXT_PUBLIC_FORM_ACCESS_KEY),
  bookingUrl: env(process.env.NEXT_PUBLIC_BOOKING_URL),
  resumeUrl: env(process.env.NEXT_PUBLIC_RESUME_URL),
  socials: {
    github: env(process.env.NEXT_PUBLIC_GITHUB_URL),
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    x: env(process.env.NEXT_PUBLIC_X_URL),
  },

  // ── Contact page content. TODO(owner): everything below is empty on
  // purpose; each piece of UI that uses it stays hidden until filled in.

  // Short availability note shown as a badge with a live dot,
  // e.g. "Taking new projects from November".
  availability: "",
  // City for the "Based in … · 2:41 pm here" line, e.g. "Jaipur".
  city: "",
  // IANA time zone for that line, e.g. "Asia/Kolkata". The line needs both
  // `city` and `timeZone`.
  timeZone: "",
  // Currency symbol used in budget labels, e.g. "₹" or "$".
  currency: "",
  // Budget choices for the form, in your own words,
  // e.g. ["Under X", "X to Y", "Y+", "Not sure yet"].
  budgetRanges: [] as string[],
  // Timeline choices for the form,
  // e.g. ["ASAP", "1 to 3 months", "3 to 6 months", "Flexible"].
  timelines: [] as string[],
  // Frequently asked questions. Items marked `draft` never ship to
  // production (see the FAQ component).
  faq: [] as { q: string; a: string; draft?: boolean }[],
};

const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  email: "Email",
};

/** Configured social links, in display order. Email is included if set. */
export function activeSocials() {
  const links: { key: SocialKey; label: string; href: string }[] = [];
  for (const key of ["github", "linkedin", "x"] as const) {
    const href = site.socials[key];
    if (href) links.push({ key, label: SOCIAL_LABELS[key], href });
  }
  if (site.email)
    links.push({
      key: "email",
      label: SOCIAL_LABELS.email,
      href: `mailto:${site.email}`,
    });
  return links;
}

/** Absolute URL for a site path, e.g. pageUrl("/projects/"). */
export function pageUrl(path: `/${string}`) {
  return `${site.url}${path}`;
}

/** Metadata entry for a generated share image (built by app/og/[image]). */
export function ogImage(name: string, alt: string) {
  return { url: `${site.url}/og/${name}.png`, width: 1200, height: 630, alt };
}

/**
 * Canonical + Open Graph + Twitter metadata for a page. Pages must set all
 * three together: a page-level `openGraph`/`twitter` replaces the layout's.
 */
export function shareMetadata({
  path,
  title,
  description = site.description,
  image = "default",
  imageAlt = `${site.name}: engineering what's next`,
  type = "website",
}: {
  path: `/${string}`;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}) {
  const url = pageUrl(path);
  const images = [ogImage(image, imageAlt)];
  return {
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images,
    },
  };
}
