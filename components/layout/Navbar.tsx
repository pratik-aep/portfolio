"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/#main", name: "Home" },
  { href: "/projects/", name: "Projects" },
  { href: "/#about", name: "About" },
  { href: "/#contact", name: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const isActive = (name: string) =>
    (name === "Home" && pathname === "/") ||
    (name === "Projects" && pathname.startsWith("/projects")) ||
    (name === "Contact" && pathname.startsWith("/contact"));
  // The contact page opens on a dark panel. Until the visitor scrolls (or
  // opens the mobile menu) the bar goes transparent over it; see
  // [data-surface="split"] in styles/nav.css.
  const surface =
    pathname.startsWith("/contact") && !scrolled && !open ? "split" : undefined;
  return (
    <header
      className={`nav ${scrolled ? "nav-scrolled" : ""}`}
      data-surface={surface}
    >
      <div className="nav-inner">
        <Link
          href="/#main"
          aria-label={`${site.name} home`}
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className={isActive(l.name) ? "active" : ""}
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <Link className="button nav-cta" href="/contact/">
          Let&apos;s Talk <ArrowUpRight size={15} />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links.map((l) => (
          <Link href={l.href} key={l.name} onClick={() => setOpen(false)}>
            {l.name}
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </nav>
    </header>
  );
}
