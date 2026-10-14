import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer container">
      <Link href="/" aria-label={`${site.name} home`}>
        <Wordmark />
      </Link>
      <span>Thoughtfully designed. Carefully built.</span>
      <a href="#main">
        Back to top <ArrowUpRight size={14} />
      </a>
      <small>
        © {new Date().getFullYear()} {site.name}
      </small>
    </footer>
  );
}
