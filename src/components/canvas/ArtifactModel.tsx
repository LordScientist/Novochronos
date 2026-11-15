import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Artifact } from '../../types/artifact';

// Configure local Draco decoder so all compressed models load reliably offline
useGLTF.setDecoderPath('/draco/');

// NASA GLB model registry mapped to local verified assets in /models/
export const NASA_GLB_MAP: Record<string, string> = {
  'opportunity-rover': '/models/opportunity.glb',
  'ingenuity-helicopter': '/models/ingenuity.glb',
  'apollo-11-descent': '/models/apollo-lunar-module.glb',
  'insight-lander': '/models/insight.glb',
  'pioneer-10': '/models/pioneer-10.glb',
};

// Calibrated realistic display scale hierarchy for each artifact
export const ARTIFACT_VISUAL_SCALE_MAP: Record<string, number> = {
  'apollo-11-descent': 3.3,     // Majestic, towering Apollo Lunar Module
  'insight-lander': 2.3,        // Wide circular solar array span
  'pioneer-10': 2.3,            // Large parabolic antenna dish
  'apollo-15-lrv': 2.1,         // Two-seater moon buggy
  'surveyor-3': 2.2,            // Tall tripod lunar scout
  'opportunity-rover': 1.85,    // Medium solar-winged exploration rover
  'ingenuity-helicopter': 1.25, // Compact, sleek scout drone
  'sojourner-pathfinder': 1.1,  // Compact historic pioneer rover
  'sojourner-rover': 1.1,
};

// Preload models with local Draco path
try {
  useGLTF.preload('/models/opportunity.glb', '/draco/');
  useGLTF.preload('/models/ingenuity.glb', '/draco/');
  useGLTF.preload('/models/apollo-lunar-module.glb', '/draco/');
  useGLTF.preload('/models/insight.glb', '/draco/');
  useGLTF.preload('/models/pioneer-10.glb', '/draco/');
} catch (e) {
  console.warn('GLTF preload deferred:', e);
}

interface ArtifactModelProps {
  artifact: Artifact;
  autoRotate?: boolean;
  highlightMechanical?: boolean; // When in intro spotlight mode
  isActionActive?: boolean;      // Triggers physical mechanics (e.g. spinning rotors, driving)
  actionTime?: number;           // Continuous time for physics/motion calculations
}

// GLTF model renderer with automatic bounding-box normalization & mechanical kinematics
const GLTFModelRenderer: React.FC<{
  path: string;
  artifact: Artifact;
  autoRotate?: boolean;
  isActionActive?: boolean;
  actionTime?: number;
}> = ({ path, artifact, autoRotate = false, isActionActive = false, actionTime = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(path, '/draco/');

  // Normalize scale and center bounding box so models are always visible, properly scaled and grounded
  const { cloned, normalizedScale, offset } = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child: any) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.18, mat.roughness ?? 0.5);
          mat.metalness = Math.min(0.92, (mat.metalness ?? 0.2) + 0.1);
          mat.envMapIntensity = 1.4;
          mesh.material = mat;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    // Use calibrated scale per artifact to keep reasonable and proportional sizes
    const targetSize = ARTIFACT_VISUAL_SCALE_MAP[artifact.id] || 2.2;
    const scale = targetSize / maxDim;

    // Center on X and Z, ground bottom of wheels/pads exactly on Y = 0
    const posOffset: [number, number, number] = [
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale,
    ];

    return { cloned: clone, normalizedScale: scale, offset: posOffset };
  }, [gltf.scene, artifact]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Do NOT perform physical actions or spinning unless explicitly active (e.g. during science scene)
    if (!isActionActive || !groupRef.current) return;

    // 1. Ingenuity: High-fidelity coaxial counter-rotating blades (2,400 RPM)
    if (artifact.id === 'ingenuity-helicopter') {
      const isFlying = actionTime >= 13.0 && actionTime <= 56.5;
      const speed = isFlying ? 28.0 : 0;
      groupRef.current.traverse((child: any) => {
        const name = child.name?.toLowerCase() || '';
        if (name.includes('rotors_01') || name.includes('rotor1') || (name.includes('blade') && !name.includes('2'))) {
          child.rotation.y += delta * speed;
        } else if (name.includes('rotors_02') || name.includes('rotor2') || name.includes('blade_02')) {
          child.rotation.y -= delta * speed;
        }
      });
    }

    // 2. Opportunity Rover: 6-wheel forward drive roll during travel phases
    if (artifact.id === 'opportunity-rover') {
      const isDriving = (actionTime >= 8.0 && actionTime <= 24.5) || (actionTime >= 35.0 && actionTime <= 46.5);
      if (isDriving) {
        const driveSpeed = delta * 5.0;
        groupRef.current.traverse((child: any) => {
          const name = child.name?.toLowerCase() || '';
          if (name.includes('wheel') || name.includes('tire') || name.includes('roll')) {
            child.rotation.x += driveSpeed;
          }
        });
      }
    }

    // 3. Pioneer 10: 4.8 RPM gyroscopic roll spin stabilization
    if (artifact.id === 'pioneer-10') {
      groupRef.current.rotation.z += delta * 0.5;
    }

    // 4. Apollo 11 Lunar Module: Ascent stage liftoff separation at 22.8s
    if (artifact.id === 'apollo-11-descent') {
      if (actionTime >= 22.8 && actionTime <= 33.5) {
        const ascentLift = (actionTime - 22.8) * 0.35;
        groupRef.current.traverse((child: any) => {
          const name = child.name?.toLowerCase() || '';
          if (name.includes('ascent') || name.includes('cabin') || name.includes('upper') || name.includes('stage2')) {
            child.position.y += ascentLift * delta;
          }
        });
      }
    }
  });

  return (
    <group ref={groupRef} rotation={artifact.modelRotation || [0, 0, 0]}>
      <group position={offset} scale={normalizedScale}>
        <primitive object={cloned} />
      </group>
    </group>
  );
};

// Procedural high-fidelity models for artifacts without standalone GLB
export const ProceduralArtifactModel: React.FC<{
  artifact: Artifact;
  autoRotate?: boolean;
  isActionActive?: boolean;
  actionTime?: number;
}> = ({ artifact, autoRotate = false, isActionActive = false, actionTime = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const armRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Do NOT perform physical actions unless explicitly active
    if (!isActionActive) return;

    // Drive wheel roll
    const isDriving = actionTime > 10;
    if (isDriving && wheelsRef.current.length > 0) {
      wheelsRef.current.forEach((w) => {
        if (w) w.rotation.x += delta * 4;
      });
    }

    // Mechanical arm animation
    if (armRef.current) {
      if (artifact.id === 'surveyor-3') {
        const isTrenching = actionTime >= 22.5 && actionTime <= 40.0;
        armRef.current.rotation.x = isTrenching ? Math.sin(actionTime * 2.5) * 0.3 + 0.3 : 0.1;
      }
      if (artifact.id === 'sojourner-pathfinder' || artifact.id === 'sojourner-rover') {
        const isAnalyzing = actionTime >= 45.0 && actionTime <= 57.0;
        armRef.current.rotation.z = isAnalyzing ? -0.8 : -0.2;
      }
    }

    // TV camera tracking
    if (cameraRef.current && artifact.id === 'apollo-15-lrv') {
      const isAscentTracking = actionTime >= 50.8 && actionTime <= 67.2;
      cameraRef.current.rotation.x = isAscentTracking ? -0.6 : 0.0;
    }
  });

  switch (artifact.id) {
    case 'apollo-15-lrv':
      // Lunar Roving Vehicle: proportional two-seater chassis, wire wheels flush with y=0
      return (
        <group ref={groupRef} scale={[0.88, 0.88, 0.88]} position={[0, 0.12, 0]}>
          {/* Main Chassis Frame with Gold Foil Accents */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.14, 1.05]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.65, 0.04, 0.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* 2 Crew Bucket Seats */}
          {[-0.22, 0.22].map((z, idx) => (
            <group key={idx} position={[-0.1, 0.52, z]}>
              <mesh castShadow>
                <boxGeometry args={[0.42, 0.48, 0.36]} />
                <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.28, -0.16]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.4, 0.4, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* Central T-Bar Joystick Controller */}
          <group position={[0.22, 0.6, 0]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* 4 Open Woven Piano-Wire Mesh Wheels with Chevron Treads */}
          {[
            [-0.72, 0.26, 0.68],
            [0.72, 0.26, 0.68],
            [-0.72, 0.26, -0.68],
            [0.72, 0.26, -0.68],
          ].map(([x, y, z], idx) => (
            <group
              key={idx}
              position={[x, y, z]}
              ref={(el) => {
                if (el) wheelsRef.current[idx] = el;
              }}
            >
              {/* Outer Wire Mesh Torus Tire */}
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.3, 0.09, 16, 32]} />
                <meshStandardMaterial color="#cbd5e1" wireframe metalness={0.95} roughness={0.15} />
              </mesh>
              {/* Wheel Aluminum Hub */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}

          {/* High-Gain Umbrella Dish Antenna on Forward Mast */}
          <group position={[0.7, 0.85, -0.42]}>
            <mesh rotation={[0.45, 0, 0.35]} castShadow>
              <cylinderGeometry args={[0.42, 0.06, 0.12, 24, 1, true]} />
              <meshStandardMaterial color="#f8fafc" wireframe metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.65, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* RCA Color Television Camera Tracking Liftoff */}
          <group ref={cameraRef} position={[0.78, 0.72, 0.36]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.16, 0.22]} />
              <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </group>
      );

    case 'sojourner-pathfinder':
    case 'sojourner-rover':
      // Sojourner microrover: compact, realistic scale relative to large exploration rovers
      return (
        <group ref={groupRef} scale={[0.9, 0.9, 0.9]} position={[0, -0.035, 0]}>
          {/* Main Gold-Foil Insulated Electronics Body */}
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.24, 0.46]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Dark Blue GaAs Solar Cell Array Deck */}
          <mesh position={[0, 0.365, 0]}>
            <boxGeometry args={[0.66, 0.02, 0.44]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.92} roughness={0.12} />
          </mesh>

          {/* Front Stereo Navigational Eyes */}
          <group position={[0.34, 0.29, 0]}>
            <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.08} />
            </mesh>
            <mesh position={[0, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.08} />
            </mesh>
          </group>

          {/* Rear APXS Alpha Proton X-ray Spectrometer Sensor Arm */}
          <group ref={armRef} position={[-0.36, 0.18, 0]}>
            <mesh rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.022, 0.022, 0.24, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[-0.12, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.09, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* 6 Cleated Rocker-Bogie Aluminum Wheels */}
          {[
            [-0.26, 0.11, 0.31],
            [0, 0.11, 0.33],
            [0.26, 0.11, 0.31],
            [-0.26, 0.11, -0.31],
            [0, 0.11, -0.33],
            [0.26, 0.11, -0.31],
          ].map(([x, y, z], idx) => (
            <group
              key={idx}
              position={[x, y, z]}
              ref={(el) => {
                if (el) wheelsRef.current[idx] = el;
              }}
            >
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.075, 0.075, 0.065, 18]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* Rocker-Bogie Suspension Linkages */}
          <mesh position={[0, 0.16, 0.28]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.58, 0.022, 0.022]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.16, -0.28]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.58, 0.022, 0.022]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      );

    case 'surveyor-3':
      // Surveyor 3: Tripod legs, center triangular truss, solar mast, scoop arm claw
      return (
        <group ref={groupRef} scale={[0.95, 0.95, 0.95]} position={[0, -0.027, 0]}>
          {/* Triangular Aluminum Space Frame */}
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.48, 0.54, 0.38, 3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} wireframe />
          </mesh>
          <mesh position={[0, 0.48, 0]} receiveShadow>
            <cylinderGeometry args={[0.34, 0.38, 0.32, 3]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* 3 Tripod Landing Struts with Footpads */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
            const x = Math.cos(angle) * 0.82;
            const z = Math.sin(angle) * 0.82;
            return (
              <group key={idx}>
                <mesh position={[x * 0.5, 0.28, z * 0.5]} rotation={[0, -angle, 0.65]} castShadow>
                  <cylinderGeometry args={[0.028, 0.028, 0.8, 12]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.18} />
                </mesh>
                <mesh position={[x, 0.05, z]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.13, 0.15, 0.045, 16]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
                </mesh>
              </group>
            );
          })}

          {/* Vertical Center Solar Mast */}
          <mesh position={[0, 0.96, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.76, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.2} />
          </mesh>

          {/* Planar Solar Array Panel */}
          <mesh position={[0.22, 1.22, 0]} rotation={[0.4, 0, 0.5]} castShadow>
            <boxGeometry args={[0.48, 0.65, 0.022]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Omnidirectional High-Gain Antenna */}
          <mesh position={[-0.16, 1.32, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.35} />
          </mesh>

          {/* Motorized Soil Sampler Pantograph Arm & Claw */}
          <group ref={armRef} position={[0.26, 0.38, 0.26]} rotation={[0.4, -0.6, 0]}>
            <mesh position={[0.22, -0.12, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.48, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0.38, -0.3, 0]} castShadow>
              <boxGeometry args={[0.09, 0.07, 0.09]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Vidicon Pan-Tilt TV Camera */}
          <group position={[-0.22, 0.7, 0.16]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.22, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.09, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.065, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.98} roughness={0.08} />
            </mesh>
          </group>
        </group>
      );

    default:
      return (
        <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.65, 0.95]} />
            <meshStandardMaterial color={artifact.accentColor} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.24, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      );
  }
};

// Error Boundary wrapper for GLTF loading
class ModelErrorBoundary extends React.Component<
  { artifact: Artifact; autoRotate?: boolean; isActionActive?: boolean; actionTime?: number; children: React.ReactNode },
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
      return (
        <ProceduralArtifactModel
          artifact={this.props.artifact}
          autoRotate={this.props.autoRotate}
          isActionActive={this.props.isActionActive}
          actionTime={this.props.actionTime}
        />
      );
    }
    return this.props.children;
  }
}

export const ArtifactModel: React.FC<ArtifactModelProps> = ({
  artifact,
  autoRotate = false,
  isActionActive = false,
  actionTime = 0,
}) => {
  // Use registered NASA GLB model path if available
  const modelPath = artifact.modelPath || NASA_GLB_MAP[artifact.id];

  if (modelPath) {
    return (
      <ModelErrorBoundary
        artifact={artifact}
        autoRotate={autoRotate}
        isActionActive={isActionActive}
        actionTime={actionTime}
      >
        <React.Suspense
          fallback={
            <ProceduralArtifactModel
              artifact={artifact}
              autoRotate={autoRotate}
              isActionActive={isActionActive}
              actionTime={actionTime}
            />
          }
        >
          <GLTFModelRenderer
            path={modelPath}
            artifact={artifact}
            autoRotate={autoRotate}
            isActionActive={isActionActive}
            actionTime={actionTime}
          />
        </React.Suspense>
      </ModelErrorBoundary>
    );
  }

  return (
    <ProceduralArtifactModel
      artifact={artifact}
      autoRotate={autoRotate}
      isActionActive={isActionActive}
      actionTime={actionTime}
    />
  );
};
