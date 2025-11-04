'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box, Cylinder, Octahedron, Cone } from '@react-three/drei';
import { Mesh, Group, Vector3 } from 'three';
import { HolographicEffect } from './HolographicEffect';
import { DataFlowParticles } from './HolographicEffect';
import { AgentType } from '@/lib/ai/agentConfigs';

interface AgentVisualization3D {
  id: string;
  agentType: AgentType;
  position: [number, number, number];
  status: 'idle' | 'working' | 'complete' | 'error';
  progress: number;
  targetNode?: string;
  color?: string;
}

interface AgentVisualizationsProps {
  agents?: AgentVisualization3D[];
  onAgentClick?: (agentId: string) => void;
}

export function AgentVisualizations({ agents = [], onAgentClick }: AgentVisualizationsProps) {
  const groupRef = useRef<Group>(null);

  // Agent color scheme
  const agentColors = {
    [AgentType.PLANNER]: '#8b5cf6',      // Purple
    [AgentType.FRONTEND_CODER]: '#22c55e', // Green
    [AgentType.BACKEND_CODER]: '#f59e0b',  // Orange
    [AgentType.DB_DESIGNER]: '#06b6d4',    // Cyan
    [AgentType.TESTER]: '#ef4444',         // Red
    [AgentType.SECURITY_REVIEWER]: '#f97316', // Bright Orange
    [AgentType.UI_DESIGNER]: '#ec4899',    // Pink
    [AgentType.OPTIMIZER]: '#a855f7',      // Light Purple
    [AgentType.DEBUGGER]: '#fbbf24',       // Yellow
  };

  // Agent geometry mapping
  const AgentGeometry = ({ type, status, color }: { type: AgentType; status: string; color: string }) => {
    const props = {
      color,
      emissive: color,
      emissiveIntensity: status === 'working' ? 0.5 : 0.2,
      roughness: 0.3,
      metalness: 0.7,
    };

    switch (type) {
      case AgentType.PLANNER:
        return (
          <Cone args={[0.8, 1.5, 6]} {...props}>
            <meshStandardMaterial {...props} />
          </Cone>
        );
      case AgentType.FRONTEND_CODER:
        return (
          <Box args={[1.2, 1.2, 0.3]}>
            <meshStandardMaterial {...props} />
          </Box>
        );
      case AgentType.BACKEND_CODER:
        return (
          <Cylinder args={[0.6, 0.6, 1.5, 8]}>
            <meshStandardMaterial {...props} />
          </Cylinder>
        );
      case AgentType.DB_DESIGNER]:
        return (
          <Octahedron args={[0.8]}>
            <meshStandardMaterial {...props} />
          </Octahedron>
        );
      case AgentType.TESTER:
        return (
          <Box args={[0.5, 0.5, 1.5]}>
            <meshStandardMaterial {...props} />
          </Box>
        );
      case AgentType.SECURITY_REVIEWER:
        return (
          <Cone args={[0.7, 1.2, 4]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial {...props} />
          </Cone>
        );
      case AgentType.UI_DESIGNER:
        return (
          <Box args={[1, 1, 0.2]}>
            <meshStandardMaterial {...props} />
          </Box>
        );
      case AgentType.OPTIMIZER:
        return (
          <Octahedron args={[0.6]}>
            <meshStandardMaterial {...props} />
          </Octahedron>
        );
      case AgentType.DEBUGGER:
        return (
          <Sphere args={[0.6]}>
            <meshStandardMaterial {...props} />
          </Sphere>
        );
      default:
        return (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial {...props} />
          </Box>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {agents.map((agent) => (
        <AgentNode
          key={agent.id}
          agent={agent}
          color={agent.color || agentColors[agent.agentType]}
          onClick={() => onAgentClick?.(agent.id)}
        />
      ))}

      {/* Data flow connections between agents */}
      {agents.length > 1 && agents.map((agent, index) => {
        const nextAgent = agents[index + 1];
        if (nextAgent && agent.status === 'complete') {
          return (
            <DataFlowParticles
              key={`flow-${agent.id}-${nextAgent.id}`}
              start={agent.position}
              end={nextAgent.position}
              color={agent.color || agentColors[agent.agentType]}
              active={true}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

interface AgentNodeProps {
  agent: AgentVisualization3D;
  color: string;
  onClick: () => void;
}

function AgentNode({ agent, color, onClick }: AgentNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);

  // Agent-specific animations
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;

      if (agent.status === 'working') {
        // Rotation when working
        meshRef.current.rotation.y = time * 2;
        meshRef.current.position.y = agent.position[1] + Math.sin(time * 3) * 0.2;
      } else if (agent.status === 'error') {
        // Shake when error
        meshRef.current.rotation.x = Math.sin(time * 10) * 0.1;
        meshRef.current.rotation.z = Math.cos(time * 10) * 0.1;
      } else if (agent.status === 'complete') {
        // Gentle bounce when complete
        meshRef.current.position.y = agent.position[1] + Math.sin(time * 2) * 0.1;
      }

      // Scale based on hover and status
      const baseScale = hovered ? 1.2 : 1;
      const statusScale = agent.status === 'working' ? 1.1 : 1;
      const scale = baseScale * statusScale;
      meshRef.current.scale.setScalar(scale);
    }

    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  const getStatusIndicatorColor = () => {
    switch (agent.status) {
      case 'working': return '#f59e0b'; // Orange
      case 'complete': return '#22c55e'; // Green
      case 'error': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <group
      ref={groupRef}
      position={agent.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Agent geometry */}
      <mesh ref={meshRef}>
        <AgentGeometry type={agent.agentType} status={agent.status} color={color} />
      </mesh>

      {/* Status indicator */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial
          color={getStatusIndicatorColor()}
          emissive={getStatusIndicatorColor()}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Progress ring */}
      {agent.progress > 0 && agent.progress < 1 && (
        <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32, 0, Math.PI * 2 * agent.progress]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      )}

      {/* Agent label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {agent.agentType.replace('_', ' ').toUpperCase()}
      </Text>

      {/* Status text */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.3}
        color={getStatusIndicatorColor()}
        anchorX="center"
        anchorY="middle"
      >
        {agent.status.toUpperCase()}
      </Text>

      {/* Holographic effect when active */}
      {agent.status === 'working' && (
        <HolographicEffect
          position={[0, 0, 0]}
          scale={[1.5, 1.5, 1.5]}
          color={color}
          intensity={0.5}
          animated={true}
        />
      )}
    </group>
  );
}

// Agent trail effect for moving agents
interface AgentTrailProps {
  positions: [number, number, number][];
  color: string;
  active?: boolean;
}

export function AgentTrail({ positions, color, active = true }: AgentTrailProps) {
  const [trailGeometry, setTrailGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (positions.length < 2) return;

    const geometry = new THREE.BufferGeometry();
    const curve = new THREE.CatmullRomCurve3(positions.map(p => new Vector3(...p)));
    const points = curve.getPoints(50);

    const positionsArray = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      positionsArray[i * 3] = point.x;
      positionsArray[i * 3 + 1] = point.y;
      positionsArray[i * 3 + 2] = point.z;
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
    setTrailGeometry(geometry);

    return () => {
      geometry.dispose();
    };
  }, [positions]);

  if (!trailGeometry || !active) return null;

  return (
    <line>
      <bufferGeometry attach="geometry" {...trailGeometry} />
      <lineBasicMaterial
        color={color}
        opacity={0.6}
        transparent
        linewidth={2}
      />
    </line>
  );
}