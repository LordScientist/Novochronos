import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const AmbientSpaceBackground: React.FC = () => {
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const earthLimbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Very slow, majestic cosmic rotation
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y = time * 0.005;
      nebulaGroupRef.current.rotation.x = Math.sin(time * 0.003) * 0.02;
    }

    // Subtle atmospheric pulsing on Earth's blue horizon limb
    if (earthLimbRef.current) {
      const mat = earthLimbRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(time * 0.8) * 0.05;
    }
  });

  return (
    <group>
      {/* 
        Layer 1: Deep Starlight Field
        3,500 twinkling stars at varying depths
      */}
      <Stars
        radius={90}
        depth={50}
        count={3500}
        factor={3.5}
        saturation={0.3}
        fade
        speed={0.6}
      />

      {/* 
        Layer 2: Stellar Dust & Micro-Meteoroid Sparkles
        Slowly drifting luminous space dust in cyan and warm gold
      */}
      <Sparkles
        count={120}
        scale={[20, 20, 20]}
        size={2.2}
        speed={0.3}
        color="#38bdf8"
        opacity={0.5}
      />
      <Sparkles
        count={60}
        scale={[25, 25, 25]}
        size={1.8}
        speed={0.2}
        color="#f59e0b"
        opacity={0.35}
      />

      {/* 
        Layer 3: Ambient Deep Space Nebula Clouds
        Soft semi-transparent volumetric glows providing cosmic depth
      */}
      <group ref={nebulaGroupRef} position={[0, 0, -25]}>
        {/* Deep Cyan / Stellar Plasma Cloud (Left) */}
        <mesh position={[-16, 8, -5]}>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial
            color="#0369a1"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Deep Violet / Galactic Dust Cloud (Right) */}
        <mesh position={[18, -6, -8]}>
          <sphereGeometry args={[16, 16, 16]} />
          <meshBasicMaterial
            color="#4338ca"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Subtle Warm Solar / Golden Dust Glow (Center Depth) */}
        <mesh position={[0, -12, -12]}>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial
            color="#1e1b4b"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 
        Layer 4: Earth Atmospheric Limb Glow
        A majestic curved planetary horizon glow positioned in the lower background,
        evoking the view from Space Shuttle Low Earth Orbit (350 km altitude).
      */}
      <mesh
        ref={earthLimbRef}
        position={[0, -22, -10]}
        rotation={[-Math.PI / 2.2, 0, 0]}
      >
        <ringGeometry args={[18, 26, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
