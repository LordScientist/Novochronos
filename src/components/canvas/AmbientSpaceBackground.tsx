import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

export const AmbientSpaceBackground: React.FC = () => {
  const earthLimbRef = useRef<THREE.Mesh>(null);
  const deepNebulaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (deepNebulaRef.current) {
      deepNebulaRef.current.rotation.y = time * 0.002;
    }

    if (earthLimbRef.current) {
      const mat = earthLimbRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.28 + Math.sin(time * 0.6) * 0.04;
    }
  });

  return (
    <group>
      {/* 
        Layer 1: Deep Infinite Starfield against Pure Obsidian Black #000000
        High-density, low-luminance pinpricks that establish cosmic infinite distance
      */}
      <Stars
        radius={110}
        depth={65}
        count={4500}
        factor={2.8}
        saturation={0.15}
        fade
        speed={0.3}
      />

      {/* 
        Layer 2: Extreme Deep Space Volumetric Haze (Z = -35)
        Faint cosmic gas clouds providing atmospheric depth falloff into the void
      */}
      <group ref={deepNebulaRef} position={[0, 0, -35]}>
        {/* Cold Cyan Deep Field */}
        <mesh position={[-18, 10, 0]}>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial
            color="#082f49"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Deep Galactic Indigo Field */}
        <mesh position={[20, -8, -5]}>
          <sphereGeometry args={[22, 16, 16]} />
          <meshBasicMaterial
            color="#1e1b4b"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 
        Layer 3: Earth Atmospheric Horizon Limb
        Curving gently below in the deep distance against the pure black void
      */}
      <mesh
        ref={earthLimbRef}
        position={[0, -24, -12]}
        rotation={[-Math.PI / 2.15, 0, 0]}
      >
        <ringGeometry args={[20, 28, 96]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
