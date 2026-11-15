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

const getCelestialColor = (body: string): string => {
  const b = body.toLowerCase();
  if (b.includes('mar')) return '#E26D5C'; // Martian Amber
  if (b.includes('moon')) return '#54C9F5'; // Nebula Cyan
  return '#9DB4FF'; // Stellar Blue / Deep Space
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

  const indexStr = `${String(index + 1).padStart(2, '0')} // ${String(totalCards).padStart(2, '0')}`;
  const headlineName = SENTINEL_SHORT_NAMES[id] || name.split('(')[0].trim().toUpperCase();
  const celestialColor = getCelestialColor(celestialBody);

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
        Layer 1: Obsidian Architectural Backplate
        Clean solid rounded box with dark luxury surface
      */}
      <RoundedBox
        args={[3.52, 2.27, 0.04]}
        radius={0.14}
        smoothness={4}
        position={[0, 0, -0.02]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color="#090D16"
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* 
        Layer 2: Luminous Precision Bezel Rim
        Dynamic rim responding to orientation and active selection
      */}
      <RoundedBox
        args={[3.46, 2.21, 0.03]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, -0.01]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color={isActive ? '#F4F6FA' : isFrontFacing ? '#54C9F5' : '#1A2FFB'}
          transparent
          opacity={isActive ? 1.0 : isFrontFacing ? 0.85 : 0.45}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* 
        Layer 3: Edge-to-Edge NASA Image:
        Fills the 3.4 x 2.15 card with crisp rounded corners
      */}
      <group
        position={[0, 0, 0.015]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Image
          url={`/images/sentinels/${id}.jpg`}
          scale={[3.4, 2.15]}
          radius={0.11}
          transparent
          opacity={cardOpacity}
          toneMapped={true}
          side={THREE.DoubleSide}
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>

      {/* Layer 4: Lower Third Contrast Gradient Mesh */}
      <mesh position={[0, -0.55, 0.025]}>
        <planeGeometry args={[3.38, 1.0]} />
        <meshBasicMaterial
          color="#05070D"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4 Optical Corner Crosshair Reticles in 3D */}
      <Text position={[-1.56, 0.96, 0.035]} fontSize={0.08} color={isFrontFacing ? '#54C9F5' : '#8E9AA8'} fillOpacity={cardOpacity * 0.75}>
        +
      </Text>
      <Text position={[1.56, 0.96, 0.035]} fontSize={0.08} color={isFrontFacing ? '#54C9F5' : '#8E9AA8'} fillOpacity={cardOpacity * 0.75}>
        +
      </Text>
      <Text position={[-1.56, -0.96, 0.035]} fontSize={0.08} color={isFrontFacing ? '#54C9F5' : '#8E9AA8'} fillOpacity={cardOpacity * 0.75}>
        +
      </Text>
      <Text position={[1.56, -0.96, 0.035]} fontSize={0.08} color={isFrontFacing ? '#54C9F5' : '#8E9AA8'} fillOpacity={cardOpacity * 0.75}>
        +
      </Text>

      {/* Glowing Signal Beacon LED in 3D */}
      <mesh position={[-1.48, 0.8, 0.045]}>
        <circleGeometry args={[0.024, 16]} />
        <meshBasicMaterial color="#00F5A0" transparent opacity={cardOpacity} />
      </mesh>

      {/* Top Header: Monospace Counter & Celestial Body */}
      <group
        position={[0, 0.8, 0.04]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Text
          position={[-1.38, 0, 0]}
          fontSize={0.09}
          color="#F4F6FA"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
          outlineWidth={0.018}
          outlineColor="#05070D"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {indexStr}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.09}
          color={celestialColor}
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.14}
          outlineWidth={0.018}
          outlineColor="#05070D"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {celestialBody.toUpperCase()}
        </Text>
      </group>

      {/* Bottom Title & Action Pill */}
      <group
        position={[0, -0.74, 0.04]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.2}
          color="#F4F6FA"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.08}
          maxWidth={2.2}
          overflowWrap="break-word"
          lineHeight={1.1}
          outlineWidth={0.022}
          outlineColor="#05070D"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {headlineName}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.11}
          color={isFrontFacing ? '#54C9F5' : '#8E9AA8'}
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.12}
          outlineWidth={0.016}
          outlineColor="#05070D"
          fillOpacity={cardOpacity}
          onClick={handleSelect}
        >
          {isFrontFacing ? 'INSPECT →' : '→'}
        </Text>
      </group>
    </group>
  );
};
