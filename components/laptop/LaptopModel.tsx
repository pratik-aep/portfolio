"use client";
import type { RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import type * as THREE from "three";
import { Keyboard } from "./Keyboard";
import { LaptopScreen } from "./LaptopScreen";
import { LID_CLOSED } from "./choreography";

// Hinge axis. The lid rotates around this line.
const HINGE_Y = -1.49;
const HINGE_Z = -1.78;

const aluminum = {
  color: "#d9dbe0",
  metalness: 1,
  roughness: 0.32,
} as const;

/**
 * Laptop geometry and materials. Animation is applied from outside through
 * the `body` (whole laptop), `lid` (hinge rotation) and `screen` refs.
 */
export function LaptopModel({
  body,
  lid,
  screen,
  screenResolution,
}: {
  body: RefObject<THREE.Group | null>;
  lid: RefObject<THREE.Group | null>;
  screen: RefObject<THREE.ShaderMaterial | null>;
  screenResolution: number;
}) {
  return (
    <group ref={body}>
      {/* Base */}
      <RoundedBox
        args={[5.9, 0.16, 3.82]}
        radius={0.07}
        smoothness={5}
        position={[0, -1.65, 0]}
      >
        <meshStandardMaterial {...aluminum} />
      </RoundedBox>
      <RoundedBox
        args={[5.83, 0.025, 3.74]}
        radius={0.012}
        smoothness={3}
        position={[0, -1.56, 0]}
      >
        <meshStandardMaterial {...aluminum} roughness={0.38} color="#e1e3e7" />
      </RoundedBox>
      {/* Keyboard well and keys */}
      <RoundedBox
        args={[5.18, 0.012, 1.51]}
        radius={0.005}
        smoothness={3}
        position={[0, -1.545, -0.6]}
      >
        <meshStandardMaterial color="#5c5f66" metalness={0.6} roughness={0.5} />
      </RoundedBox>
      <Keyboard />
      {/* Trackpad */}
      <RoundedBox
        args={[2.2, 0.01, 1.15]}
        radius={0.004}
        smoothness={3}
        position={[0, -1.546, 0.88]}
      >
        <meshStandardMaterial
          color="#9a9da4"
          metalness={0.8}
          roughness={0.35}
        />
      </RoundedBox>
      <RoundedBox
        args={[2.17, 0.012, 1.12]}
        radius={0.005}
        smoothness={3}
        position={[0, -1.54, 0.88]}
      >
        <meshPhysicalMaterial
          color="#cfd1d6"
          metalness={0.6}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>
      {/* Speakers, ports, feet */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 2.72, -1.546, -0.45]}>
            <boxGeometry args={[0.13, 0.004, 1.6]} />
            <meshStandardMaterial color="#6f727a" roughness={0.75} />
          </mesh>
          {[-0.9, -0.3].map((z) => (
            <RoundedBox
              key={z}
              args={[0.01, 0.045, 0.28]}
              radius={0.004}
              position={[side * 2.951, -1.66, z]}
            >
              <meshStandardMaterial color="#25272c" roughness={0.6} />
            </RoundedBox>
          ))}
          {[-1.55, 1.55].map((z) => (
            <mesh key={z} position={[side * 2.55, -1.735, z]}>
              <cylinderGeometry args={[0.13, 0.13, 0.012, 24]} />
              <meshStandardMaterial color="#3a3c41" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Hinge barrel */}
      <mesh
        position={[0, HINGE_Y - 0.03, HINGE_Z - 0.08]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.07, 0.07, 4.9, 28]} />
        <meshStandardMaterial {...aluminum} color="#a7aab1" />
      </mesh>
      {/* Lid, pivoting at the hinge */}
      <group
        ref={lid}
        position={[0, HINGE_Y, HINGE_Z]}
        rotation={[LID_CLOSED, 0, 0]}
      >
        <RoundedBox
          args={[5.9, 3.7, 0.14]}
          radius={0.07}
          smoothness={5}
          position={[0, 1.85, -0.1]}
        >
          <meshStandardMaterial {...aluminum} />
        </RoundedBox>
        <RoundedBox
          args={[5.78, 3.6, 0.03]}
          radius={0.012}
          smoothness={3}
          position={[0, 1.85, -0.016]}
        >
          <meshPhysicalMaterial
            color="#0b0c0e"
            metalness={0.2}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>
        <LaptopScreen material={screen} resolution={screenResolution} />
        <mesh position={[0, 3.6, 0.001]}>
          <circleGeometry args={[0.022, 20]} />
          <meshStandardMaterial
            color="#1f2633"
            metalness={0.6}
            roughness={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}
