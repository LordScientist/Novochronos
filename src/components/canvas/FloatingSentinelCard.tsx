import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
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

export const FloatingSentinelCard: React.FC<FloatingSentinelCardProps> = ({
  id,
  name,
  celestialBody,
  index,
  totalCards,
  position,
  rotation = [0, 0, 0],
  scrollVelocity = 0,
  isActive = false,
  distanceFromCenter = 0,
  onSelect,
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load the authentic NASA photograph for this sentinel
  const texture = useTexture(`/images/sentinels/${id}.jpg`);

  const indexStr = `${String(index + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
  const headlineName = name.split('(')[0].trim().toUpperCase();

  const isFrontFacing = distanceFromCenter < 1.35;

  useFrame((state, delta) => {
    if (!cardRef.current) return;

    const helixScale = Math.max(0.78, 1.0 - distanceFromCenter * 0.08);
    const targetScale = hovered && isFrontFacing ? 1.06 : isActive ? 1.03 : helixScale;

    const targetTiltX = hovered && isFrontFacing ? -state.pointer.y * 0.35 : 0;
    const targetTiltY = hovered && isFrontFacing ? state.pointer.x * 0.35 : 0;
    const velocityTiltZ = -scrollVelocity * 0.0015;

    cardRef.current.position.x = THREE.MathUtils.damp(cardRef.current.position.x, position[0], 5, delta);
    cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, position[1], 5, delta);
    cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, position[2], 5, delta);

    cardRef.current.scale.x = THREE.MathUtils.damp(cardRef.current.scale.x, targetScale, 6, delta);
    cardRef.current.scale.y = THREE.MathUtils.damp(cardRef.current.scale.y, targetScale, 6, delta);
    cardRef.current.scale.z = THREE.MathUtils.damp(cardRef.current.scale.z, targetScale, 6, delta);

    cardRef.current.rotation.x = THREE.MathUtils.damp(
      cardRef.current.rotation.x,
      rotation[0] + targetTiltX,
      5,
      delta
    );
    cardRef.current.rotation.y = THREE.MathUtils.damp(
      cardRef.current.rotation.y,
      rotation[1] + targetTiltY,
      5,
      delta
    );
    cardRef.current.rotation.z = THREE.MathUtils.damp(
      cardRef.current.rotation.z,
      rotation[2] + velocityTiltZ,
      5,
      delta
    );
  });

  const cardOpacity = Math.max(0.3, Math.min(1.0, 1.0 - distanceFromCenter * 0.22));

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
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Rounded Backing Slab */}
      <RoundedBox args={[3.4, 2.15, 0.06]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#050811"
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={cardOpacity}
        />
      </RoundedBox>

      {/* Front Face: The Authentic NASA Photograph */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[3.32, 2.07]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={cardOpacity}
        />
      </mesh>

      {/* Elegant Dark Vignette Gradient Overlay at Bottom of Card for Typography Legibility */}
      <mesh position={[0, -0.4, 0.038]}>
        <planeGeometry args={[3.32, 1.25]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={cardOpacity * 0.65}
        />
      </mesh>

      {/* Glowing Border Trim (Active Theory Highlight) */}
      <RoundedBox args={[3.44, 2.19, 0.04]} radius={0.12} smoothness={4} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color={hovered && isFrontFacing ? '#38bdf8' : isFrontFacing ? '#60a5fa' : '#334155'}
          wireframe
          transparent
          opacity={hovered && isFrontFacing ? 0.95 : isFrontFacing ? 0.5 : 0.2}
        />
      </RoundedBox>

      {/* Top Header: Minimal Index & Celestial Body */}
      <group position={[0, 0.78, 0.042]}>
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.14}
          fillOpacity={cardOpacity}
        >
          {indexStr}
        </Text>

        <Text
          position={[1.4, 0, 0]}
          fontSize={0.09}
          color="#38bdf8"
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.14}
          fillOpacity={cardOpacity}
        >
          {celestialBody.toUpperCase()}
        </Text>
      </group>

      {/* Bottom Title: Clean & Focused (Active Theory Minimalist Style) */}
      <group position={[0, -0.65, 0.042]}>
        <Text
          position={[-1.4, 0, 0]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.08}
          fillOpacity={cardOpacity}
        >
          {headlineName}
        </Text>

        {/* Small subtle arrow cue */}
        <Text
          position={[1.4, 0, 0]}
          fontSize={0.14}
          color={hovered && isFrontFacing ? '#38bdf8' : '#94a3b8'}
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
