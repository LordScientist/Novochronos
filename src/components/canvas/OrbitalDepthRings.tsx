import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const OrbitalDepthRings: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Ultra-slow, majestic orbital rotation inspired by Space Trash Signs
    groupRef.current.rotation.y = time * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 
        Concentric Orbital Distance Rings (Space Trash Signs design token)
        Provides visual depth cues against the black void so the brain 
        instantly senses 3D perspective and orbital geometry.
      */}
      {[3.8, 5.2, 6.8, 8.5].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, (i - 1.5) * 0.8, 0]}>
          <ringGeometry args={[radius, radius + 0.015, 96]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.06 - i * 0.01}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Subtle Distance Grid Axis Crosshair at Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
        <ringGeometry args={[5.18, 5.22, 64]} />
        <meshBasicMaterial
          color="#64748b"
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
