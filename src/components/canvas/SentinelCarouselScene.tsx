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

  const cardTransforms = useMemo(() => {
    return narrationScripts.map((sentinel, index) => {
      return { sentinel, index };
    });
  }, []);

  return (
    <group>
      {/* 
        Layer 1: Ambient Space Environment
        Stars, micro-meteoroid sparkles, volumetric nebulae, and Earth orbital horizon
      */}
      <AmbientSpaceBackground />

      {/* 
        Layer 2: Photorealistic Outer Space Lighting
        Direct solar illumination + soft planetary Earthshine reflection
      */}
      <ambientLight intensity={0.45} color="#0f172a" />

      {/* The Sun: High-intensity directional sunlight with sharp space shadows */}
      <directionalLight
        position={[14, 22, 14]}
        intensity={3.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Earthshine: Soft cyan-blue planetary bounce light from Earth below */}
      <directionalLight
        position={[-12, -8, -6]}
        intensity={1.1}
        color="#38bdf8"
      />

      {/* Launchpad Gantry / Engine Ignition Glow */}
      <pointLight position={[0, -5, 2]} intensity={2.0} color="#f59e0b" distance={12} />

      {/* 
        Layer 3: The NASA Space Shuttle Orbiter in Vertical Launch Stance
        Realistic PBR materials, cryogenic boil-off vents, and beginner-friendly callout labels.
      */}
      <SpaceShuttleSpine
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        scale={0.22}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        showAnnotations={true}
      />

      {/* 
        Layer 4: 3D Helical Card Formation
        Winding around the tall vertical launch stack.
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
