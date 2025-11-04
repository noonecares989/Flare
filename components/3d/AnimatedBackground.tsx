'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeDAnimationSystem } from '@/lib/3d/animationSystem';

interface AnimatedBackgroundProps {
  colorScheme?: 'magical' | 'cyber' | 'nature' | 'fire';
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  className?: string;
}

export function AnimatedBackground({
  colorScheme = 'magical',
  intensity = 'medium',
  interactive = false,
  className = ''
}: AnimatedBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationSystemRef = useRef<ThreeDAnimationSystem | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const config = {
      enableOrbitControls: interactive,
      enableBloom: intensity !== 'low',
      enableParticles: true,
      enableFloating: intensity !== 'low',
      enableRotation: true,
      particleCount: intensity === 'high' ? 2000 : intensity === 'medium' ? 1000 : 500,
      colorScheme
    };

    try {
      animationSystemRef.current = new ThreeDAnimationSystem(mountRef.current, config);
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize 3D animation system:', error);
    }

    return () => {
      if (animationSystemRef.current) {
        animationSystemRef.current.dispose();
      }
    };
  }, [colorScheme, intensity, interactive]);

  useEffect(() => {
    if (animationSystemRef.current && isReady) {
      animationSystemRef.current.changeColorScheme(colorScheme);
    }
  }, [colorScheme, isReady]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg,
            ${colorScheme === 'magical' ? '#1a1a2e' :
              colorScheme === 'cyber' ? '#0a0a0a' :
              colorScheme === 'nature' ? '#064e3b' : '#7c2d12'} 0%,
            ${colorScheme === 'magical' ? '#16213e' :
              colorScheme === 'cyber' ? '#1a1a1a' :
              colorScheme === 'nature' ? '#065f46' : '#92400e'} 100%)`
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-lg">Initializing magical environment...</div>
        </div>
      )}
    </div>
  );
}

// Hook for creating particle explosions
export function useParticleExplosion() {
  const animationSystemRef = useRef<ThreeDAnimationSystem | null>(null);

  const triggerExplosion = (x: number, y: number, z: number) => {
    if (animationSystemRef.current) {
      animationSystemRef.current.addExplosion(x, y, z);
    }
  };

  return {
    setAnimationSystem: (system: ThreeDAnimationSystem) => {
      animationSystemRef.current = system;
    },
    triggerExplosion
  };
}