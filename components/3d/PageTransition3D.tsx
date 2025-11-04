'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransition3DProps {
  children: React.ReactNode;
  isVisible: boolean;
  onExitComplete?: () => void;
}

export function PageTransition3D({ children, isVisible, onExitComplete }: PageTransition3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      // Trigger entrance animation
      const particles = createParticles(containerRef.current);

      return () => {
        particles.forEach(p => p.remove());
      };
    }
  }, [isVisible]);

  const createParticles = (container: HTMLElement) => {
    const particles: HTMLDivElement[] = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-purple-400 rounded-full';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animation = `float ${2 + Math.random() * 2}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(particle);
      particles.push(particle);
    }

    return particles;
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
          transition={{
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1]
          }}
          onAnimationComplete={onExitComplete}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* 3D shadow effect */}
          <motion.div
            className="absolute inset-0 bg-black/20 rounded-2xl"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Particle burst effect on entrance */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 10px #8b5cf6'
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 100,
                  y: Math.sin((i * 30) * Math.PI / 180) * 100,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Glowing border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-purple-400/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.01, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add custom CSS animation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) translateX(0px);
        opacity: 0.8;
      }
      25% {
        transform: translateY(-20px) translateX(10px);
        opacity: 1;
      }
      50% {
        transform: translateY(-10px) translateX(-10px);
        opacity: 0.9;
      }
      75% {
        transform: translateY(-30px) translateX(5px);
        opacity: 0.7;
      }
    }
  `;
  document.head.appendChild(style);
}