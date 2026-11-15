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

  useFrame((state, delta) => {
    if (!cardRef.current) return;

    // Mobile scale optimization: slightly tighter proportions on mobile screens
    const isMobile = state.size.width < 768;
    const mobileScale = isMobile ? 0.86 : 1.0;

    // Stable scale and position tied directly to scroll progress
    // When active/clicked, smoothly translate along local radial normal towards camera
    const helixScale = Math.max(0.78, 1.0 - distanceFromCenter * 0.08);
    const targetScale = (isActive ? 1.14 : helixScale) * mobileScale;

    // Push outward along the card's facing angle towards the orbiting camera
    const normalX = Math.sin(rotation[1]);
    const normalZ = Math.cos(rotation[1]);
    const pushDist = isActive ? 0.45 : 0;

    const targetX = position[0] + normalX * pushDist;
    const targetY = position[1];
    const targetZ = position[2] + normalZ * pushDist;

    cardRef.current.position.x = THREE.MathUtils.damp(cardRef.current.position.x, targetX, 18, delta);
    cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, targetY, 18, delta);
    cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, targetZ, 18, delta);

    cardRef.current.scale.x = THREE.MathUtils.damp(cardRef.current.scale.x, targetScale, 18, delta);
    cardRef.current.scale.y = THREE.MathUtils.damp(cardRef.current.scale.y, targetScale, 18, delta);
    cardRef.current.scale.z = THREE.MathUtils.damp(cardRef.current.scale.z, targetScale, 18, delta);

    cardRef.current.rotation.x = THREE.MathUtils.damp(cardRef.current.rotation.x, rotation[0], 18, delta);
    cardRef.current.rotation.y = THREE.MathUtils.damp(cardRef.current.rotation.y, rotation[1], 18, delta);
    cardRef.current.rotation.z = THREE.MathUtils.damp(cardRef.current.rotation.z, rotation[2], 18, delta);
  });

  const cardOpacity = Math.max(0.68, Math.min(1.0, 1.0 - distanceFromCenter * 0.07));

  const handleSelect = (e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    onSelect?.(id);
  };

  const handlePointerOver = (e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={cardRef}
      position={position}
      rotation={rotation}
      onClick={handleSelect}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 
        Full-Surface 3D Interactive Bounding Hitbox:
        Positioned at z = 0.08 in front of all text and image layers.
        Covers the full card face and edges so clicking anywhere immediately opens the card!
      */}
      <mesh
        position={[0, 0, 0.08]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[3.6, 2.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* 
        Sleek Obsidian & Cyan Backing Rim:
        Clean solid rounded box with luminous rim that stays visible across the entire 3D depth
      */}
      <RoundedBox
        args={[3.46, 2.21, 0.04]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, -0.01]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color={isActive ? '#38bdf8' : isFrontFacing ? '#38bdf8' : '#0284c7'}
          transparent
          opacity={isActive ? 1.0 : isFrontFacing ? 0.9 : 0.65}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* 
        Full Edge-to-Edge NASA Image:
        Fills the entire 3.4 x 2.15 card without any black boxes cutting it off!
      */}
      <group
        position={[0, 0, 0.02]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Image
          url={`/images/sentinels/${id}.jpg`}
          scale={[3.4, 2.15]}
          radius={0.12}
          transparent
          opacity={cardOpacity}
          toneMapped={true}
          side={THREE.DoubleSide}
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>

      {/* Top Header: Monospace Counter & Celestial Body with Text Stroke for 100% Readability */}
      <group
        position={[0, 0.8, 0.04]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
          outlineWidth={0.018}
          outlineColor="#000000"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {indexStr}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.09}
          color="#38bdf8"
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.12}
          outlineWidth={0.018}
          outlineColor="#000000"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {celestialBody.toUpperCase()}
        </Text>
      </group>

      {/* Bottom Title: Clean, Punchy, Crisp White with Dark Outline to Pop Over Any Photo */}
      <group
        position={[0, -0.74, 0.04]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.08}
          maxWidth={2.6}
          overflowWrap="break-word"
          lineHeight={1.1}
          outlineWidth={0.022}
          outlineColor="#000000"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {headlineName}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.16}
          color={isFrontFacing ? '#38bdf8' : '#ffffff'}
          anchorX="right"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          →
        </Text>
      </group>
    </group>
  );
};
