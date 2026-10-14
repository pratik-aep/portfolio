"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in
 * sync. Disabled (native scrolling) when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tick: ((time: number) => void) | null = null;
    const start = () => {
      if (getLenis() || media.matches) return;
      const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      getLenis()?.destroy();
      setLenis(null);
      gsap.ticker.lagSmoothing(500, 33);
    };
    // Same-page hash links glide with Lenis. Keyboard activation (detail 0)
    // keeps native behavior so focus moves with the skip link.
    const onClick = (event: MouseEvent) => {
      const lenis = getLenis();
      if (!lenis || event.defaultPrevented || event.detail === 0) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname)
        return;
      if (!url.hash) return;
      const target =
        url.hash === "#main" ? 0 : document.querySelector(url.hash);
      if (target === null) return;
      event.preventDefault();
      // Lenis applies the page's scroll-padding-top, matching native anchors.
      lenis.scrollTo(target as HTMLElement | number, { duration: 1.4 });
      history.replaceState(null, "", url.hash);
    };
    const onMotionChange = () => (media.matches ? stop() : start());
    start();
    window.addEventListener("click", onClick, true);
    media.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("click", onClick, true);
      media.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);
  return null;
}
