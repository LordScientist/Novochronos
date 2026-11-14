import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Artifact } from '../../types/artifact';

interface ArtifactModelProps {
  artifact: Artifact;
  autoRotate?: boolean;
  highlightMechanical?: boolean; // When in intro spotlight mode
}

// GLTF model renderer with fallback to procedural geometry
const GLTFModelRenderer: React.FC<{
  path: string;
  artifact: Artifact;
  autoRotate?: boolean;
}> = ({ path, artifact, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(path);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    // If it's Ingenuity, spin the rotor blades
    if (artifact.id === 'ingenuity-helicopter' && groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('blade')) {
          child.rotation.y += delta * 12;
        }
      });
    }
  });

  // Deep clone scene to avoid sharing materials or mutating original cache
  const clonedScene = React.useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return (
    <group
      ref={groupRef}
      scale={artifact.modelScale}
      rotation={artifact.modelRotation}
      position={artifact.modelPosition}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Procedural high-fidelity models for artifacts without standalone GLB or as fallback
export const ProceduralArtifactModel: React.FC<{
  artifact: Artifact;
  autoRotate?: boolean;
}> = ({ artifact, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotorRef1 = useRef<THREE.Group>(null);
  const rotorRef2 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    if (rotorRef1.current) rotorRef1.current.rotation.y += delta * 15;
    if (rotorRef2.current) rotorRef2.current.rotation.y -= delta * 15;
  });

  switch (artifact.id) {
    case 'apollo-15-lrv':
      // Lunar Roving Vehicle: chassis, 2 seats, umbrella high-gain antenna, TV camera, wire wheels
      return (
        <group ref={groupRef} scale={[0.8, 0.8, 0.8]} position={[0, -0.1, 0]}>
          {/* Main Chassis Frame */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.8, 0.15, 1.0]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Floorboard */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.85]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* 2 Crew Seats */}
          <group position={[-0.1, 0.5, -0.2]}>
            <mesh>
              <boxGeometry args={[0.45, 0.5, 0.35]} />
              <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.8} />
            </mesh>
          </group>
          <group position={[-0.1, 0.5, 0.2]}>
            <mesh>
              <boxGeometry args={[0.45, 0.5, 0.35]} />
              <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.8} />
            </mesh>
          </group>
          {/* Central T-Bar Joystick */}
          <mesh position={[0.2, 0.55, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.2, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* 4 Open Wire-Mesh Wheels */}
          {[
            [-0.7, 0.25, 0.65],
            [0.7, 0.25, 0.65],
            [-0.7, 0.25, -0.65],
            [0.7, 0.25, -0.65],
          ].map(([x, y, z], idx) => (
            <group key={idx} position={[x, y, z]}>
              {/* Outer mesh tire rim */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.28, 0.08, 12, 24]} />
                <meshStandardMaterial color="#94a3b8" wireframe metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Wheel hub */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.15, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}
          {/* High-Gain Umbrella Dish Antenna on forward right mast */}
          <group position={[0.65, 0.8, -0.45]}>
            <mesh rotation={[0.4, 0, 0.3]}>
              <cylinderGeometry args={[0.4, 0.05, 0.1, 16, 1, true]} />
              <meshStandardMaterial color="#e2e8f0" wireframe metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
          {/* Color TV Camera */}
          <group position={[0.75, 0.65, 0.35]}>
            <mesh>
              <boxGeometry args={[0.15, 0.15, 0.2]} />
              <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        </group>
      );

    case 'sojourner-pathfinder':
      // Sojourner microrover: microwave-sized body, solar deck, 6 rocker-bogie wheels, APXS
      return (
        <group ref={groupRef} scale={[1.3, 1.3, 1.3]} position={[0, -0.15, 0]}>
          {/* Main Gold/Titanium Body Box */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.65, 0.22, 0.45]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Solar Panel Top Deck */}
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.62, 0.02, 0.42]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Front Stereo Camera Eyes */}
          <group position={[0.33, 0.28, 0]}>
            <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
          {/* Rear APXS Sensor Arm */}
          <group position={[-0.35, 0.18, 0]}>
            <mesh rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-0.1, -0.08, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
          {/* 6 Cleated Rocker-Bogie Wheels */}
          {[
            [-0.25, 0.1, 0.3],
            [0, 0.1, 0.32],
            [0.25, 0.1, 0.3],
            [-0.25, 0.1, -0.3],
            [0, 0.1, -0.32],
            [0.25, 0.1, -0.3],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
          {/* Miniature Rocker-Bogie Suspension Arms */}
          <mesh position={[0, 0.15, 0.26]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.55, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.15, -0.26]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.55, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      );

    case 'surveyor-3':
      // Surveyor 3: Tripod legs, center triangular truss, solar mast, scoop arm claw
      return (
        <group ref={groupRef} scale={[0.9, 0.9, 0.9]} position={[0, -0.2, 0]}>
          {/* Triangular Aluminum Space Frame */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.45, 0.5, 0.35, 3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} wireframe />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.3, 3]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* 3 Tripod Landing Struts with Round Footpads */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
            const x = Math.cos(angle) * 0.75;
            const z = Math.sin(angle) * 0.75;
            return (
              <group key={idx}>
                {/* Leg Strut */}
                <mesh position={[x * 0.5, 0.25, z * 0.5]} rotation={[0, -angle, 0.6]}>
                  <cylinderGeometry args={[0.025, 0.025, 0.75, 8]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* Footpad */}
                <mesh position={[x, 0.04, z]}>
                  <cylinderGeometry args={[0.12, 0.14, 0.04, 12]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
          {/* Vertical Center Mast */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Planar Solar Array Panel */}
          <mesh position={[0.2, 1.15, 0]} rotation={[0.4, 0, 0.5]}>
            <boxGeometry args={[0.45, 0.6, 0.02]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Omnidirectional High-Gain Antenna */}
          <mesh position={[-0.15, 1.25, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Motorized Soil Sampler Claw Arm */}
          <group position={[0.25, 0.35, 0.25]} rotation={[0.4, -0.6, 0]}>
            <mesh position={[0.2, -0.1, 0]} rotation={[0, 0, -0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Sampler Scoop Bucket */}
            <mesh position={[0.35, -0.28, 0]}>
              <boxGeometry args={[0.08, 0.06, 0.08]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
          {/* Vidicon TV Camera */}
          <group position={[-0.2, 0.65, 0.15]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.2, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.08, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </group>
      );

    default:
      // Generic procedural fallback representing spacecraft structure
      return (
        <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.2, 0.6, 0.9]} />
            <meshStandardMaterial color={artifact.accentColor} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.2, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );
  }
};

// Error Boundary wrapper for GLTF loading
class ModelErrorBoundary extends React.Component<
  { artifact: Artifact; autoRotate?: boolean; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ProceduralArtifactModel artifact={this.props.artifact} autoRotate={this.props.autoRotate} />;
    }
    return this.props.children;
  }
}

export const ArtifactModel: React.FC<ArtifactModelProps> = ({
  artifact,
  autoRotate = false,
}) => {
  if (artifact.modelPath) {
    return (
      <ModelErrorBoundary artifact={artifact} autoRotate={autoRotate}>
        <React.Suspense fallback={<ProceduralArtifactModel artifact={artifact} autoRotate={autoRotate} />}>
          <GLTFModelRenderer path={artifact.modelPath} artifact={artifact} autoRotate={autoRotate} />
        </React.Suspense>
      </ModelErrorBoundary>
    );
  }

  return <ProceduralArtifactModel artifact={artifact} autoRotate={autoRotate} />;
};
