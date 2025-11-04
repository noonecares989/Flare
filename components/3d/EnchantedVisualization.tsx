'use client';

import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  PresentationControls,
  PerspectiveCamera,
  Stars,
  Text,
  Billboard,
  Sparkles,
  MeshDistortMaterial,
  shaderMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import {
  CrystalBall,
  Sparkles as SparklesIcon,
  Wand2,
  Star,
  Moon,
  Sun,
  Zap,
  Flame,
  Droplets,
  Wind,
  Mountain
} from 'lucide-react';

// Custom shader material for magical effects
const MagicalShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0x8b5cf6),
    glowIntensity: 1.0,
    magicalEnergy: 1.0
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistort;

    uniform float time;
    uniform float magicalEnergy;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;

      // Magical distortion effect
      float distort = sin(position.x * 10.0 + time) * sin(position.y * 10.0 + time) * 0.1;
      vDistort = distort;

      vec3 newPosition = position + normal * distort * magicalEnergy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float glowIntensity;
    uniform float magicalEnergy;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistort;

    void main() {
      // Magical glow effect
      float glow = glowIntensity * (1.0 + sin(time * 2.0) * 0.5);

      // Color shifting based on magical energy
      vec3 magicalColor = color + vec3(
        sin(time) * 0.2,
        sin(time * 1.3) * 0.2,
        sin(time * 0.7) * 0.2
      ) * magicalEnergy;

      // Edge detection for magical outline
      float edge = max(0.0, 1.0 - abs(vDistort) * 10.0);

      vec3 finalColor = magicalColor * glow + edge * vec3(1.0);
      float alpha = 0.8 + sin(time) * 0.2;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ MagicalShaderMaterial });

interface MagicalCrystalProps {
  position?: [number, number, number];
  scale?: number;
  color?: THREE.Color;
  spellType?: string;
  isActivated?: boolean;
}

function MagicalCrystal({
  position = [0, 0, 0],
  scale = 1,
  color = new THREE.Color(0x8b5cf6),
  spellType = 'default',
  isActivated = false
}: MagicalCrystalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Magical floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3;

      // Rotation based on spell type
      const rotationSpeed = isActivated ? 0.02 : 0.005;
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 1.3;

      // Scale pulsing
      const pulseScale = scale + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(pulseScale);
    }

    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.magicalEnergy = isActivated ? 2.0 : 1.0;
      materialRef.current.glowIntensity = isActivated ? 2.0 : 1.0;
    }
  });

  const getCrystalGeometry = () => {
    switch (spellType) {
      case 'react': return <octahedronGeometry args={[1, 0]} />;
      case 'api': return <tetrahedronGeometry args={[1, 0]} />;
      case 'database': return <dodecahedronGeometry args={[1, 0]} />;
      case 'security': return <icosahedronGeometry args={[1, 0]} />;
      default: return <octahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {getCrystalGeometry()}
        <magicalShaderMaterial
          ref={materialRef}
          color={color}
          glowIntensity={1.0}
          magicalEnergy={1.0}
        />
      </mesh>
    </Float>
  );
}

interface MagicalOrbProps {
  position?: [number, number, number];
  energy: number;
  color?: THREE.Color;
  pulseSpeed?: number;
}

function MagicalOrb({
  position = [0, 0, 0],
  energy,
  color = new THREE.Color(0x8b5cf6),
  pulseSpeed = 1.0
}: MagicalOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Energy-based pulsing
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2 * energy;
      meshRef.current.scale.setScalar(pulse);

      // Rotation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5 * energy}
        roughness={0.1}
        metalness={0.9}
      />
      <Sparkles count={20 * energy} scale={[1, 2, 1]} speed={0.5} />
    </mesh>
  );
}

interface MagicalParticlesProps {
  position?: [number, number, number];
  count?: number;
  color?: THREE.Color;
}

function MagicalParticles({
  position = [0, 0, 0],
  count = 100,
  color = new THREE.Color(0x8b5cf6)
}: MagicalParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count, color]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface MagicalRuneProps {
  position?: [number, number, number];
  text: string;
  color?: THREE.Color;
  size?: number;
}

function MagicalRune({
  position = [0, 0, 0],
  text,
  color = new THREE.Color(0x8b5cf6),
  size = 1
}: MagicalRuneProps) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Billboard position={position}>
      <Text
        ref={textRef}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/magical-runes.woff"
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Text>
    </Billboard>
  );
}

interface ElementalMagicProps {
  position?: [number, number, number];
  elementType: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  intensity?: number;
}

function ElementalMagic({
  position = [0, 0, 0],
  elementType,
  intensity = 1.0
}: ElementalMagicProps) {
  const groupRef = useRef<THREE.Group>(null);

  const getElementalProperties = () => {
    switch (elementType) {
      case 'fire':
        return {
          color: new THREE.Color(0xff6b35),
          particleCount: 50,
          speed: 2.0,
          size: 0.1
        };
      case 'water':
        return {
          color: new THREE.Color(0x4fc3f7),
          particleCount: 40,
          speed: 0.5,
          size: 0.15
        };
      case 'earth':
        return {
          color: new THREE.Color(0x8d6e63),
          particleCount: 30,
          speed: 0.1,
          size: 0.2
        };
      case 'air':
        return {
          color: new THREE.Color(0xb39ddb),
          particleCount: 60,
          speed: 3.0,
          size: 0.05
        };
      case 'aether':
        return {
          color: new THREE.Color(0xe1bee7),
          particleCount: 80,
          speed: 1.5,
          size: 0.08
        };
      default:
        return {
          color: new THREE.Color(0x8b5cf6),
          particleCount: 40,
          speed: 1.0,
          size: 0.1
        };
    }
  };

  const props = getElementalProperties();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01 * props.speed;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: props.particleCount }).map((_, i) => {
        const angle = (i / props.particleCount) * Math.PI * 2;
        const radius = 2 + Math.sin(state.clock.elapsedTime + i) * 0.5;
        const height = Math.sin(state.clock.elapsedTime * props.speed + i * 0.1) * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[props.size, 8, 8]} />
            <meshStandardMaterial
              color={props.color}
              emissive={props.color}
              emissiveIntensity={0.8 * intensity}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface EnchantedVisualizationProps {
  projectData?: any;
  activeSpells?: string[];
  magicalEnergy?: number;
  className?: string;
}

export function EnchantedVisualization({
  projectData,
  activeSpells = [],
  magicalEnergy = 1.0,
  className = ''
}: EnchantedVisualizationProps) {
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const crystals = useMemo(() => [
    { id: 'react', position: [-4, 0, 0] as [number, number, number], color: new THREE.Color(0x61dafb), spellType: 'react' },
    { id: 'api', position: [0, 0, 0] as [number, number, number], color: new THREE.Color(0xff6b35), spellType: 'api' },
    { id: 'database', position: [4, 0, 0] as [number, number, number], color: new THREE.Color(0x4caf50), spellType: 'database' },
    { id: 'security', position: [0, 3, 0] as [number, number, number], color: new THREE.Color(0xf44336), spellType: 'security' }
  ], []);

  return (
    <div className={`h-full bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CrystalBall className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Enchanted 3D Visualization</h2>
                <p className="text-sm text-purple-300">Witness your magical creation take form</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Magical Energy</div>
                <div className="text-sm font-mono text-purple-400">
                  {Math.round(magicalEnergy * 100)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Active Spells</div>
                <div className="text-sm font-mono text-purple-400">
                  {activeSpells.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [10, 8, 10], fov: 60 }}
            shadows
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.5,
              alpha: true
            }}
          >
            <Suspense fallback={null}>
              {/* Magical Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                color={new THREE.Color(0x8b5cf6)}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <pointLight position={[0, 5, 0]} intensity={0.5} color={new THREE.Color(0xe1bee7)} />
              <pointLight position={[-10, 5, -10]} intensity={0.3} color={new THREE.Color(0x4fc3f7)} />
              <pointLight position={[10, 5, 10]} intensity={0.3} color={new THREE.Color(0xff6b35)} />

              {/* Magical Background */}
              <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
              <MagicalParticles count={200} color={new THREE.Color(0x8b5cf6)} />

              {/* Magical Crystals */}
              {crystals.map(crystal => (
                <MagicalCrystal
                  key={crystal.id}
                  position={crystal.position}
                  color={crystal.color}
                  spellType={crystal.spellType}
                  isActivated={activeSpells.includes(crystal.id)}
                  onClick={() => setSelectedCrystal(crystal.id)}
                />
              ))}

              {/* Central Magical Orb */}
              <MagicalOrb
                position={[0, 0, 0]}
                energy={magicalEnergy}
                color={new THREE.Color(0xe1bee7)}
              />

              {/* Elemental Magic */}
              <ElementalMagic position={[-6, 0, -6]} elementType="fire" intensity={magicalEnergy} />
              <ElementalMagic position={[6, 0, -6]} elementType="water" intensity={magicalEnergy} />
              <ElementalMagic position={[-6, 0, 6]} elementType="earth" intensity={magicalEnergy} />
              <ElementalMagic position={[6, 0, 6]} elementType="air" intensity={magicalEnergy} />
              <ElementalMagic position={[0, 6, 0]} elementType="aether" intensity={magicalEnergy} />

              {/* Magical Runes */}
              <MagicalRune position={[-4, -2, 0]} text="REACT" size={0.5} />
              <MagicalRune position={[0, -2, 0]} text="API" size={0.5} />
              <MagicalRune position={[4, -2, 0]} text="DATA" size={0.5} />
              <MagicalRune position={[0, 5, 0]} text="SECURE" size={0.5} />

              {/* Camera Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={30}
                maxPolarAngle={Math.PI / 2}
                autoRotate={isPlaying}
                autoRotateSpeed={0.5}
              />

              {/* Magical Environment */}
              <Environment preset="night" background={false} />
            </Suspense>
          </Canvas>

          {/* UI Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-400" />
                Magical Controls
              </h3>
              <div className="text-sm text-purple-300 space-y-1">
                <p>🖱️ Scroll to zoom</p>
                <p>🔄 Drag to rotate</p>
                <p>✋ Right-click to pan</p>
                <p>💎 Click crystals to activate</p>
              </div>
            </div>
          </div>

          {/* Crystal Information */}
          {selectedCrystal && (
            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-purple-500/20 rounded-lg p-4 max-w-xs">
                <h3 className="text-white font-semibold mb-2 capitalize">
                  {selectedCrystal} Crystal
                </h3>
                <div className="text-sm text-purple-300">
                  {selectedCrystal === 'react' && 'Transmutation magic for living components'}
                  {selectedCrystal === 'api' && 'Summoning spells for powerful endpoints'}
                  {selectedCrystal === 'database' && 'Enchantments for data organization'}
                  {selectedCrystal === 'security' && 'Protection wards for your application'}
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      {activeSpells.includes(selectedCrystal) ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Spells Display */}
          {activeSpells.length > 0 && (
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-400" />
                  Active Spells
                </h3>
                <div className="flex gap-2">
                  {activeSpells.map(spell => (
                    <div
                      key={spell}
                      className="px-3 py-1 bg-purple-600/20 border border-purple-400/30 rounded-full text-xs text-purple-300 capitalize"
                    >
                      {spell}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-300">
                <SparklesIcon className="h-4 w-4 inline mr-1" />
                Magical Visualization Active
              </div>
              <div className="text-sm text-purple-300">
                <Zap className="h-4 w-4 inline mr-1" />
                Energy Level: {Math.round(magicalEnergy * 100)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <span className="w-4 h-4 bg-white rounded-sm"></span>
                    Pause
                  </>
                ) : (
                  <>
                    <span className="w-0 h-0 border-l-8 border-r-0 border-y-4 border-transparent border-l-white"></span>
                    Play
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}