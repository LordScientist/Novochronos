import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Image } from '@react-three/drei';
import * as THREE from 'three';

export interface FloatingSentinelCardProps {
  id: string;
  name: string;
  celestialBody: string;
  characterArchetype?: string;
  index: number;
  totalCards: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  scrollVelocity?: number;
  isActive?: boolean;
  distanceFromCenter?: number;
  onSelect?: (id: string) => void;
}

// Concise, non-overflowing canonical names for the 8 featured sentinels
const SENTINEL_SHORT_NAMES: Record<string, string> = {
  'opportunity-rover': 'OPPORTUNITY',
  'ingenuity-helicopter': 'INGENUITY',
  'apollo-11-descent': 'APOLLO 11',
  'insight-lander': 'INSIGHT',
  'apollo-15-lrv': 'APOLLO 15 LRV',
  'sojourner-pathfinder': 'SOJOURNER',
  'pioneer-10': 'PIONEER 10',
  'surveyor-3': 'SURVEYOR 3',
};

export const FloatingSentinelCard: React.FC<FloatingSentinelCardProps> = ({
  id,
  name,
  celestialBody,
  index,
  totalCards,
  position,
  rotation = [0, 0, 0],
  isActive = false,
  distanceFromCenter = 0,
  onSelect,
}) => {
  const cardRef = useRef<THREE.Group>(null);

  const indexStr = `${String(index + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
  const headlineName = SENTINEL_SHORT_NAMES[id] || name.split('(')[0].trim().toUpperCase();

  const isFrontFacing = distanceFromCenter < 1.3;

  useFrame((_, delta) => {
    if (!cardRef.current) return;

    // Stable, rock-solid positioning without shaking, wobbling or back-and-forth oscillations
    const helixScale = Math.max(0.78, 1.0 - distanceFromCenter * 0.08);
    const targetScale = isActive ? 1.04 : helixScale;

    // Smooth single-direction interpolation strictly locked to scroll progression
    cardRef.current.position.x = THREE.MathUtils.damp(cardRef.current.position.x, position[0], 6, delta);
    cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, position[1], 6, delta);
    cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, position[2], 6, delta);

    cardRef.current.scale.x = THREE.MathUtils.damp(cardRef.current.scale.x, targetScale, 6, delta);
    cardRef.current.scale.y = THREE.MathUtils.damp(cardRef.current.scale.y, targetScale, 6, delta);
    cardRef.current.scale.z = THREE.MathUtils.damp(cardRef.current.scale.z, targetScale, 6, delta);

    // Stable rotation matching helix tangent - zero pointer jitter or velocity skew
    cardRef.current.rotation.x = THREE.MathUtils.damp(cardRef.current.rotation.x, rotation[0], 6, delta);
    cardRef.current.rotation.y = THREE.MathUtils.damp(cardRef.current.rotation.y, rotation[1], 6, delta);
    cardRef.current.rotation.z = THREE.MathUtils.damp(cardRef.current.rotation.z, rotation[2], 6, delta);
  });

  const cardOpacity = Math.max(0.35, Math.min(1.0, 1.0 - distanceFromCenter * 0.22));

  return (
    <group
      ref={cardRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        if (!isFrontFacing) return;
        e.stopPropagation();
        onSelect?.(id);
      }}
      onPointerOver={(e) => {
        if (!isFrontFacing) return;
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Glassmorphic Obsidian Backing Slab */}
      <RoundedBox args={[3.4, 2.15, 0.06]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#050811"
          roughness={0.35}
          metalness={0.65}
          transparent
          opacity={cardOpacity}
        />
      </RoundedBox>

      {/* 
        High-Quality Drei Image:
        Automatically handles aspect-ratio cover crop (no squishing/stretching),
        proper sRGB color space, smooth mipmapping, and corner radius.
      */}
      <group position={[0, 0, 0.035]}>
        <Image
          url={`/images/sentinels/${id}.jpg`}
          scale={[3.32, 2.07]}
          radius={0.08}
          transparent
          opacity={cardOpacity}
          toneMapped={true}
        />
      </group>

      {/* Dark Vignette Overlay along bottom half for crisp text contrast */}
      <mesh position={[0, -0.45, 0.038]}>
        <planeGeometry args={[3.32, 1.15]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={cardOpacity * 0.72}
        />
      </mesh>

      {/* Clean Subtle Border Frame */}
      <RoundedBox args={[3.44, 2.19, 0.04]} radius={0.12} smoothness={4} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color={isFrontFacing ? '#38bdf8' : '#334155'}
          wireframe
          transparent
          opacity={isFrontFacing ? 0.7 : 0.2}
        />
      </RoundedBox>

      {/* Top Header: Monospace Counter & Celestial Body */}
      <group position={[0, 0.8, 0.042]}>
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.085}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
          fillOpacity={cardOpacity}
        >
          {indexStr}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.085}
          color="#38bdf8"
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.12}
          fillOpacity={cardOpacity}
        >
          {celestialBody.toUpperCase()}
        </Text>
      </group>

      {/* Bottom Title: Clean, Punchy, Strict Max Width to Prevent Any Text Overflow */}
      <group position={[0, -0.68, 0.042]}>
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.08}
          maxWidth={2.5}
          overflowWrap="break-word"
          lineHeight={1.1}
          fillOpacity={cardOpacity}
        >
          {headlineName}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.13}
          color={isFrontFacing ? '#38bdf8' : '#94a3b8'}
          anchorX="right"
          anchorY="middle"
          fillOpacity={cardOpacity}
        >
          →
        </Text>
      </group>
    </group>
  );
};
