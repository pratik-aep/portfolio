"use client";
import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { clampAbs, smoothstep } from "@/lib/monotone-spline";
import { FINAL, createPose, evaluatePose, type Profile } from "./choreography";
import { LaptopModel } from "./LaptopModel";

/** Inputs written by the DOM side, read every frame. */
export type SceneDriver = {
  progress: number; // raw scroll progress from ScrollTrigger
  pointer: { x: number; y: number }; // normalized -1..1
  profile: Profile;
};

/** Reported every frame so DOM overlays can follow the rendered motion. */
export type SceneFrame = {
  progress: number; // smoothed progress actually rendered
  power: number;
  screen: number;
};

/**
 * Lighting, shadow and the per-frame animation loop. Smoothed state lives in
 * refs so scrolling never causes a React render.
 */
export function LaptopScene({
  driver,
  profile,
  onReady,
  onFrame,
}: {
  driver: RefObject<SceneDriver>;
  profile: Profile;
  onReady: () => void;
  onFrame: (frame: SceneFrame) => void;
}) {
  const body = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const shadow = useRef<THREE.Group>(null);
  const screen = useRef<THREE.ShaderMaterial>(null);
  const motion = useRef({
    p: 0,
    pose: createPose(),
    prevX: 0,
    prevY: 0,
    bank: 0,
    lift: 0,
    px: 0,
    py: 0,
    first: true,
  });
  const compact = profile.scale < 0.6;
  useEffect(() => {
    onReady();
  }, [onReady]);
  useFrame(({ clock }, rawDelta) => {
    const g = body.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 1 / 20);
    const s = motion.current;
    const { progress, pointer, profile } = driver.current;
    // Inertia: the rendered progress chases the scroll position, so quick
    // flicks feel weighted instead of mechanically locked to the wheel.
    s.p = s.first ? progress : THREE.MathUtils.damp(s.p, progress, 6.5, delta);
    const pose = evaluatePose(s.p, profile, s.pose);
    // Bank into horizontal movement and pitch with vertical movement, like
    // a physical object carried through the air.
    const dt = Math.max(delta, 1e-3);
    const vx = s.first ? 0 : (pose.x - s.prevX) / dt;
    const vy = s.first ? 0 : (pose.y - s.prevY) / dt;
    s.prevX = pose.x;
    s.prevY = pose.y;
    s.first = false;
    s.bank = THREE.MathUtils.damp(
      s.bank,
      clampAbs(-vx * 0.045, 0.16),
      3.5,
      delta,
    );
    s.lift = THREE.MathUtils.damp(s.lift, clampAbs(vy * 0.03, 0.1), 3.5, delta);
    // Once the laptop settles, let it float and lean toward the pointer.
    const settled = smoothstep(0.7, 0.88, s.p);
    s.px = THREE.MathUtils.damp(s.px, pointer.x, 3, delta);
    s.py = THREE.MathUtils.damp(s.py, pointer.y, 3, delta);
    const t = clock.elapsedTime;
    const floatY = Math.sin(t * 1.1) * 0.045;
    const floatR = Math.sin(t * 0.75) * 0.01;
    g.position.set(pose.x, pose.y + floatY, pose.z);
    g.rotation.set(
      pose.rx + s.lift + floatR * 0.6 + s.py * 0.07 * settled,
      pose.ry + s.px * 0.17 * settled,
      pose.rz + s.bank + floatR,
    );
    g.scale.setScalar(pose.scale);
    if (lid.current) lid.current.rotation.x = pose.lid;
    const u = screen.current?.uniforms;
    if (u) {
      u.progress.value = pose.screen;
      u.power.value = pose.power;
      u.sweep.value = pose.ry * 0.45 + s.px * 0.1;
    }
    if (keyLight.current)
      keyLight.current.intensity = 1.9 + Math.sin(s.p * Math.PI) * 0.9;
    // Contact shadow appears only as the laptop comes in to land.
    if (shadow.current) {
      const mesh = shadow.current.children[0] as THREE.Mesh | undefined;
      const material = mesh?.material as THREE.MeshBasicMaterial | undefined;
      if (material)
        material.opacity =
          smoothstep(0.62, 0.86, s.p) *
          (1 - smoothstep(0.93, 1, s.p) * 0.6) *
          0.32;
      shadow.current.position.y = FINAL.y - 1.8 * profile.scale;
    }
    onFrame({ progress: s.p, power: pose.power, screen: pose.screen });
  });
  return (
    <>
      {/* Studio reflections generated in-scene; no HDR download. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#c4c7cd"]} />
        <Lightformer intensity={2.4} position={[0, 7, 2]} scale={[14, 5, 1]} />
        <Lightformer intensity={2.2} position={[-8, 2, 3]} scale={[4, 12, 1]} />
        <Lightformer intensity={2.2} position={[8, 2, 3]} scale={[4, 12, 1]} />
        <Lightformer intensity={0.9} position={[0, 0, 10]} scale={[16, 3, 1]} />
        <Lightformer
          form="ring"
          color="#dfe8ff"
          intensity={2}
          position={[-4, 4, -7]}
          scale={3}
        />
      </Environment>
      <ambientLight intensity={0.25} />
      <directionalLight ref={keyLight} position={[4, 7, 6]} intensity={2} />
      <directionalLight
        position={[-6, 3, -5]}
        intensity={2.4}
        color="#dfe9ff"
      />
      <ContactShadows
        ref={shadow}
        position={[0, -1.95, 0.7]}
        opacity={0}
        scale={14 * profile.scale}
        far={2.6 * profile.scale}
        blur={3.2}
        resolution={compact ? 256 : 512}
        color="#2a2f38"
      />
      <LaptopModel
        body={body}
        lid={lid}
        screen={screen}
        screenResolution={compact ? 1280 : 1920}
      />
    </>
  );
}
