import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceShuttleSpine } from './SpaceShuttleSpine';
import { FloatingSentinelCard } from './FloatingSentinelCard';
import { AmbientSpaceBackground } from './AmbientSpaceBackground';
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
  const currentScrollIndexRef = useRef<number>(0);

  // Helical geometry parameters
  const totalCards = narrationScripts.length;
  const orbitRadius = 5.2; // Radius around the launch stack
  const stepY = 1.7; // Vertical spacing between consecutive cards
  const deltaTheta = (Math.PI * 2) / 4.6; // ~78.2 degrees per card

  useFrame((_, delta) => {
    // Map scroll progress (0 to 1) to continuous card index space (0 to totalCards - 1)
    const targetIndex = scrollProgress * (totalCards - 1);

    // Smooth single-direction damping strictly tied to scroll
    currentScrollIndexRef.current = THREE.MathUtils.damp(
      currentScrollIndexRef.current,
      targetIndex,
      5.0,
      delta
    );
  });

  const cardTransforms = useMemo(() => {
    return narrationScripts.map((sentinel, index) => {
      return { sentinel, index };
    });
  }, []);

  return (
    <group>
      {/* Ambient Space Environment: Pure stars, nebulae, Earth limb (no moving box particles) */}
      <AmbientSpaceBackground />

      {/* Photorealistic Outer Space Lighting */}
      <ambientLight intensity={0.45} color="#0f172a" />

      {/* Primary Sunlight */}
      <directionalLight
        position={[14, 22, 14]}
        intensity={3.2}
        color="#ffffff"
        castShadow
      />

      {/* Earthshine Planetary Fill Light */}
      <directionalLight
        position={[-12, -8, -6]}
        intensity={1.1}
        color="#38bdf8"
      />

      {/* Launchpad Ground Reflection */}
      <pointLight position={[0, -5, 2]} intensity={2.0} color="#f59e0b" distance={12} />

      {/* 
        Central Space Transportation System (STS) Launch Stack
        External Tank + Twin SRBs + Orbiter standing completely rock-solid.
      */}
      <SpaceShuttleSpine
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        scale={0.92}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      {/* 
        Helical Card Formation:
        Positioned steadily around the launch stack, moving smoothly on scroll with zero jitter.
      */}
      <group position={[0, 0, 0]}>
        {cardTransforms.map(({ sentinel, index }) => {
          const relIndex = index - currentScrollIndexRef.current;
          const dist = Math.abs(relIndex);

          // Helical vertical displacement
          const y = -relIndex * stepY;

          // Helical angular spiral
          const angle = relIndex * deltaTheta;

          // Cylindrical coordinates
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;

          // Smooth steady rotation - no sign-flip jitter or back-and-forth tilt
          const cardRotation: [number, number, number] = [0, -angle, 0];

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
              distanceFromCenter={dist}
              onSelect={onSelectSentinel}
            />
          );
        })}
      </group>
    </group>
  );
};
