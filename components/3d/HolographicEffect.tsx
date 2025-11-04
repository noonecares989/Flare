'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Holographic shader material
const HolographicMaterial = shaderMaterial(
  {
    time: 0,
    intensity: 1.0,
    baseColor: new THREE.Color('#8b5cf6'),
    opacity: 0.8,
    scanlineFrequency: 50.0,
    glowIntensity: 0.5,
    fresnelPower: 2.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistortion;

    uniform float time;
    uniform float intensity;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;

      // Add distortion animation
      float distortion = sin(position.y * 10.0 + time * 2.0) * 0.02;
      distortion += cos(position.x * 10.0 + time * 3.0) * 0.02;
      distortion += sin(position.z * 10.0 + time * 4.0) * 0.02;

      vDistortion = distortion;

      vec3 distortedPosition = position + normal * distortion * intensity;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform float intensity;
    uniform vec3 baseColor;
    uniform float opacity;
    uniform float scanlineFrequency;
    uniform float glowIntensity;
    uniform float fresnelPower;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistortion;

    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Holographic scanlines
      float scanline = sin(vUv.y * scanlineFrequency + time * 2.0) * 0.5 + 0.5;
      scanline *= sin(vUv.x * scanlineFrequency * 0.5 + time * 3.0) * 0.5 + 0.5;

      // Noise texture
      vec2 noiseCoord = vUv * 10.0 + time * 0.5;
      float noiseValue = noise(noiseCoord);

      // Fresnel effect for edge glow
      vec3 viewDirection = normalize(vViewPosition);
      float fresnel = 1.0 - dot(normalize(vNormal), viewDirection);
      fresnel = pow(fresnel, fresnelPower);

      // Animated glow
      float glow = sin(time * 3.0 + vPosition.y * 5.0) * 0.5 + 0.5;
      glow *= glowIntensity;

      // Combine effects
      vec3 color = baseColor;
      color += scanline * 0.3 * intensity;
      color += noiseValue * 0.1 * intensity;
      color += fresnel * 0.5 * intensity;
      color += glow * 0.2 * intensity;

      // Add edge enhancement
      float edge = length(vec2(dFdx(vUv.x), dFdy(vUv.y)));
      color += edge * 0.5;

      // Add holographic color shift
      color.r += sin(time * 2.0 + vPosition.y * 2.0) * 0.1;
      color.g += sin(time * 3.0 + vPosition.x * 2.0) * 0.1;
      color.b += sin(time * 4.0 + vPosition.z * 2.0) * 0.1;

      // Distortion-based opacity variation
      float alphaModulation = 1.0 - abs(vDistortion) * 5.0;
      alphaModulation = clamp(alphaModulation, 0.3, 1.0);

      gl_FragColor = vec4(color, opacity * alphaModulation);
    }
  `
);

extend({ HolographicMaterial });

interface HolographicEffectProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry?: JSX.Element;
  color?: string;
  intensity?: number;
  animated?: boolean;
}

export function HolographicEffect({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  geometry,
  color = '#8b5cf6',
  intensity = 1.0,
  animated = true
}: HolographicEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current && animated) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.intensity = intensity;
      materialRef.current.baseColor.set(color);
    }
  });

  const DefaultGeometry = () => (
    <boxGeometry args={[2, 2, 2]} />
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {geometry || <DefaultGeometry />}
      <holographicMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        baseColor={color}
        intensity={intensity}
        opacity={0.8}
      />
    </mesh>
  );
}

interface DataFlowParticlesProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  active?: boolean;
}

export function DataFlowParticles({ start, end, color = '#06b6d4', active = true }: DataFlowParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      positions[i * 3] = start[0] + (end[0] - start[0]) * t;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
    }

    return positions;
  }, [start, end]);

  useFrame((state) => {
    if (groupRef.current && active) {
      // Animate particles along the path
      const offset = (state.clock.elapsedTime * 2) % 1;

      const geometry = groupRef.current.children[0] as THREE.Points;
      if (geometry?.geometry) {
        const positions = geometry.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < 20; i++) {
          const t = ((i / 20) + offset) % 1;
          positions[i * 3] = start[0] + (end[0] - start[0]) * t;
          positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t + Math.sin(state.clock.elapsedTime * 5 + i) * 0.1;
          positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
        }

        geometry.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={particles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={20}
            array={new Float32Array(20 * 3).fill(0.5)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.1}
          transparent
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}