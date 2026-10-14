"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/data/projects";
export function Wordmark() {
  return (
    <span className="wordmark">
      {site.name}
      <span className="brand-dot" />
    </span>
  );
}
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
  const links = [
    { href: "/#main", name: "Home" },
    { href: "/projects/", name: "Projects" },
    { href: "/#about", name: "About" },
    { href: "/#contact", name: "Contact" },
  ];
  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <Link
          href="/#main"
          aria-label="forgeD home"
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className={
                (l.name === "Home" && pathname === "/") ||
                (l.name === "Projects" && pathname.startsWith("/projects"))
                  ? "active"
                  : ""
              }
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <Link className="button nav-cta" href="/#contact">
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
export function Footer() {
  return (
    <footer className="footer container">
      <Link href="/" aria-label="forgeD home">
        <Wordmark />
      </Link>
      <span>Thoughtfully designed. Carefully built.</span>
      <a href="#main">
        Back to top <ArrowUpRight size={14} />
      </a>
      <small>© {new Date().getFullYear()} forgeD</small>
    </footer>
  );
}
