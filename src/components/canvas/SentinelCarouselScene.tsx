import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceShuttleSpine } from './SpaceShuttleSpine';
import { FloatingSentinelCard } from './FloatingSentinelCard';
import { CosmicDustField } from './CosmicDustField';
import narrationScripts from '../../data/narrationScripts.json';

interface SentinelCarouselSceneProps {
  scrollProgress: number;
  scrollVelocity: number;
  selectedSentinelId: string | null;
  onSelectSentinel: (id: string) => void;
}

export const SentinelCarouselScene: React.FC<SentinelCarouselSceneProps> = ({
  scrollProgress,
  scrollVelocity,
  selectedSentinelId,
  onSelectSentinel,
}) => {
  const carouselGroupRef = useRef<THREE.Group>(null);
  const currentRotationRef = useRef<number>(0);

  // Configuration for 3D Cylindrical Orbit
  const totalCards = narrationScripts.length;
  const orbitRadius = 6.0;

  useFrame((_, delta) => {
    // Scroll progress maps directly to carousel angular revolution
    // 1 full page scroll = 1 complete revolution of all 8 sentinels
    const targetRotation = scrollProgress * Math.PI * 2;

    // Smooth inertial lerp for rotation damping
    currentRotationRef.current = THREE.MathUtils.damp(
      currentRotationRef.current,
      targetRotation,
      4.5,
      delta
    );

    if (carouselGroupRef.current) {
      carouselGroupRef.current.rotation.y = currentRotationRef.current;
    }
  });

  return (
    <group>
      {/* Deep Space Lighting Rig */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[12, 16, 10]} intensity={2.8} color="#ffffff" castShadow />
      <directionalLight position={[-12, -8, -10]} intensity={0.9} color="#38bdf8" />
      <pointLight position={[0, -2, 4]} intensity={1.2} color="#818cf8" distance={15} />

      {/* Swirling Cosmic Particle / Space Debris Field */}
      <CosmicDustField count={500} />

      {/* 
        Central Anchor: The NASA Space Shuttle Orbiter
        Replaces Active Theory's mechanical backbone.
      */}
      <SpaceShuttleSpine
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        scale={0.08}
        position={[0, 0, -0.5]}
        rotation={[0.2, 0, 0]}
      />

      {/* Orbiting Cylindrical Carousel Group */}
      <group ref={carouselGroupRef} position={[0, 0, -0.5]}>
        {narrationScripts.map((sentinel, index) => {
          // Angular offset around 360 degrees
          const angle = (index / totalCards) * Math.PI * 2;

          // Cylindrical coordinates
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;
          // Slight vertical undulation for dynamic composition
          const y = Math.sin(angle * 2) * 0.45;

          // Card faces outward tangentially
          const cardRotation: [number, number, number] = [0, angle, 0];

          return (
            <FloatingSentinelCard
              key={sentinel.id}
              id={sentinel.id}
              name={sentinel.name}
              celestialBody={sentinel.celestialBody}
              characterArchetype={sentinel.characterArchetype}
              index={index}
              totalCards={totalCards}
              position={[x, y, z]}
              rotation={cardRotation}
              scrollVelocity={scrollVelocity}
              isActive={selectedSentinelId === sentinel.id}
              onSelect={onSelectSentinel}
            />
          );
        })}
      </group>
    </group>
  );
};
