// Realistic Translucent Interstellar Nebulae & Cosmic Gas Clouds
// Multi-layered diffuse gas formations with soft blending and restrained astronomical palette

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicNebula3DProps {
  palette?: 'deep-space' | 'carina' | 'orion' | 'cygnus';
  density?: 'subtle' | 'moderate' | 'prominent';
  position?: [number, number, number];
  scale?: number;
}

export const CosmicNebula3D: React.FC<CosmicNebula3DProps> = ({
  palette = 'deep-space',
  density = 'subtle',
  position = [0, 0, -45],
  scale = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    const baseOpacity = density === 'subtle' ? 0.045 : density === 'moderate' ? 0.075 : 0.11;

    switch (palette) {
      case 'carina':
        return [
          { pos: [-22, 14, -8] as [number, number, number], r: 24, col: '#1e1b4b', op: baseOpacity * 1.2 },
          { pos: [-12, 18, 4] as [number, number, number], r: 18, col: '#3b0764', op: baseOpacity * 0.9 },
          { pos: [18, -12, -6] as [number, number, number], r: 22, col: '#172554', op: baseOpacity * 1.1 },
          { pos: [8, -6, 2] as [number, number, number], r: 15, col: '#450a0a', op: baseOpacity * 0.65 },
          { pos: [-5, 8, -14] as [number, number, number], r: 28, col: '#082f49', op: baseOpacity * 0.8 },
        ];
      case 'orion':
        return [
          { pos: [-16, -10, 0] as [number, number, number], r: 20, col: '#0e7490', op: baseOpacity * 0.9 },
          { pos: [14, 12, -4] as [number, number, number], r: 24, col: '#1e3a8a', op: baseOpacity * 1.2 },
          { pos: [24, -14, -8] as [number, number, number], r: 18, col: '#0369a1', op: baseOpacity * 0.75 },
          { pos: [-8, 16, -10] as [number, number, number], r: 22, col: '#1e1b4b', op: baseOpacity * 1.0 },
        ];
      case 'cygnus':
        return [
          { pos: [0, 18, -12] as [number, number, number], r: 26, col: '#155e75', op: baseOpacity * 0.85 },
          { pos: [-20, -10, -6] as [number, number, number], r: 22, col: '#1e1b4b', op: baseOpacity * 1.1 },
          { pos: [18, -8, 2] as [number, number, number], r: 19, col: '#311042', op: baseOpacity * 0.9 },
        ];
      case 'deep-space':
      default:
        return [
          { pos: [-24, 12, -5] as [number, number, number], r: 24, col: '#082f49', op: baseOpacity * 0.9 },
          { pos: [22, -10, -8] as [number, number, number], r: 26, col: '#1e1b4b', op: baseOpacity * 1.1 },
          { pos: [-10, -16, 4] as [number, number, number], r: 18, col: '#172554', op: baseOpacity * 0.85 },
          { pos: [12, 16, -12] as [number, number, number], r: 21, col: '#2e1065', op: baseOpacity * 0.75 },
          { pos: [0, 4, -18] as [number, number, number], r: 30, col: '#020617', op: baseOpacity * 1.3 },
        ];
    }
  }, [palette, density]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.001;
    groupRef.current.rotation.z = Math.sin(time * 0.0005) * 0.01;
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.pos}>
          <sphereGeometry args={[cloud.r, 16, 16]} />
          <meshBasicMaterial
            color={cloud.col}
            transparent
            opacity={cloud.op}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

