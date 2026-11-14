import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface FloatingSentinelCardProps {
  id: string;
  name: string;
  celestialBody: string;
  characterArchetype: string;
  index: number;
  totalCards: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  scrollVelocity?: number;
  isActive?: boolean;
  distanceFromCenter?: number; // Distance in helical index space (|relIndex|)
  onSelect?: (id: string) => void;
}

export const FloatingSentinelCard: React.FC<FloatingSentinelCardProps> = ({
  id,
  name,
  celestialBody,
  characterArchetype,
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

  // Format index string (e.g. "01 / 08")
  const indexStr = `${String(index + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;

  // Short clean name for headline
  const headlineName = name.split('(')[0].trim().toUpperCase();

  // Accent color per celestial body
  const bodyColor = celestialBody.toLowerCase().includes('mars')
    ? '#f97316' // Warm Martian orange
    : celestialBody.toLowerCase().includes('moon')
    ? '#e2e8f0' // Lunar regolith silver
    : '#38bdf8'; // Deep space cyan

  // Whether this card is close enough to the foreground sweet-spot to be interactable
  const isFrontFacing = distanceFromCenter < 1.35;

  useFrame((state, delta) => {
    if (!cardRef.current) return;

    // Active Theory helical focus physics:
    // When near center (distanceFromCenter -> 0), scale is 1.0; farther cards taper to 0.78
    const helixScale = Math.max(0.78, 1.0 - distanceFromCenter * 0.08);
    const targetScale = hovered && isFrontFacing ? 1.08 : isActive ? 1.04 : helixScale;

    // Hover pointer tilt (only active on front-facing card to prevent erratic background tilt)
    const targetTiltX = hovered && isFrontFacing ? -state.pointer.y * 0.35 : 0;
    const targetTiltY = hovered && isFrontFacing ? state.pointer.x * 0.35 : 0;

    // Velocity skew on scroll
    const velocityTiltZ = -scrollVelocity * 0.0015;

    // Smooth lerps for position, rotation and scale
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

  // Calculate dynamic opacity: front cards are vivid, cards behind the shuttle fade into atmospheric haze
  const cardOpacity = Math.max(0.25, Math.min(0.95, 1.0 - distanceFromCenter * 0.22));

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
      {/* 3D Glassmorphic Obsidian Slab */}
      <RoundedBox args={[3.2, 2.0, 0.08]} radius={0.12} smoothness={4}>
        <meshPhysicalMaterial
          color={hovered && isFrontFacing ? '#0f172a' : '#080d1a'}
          roughness={0.25}
          metalness={0.65}
          transmission={0.35}
          ior={1.4}
          thickness={0.5}
          transparent
          opacity={cardOpacity}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Glowing Border Frame */}
      <RoundedBox args={[3.24, 2.04, 0.06]} radius={0.12} smoothness={4} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color={hovered && isFrontFacing ? '#38bdf8' : isFrontFacing ? '#60a5fa' : '#334155'}
          wireframe
          transparent
          opacity={hovered && isFrontFacing ? 0.9 : isFrontFacing ? 0.5 : 0.2}
        />
      </RoundedBox>

      {/* Top Telemetry Header */}
      <group position={[0, 0.65, 0.05]}>
        <Text
          position={[-1.3, 0, 0]}
          fontSize={0.09}
          color="#94a3b8"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
          fillOpacity={cardOpacity}
        >
          {`MISSION ${indexStr}`}
        </Text>

        <Text
          position={[1.3, 0, 0]}
          fontSize={0.09}
          color={bodyColor}
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.1}
          fillOpacity={cardOpacity}
        >
          {celestialBody.toUpperCase()}
        </Text>
      </group>

      {/* Divider Line */}
      <mesh position={[0, 0.48, 0.05]}>
        <planeGeometry args={[2.7, 0.01]} />
        <meshBasicMaterial
          color={hovered && isFrontFacing ? '#38bdf8' : '#334155'}
          transparent
          opacity={cardOpacity * 0.7}
        />
      </mesh>

      {/* Main Title (Headline) */}
      <Text
        position={[-1.3, 0.22, 0.05]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.06}
        maxWidth={2.6}
        fillOpacity={cardOpacity}
      >
        {headlineName}
      </Text>

      {/* Archetype Subtitle */}
      <Text
        position={[-1.3, -0.06, 0.05]}
        fontSize={0.11}
        color="#38bdf8"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.04}
        fillOpacity={cardOpacity}
      >
        {`// ${characterArchetype}`}
      </Text>

      {/* Bottom CTA / Action Bar */}
      <group position={[0, -0.65, 0.05]}>
        <mesh position={[-1.25, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial
            color={hovered && isFrontFacing ? '#22c55e' : isFrontFacing ? '#38bdf8' : '#475569'}
            transparent
            opacity={cardOpacity}
          />
        </mesh>

        <Text
          position={[-1.1, 0, 0]}
          fontSize={0.09}
          color={hovered && isFrontFacing ? '#ffffff' : isFrontFacing ? '#94a3b8' : '#64748b'}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.08}
          fillOpacity={cardOpacity}
        >
          {hovered && isFrontFacing
            ? 'CLICK TO DOCK & LISTEN →'
            : isFrontFacing
            ? 'ABANDONED SENTINEL'
            : 'ORBITAL TELEMETRY'}
        </Text>
      </group>
    </group>
  );
};
