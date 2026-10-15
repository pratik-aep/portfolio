import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { ContactChannels } from "@/components/ui/ContactChannels";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-brand">
        <Link href="/" aria-label={`${site.name} home`}>
          <Wordmark />
        </Link>
        <span>Thoughtfully designed. Carefully built.</span>
      </div>
      <ContactChannels />
      <div className="footer-meta">
        <a href="#main">
          Back to top <ArrowUpRight size={14} aria-hidden />
        </a>
        <small>
          © {new Date().getFullYear()} {site.name}
        </small>
      </div>
    </footer>
  );
}
