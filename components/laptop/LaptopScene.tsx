"use client";
import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { runWhenIdle } from "@/lib/idle";
import { clampAbs, smoothstep } from "@/lib/monotone-spline";
import {
  CAMERA,
  FINAL,
  FINAL_SCALE,
  createCameraPose,
  createLightPose,
  createPose,
  evaluateCamera,
  evaluateLight,
  evaluatePose,
  type Profile,
} from "./choreography";
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
  focus: number; // 0→1 background focus pull
  drift: number; // camera azimuth (radians), for background parallax
};

// Peak intensities for the scroll-driven lights (physical units).
const SWEEP_INTENSITY = 110;
const RIM_BASE = 2.4;
const RIM_FLASH = 18;

/**
 * Lighting, camera, shadow and the per-frame animation loop. Smoothed state
 * lives in refs so scrolling never causes a React render.
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
  const sweepLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const shadow = useRef<THREE.Group>(null);
  const screen = useRef<THREE.ShaderMaterial>(null);
  const motion = useRef({
    p: 0,
    pose: createPose(),
    cam: createCameraPose(),
    light: createLightPose(),
    prevX: 0,
    prevY: 0,
    bank: 0,
    lift: 0,
    px: 0,
    py: 0,
    first: true,
  });
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const sceneCamera = useThree((s) => s.camera);
  const compact = profile.scale < 0.7;

  useEffect(() => {
    onReady();
  }, [onReady]);

  // The laptop starts off-frame, so three.js would only compile its
  // shaders on the first scroll frame, exactly when the arrival starts.
  // Compile everything up front, in idle time.
  useEffect(
    () =>
      runWhenIdle([
        () => {
          gl.compileAsync(scene, sceneCamera).catch(() => {});
        },
      ]),
    [gl, scene, sceneCamera],
  );

  useFrame((state, rawDelta) => {
    const g = body.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 1 / 20);
    const s = motion.current;
    const { progress, pointer, profile } = driver.current;
    // Inertia: the rendered progress chases the scroll position, so quick
    // flicks feel weighted instead of mechanically locked to the wheel.
    s.p = s.first ? progress : THREE.MathUtils.damp(s.p, progress, 6.5, delta);
    const pose = evaluatePose(s.p, profile, s.pose);
    const cam = evaluateCamera(s.p, profile, s.cam);
    const light = evaluateLight(s.p, s.light);

    // Camera: orbit the target (dolly, arc, elevation) and keep looking at it.
    const { target } = CAMERA;
    const flat = cam.distance * Math.cos(cam.elevation);
    state.camera.position.set(
      target.x + flat * Math.sin(cam.azimuth),
      target.y + cam.distance * Math.sin(cam.elevation),
      target.z + flat * Math.cos(cam.azimuth),
    );
    state.camera.lookAt(target.x, target.y, target.z);

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
    const t = state.clock.elapsedTime;
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

    // Lighting: a light sweeps across the front, the rim flashes at the
    // reveal, and the studio environment brightens as the laptop opens.
    if (keyLight.current) keyLight.current.intensity = light.key;
    if (sweepLight.current) {
      sweepLight.current.position.set(
        light.sweep * 7,
        4.2,
        5.5 - Math.abs(light.sweep) * 1.5,
      );
      sweepLight.current.intensity = light.sweepPower * SWEEP_INTENSITY;
    }
    if (rimLight.current)
      rimLight.current.intensity = RIM_BASE + light.rim * RIM_FLASH;
    state.scene.environmentIntensity = light.env;

    const u = screen.current?.uniforms;
    if (u) {
      u.progress.value = pose.screen;
      u.power.value = pose.power;
      // The glass sheen tracks the sweep light; the glint crosses once at
      // the reveal.
      u.sweep.value = light.sweep * 0.5 + s.px * 0.1;
      u.glint.value = light.glint;
      u.glintPos.value = light.glintPos;
    }

    // Contact shadow appears only as the laptop comes in to land.
    if (shadow.current) {
      const mesh = shadow.current.children[0] as THREE.Mesh | undefined;
      const material = mesh?.material as THREE.MeshBasicMaterial | undefined;
      if (material)
        material.opacity =
          smoothstep(0.62, 0.86, s.p) *
          (1 - smoothstep(0.93, 1, s.p) * 0.6) *
          0.32;
      shadow.current.position.y = FINAL.y - 1.78 * FINAL_SCALE * profile.scale;
    }
    onFrame({
      progress: s.p,
      power: pose.power,
      screen: pose.screen,
      focus: cam.focus,
      drift: cam.azimuth,
    });
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
      {/* Key from upper right, soft fill from front left, cool rim behind,
          plus the moving sweep light. Intensities are animated per frame. */}
      <directionalLight ref={keyLight} position={[4, 7, 6]} intensity={1.5} />
      <directionalLight position={[-5, 2, 7]} intensity={0.7} />
      <directionalLight
        ref={rimLight}
        position={[-6, 3, -5]}
        intensity={RIM_BASE}
        color="#dfe9ff"
      />
      <pointLight
        ref={sweepLight}
        position={[-7, 4.2, 4]}
        intensity={0}
        distance={0}
        decay={2}
      />
      <ContactShadows
        ref={shadow}
        position={[0, -1.9, FINAL.z]}
        opacity={0}
        scale={16 * profile.scale}
        far={3 * profile.scale}
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
