import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Artifact3DModelProps {
  sentinelId: string;
  targetSize?: number;
}

useGLTF.setDecoderPath('/draco/');

// Official NASA GLB model paths available locally
const NASA_GLB_MAP: Record<string, string> = {
  'opportunity-rover': '/models/opportunity.glb',
  'ingenuity-helicopter': '/models/ingenuity.glb',
  'apollo-11-descent': '/models/apollo-lunar-module.glb',
  'insight-lander': '/models/insight.glb',
  'pioneer-10': '/models/pioneer-10.glb',
};

// Component that renders any NASA GLB model with automatic bounding-box normalization & centering
const NormalizedGLTFModel: React.FC<{ url: string; targetSize?: number }> = ({
  url,
  targetSize = 2.4,
}) => {
  const { scene } = useGLTF(url, '/draco/');

  const { cloned, normalizedScale, offset } = useMemo(() => {
    const clone = scene.clone(true);

    // Optimize materials for studio podium lighting
    clone.traverse((child: any) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.25, mat.roughness ?? 0.5);
          mat.metalness = Math.min(0.85, (mat.metalness ?? 0.2) + 0.1);
          mat.envMapIntensity = 1.3;
          mesh.material = mat;
        }
      }
    });

    // Compute bounding box and normalize scale & center
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = targetSize / maxDim;
    const posOffset: [number, number, number] = [
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    ];

    return { cloned: clone, normalizedScale: scale, offset: posOffset };
  }, [scene, targetSize]);

  return (
    <group position={offset} scale={normalizedScale}>
      <primitive object={cloned} />
    </group>
  );
};

// Procedural high-detail Apollo 15 Lunar Roving Vehicle (LRV-1)
const Apollo15RoverProcedural: React.FC<{ targetSize?: number }> = ({ targetSize = 2.2 }) => {
  return (
    <group scale={targetSize * 0.45} position={[0, -0.2, 0]}>
      {/* Aluminum Tubular Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.1, 0.25, 1.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Two Fold-Down Lawn-Chair Seats */}
      <mesh position={[-0.2, 0.5, -0.4]}>
        <boxGeometry args={[0.7, 0.8, 0.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.5, 0.4]}>
        <boxGeometry args={[0.7, 0.8, 0.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* T-Handle Steering Controller */}
      <mesh position={[0.4, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 4 Open Wire-Mesh Wheels with Chevron Treads */}
      {[
        [-1.1, -0.3, 1.0],
        [1.1, -0.3, 1.0],
        [-1.1, -0.3, -1.0],
        [1.1, -0.3, -1.0],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
          <meshStandardMaterial color="#475569" wireframe={true} metalness={0.7} roughness={0.3} />
        </group>
      ))}

      {/* High-Gain Umbrella Mesh Dish Antenna */}
      <group position={[1.2, 1.1, 0.6]} rotation={[0.4, 0.3, -0.4]}>
        <mesh>
          <sphereGeometry args={[0.75, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color="#cbd5e1" wireframe={true} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
      </group>

      {/* RCA Color TV Camera Mounted on Front */}
      <mesh position={[1.4, 0.6, -0.5]}>
        <boxGeometry args={[0.35, 0.3, 0.25]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Procedural Sojourner Rover & Mars Pathfinder
const SojournerProcedural: React.FC<{ targetSize?: number }> = ({ targetSize = 2.0 }) => {
  return (
    <group scale={targetSize * 0.55} position={[0, -0.2, 0]}>
      {/* Microwave-Sized Main Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.45, 1.1]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Solar Panel Deck (Dark Blue GaAs Cells) */}
      <mesh position={[0, 0.44, 0]}>
        <planeGeometry args={[1.52, 1.02]} />
        <meshStandardMaterial
          color="#1e3a8a"
          metalness={0.9}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stereoscopic Camera Eyes */}
      <group position={[0.75, 0.5, 0]}>
        <mesh position={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.18]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 6 Cleated Rocker-Bogie Aluminum Wheels */}
      {[
        [-0.6, -0.15, 0.65],
        [0.0, -0.15, 0.68],
        [0.6, -0.15, 0.65],
        [-0.6, -0.15, -0.65],
        [0.0, -0.15, -0.68],
        [0.6, -0.15, -0.65],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.14, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
        </group>
      ))}

      {/* Rear APXS Sensor Arm */}
      <mesh position={[-0.85, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.12, 0.12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
    </group>
  );
};

// Procedural Surveyor 3 Robot Scout
const Surveyor3Procedural: React.FC<{ targetSize?: number }> = ({ targetSize = 2.2 }) => {
  return (
    <group scale={targetSize * 0.48} position={[0, -0.3, 0]}>
      {/* Triangular Tubular Aluminum Space Frame */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 1.0, 3]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} wireframe={false} />
      </mesh>

      {/* 3 Tripod Landing Legs with Footpads */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rad, i) => (
        <group key={i} rotation={[0, rad, 0]}>
          <mesh position={[0.9, -0.1, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[1.4, -0.55, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Center Vertical Mast with Planar Solar Panel & High-Gain Antenna */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.9, 0.3]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.04]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Motorized Pantograph Surface Sampler Arm */}
      <group position={[0.6, 0.3, 0]} rotation={[0, 0.2, -0.5]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.9, 0.08, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>
        <mesh position={[0.95, -0.1, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

export const Artifact3DModel: React.FC<Artifact3DModelProps> = ({
  sentinelId,
  targetSize = 2.4,
}) => {
  const glbUrl = NASA_GLB_MAP[sentinelId];

  if (glbUrl) {
    return <NormalizedGLTFModel url={glbUrl} targetSize={targetSize} />;
  }

  // High-detail procedural fallbacks matching NASA historical archives
  if (sentinelId === 'apollo-15-lrv') {
    return <Apollo15RoverProcedural targetSize={targetSize} />;
  }
  if (sentinelId === 'sojourner-pathfinder') {
    return <SojournerProcedural targetSize={targetSize} />;
  }
  if (sentinelId === 'surveyor-3') {
    return <Surveyor3Procedural targetSize={targetSize} />;
  }

  return null;
};

// Preload the official NASA GLBs for instant loading
Object.values(NASA_GLB_MAP).forEach((url) => {
  useGLTF.preload(url, '/draco/');
});
