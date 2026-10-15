import { Github, Linkedin, Mail, Twitter, type LucideIcon } from "lucide-react";
import { activeSocials, type SocialKey } from "@/data/site";

const ICONS: Record<SocialKey, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
};

/**
 * Icon links for every configured social profile. Renders nothing when
 * none are set.
 *
 * Usage: <SocialLinks /> or <SocialLinks tone="inverse" /> on dark surfaces.
 */
export function SocialLinks({
  tone = "default",
}: {
  tone?: "default" | "inverse";
}) {
  const links = activeSocials();
  if (links.length === 0) return null;
  return (
    <ul className={`social-links social-links-${tone}`} aria-label="Social">
      {links.map(({ key, label, href }) => {
        const Icon = ICONS[key];
        const external = key !== "email";
        return (
          <li key={key}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <Icon size={17} strokeWidth={1.75} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
