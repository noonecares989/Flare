'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, PresentationControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Settings,
  Rocket,
  Save,
  Download,
  Eye,
  Zap,
  Globe,
  Smartphone,
  Layers,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';

interface Web3DGeneratorProps {
  config: any;
  onPreview: (preview: any) => void;
  onSave: (config: any) => void;
  className?: string;
}

// 3D Components
function FloatingWebsite({ url, position = [0, 0, 0], scale = 1 }: {
  url: string;
  position?: [number, number, number];
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;

      if (hovered) {
        meshRef.current.scale.setScalar(scale * 1.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#8b5cf6' : '#6366f1'}
          emissive={hovered ? '#8b5cf6' : '#6366f1'}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
        />
        <Html
          position={[0, 0, 0.06]}
          center
          transform
          occlude
          className="pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-md rounded p-2">
            <iframe
              src={url}
              className="w-48 h-36 rounded"
              title="Website Preview"
            />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function TechStack3D({ technologies }: { technologies: string[] }) {
  return (
    <group>
      {technologies.map((tech, index) => {
        const angle = (index / technologies.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={tech} position={[x, 0, z]}>
            <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.3}
              roughness={0.2}
              metalness={0.9}
            />
            <Html
              position={[0, 0, 0.16]}
              center
              transform
              occlude
              className="pointer-events-none"
            >
              <div className="text-xs text-white font-mono bg-purple-600/80 px-2 py-1 rounded">
                {tech}
              </div>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}

function PerformanceMetrics3D({ metrics }: { metrics: any }) {
  const { camera } = useThree();

  return (
    <group position={[0, 3, 0]}>
      {Object.entries(metrics).map(([key, value], index) => {
        const x = (index - Object.keys(metrics).length / 2) * 2;
        const height = (value as number) / 10;
        const color = value > 80 ? '#22c55e' : value > 60 ? '#eab308' : '#ef4444';

        return (
          <group key={key} position={[x, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            <Html
              position={[0, height + 0.6, 0]}
              center
              transform
              occlude
            >
              <div className="text-center">
                <div className="text-xs text-white font-bold bg-black/80 backdrop-blur-md px-2 py-1 rounded">
                  {key}
                </div>
                <div className="text-lg text-white font-bold bg-black/80 backdrop-blur-md px-2 py-1 rounded mt-1">
                  {value}%
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function AnimatedBackground() {
  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = new Array(1000).fill(null).map(() => ({
    position: [
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50
    ],
    color: new THREE.Color(
      Math.random() * 0.5 + 0.5,
      Math.random() * 0.5 + 0.5,
      1
    )
  }));

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => [
            p.color.r, p.color.g, p.color.b
          ]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export function Web3DGenerator({ config, onPreview, onSave, className = '' }: Web3DGeneratorProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'features' | 'performance'>('overview');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockMetrics = {
    Performance: 92,
    SEO: 88,
    Accessibility: 95,
    BestPractices: 90,
    Mobile: 87
  };

  const mockFeatures = [
    'Responsive Design',
    'Real-time Updates',
    'Advanced Animations',
    'AI Integration',
    '3D Visualization',
    'Performance Optimized'
  ];

  const generateWebsite = async () => {
    setIsGenerating(true);
    // Simulate website generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">3D Web Generator</h2>
                <p className="text-sm text-gray-300">Preview your billion-dollar website in 3D</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-gray-600 text-gray-300"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('overview')}
                  className={`border-gray-600 text-gray-300 ${
                    currentView === 'overview' ? 'bg-purple-600 border-purple-600' : ''
                  }`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('features')}
                  className={`border-gray-600 text-gray-300 ${
                    currentView === 'features' ? 'bg-purple-600 border-purple-600' : ''
                  }`}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Features
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('performance')}
                  className={`border-gray-600 text-gray-300 ${
                    currentView === 'performance' ? 'bg-purple-600 border-purple-600' : ''
                  }`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Performance
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={generateWebsite}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Generate Website
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [15, 10, 15], fov: 60 }}
            shadows
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.5,
            }}
          >
            <Suspense fallback={null}>
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <pointLight position={[0, 10, 0]} intensity={0.5} color="#8b5cf6" />
              <pointLight position={[-10, 5, -10]} intensity={0.3} color="#22c55e" />
              <pointLight position={[10, 5, 10]} intensity={0.3} color="#f59e0b" />

              {/* Background */}
              <AnimatedBackground />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

              {/* Main Content */}
              {currentView === 'overview' && (
                <>
                  <FloatingWebsite
                    url="https://example.com"
                    position={[0, 0, 0]}
                    scale={1.2}
                  />
                  <TechStack3D technologies={['React', 'Node.js', 'PostgreSQL', 'Redis']} />
                </>
              )}

              {currentView === 'features' && (
                <group>
                  {mockFeatures.map((feature, index) => {
                    const angle = (index / mockFeatures.length) * Math.PI * 2;
                    const radius = 6;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;

                    return (
                      <FloatingWebsite
                        key={feature}
                        url="https://example.com"
                        position={[x, 0, z]}
                        scale={0.8}
                      />
                    );
                  })}
                </group>
              )}

              {currentView === 'performance' && (
                <PerformanceMetrics3D metrics={mockMetrics} />
              )}

              {/* Camera Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2}
                autoRotate={isPlaying}
                autoRotateSpeed={0.5}
              />

              {/* Environment */}
              <Environment preset="city" background={false} />
            </Suspense>
          </Canvas>

          {/* UI Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <Card className="bg-black/60 backdrop-blur-md border border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-2">3D Preview</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>🖱️ Scroll to zoom</p>
                  <p>🔄 Drag to rotate</p>
                  <p>✋ Right-click to pan</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <Card className="bg-black/60 backdrop-blur-md border border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-2">
                  {config.projectName || 'Untitled Project'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {config.frontendFramework || 'Next.js'}
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {config.database || 'PostgreSQL'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p>Performance Score: <span className="text-green-400 font-bold">92%</span></p>
                    <p>SEO Score: <span className="text-blue-400 font-bold">88%</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
              <Card className="bg-black/80 border border-purple-500">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Generating Your 3D Website
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Our AI is creating an immersive 3D experience...
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                <span className="font-semibold text-white">AI-Powered 3D Generation</span>
                <span className="mx-2">•</span>
                <span>Advanced WebGL Rendering</span>
                <span className="mx-2">•</span>
                <span>Real-time Preview</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(config)}
                className="border-gray-600 text-gray-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => onSave(config)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}