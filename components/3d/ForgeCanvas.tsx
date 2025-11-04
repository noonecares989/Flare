'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { LoadingOverlay } from './LoadingOverlay';

interface ForgeCanvasProps {
  projectId: string;
  sessionId: string;
  initialData?: any;
}

export function ForgeCanvas({ projectId, sessionId, initialData }: ForgeCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: 3, // ACES tone mapping
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

          {/* Temporary placeholder geometry */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          <mesh position={[6, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2, 2, 4, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          <mesh position={[-6, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Ground plane */}
          <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Environment */}
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">3D Workspace</h3>
          <div className="text-sm space-y-1">
            <p>Scroll to zoom</p>
            <p>Drag to rotate</p>
            <p>Right-click to pan</p>
          </div>
        </div>
      </div>

      <LoadingOverlay />
    </div>
  );
}