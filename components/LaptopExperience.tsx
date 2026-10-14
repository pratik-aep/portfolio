"use client";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
gsap.registerPlugin(ScrollTrigger);
type Motion = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  screen: number;
  light: number;
};
const finalPose: Motion = {
  x: 0,
  y: -0.1,
  z: 0.7,
  rx: 0.06,
  ry: -0.1,
  rz: 0.015,
  scale: 1.03,
  screen: 3,
  light: 1,
};
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Keyboard() {
  const geometry = useMemo(() => {
    const keys: THREE.BufferGeometry[] = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 15; col++) {
        if (row === 5 && col > 2 && col < 12) continue;
        const key = new THREE.BoxGeometry(
          0.285,
          0.045,
          row === 0 ? 0.105 : 0.175,
        );
        key.translate((col - 7) * 0.337, -1.49, -1.16 + row * 0.225);
        keys.push(key);
      }
    }
    const space = new THREE.BoxGeometry(2.82, 0.045, 0.175);
    space.translate(0, -1.49, -0.035);
    keys.push(space);
    const merged = mergeGeometries(keys);
    keys.forEach((key) => key.dispose());
    return merged;
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#25272b" roughness={0.65} />
    </mesh>
  );
}
function Screen({ motion }: { motion: React.RefObject<Motion> }) {
  const textures = useTexture([
    "/previews/lake.svg",
    "/previews/antarctic.svg",
    "/previews/space.svg",
  ]);
  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [textures]);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useRef({
    a: { value: textures[0] },
    b: { value: textures[1] },
    c: { value: textures[2] },
    progress: { value: 0 },
  });
  useFrame(() => {
    if (material.current)
      material.current.uniforms.progress.value = motion.current.screen;
  });
  return (
    <mesh position={[0, 1.88, 0.132]}>
      <planeGeometry args={[5.36, 3.35]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms.current}
        toneMapped={false}
        vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader={`uniform sampler2D a;uniform sampler2D b;uniform sampler2D c;uniform float progress;varying vec2 vUv;void main(){vec4 ca=texture2D(a,vUv);vec4 cb=texture2D(b,vUv);vec4 cc=texture2D(c,vUv);vec4 color=progress<1.0?mix(ca,cb,smoothstep(0.25,0.85,progress)):progress<2.0?mix(cb,cc,smoothstep(1.25,1.85,progress)):mix(cc,ca,smoothstep(2.25,2.85,progress));gl_FragColor=color;
  #include <colorspace_fragment>
  }`}
      />
    </mesh>
  );
}
function LaptopModel({
  motion,
  invalidateRef,
  onReady,
}: {
  motion: React.RefObject<Motion>;
  invalidateRef: React.RefObject<(() => void) | null>;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    invalidateRef.current = invalidate;
    onReady();
    invalidate();
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef, onReady]);
  useFrame(() => {
    if (!group.current) return;
    const m = motion.current;
    group.current.position.set(m.x, m.y, m.z);
    group.current.rotation.set(m.rx, m.ry, m.rz);
    group.current.scale.setScalar(m.scale);
    if (light.current) light.current.intensity = 3.2 * m.light;
  });
  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight ref={light} position={[3, 6, 6]} intensity={3.2} />
      <directionalLight position={[-6, 3, -4]} intensity={4} color="#dfe9ff" />
      <directionalLight position={[0, -3, 4]} intensity={1.2} />
      <group ref={group}>
        <RoundedBox
          args={[5.9, 0.16, 3.82]}
          radius={0.065}
          smoothness={4}
          position={[0, -1.65, 0]}
        >
          <meshStandardMaterial
            color="#b5b8bf"
            metalness={0.78}
            roughness={0.29}
          />
        </RoundedBox>
        <RoundedBox
          args={[5.83, 0.025, 3.72]}
          radius={0.01}
          smoothness={3}
          position={[0, -1.555, 0]}
        >
          <meshStandardMaterial
            color="#c5c7cd"
            metalness={0.72}
            roughness={0.33}
          />
        </RoundedBox>
        <RoundedBox
          args={[5.18, 0.012, 1.51]}
          radius={0.005}
          smoothness={3}
          position={[0, -1.532, -0.6]}
        >
          <meshStandardMaterial
            color="#73767d"
            metalness={0.65}
            roughness={0.4}
          />
        </RoundedBox>
        <Keyboard />
        <RoundedBox
          args={[2.2, 0.01, 1.15]}
          radius={0.004}
          smoothness={3}
          position={[0, -1.527, 0.88]}
        >
          <meshStandardMaterial
            color="#9c9fa6"
            metalness={0.72}
            roughness={0.4}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.17, 0.012, 1.12]}
          radius={0.005}
          smoothness={3}
          position={[0, -1.517, 0.88]}
        >
          <meshStandardMaterial
            color="#bec1c7"
            metalness={0.65}
            roughness={0.35}
          />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 2.7, -1.525, -0.45]}>
              <boxGeometry args={[0.12, 0.005, 1.6]} />
              <meshStandardMaterial color="#8a8d94" roughness={0.6} />
            </mesh>
            {[-0.9, -0.3].map((z) => (
              <mesh key={z} position={[side * 2.952, -1.66, z]}>
                <boxGeometry args={[0.005, 0.05, 0.3]} />
                <meshStandardMaterial color="#33353b" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, -1.55, -1.72]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.105, 0.105, 5.35, 20]} />
          <meshStandardMaterial
            color="#656973"
            metalness={0.8}
            roughness={0.35}
          />
        </mesh>
        <group position={[0, -1.56, -1.7]} rotation={[-0.14, 0, 0]}>
          <RoundedBox
            args={[5.9, 3.76, 0.15]}
            radius={0.07}
            smoothness={5}
            position={[0, 1.88, 0]}
          >
            <meshStandardMaterial
              color="#a1a5ae"
              metalness={0.8}
              roughness={0.3}
            />
          </RoundedBox>
          <RoundedBox
            args={[5.74, 3.62, 0.06]}
            radius={0.025}
            smoothness={4}
            position={[0, 1.88, 0.085]}
          >
            <meshStandardMaterial
              color="#16181b"
              metalness={0.12}
              roughness={0.3}
            />
          </RoundedBox>
          <Screen motion={motion} />
          <mesh position={[0, 3.61, 0.13]}>
            <circleGeometry args={[0.025, 16]} />
            <meshStandardMaterial
              color="#333a49"
              metalness={0.7}
              roughness={0.15}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
function StaticLaptop() {
  return (
    <div className="static-laptop">
      <div className="static-display">
        <Image
          src="/previews/lake.svg"
          alt="Illustrative water quality monitoring interface in a laptop"
          width={1200}
          height={750}
        />
      </div>
      <div className="static-base" />
    </div>
  );
}
export default function LaptopExperience() {
  const root = useRef<HTMLElement>(null);
  const motion = useRef<Motion>({
    ...finalPose,
    x: -7,
    y: -4,
    z: -3,
    rx: 0.4,
    ry: -0.95,
    rz: -0.15,
    scale: 0.58,
    screen: 0,
  });
  const invalidateRef = useRef<(() => void) | null>(null);
  const onReady = useRef(() => setReady(true)).current;
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener("change", change);
    let supported = false;
    try {
      const c = document.createElement("canvas");
      supported = !!c.getContext("webgl2");
    } catch {}
    if (!supported) setFallback(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "650px" },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener("change", change);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!ready || fallback || reduced) return;
    const mm = gsap.matchMedia();
    mm.add(
      { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" },
      (context) => {
        const mobile = !!context.conditions?.mobile;
        const s = mobile ? 0.61 : 1;
        const x = mobile ? 0.48 : 1;
        Object.assign(motion.current, {
          x: -7 * x,
          y: -4,
          z: -3,
          rx: 0.4,
          ry: mobile ? -0.5 : -0.95,
          rz: -0.15,
          scale: 0.58 * s,
          screen: 0,
          light: 0.8,
        });
        const timeline = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
          onUpdate: () => invalidateRef.current?.(),
        });
        timeline
          .to(motion.current, {
            x: -1.9 * x,
            y: -0.3,
            z: -0.9,
            rx: 0.28,
            ry: -0.65,
            rz: -0.09,
            scale: 0.82 * s,
            screen: 0.3,
            light: 1,
            duration: 0.2,
          })
          .to(motion.current, {
            x: 1.9 * x,
            y: 0.45,
            z: -1.2,
            rx: -0.15,
            ry: 0.52,
            rz: 0.12,
            scale: 0.88 * s,
            screen: 1.2,
            light: 0.82,
            duration: 0.2,
          })
          .to(motion.current, {
            x: -0.85 * x,
            y: -0.08,
            z: 0.25,
            rx: 0.2,
            ry: -0.32,
            rz: -0.09,
            scale: 0.95 * s,
            screen: 2.2,
            light: 1.1,
            duration: 0.25,
          })
          .to(motion.current, {
            ...finalPose,
            scale: finalPose.scale * s,
            screen: 2.9,
            duration: 0.2,
          })
          .to(motion.current, {
            ...finalPose,
            scale: finalPose.scale * s,
            duration: 0.15,
          });
        invalidateRef.current?.();
        return () => timeline.revert();
      },
    );
    return () => mm.revert();
  }, [ready, fallback, reduced]);
  return (
    <section
      id="experience"
      ref={root}
      className={`laptop-experience ${fallback || reduced ? "simplified-scene" : ""}`}
      aria-label="Scroll-controlled 3D laptop showcase"
    >
      <div className="scene-sticky">
        <div className="scene-heading">
          <span className="eyebrow">BUILT TO MAKE AN IMPACT</span>
          <h2>Ideas take shape.</h2>
          <p>A little imagination. A lot of engineering.</p>
        </div>
        <div className="canvas-wrap" aria-hidden={!fallback && !reduced}>
          {fallback || reduced ? (
            <StaticLaptop />
          ) : active ? (
            <SceneBoundary onFailure={() => setFallback(true)}>
              <Canvas
                dpr={[1, 1.6]}
                frameloop="demand"
                camera={{ position: [0, 1.3, 11], fov: 40 }}
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: "high-performance",
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
                  <LaptopModel
                    motion={motion}
                    invalidateRef={invalidateRef}
                    onReady={onReady}
                  />
                </Suspense>
              </Canvas>
            </SceneBoundary>
          ) : null}
        </div>
        <div className="scene-floor" />
        <div className="scene-bottom">
          <span>ONE IDEA. ENDLESS POSSIBILITIES.</span>
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={reduced}
            onClick={() => {
              setReduced(!reduced);
              root.current?.scrollIntoView({
                behavior: "instant",
                block: "start",
              });
            }}
          >
            {reduced ? "Enable motion" : "Reduce motion"}
          </button>
          <span className="scene-project-label">
            PROJECT INTERFACES · CONCEPT PREVIEWS
          </span>
        </div>
      </div>
    </section>
  );
}
