import React, { useRef, useMemo } from 'react';
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
  const currentScrollIndexRef = useRef<number>(0);

  // Helical geometry parameters (Active Theory spiral architecture)
  const totalCards = narrationScripts.length;
  const orbitRadius = 4.7; // Radius of helix around the vertical launch shuttle
  const stepY = 1.65; // Vertical pitch between consecutive cards along the tower
  const deltaTheta = (Math.PI * 2) / 4.6; // Angle pitch (~78.2 degrees per card)

  useFrame((_, delta) => {
    // Map scroll progress (0 to 1) to continuous card index space (0 to totalCards - 1)
    const targetIndex = scrollProgress * (totalCards - 1);

    // Smooth exponential damping for scroll inertia
    currentScrollIndexRef.current = THREE.MathUtils.damp(
      currentScrollIndexRef.current,
      targetIndex,
      4.8,
      delta
    );
  });

  // Calculate dynamic helical coordinates for each card
  const cardTransforms = useMemo(() => {
    return narrationScripts.map((sentinel, index) => {
      return { sentinel, index };
    });
  }, []);

  return (
    <group>
      {/* High-Contrast Launchpad & Space Lighting Rig */}
      <ambientLight intensity={0.4} />

      {/* Main Key Floodlight (Simulating KSC Pad 39A high-intensity launch illumination) */}
      <directionalLight position={[8, 14, 12]} intensity={3.0} color="#ffffff" castShadow />
      {/* Cold Lunar / Deep Space Rim Light */}
      <directionalLight position={[-10, 2, -8]} intensity={1.2} color="#38bdf8" />
      {/* Launchpad Ground Reflection */}
      <pointLight position={[0, -6, 2]} intensity={2.2} color="#f59e0b" distance={14} />

      {/* Swirling Ambient Dust and Launchpad Vapor Particle Cloud */}
      <CosmicDustField count={550} />

      {/* 
        Central Anchor: The NASA Space Shuttle Orbiter in Launch Stance
        Stands vertically ("very long") like a launchpad tower, replacing Active Theory's backbone.
      */}
      <SpaceShuttleSpine
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        scale={0.22}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      {/* 
        Helical Card Formation:
        Winding in 3D up and down around the vertical Space Shuttle launch stack.
      */}
      <group position={[0, 0, 0]}>
        {cardTransforms.map(({ sentinel, index }) => {
          // Relative position from current scroll focus
          const relIndex = index - currentScrollIndexRef.current;
          const dist = Math.abs(relIndex);

          // Helical Y: Scrolling advances the cards along the vertical height of the shuttle
          const y = -relIndex * stepY;

          // Helical Angle: Wraps around the shuttle in a spiral
          const angle = relIndex * deltaTheta;

          // Cylindrical coordinates around the shuttle
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;

          // Card orientation: Tangent to helix + facing outwards towards camera
          const cardRotation: [number, number, number] = [
            -0.03 * Math.sign(relIndex),
            -angle,
            0,
          ];

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
