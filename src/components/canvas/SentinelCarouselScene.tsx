import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceShuttleSpine } from './SpaceShuttleSpine';
import { FloatingSentinelCard } from './FloatingSentinelCard';
import { AmbientSpaceBackground } from './AmbientSpaceBackground';
import { OrbitalDepthRings } from './OrbitalDepthRings';
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

    // High-fidelity damping in lockstep with Lenis smooth momentum physics
    currentScrollIndexRef.current = THREE.MathUtils.damp(
      currentScrollIndexRef.current,
      targetIndex,
      18.0,
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
        True Black Depth Fog (Active Theory & Space Trash Signs Token)
        Dissolves distant background geometry into pure obsidian #000000 void,
        tuned to allow cards on the far side to remain crisply visible for deep 3D perspective!
      */}
      <fog attach="fog" args={['#000000', 16.0, 42.0]} />

      {/* Layer 1: Ambient Space Background (Stars, deep volumetric haze, Earth horizon) */}
      <AmbientSpaceBackground />

      {/* Layer 2: Concentric Orbital Depth Rings (Establishes 3D perspective plane) */}
      <OrbitalDepthRings />

      {/* 
        Layer 3: High-Contrast Cinematic Space Lighting
        Spotlight focal illumination with true pitch-black shadow falloff
      */}
      <ambientLight intensity={0.45} color="#0f172a" />

      {/* The Sun / Stage Key Spotlight (Illuminates foreground active sentinel & launch stack) */}
      <directionalLight
        position={[14, 22, 14]}
        intensity={3.4}
        color="#ffffff"
        castShadow
      />

      {/* Focused Center Spotlight for Dramatic Depth Falloff */}
      <spotLight
        position={[0, 8, 14]}
        angle={0.45}
        penumbra={0.8}
        intensity={3.2}
        color="#f8fafc"
        distance={25}
      />

      {/* Earthshine Planetary Rim Light (Cold cyan glow from the side) */}
      <directionalLight
        position={[-14, -6, -6]}
        intensity={1.5}
        color="#38bdf8"
      />

      {/* Deep Space Far-Side Key & Fill (Illuminates cards orbiting behind the launch stack) */}
      <directionalLight
        position={[0, 8, -16]}
        intensity={2.8}
        color="#e2e8f0"
      />
      <pointLight
        position={[0, 0, -6]}
        intensity={3.4}
        color="#38bdf8"
        distance={26}
      />

      {/* Warm Launchpad / Engine Gantry Base Light */}
      <pointLight position={[0, -5, 2]} intensity={2.2} color="#f59e0b" distance={10} />

      {/* 
        Layer 4: Central Space Transportation System (STS) Launch Stack
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
        Layer 5: Helical Card Formation
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

          // Cylindrical perspective curvature: cards gracefully follow the orbital arc
          // while always presenting their luminous front face to the camera so cards on the far side remain fully visible!
          const cardRotation: [number, number, number] = [
            -y * 0.02,
            -Math.sin(angle) * 0.35,
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
