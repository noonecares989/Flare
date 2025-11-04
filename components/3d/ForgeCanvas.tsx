'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Effects, Bloom } from '@react-three/drei';
import { LoadingOverlay } from './LoadingOverlay';
import { ParticleSystem } from './ParticleSystem';
import { AgentVisualizations } from './AgentVisualizations';
import { HolographicEffect } from './HolographicEffect';
import { AgentType } from '@/lib/ai/agentConfigs';

interface ForgeCanvasProps {
  projectId: string;
  sessionId: string;
  initialData?: any;
}

export function ForgeCanvas({ projectId, sessionId, initialData }: ForgeCanvasProps) {
  const [agents, setAgents] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);

  useEffect(() => {
    // Simulate agent activity
    if (isBuilding) {
      const mockAgents = [
        {
          id: '1',
          agentType: AgentType.PLANNER,
          position: [-8, 2, 0] as [number, number, number],
          status: 'working' as const,
          progress: 0.7,
          color: '#8b5cf6',
        },
        {
          id: '2',
          agentType: AgentType.FRONTEND_CODER,
          position: [0, 2, 0] as [number, number, number],
          status: 'working' as const,
          progress: 0.4,
          color: '#22c55e',
        },
        {
          id: '3',
          agentType: AgentType.BACKEND_CODER,
          position: [8, 2, 0] as [number, number, number],
          status: 'idle' as const,
          progress: 0,
          color: '#f59e0b',
        },
      ];
      setAgents(mockAgents);
    }
  }, [isBuilding]);

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
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 10, 0]} intensity={0.8} color="#8b5cf6" />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#22c55e" />
          <pointLight position={[10, 5, 10]} intensity={0.5} color="#f59e0b" />

          {/* Advanced Particle Systems */}
          <ParticleSystem
            count={2000}
            area={[30, 20, 30]}
            color="#8b5cf6"
            speed={0.5}
            intensity={0.6}
            type="ambient"
            active={true}
          />

          {isBuilding && (
            <>
              <ParticleSystem
                count={500}
                area={[20, 15, 20]}
                color="#22c55e"
                speed={2}
                intensity={1}
                type="code-flow"
                active={true}
              />

              <ParticleSystem
                count={300}
                area={[15, 15, 15]}
                color="#06b6d4"
                speed={1.5}
                intensity={0.8}
                type="data-stream"
                active={true}
              />
            </>
          )}

          {/* Core Application Components with Holographic Effects */}
          <group position={[0, 0, 0]}>
            {/* Frontend Component */}
            <mesh position={[-6, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[3, 3, 1]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={isBuilding ? 0.4 : 0.1}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {isBuilding && (
              <HolographicEffect
                position={[-6, 0, 0]}
                scale={[3.5, 3.5, 1.5]}
                color="#22c55e"
                intensity={0.3}
                animated={true}
              />
            )}

            {/* Backend Component */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2, 2, 3, 8]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={isBuilding ? 0.4 : 0.1}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {isBuilding && (
              <HolographicEffect
                position={[0, 0, 0]}
                scale={[2.5, 2.5, 3.5]}
                color="#f59e0b"
                intensity={0.3}
                animated={true}
              />
            )}

            {/* Database Component */}
            <mesh position={[6, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={isBuilding ? 0.4 : 0.1}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {isBuilding && (
              <HolographicEffect
                position={[6, 0, 0]}
                scale={[2.5, 2.5, 2.5]}
                color="#06b6d4"
                intensity={0.3}
                animated={true}
              />
            )}
          </group>

          {/* Agent Visualizations */}
          {agents.length > 0 && (
            <AgentVisualizations
              agents={agents}
              onAgentClick={(agentId) => console.log('Agent clicked:', agentId)}
            />
          )}

          {/* Ground Platform */}
          <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#0a0a0f" roughness={0.8} />
          </mesh>

          {/* Post-processing Effects */}
          <Effects>
            <Bloom
              intensity={isBuilding ? 0.8 : 0.3}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </Effects>

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Environment */}
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
          <h3 className="font-semibold mb-2 flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isBuilding ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            3D AI Workspace
          </h3>
          <div className="text-sm space-y-1 text-gray-300">
            <p>🖱️ Scroll to zoom</p>
            <p>🔄 Drag to rotate</p>
            <p>✋ Right-click to pan</p>
            {isBuilding && <p className="text-green-400 animate-pulse">🤖 Agents are working...</p>}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={() => setIsBuilding(!isBuilding)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isBuilding ? '⏸️ Pause Building' : '🚀 Start Building'}
        </button>
      </div>

      {/* Agent Status Panel */}
      {agents.length > 0 && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
            <h4 className="font-semibold mb-3">Active Agents</h4>
            <div className="space-y-2 text-sm">
              {agents.map((agent: any) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: agent.color }}
                    />
                    {agent.agentType.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    agent.status === 'working' ? 'bg-yellow-500/20 text-yellow-400' :
                    agent.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay />
    </div>
  );
}