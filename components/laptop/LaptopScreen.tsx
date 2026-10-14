"use client";
import { useEffect, useMemo, type RefObject } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/data/projects";

// One screen per featured project, in showcase order.
const SCREENS = projects.map((p) => p.image);

const vertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const fragmentShader = /* glsl */ `
uniform sampler2D a;
uniform sampler2D b;
uniform sampler2D c;
uniform sampler2D d;
uniform float progress;
uniform float power;
uniform float sweep;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vec3 color = texture2D(a, vUv).rgb;
  color = mix(color, texture2D(b, vUv).rgb, smoothstep(0.15, 0.85, progress));
  color = mix(color, texture2D(c, vUv).rgb, smoothstep(1.15, 1.85, progress));
  color = mix(color, texture2D(d, vUv).rgb, smoothstep(2.15, 2.85, progress));
  // Panel wakes from the centre outward.
  float wake = clamp(power * 1.5 - length(vUv - 0.5) * 0.7, 0.0, 1.0);
  vec3 panel = mix(vec3(0.012, 0.013, 0.016), color, smoothstep(0.0, 1.0, wake));
  // Cover glass: fresnel edge reflection plus a soft diagonal sheen that
  // drifts as the laptop turns.
  vec3 view = normalize(cameraPosition - vWorld);
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), view), 0.0), 4.0);
  float band = vUv.x * 0.85 + vUv.y * 0.6 - 0.72 - sweep;
  float sheen = smoothstep(0.32, 0.0, abs(band)) * 0.03;
  panel += vec3(fresnel * 0.3 + sheen);
  gl_FragColor = vec4(panel, 1.0);
  #include <colorspace_fragment>
}`;

// SVG previews are rasterized above their intrinsic 1200×750 so the screen
// stays sharp when the laptop fills the viewport.
function useScreenTextures(width: number) {
  const images = useLoader(THREE.ImageLoader, SCREENS);
  const gl = useThree((s) => s.gl);
  const textures = useMemo(() => {
    const height = Math.round(width / 1.6);
    return images.map((image) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      return texture;
    });
  }, [images, width, gl]);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  return textures;
}

/**
 * The display panel. Driven per frame through `material.current.uniforms`:
 * `progress` (screen index, fractional values crossfade), `power` (0 off →
 * 1 on) and `sweep` (glass sheen offset). R3F copies uniforms passed as
 * props, so writes must go through the material instance.
 */
export function LaptopScreen({
  material,
  resolution,
}: {
  material: RefObject<THREE.ShaderMaterial | null>;
  resolution: number;
}) {
  const textures = useScreenTextures(resolution);
  const uniforms = useMemo(
    () => ({
      a: { value: textures[0] },
      b: { value: textures[1] },
      c: { value: textures[2] },
      d: { value: textures[3] },
      progress: { value: 0 },
      power: { value: 0 },
      sweep: { value: 0 },
    }),
    [textures],
  );
  return (
    <mesh position={[0, 1.92, 0.002]}>
      <planeGeometry args={[5.2, 3.25]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        toneMapped={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
