'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Wand2, Heart } from 'lucide-react';

interface MagicalCard3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'enchantment' | 'protection' | 'divination' | 'powerful';
  interactive?: boolean;
  glow?: boolean;
  floating?: boolean;
}

export function MagicalCard3D({
  children,
  className = '',
  variant = 'enchantment',
  interactive = true,
  glow = true,
  floating = true
}: MagicalCard3DProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const variantConfig = {
    enchantment: {
      gradient: 'from-purple-900/50 via-violet-900/30 to-indigo-900/50',
      borderGlow: 'border-purple-500/30',
      shadowGlow: 'shadow-purple-500/20',
      particleColor: '#8b5cf6',
      icon: Sparkles
    },
    protection: {
      gradient: 'from-amber-900/50 via-orange-900/30 to-yellow-900/50',
      borderGlow: 'border-amber-500/30',
      shadowGlow: 'shadow-amber-500/20',
      particleColor: '#f59e0b',
      icon: Shield
    },
    divination: {
      gradient: 'from-pink-900/50 via-rose-900/30 to-red-900/50',
      borderGlow: 'border-pink-500/30',
      shadowGlow: 'shadow-pink-500/20',
      particleColor: '#ec4899',
      icon: Heart
    },
    powerful: {
      gradient: 'from-red-900/50 via-orange-900/30 to-yellow-900/50',
      borderGlow: 'border-red-500/30',
      shadowGlow: 'shadow-red-500/20',
      particleColor: '#ef4444',
      icon: Wand2
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: x * 10, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      {glow && (
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.gradient} blur-xl opacity-50`}
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main card */}
      <motion.div
        ref={cardRef}
        className={`
          relative bg-black/60 backdrop-blur-md border rounded-2xl p-6
          transform-gpu transition-all duration-300
          ${config.borderGlow} ${className}
          ${interactive ? 'cursor-pointer' : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${config.gradient})`,
          boxShadow: isHovered
            ? `0 20px 40px ${config.shadowGlow}, 0 0 80px ${config.shadowGlow}`
            : `0 10px 20px ${config.shadowGlow}`,
          transform: interactive
            ? `
              perspective(1000px)
              rotateY(${mousePosition.x}deg)
              rotateX(${-mousePosition.y}deg)
              translateZ(${isHovered ? '20px' : '0px'})
            `
            : `translateZ(${floating ? '0px' : '0px'})`
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: floating ? -5 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >

        {/* Floating magical elements */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Icon
              className="h-6 w-6"
              style={{ color: config.particleColor }}
            />
          </motion.div>
        </div>

        {/* Particle effects */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: config.particleColor,
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 80}%`,
                  boxShadow: `0 0 10px ${config.particleColor}`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
          style={{ borderColor: config.particleColor }}
        />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
          style={{ borderColor: config.particleColor }}
        />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
          style={{ borderColor: config.particleColor }}
        />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
          style={{ borderColor: config.particleColor }}
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 opacity-30"
          style={{ borderColor: config.particleColor }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Floating particles around card */}
      {floating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: config.particleColor,
                boxShadow: `0 0 6px ${config.particleColor}`
              }}
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: 0
              }}
              animate={{
                x: [
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100
                ],
                y: [
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100
                ],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}