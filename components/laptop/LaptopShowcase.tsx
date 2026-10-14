"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getLenis } from "@/lib/lenis";
import { smoothstep } from "@/lib/monotone-spline";
import { profileFor } from "./choreography";
import { LaptopScene, type SceneDriver, type SceneFrame } from "./LaptopScene";
import { SceneBoundary } from "./SceneBoundary";
import { StaticLaptop } from "./StaticLaptop";

gsap.registerPlugin(ScrollTrigger);

function supportsWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * The scroll-scrubbed laptop section. Client-only: loaded through
 * LaptopShowcaseLoader so three.js stays out of the initial bundle.
 */
export default function LaptopShowcase() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const chapters = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [profile, setProfile] = useState(() => profileFor(window.innerWidth));
  const driver = useRef<SceneDriver>({
    progress: 0,
    pointer: { x: 0, y: 0 },
    profile,
  });
  // Last values written to the overlays, to skip redundant DOM writes.
  const overlay = useRef({ heading: -1, chapter: -1 });
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fallback, setFallback] = useState(() => !supportsWebGL2());
  const systemReduced = usePrefersReducedMotion();
  const [reducedOverride, setReducedOverride] = useState<boolean | null>(null);
  const reduced = reducedOverride ?? systemReduced;
  const simplified = fallback || reduced;

  // Overlays follow the rendered (smoothed) motion, not raw scroll.
  const onFrame = useCallback(({ progress, power, screen }: SceneFrame) => {
    const last = overlay.current;
    const headingOpacity = Math.round(
      (1 - smoothstep(0.06, 0.2, progress)) * 100,
    );
    if (heading.current && headingOpacity !== last.heading) {
      last.heading = headingOpacity;
      heading.current.style.opacity = String(headingOpacity / 100);
      heading.current.style.transform = `translateY(${(headingOpacity - 100) * 0.35}px)`;
    }
    const chapter = power < 0.5 ? -1 : Math.round(screen);
    if (chapters.current && chapter !== last.chapter) {
      last.chapter = chapter;
      Array.from(chapters.current.children).forEach((el, i) =>
        el.classList.toggle("is-active", i === chapter),
      );
    }
    if (bar.current)
      bar.current.style.transform = `scaleX(${progress.toFixed(4)})`;
  }, []);

  useEffect(() => {
    const resize = () => {
      const next = profileFor(window.innerWidth);
      driver.current.profile = next;
      setProfile(next);
    };
    window.addEventListener("resize", resize);
    const pointer = (e: PointerEvent) => {
      driver.current.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      driver.current.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) window.addEventListener("pointermove", pointer);
    // Mount the canvas shortly before the section arrives...
    const near = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          near.disconnect();
        }
      },
      { rootMargin: "650px" },
    );
    // ...and render continuously only while it is on screen.
    const onScreen = new IntersectionObserver((entries) =>
      setVisible(entries[0].isIntersecting),
    );
    if (root.current) {
      near.observe(root.current);
      onScreen.observe(root.current);
    }
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      near.disconnect();
      onScreen.disconnect();
    };
  }, []);

  useEffect(() => {
    if (simplified) return;
    const sync = (self: ScrollTrigger) => {
      driver.current.progress = self.progress;
    };
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top 35%",
      end: "bottom bottom",
      onUpdate: sync,
      onRefresh: sync,
    });
    return () => trigger.kill();
  }, [simplified]);

  const toggleMotion = () => {
    setReducedOverride(!reduced);
    // The section changes height; keep the visitor at its top.
    const lenis = getLenis();
    if (lenis && root.current)
      lenis.scrollTo(root.current, { immediate: true });
    else root.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  return (
    <section
      id="experience"
      ref={root}
      className={`laptop-experience ${simplified ? "simplified-scene" : ""}`}
      aria-label="Scroll-controlled 3D laptop showcase"
    >
      <div className="scene-sticky">
        <div className="scene-heading" ref={heading}>
          <span className="eyebrow">BUILT TO MAKE AN IMPACT</span>
          <h2>Ideas take shape.</h2>
          <p>A little imagination. A lot of engineering.</p>
        </div>
        <div
          className={`canvas-wrap ${ready ? "is-ready" : ""}`}
          aria-hidden={!simplified}
        >
          {simplified ? (
            <StaticLaptop />
          ) : active ? (
            <SceneBoundary onFailure={() => setFallback(true)}>
              <Canvas
                dpr={[1, 1.75]}
                frameloop={visible ? "always" : "never"}
                camera={{ position: [0, 1.3, 11], fov: 40 }}
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: "high-performance",
                  toneMappingExposure: 1.05,
                }}
                onCreated={({ gl }) => {
                  gl.domElement.addEventListener(
                    "webglcontextlost",
                    () => {
                      if (gl.domElement.isConnected) setFallback(true);
                    },
                    { once: true },
                  );
                }}
                fallback={<StaticLaptop />}
              >
                <Suspense fallback={null}>
                  <LaptopScene
                    driver={driver}
                    profile={profile}
                    onReady={onReady}
                    onFrame={onFrame}
                  />
                </Suspense>
              </Canvas>
            </SceneBoundary>
          ) : null}
        </div>
        {simplified && <div className="scene-floor" />}
        {!simplified && (
          <ol className="scene-chapters" ref={chapters} aria-hidden="true">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <span>
                  0{i + 1} / 0{projects.length}
                </span>
                {p.title}
              </li>
            ))}
          </ol>
        )}
        <div className="scene-bottom">
          <span>ONE IDEA. ENDLESS POSSIBILITIES.</span>
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={reduced}
            onClick={toggleMotion}
          >
            {reduced ? "Enable motion" : "Reduce motion"}
          </button>
          <span className="scene-project-label">
            PROJECT INTERFACES · CONCEPT PREVIEWS
          </span>
        </div>
        {!simplified && (
          <div className="scene-progress" aria-hidden="true">
            <span ref={bar} />
          </div>
        )}
      </div>
    </section>
  );
}
