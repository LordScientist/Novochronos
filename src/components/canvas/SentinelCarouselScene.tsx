import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const { camera } = useThree();
  const currentScrollProgressRef = useRef<number>(0);
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));

  // Helical spiral parameters around the stationary Space Shuttle
  // Replicating Active Theory's spiral staircase flight path:
  // Starts high up at the tip of the shuttle nose and spirals down to the base rocket engines and gantry heat!
  const totalCards = narrationScripts.length; // 8 sentinels
  const heightTop = 3.2;      // Camera & card elevation at scroll progress 0 (Shuttle Tip)
  const heightBottom = -3.5;  // Camera & card elevation at scroll progress 1 (Rocket Engine Heat)
  const totalAngle = Math.PI * 2 * 1.35; // 1.35 full spiral revolutions (~486 degrees)
  const orbitRadius = 5.2;    // Card distance from central shuttle axis
  const cameraDistance = 9.8; // Viewpoint distance from central shuttle axis

  useFrame((state, delta) => {
    // High-fidelity damping locked directly with Lenis scroll momentum
    currentScrollProgressRef.current = THREE.MathUtils.damp(
      currentScrollProgressRef.current,
      scrollProgress,
      18.0,
      delta
    );

    const p = currentScrollProgressRef.current;

    // Responsive camera distance for mobile vs desktop viewports
    const isMobile = state.size.width < 768;
    const effectiveCamDist = isMobile ? 12.2 : cameraDistance;

    // Moving on a spiral staircase around the stationary shuttle
    const currentAngle = p * totalAngle;
    const currentY = THREE.MathUtils.lerp(heightTop, heightBottom, p);

    const targetCamX = Math.sin(currentAngle) * effectiveCamDist;
    const targetCamZ = Math.cos(currentAngle) * effectiveCamDist;
    const targetCamY = currentY;

    // Smoothly update camera coordinates
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 18.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 18.0, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 18.0, delta);

    // Camera continuously aims at the shuttle axis at the current elevation
    const targetLookAtY = currentY * 0.72 - 0.15;
    currentLookAtRef.current.y = THREE.MathUtils.damp(currentLookAtRef.current.y, targetLookAtY, 18.0, delta);
    camera.lookAt(0, currentLookAtRef.current.y, 0);
  });

  // Calculate fixed helical spiral positions for all 8 cards around the stationary shuttle
  const cardTransforms = useMemo(() => {
    return narrationScripts.map((sentinel, index) => {
      const t = index / (totalCards - 1);
      const angle = t * totalAngle;
      const y = THREE.MathUtils.lerp(heightTop, heightBottom, t);
      const x = Math.sin(angle) * orbitRadius;
      const z = Math.cos(angle) * orbitRadius;

      // Card faces radially outward toward where the camera orbits
      const rotation: [number, number, number] = [0, angle, 0];

      return {
        sentinel,
        index,
        t,
        position: [x, y, z] as [number, number, number],
        rotation,
      };
    });
  }, [totalCards, heightTop, heightBottom, totalAngle, orbitRadius]);

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
        Layer 5: Helical Card Formation wrapped around the Shuttle
        Fixed steps along the spiral staircase around the Space Shuttle
      */}
      <group position={[0, 0, 0]}>
        {cardTransforms.map(({ sentinel, index, position, rotation }) => {
          const currentIndex = currentScrollProgressRef.current * (totalCards - 1);
          const dist = Math.abs(index - currentIndex);

          return (
            <FloatingSentinelCard
              key={sentinel.id}
              id={sentinel.id}
              name={sentinel.name}
              celestialBody={sentinel.celestialBody}
              characterArchetype={sentinel.characterArchetype}
              index={index}
              totalCards={totalCards}
              position={position}
              rotation={rotation}
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
