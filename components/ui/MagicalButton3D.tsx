'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Crown, Star } from 'lucide-react';

interface MagicalButton3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'enchantment' | 'transmutation' | 'illusion' | 'protection' | 'divination' | 'powerful';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  enable3D?: boolean;
}

export const MagicalButton3D = forwardRef<HTMLButtonElement, MagicalButton3DProps>(
  ({ children, onClick, variant = 'enchantment', size = 'md', disabled = false, className = '', enable3D = true }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const variantConfig = {
      enchantment: {
        gradient: 'from-purple-600 via-pink-600 to-violet-600',
        shadowColor: 'rgba(139, 92, 246, 0.5)',
        particleColor: '#8b5cf6',
        icon: Sparkles
      },
      transmutation: {
        gradient: 'from-green-600 via-teal-600 to-emerald-600',
        shadowColor: 'rgba(34, 197, 94, 0.5)',
        particleColor: '#22c55e',
        icon: Zap
      },
      illusion: {
        gradient: 'from-blue-600 via-cyan-600 to-sky-600',
        shadowColor: 'rgba(59, 130, 246, 0.5)',
        particleColor: '#3b82f6',
        icon: Star
      },
      protection: {
        gradient: 'from-amber-600 via-orange-600 to-yellow-600',
        shadowColor: 'rgba(245, 158, 11, 0.5)',
        particleColor: '#f59e0b',
        icon: Crown
      },
      divination: {
        gradient: 'from-pink-600 via-red-600 to-rose-600',
        shadowColor: 'rgba(236, 72, 153, 0.5)',
        particleColor: '#ec4899',
        icon: Star
      },
      powerful: {
        gradient: 'from-red-600 via-orange-600 to-yellow-600',
        shadowColor: 'rgba(239, 68, 68, 0.5)',
        particleColor: '#ef4444',
        icon: Crown
      }
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-12 py-6 text-xl'
    };

    const createParticles = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width,
        y: rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height
      }));

      setParticles(newParticles);

      // Remove particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    };

    const handleClick = (e: React.MouseEvent) => {
      if (disabled) return;
      setIsPressed(true);
      createParticles();
      onClick?.();

      setTimeout(() => setIsPressed(false), 200);
    };

    useEffect(() => {
      if (isHovered && enable3D) {
        const interval = setInterval(() => {
          setParticles(prev => {
            if (prev.length > 30) return prev.slice(1);

            const button = buttonRef.current;
            if (!button) return prev;

            const rect = button.getBoundingClientRect();
            return [...prev, {
              id: Date.now(),
              x: rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 1.5,
              y: rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 1.5
            }];
          });
        }, 100);

        return () => clearInterval(interval);
      }
    }, [isHovered, enable3D]);

    return (
      <>
        <motion.button
          ref={buttonRef}
          className={`
            relative overflow-hidden
            ${sizeClasses[size]}
            font-semibold rounded-xl
            text-white shadow-lg
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${enable3D ? 'transform-gpu' : ''}
            ${className}
          `}
          style={{
            background: `linear-gradient(135deg, ${config.gradient})`,
            boxShadow: isHovered
              ? `0 20px 40px ${config.shadowColor}, 0 0 60px ${config.shadowColor}`
              : `0 10px 20px ${config.shadowColor}`,
            transform: enable3D ? `
              perspective(1000px)
              rotateX(${isPressed ? '5deg' : isHovered ? '-2deg' : '0deg'})
              rotateY(${isHovered ? '2deg' : '0deg'})
              translateZ(${isHovered ? '10px' : '0px'})
              scale(${isPressed ? '0.95' : isHovered ? '1.05' : '1'})
            ` : `scale(${isPressed ? '0.95' : isHovered ? '1.02' : '1'})`
          }}
          whileHover={{ scale: enable3D ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleClick}
          disabled={disabled}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-xl bg-white/20 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Icon
              className={`${
                size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-5 w-5' :
                size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'
              } ${isHovered ? 'animate-spin' : ''}`}
              style={{
                animationDuration: '3s'
              }}
            />
            <span>{children}</span>
          </div>

          {/* Pulsing border */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/30"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: particle.x,
              top: particle.y,
              color: config.particleColor
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
              y: [0, -30, -60],
              x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          >
            <Icon className="h-3 w-3" />
          </motion.div>
        ))}
      </>
    );
  }
);

MagicalButton3D.displayName = 'MagicalButton3D';