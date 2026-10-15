"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getLenis } from "@/lib/lenis";
import { smoothstep } from "@/lib/monotone-spline";
import {
  CAMERA,
  PHASES,
  phaseAt,
  profileFor,
  type Profile,
} from "./choreography";
import { LaptopScene, type SceneDriver, type SceneFrame } from "./LaptopScene";
import { SceneBoundary } from "./SceneBoundary";
import { StaticLaptop } from "./StaticLaptop";

gsap.registerPlugin(ScrollTrigger);

// Editorial callouts, each visible for part of the story.
const CALLOUTS = [
  { text: "From idea to interface", from: 0.17, to: 0.35, side: "right" },
  { text: "Designed in three dimensions", from: 0.38, to: 0.58, side: "left" },
  { text: "Engineered to the detail", from: 0.62, to: 0.84, side: "left" },
] as const;

// Background parallax: pixels of drift per radian of camera arc.
const DRIFT_PX = 260;

function supportsWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const sameProfile = (a: Profile, b: Profile) =>
  a.travel === b.travel && a.scale === b.scale && a.turn === b.turn;

/**
 * The pinned, scroll-scrubbed laptop story. Client-only: loaded through
 * LaptopShowcaseLoader so three.js stays out of the initial bundle.
 *
 * The section starts at the top of the page, behind the hero (see
 * styles/showcase.css), so the laptop can arrive while the headline leaves.
 * One ScrollTrigger is the single source of progress. The render loop reads
 * it, smooths it, and reports each frame back through `onFrame`, which
 * drives the DOM overlays without React renders.
 */
export default function LaptopShowcase() {
  const root = useRef<HTMLElement>(null);
  const markers = useRef<HTMLOListElement>(null);
  const callouts = useRef<HTMLDivElement>(null);
  const numeral = useRef<HTMLSpanElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const chapters = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [profile, setProfile] = useState(() =>
    profileFor(window.innerWidth, window.innerHeight),
  );
  const driver = useRef<SceneDriver>({
    progress: 0,
    pointer: { x: 0, y: 0 },
    profile,
  });
  // Last values written to the overlays, to skip redundant DOM writes.
  const overlay = useRef({
    phase: -2,
    chapter: -2,
    callouts: "",
    vars: "",
    entered: false,
  });
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  // At the very top of the page the laptop is out of frame: render on
  // demand only, and run the loop once the story is actually moving.
  const [moving, setMoving] = useState(false);
  const movingRef = useRef(false);
  const updateMoving = useCallback((value: boolean) => {
    if (movingRef.current === value) return;
    movingRef.current = value;
    setMoving(value);
  }, []);
  const [fallback, setFallback] = useState(() => !supportsWebGL2());
  const systemReduced = usePrefersReducedMotion();
  const [reducedOverride, setReducedOverride] = useState<boolean | null>(null);
  const reduced = reducedOverride ?? systemReduced;
  const simplified = fallback || reduced;

  // Overlays follow the rendered (smoothed) motion, not raw scroll.
  const onFrame = useCallback(
    ({ progress, power, screen, focus, drift }: SceneFrame) => {
      const last = overlay.current;
      const section = root.current;
      if (progress < 0.0005 && driver.current.progress === 0)
        updateMoving(false);

      const phase = phaseAt(progress);
      if (phase !== last.phase) {
        last.phase = phase;
        markers.current
          ?.querySelectorAll("li")
          .forEach((el, i) => el.classList.toggle("is-active", i === phase));
        if (numeral.current) numeral.current.textContent = PHASES[phase].id;
      }
      const shown = CALLOUTS.map((c) => progress >= c.from && progress < c.to);
      const key = shown.join();
      if (key !== last.callouts && callouts.current) {
        last.callouts = key;
        Array.from(callouts.current.children).forEach((el, i) =>
          el.classList.toggle("is-visible", shown[i]),
        );
      }
      const chapter = power < 0.5 ? -1 : Math.round(screen);
      if (chapters.current && chapter !== last.chapter) {
        last.chapter = chapter;
        Array.from(chapters.current.children).forEach((el, i) =>
          el.classList.toggle("is-active", i === chapter),
        );
      }

      // CSS custom properties (see styles/showcase.css):
      // --enter  scene furniture fades in as the hero leaves
      // --exit   overlays clear as the featured work takes over
      // --focus  background focus pull at the peak of the orbit
      // --drift  background parallax following the camera arc
      const enter = smoothstep(0.03, 0.14, progress);
      const exit = smoothstep(0.88, 0.99, progress);
      const vars = [
        enter.toFixed(3),
        exit.toFixed(3),
        focus.toFixed(3),
        (drift * DRIFT_PX).toFixed(1),
      ];
      const varsKey = vars.join();
      if (section && varsKey !== last.vars) {
        last.vars = varsKey;
        section.style.setProperty("--enter", vars[0]);
        section.style.setProperty("--exit", vars[1]);
        section.style.setProperty("--focus", vars[2]);
        section.style.setProperty("--drift", vars[3]);
      }
      const entered = enter > 0.01;
      if (section && entered !== last.entered) {
        last.entered = entered;
        section.toggleAttribute("data-entered", entered);
      }
      if (trail.current)
        trail.current.style.strokeDashoffset = String(1 - progress);
      if (bar.current)
        bar.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    },
    [updateMoving],
  );

  useEffect(() => {
    const resize = () => {
      const next = profileFor(window.innerWidth, window.innerHeight);
      if (sameProfile(next, driver.current.profile)) return;
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
      if (self.progress > 0) updateMoving(true);
    };
    // The section begins at the top of the page (it sits behind the hero),
    // so progress starts with the very first pixel of scroll.
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: sync,
      onRefresh: sync,
    });
    return () => trigger.kill();
  }, [simplified, updateMoving]);

  const toggleMotion = () => {
    setReducedOverride(!reduced);
    // The section changes size and position; once React has committed,
    // bring the visitor to its start.
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis && root.current)
        lenis.scrollTo(root.current, { immediate: true, force: true });
      else
        root.current?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  };

  return (
    <section
      id="experience"
      ref={root}
      className={`showcase ${simplified ? "is-simplified" : ""}`}
      aria-label="Scroll-controlled 3D laptop showcase"
    >
      {/* Studio backdrop: its own sticky layer so it sits beneath the hero,
          while the laptop frame below sits above it. */}
      <div className="showcase-backdrop" aria-hidden />
      <div className="showcase-sticky">
        <div className="showcase-stage">
          {!simplified && (
            <>
              <span className="showcase-numeral" ref={numeral} aria-hidden>
                01
              </span>
              <svg
                className="showcase-trail"
                viewBox="0 0 1440 900"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  className="trail-guide"
                  d="M-40 840 C 240 760, 420 330, 720 300 S 1180 360, 1150 470 S 820 640, 720 560"
                />
                <path
                  ref={trail}
                  pathLength={1}
                  className="trail-draw"
                  d="M-40 840 C 240 760, 420 330, 720 300 S 1180 360, 1150 470 S 820 640, 720 560"
                />
                <ellipse
                  className="trail-orbit"
                  cx="720"
                  cy="520"
                  rx="520"
                  ry="150"
                />
              </svg>
            </>
          )}
          <div
            className={`showcase-canvas ${ready ? "is-ready" : ""}`}
            aria-hidden={!simplified}
          >
            {simplified ? (
              <StaticLaptop />
            ) : active ? (
              <SceneBoundary onFailure={() => setFallback(true)}>
                <Canvas
                  dpr={[1, 1.75]}
                  frameloop={visible && moving ? "always" : "demand"}
                  camera={{ position: [0, 1.5, 15], fov: CAMERA.fov }}
                  // The canvas sits above the hero; never block its links.
                  style={{ pointerEvents: "none" }}
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
          {!simplified && (
            <>
              <div className="showcase-callouts" ref={callouts} aria-hidden>
                {CALLOUTS.map((c) => (
                  <span key={c.text} className={`callout callout-${c.side}`}>
                    {c.text}
                  </span>
                ))}
              </div>
              <ol className="showcase-markers" ref={markers} aria-hidden>
                {PHASES.map((p) => (
                  <li key={p.id}>
                    <span>{p.id}</span>
                    {p.name}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
        <div className="showcase-footer">
          {simplified ? (
            <span className="showcase-note">
              Project interfaces · concept previews
            </span>
          ) : (
            <ol className="showcase-chapters" ref={chapters} aria-hidden>
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
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={reduced}
            onClick={toggleMotion}
          >
            {reduced ? "Enable motion" : "Reduce motion"}
          </button>
          {!simplified && (
            <span className="showcase-note">Concept previews</span>
          )}
        </div>
        {!simplified && (
          <div className="showcase-progress" aria-hidden>
            <span ref={bar} />
          </div>
        )}
      </div>
    </section>
  );
}
