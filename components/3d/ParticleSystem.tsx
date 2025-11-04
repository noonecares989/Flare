'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, Vector3, Color } from 'three';

interface ParticleSystemProps {
  count?: number;
  area?: [number, number, number];
  color?: string;
  speed?: number;
  intensity?: number;
  type?: 'ambient' | 'code-flow' | 'data-stream' | 'agent-trail';
  active?: boolean;
}

export function ParticleSystem({
  count = 1000,
  area = [20, 20, 20],
  color = '#8b5cf6',
  speed = 1,
  intensity = 1,
  type = 'ambient',
  active = true
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const clockRef = useRef({ elapsed: 0 });

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const particleColor = new Color(color);

    for (let i = 0; i < count; i++) {
      // Position based on particle type
      if (type === 'code-flow') {
        // Code flow particles move in streams
        const streamIndex = Math.floor(i / (count / 8));
        positions[i * 3] = (Math.random() - 0.5) * area[0];
        positions[i * 3 + 1] = -area[1] / 2 + (streamIndex * area[1] / 8);
        positions[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      } else if (type === 'data-stream') {
        // Data stream particles in circular patterns
        const angle = (i / count) * Math.PI * 2;
        const radius = Math.random() * 5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * area[1];
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      } else {
        // Ambient particles - random distribution
        positions[i * 3] = (Math.random() - 0.5) * area[0];
        positions[i * 3 + 1] = (Math.random() - 0.5) * area[1];
        positions[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }

      // Color with variation
      const colorVariation = 0.3;
      colors[i * 3] = particleColor.r + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 1] = particleColor.g + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 2] = particleColor.b + (Math.random() - 0.5) * colorVariation;

      // Velocity based on type
      if (type === 'code-flow') {
        velocities[i * 3] = (Math.random() - 0.5) * speed * 0.1;
        velocities[i * 3 + 1] = speed; // Upward flow
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.1;
      } else if (type === 'data-stream') {
        velocities[i * 3] = -Math.sin((i / count) * Math.PI * 2) * speed;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 2] = Math.cos((i / count) * Math.PI * 2) * speed;
      } else {
        velocities[i * 3] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
      }

      // Size variation
      sizes[i] = Math.random() * 2 + 0.5;

      // Phase for animations
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new Float32BufferAttribute(phases, 1));

    return { geometry, velocities };
  }, [count, area, color, speed, type]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !active) return;

    clockRef.current.elapsed += delta;

    const positions = particles.geometry.attributes.position.array as Float32Array;
    const sizes = particles.geometry.attributes.size.array as Float32Array;
    const phases = particles.geometry.attributes.phase.array as Float32Array;
    const velocities = particles.velocities;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;

      // Boundary behavior based on type
      if (type === 'code-flow') {
        // Code flow particles wrap from top to bottom
        if (positions[i3 + 1] > area[1] / 2) {
          positions[i3 + 1] = -area[1] / 2;
          positions[i3] = (Math.random() - 0.5) * area[0];
          positions[i3 + 2] = (Math.random() - 0.5) * area[2];
        }
      } else if (type === 'data-stream') {
        // Data stream particles orbit
        const angle = Math.atan2(positions[i3 + 2], positions[i3]);
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
        positions[i3] = Math.cos(angle + delta * speed) * radius;
        positions[i3 + 2] = Math.sin(angle + delta * speed) * radius;
      } else {
        // Ambient particles bounce off boundaries
        if (Math.abs(positions[i3]) > area[0] / 2) {
          velocities[i3] *= -1;
          positions[i3] = Math.sign(positions[i3]) * area[0] / 2;
        }
        if (Math.abs(positions[i3 + 1]) > area[1] / 2) {
          velocities[i3 + 1] *= -1;
          positions[i3 + 1] = Math.sign(positions[i3 + 1]) * area[1] / 2;
        }
        if (Math.abs(positions[i3 + 2]) > area[2] / 2) {
          velocities[i3 + 2] *= -1;
          positions[i3 + 2] = Math.sign(positions[i3 + 2]) * area[2] / 2;
        }
      }

      // Add wave motion
      positions[i3 + 1] += Math.sin(clockRef.current.elapsed * 2 + phases[i]) * 0.01 * intensity;

      // Pulse size
      sizes[i] = (Math.sin(clockRef.current.elapsed * 3 + phases[i]) * 0.5 + 1.5) * intensity;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.size.needsUpdate = true;

    // Gentle rotation of the entire particle system
    if (type !== 'data-stream') {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  if (!active) return null;

  return (
    <Points ref={pointsRef} geometry={particles.geometry}>
      <PointMaterial
        transparent
        vertexColors
        size={2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={type === 'code-flow' ? 2 : 1} // Additive blending for code flow
        opacity={type === 'code-flow' ? 0.8 : 0.6}
      />
    </Points>
  );
}