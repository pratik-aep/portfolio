"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// All keys merged into one geometry: one draw call instead of ~80.
export function Keyboard() {
  const geometry = useMemo(() => {
    const keys: THREE.BufferGeometry[] = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 15; col++) {
        if (row === 5 && col > 2 && col < 12) continue;
        const key = new THREE.BoxGeometry(
          0.285,
          0.03,
          row === 0 ? 0.105 : 0.175,
        );
        key.translate((col - 7) * 0.337, -1.525, -1.16 + row * 0.225);
        keys.push(key);
      }
    }
    const space = new THREE.BoxGeometry(2.82, 0.03, 0.175);
    space.translate(0, -1.525, -0.035);
    keys.push(space);
    const merged = mergeGeometries(keys);
    keys.forEach((key) => key.dispose());
    return merged;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#1c1e22" roughness={0.6} metalness={0.1} />
    </mesh>
  );
}
