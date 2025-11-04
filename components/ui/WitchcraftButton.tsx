'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Wand2 } from 'lucide-react';

interface WitchcraftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'magical' | 'ancient' | 'powerful' | 'subtle';
  spellType?: 'illusion' | 'transmutation' | 'enchantment' | 'protection' | 'divination';
  glowing?: boolean;
  casting?: boolean;
  shimmer?: boolean;
  particles?: boolean;
  onClick?: () => void;
}

export function WitchcraftButton({
  variant = 'magical',
  spellType = 'enchantment',
  glowing = true,
  shimmer = true,
  particles = true,
  casting = false,
  className = '',
  children,
  ...props
}: WitchcraftButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [spellEffect, setSpellEffect] = useState('');

  const handleMouseEnter = () => {
    setIsHovered(true);
    setSpellEffect('magical-appear');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSpellEffect('magical-disappear');
  };

  const handleMouseDown = () => {
    setIsCasting(true);
    setSpellEffect('spell-cast');
    setTimeout(() => setIsCasting(false), 500);
  };

  // Generate magical colors based on variant
  const getMagicalColors = (variant: string, spellType: string) => {
    const baseColors = {
      default: {
        illusion: 'from-purple-600 via-pink-600 to-violet-600',
        transmutation: 'from-green-600 via-teal-600 to-emerald-600',
        enchantment: 'from-blue-600 via-cyan-600 to-sky-600',
        protection: 'from-amber-600 via-orange-600 to-yellow-600',
        divination: 'from-pink-600 via-red-600 to-rose-600',
        powerful: 'from-red-600 via-orange-600 to-yellow-600'
      },
      magical: {
        illusion: 'from-purple-700 via-pink-700 to-indigo-700',
        transmutation: 'from-green-700 via-emerald-700 to-teal-700',
        enchantment: 'from-blue-700 via-cyan-700 to-azure-700',
        protection: 'from-amber-700 via-orange-700 to-yellow-700',
        divination: 'from-pink-700 via-red-700 to-rose-700',
        powerful: 'from-red-700 via-orange-700 to-yellow-700'
      },
      ancient: {
        illusion: 'from-purple-800 via-pink-800 to-violet-800',
        transmutation: 'from-green-800 via-teal-800 to-emerald-800',
        enchantment: 'from-blue-800 via-cyan-800 to-sky-800',
        protection: 'from-amber-800 via-orange-800 to-yellow-800',
        divination: 'from-pink-800 via-red-800 to-rose-800',
        powerful: 'from-red-800 via-orange-800 to-yellow-800'
      }
    };

    const colors = baseColors[variant]?.[spellType] || baseColors.default;

    return colors;
  };

  const magicalColors = getMagicalColors(variant, spellType);

  const getSpellIcon = () => {
    const icons = {
      illusion: '🌟',
      transmutation: '🔄',
      enchantment: '✨',
      protection: '🛡️',
      divination: '🔮',
      powerful: '⚡'
    };
    return icons[spellType] || '✨';
  };

  return (
    <Button
      className={\`
        relative overflow-hidden
        transition-all duration-300
        ${glowing ? 'animate-pulse' : ''}
        ${shimmer ? 'animate-shimmer' : ''}
        ${casting ? 'animate-bounce' : ''}
        ${glowing ? 'shadow-lg' : 'shadow-md'}
        ${magicalColors}
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${spellEffect}
        ${className}
      \`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {/* Particle effects */}
      {particles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-0 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}

      {/* Magical glow */}
      {glowing && (
        <div className="absolute inset-0 opacity-0 animate-pulse">
          <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-lg" />
        </div>
      )}

      {/* Button content */}
      <div className="relative z-10 flex items-center gap-2">
        {getSpellIcon()}
        <span className="font-semibold">
          {children}
        </span>
      </div>

      {/* Casting animation */}
      {casting && (
        <div className="absolute inset-0 opacity-0">
          <div className="absolute inset-0 bg-white/20 rounded-lg animate-rotate-180" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-transparent animate-pulse" />
        </div>
      )}
    </Button>
  );
}

// Specialized buttons for magical effects
export function SpellBookButton({ children, onClick, className = '', ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <WitchcraftButton
      variant="ancient"
      spellType="enchantment"
      glowing={true}
      shimmer={true}
      particles={true}
      className={`font-serif ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className="text-xl">📖</span>
        <span>{children}</span>
      </span>
    </WitchcraftButton>
  );
}

export function CrystalBallButton({ children, onClick, className = '', ...props }: {
  return (
    <WitchcraftButton
      variant="powerful"
      spellType="protection"
      glowing={true}
      shimmer={true}
      className={`font-serif ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className="text-xl">💎�</span>
        <span>{children}</span>
      </span>
    </WitchcraftButton>
  );
}

export class MagicalText {
  private text: string;
  private currentIndex = 0;
  private isTyping = false;

  constructor(text: string) {
    this.text = text;
  }

  type() {
    if (!this.isTyping) {
      this.startTyping();
      return this.type();
    }
    return this.text.slice(0, this.currentIndex);
  }

  startTyping() {
    this.isTyping = true;
    this.currentIndex = 0;
    this.type();
  }

  stopTyping() {
    this.isTyping = false;
  }

  private type() {
    if (this.currentIndex < this.text.length) {
      const currentChar = this.text[this.currentIndex];
      this.currentIndex++;
      return currentChar;
    }
    return '';
  }

  static create(text: string): MagicalText {
    return new MagicalText(text);
  }
}