import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Artifact } from '../../types/artifact';
import { ArtifactModel } from '../canvas/ArtifactModel';

interface ScienceSceneProps {
  artifact: Artifact;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isInspecting?: boolean;
}

export const Apollo15LRVScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const roverGroupRef = useRef<THREE.Group>(null);
  const tvCameraRef = useRef<THREE.Group>(null);
  const genesisRockRef = useRef<THREE.Group>(null);
  const roosterTailRef = useRef<THREE.Group>(null);
  const distantLMRef = useRef<THREE.Group>(null);

  // Timecode phases based on 05-novo5-analysis.md:
  // 00.0 - 09.5s: Joy ride introduction, walking limit before 1971
  // 10.0 - 23.9s: Origami unfolding from LM belly, aluminum tubes & piano-wire mesh tires
  // 24.3 - 30.4s: T-handle steering stick, electric throttle acceleration, rooster-tails
  // 30.9 - 41.7s: Hadley Rille canyon rim (mile wide, 1,000 ft deep) & Mons Hadley
  // 42.1 - 50.2s: 18-mile drive, finding the 4-billion-year-old Genesis Rock
  // 50.8 - 67.1s: Parked 300ft away, RCA color TV camera tracking LM ascent rocket liftoff
  // 67.7 - 81.5s: 50 years at Hadley Rille, flat-proof tires, keys in ignition

  const isDriving = (currentTime >= 24.0 && currentTime <= 42.0);
  const isGenesisRockActive = currentTime >= 42.0 && currentTime <= 50.5;
  const isAscentTracking = currentTime >= 51.0 && currentTime <= 67.0;

  // Unfolding animation factor (0 = folded origami, 1 = fully deployed)
  const unfoldFactor = useMemo(() => {
    if (currentTime < 10.0) return 1.0; // Show deployed initially or unfolding during phase
    if (currentTime < 14.0) return (currentTime - 10.0) / 4.0;
    return 1.0;
  }, [currentTime]);

  useFrame((_, delta) => {
    if (isInspecting) return;

    // Rover bouncing suspension & forward drive dynamics
    if (roverGroupRef.current) {
      if (isDriving) {
        roverGroupRef.current.position.z = THREE.MathUtils.lerp(
          roverGroupRef.current.position.z,
          Math.sin(currentTime * 1.4) * 0.5,
          delta * 2
        );
        roverGroupRef.current.rotation.x = Math.sin(currentTime * 5.0) * 0.03;
        roverGroupRef.current.rotation.z = Math.cos(currentTime * 4.2) * 0.025;
      } else {
        roverGroupRef.current.rotation.x = 0;
        roverGroupRef.current.rotation.z = 0;
      }
    }

    // Front RCA Color TV Camera pan & tilt tracking the rising rocket
    if (tvCameraRef.current) {
      if (isAscentTracking) {
        tvCameraRef.current.rotation.y = THREE.MathUtils.lerp(tvCameraRef.current.rotation.y, 0.45, delta * 1.5);
        tvCameraRef.current.rotation.x = THREE.MathUtils.lerp(tvCameraRef.current.rotation.x, -0.65, delta * 1.5);
      } else {
        tvCameraRef.current.rotation.y = 0;
        tvCameraRef.current.rotation.x = 0;
      }
    }

    // Distant LM Ascent Stage liftoff trajectory
    if (distantLMRef.current && isAscentTracking) {
      distantLMRef.current.position.y += delta * 1.2;
    }
  });

  return (
    <group>
      {/* Harsh Vacuum Lunar Solar Illumination */}
      <ambientLight intensity={0.28} color="#94a3b8" />
      <directionalLight position={[12, 16, 10]} intensity={4.2} color="#ffffff" castShadow />
      <directionalLight position={[-10, 8, -8]} intensity={0.35} color="#38bdf8" />

      {/* Terrain: Hadley-Apennine & Canyon Rim */}
      <group position={[0, -0.4, 0]}>
        {/* Main Lunar Regolith Base */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.8, 5.0, 0.12, 64]} />
          <meshStandardMaterial color="#1e293b" roughness={0.96} metalness={0.04} />
        </mesh>

        {/* Hadley Rille Canyon Chasm (Modeled drop-off on side) */}
        <mesh position={[-2.8, -0.4, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[2.5, 0.8, 6.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.98} />
        </mesh>

        {/* Parabolic Rooster-Tail Dust Particles from Wire Mesh Tires */}
        {isDriving && (
          <group ref={roosterTailRef} position={[0, 0.1, -0.7]}>
            {Array.from({ length: 12 }).map((_, i) => (
              <mesh key={i} position={[(i % 2 === 0 ? 0.45 : -0.45), (i * 0.04), -i * 0.08]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color="#64748b" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        )}

        {/* Genesis Rock (Sample 15415) Presentation Display (Active 42.1s - 50.2s) */}
        {isGenesisRockActive && (
          <group ref={genesisRockRef} position={[1.4, 0.35, 0.6]}>
            {/* White Anorthosite Specimen */}
            <mesh castShadow>
              <dodecahedronGeometry args={[0.12, 1]} />
              <meshStandardMaterial
                color="#f8fafc"
                roughness={0.4}
                metalness={0.1}
                emissive="#e2e8f0"
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Sampling Tongs Holding the Rock */}
            <mesh position={[-0.08, -0.12, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 0.2, 0]} intensity={1.5} color="#ffffff" distance={1.0} />
          </group>
        )}

        {/* Distant Apollo 15 LM Falcon (300 ft away) for Ascent Liftoff (50.8s - 67.1s) */}
        {isAscentTracking && (
          <group ref={distantLMRef} position={[-2.2, 0.8, -3.2]}>
            {/* Ascent Stage */}
            <mesh>
              <boxGeometry args={[0.6, 0.45, 0.6]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Rocket Exhaust Flare */}
            <mesh position={[0, -0.35, 0]}>
              <coneGeometry args={[0.15, 0.5, 12]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* The Animated Lunar Roving Vehicle Model */}
      <group
        ref={roverGroupRef}
        position={[0, -0.4, 0]}
        scale={[unfoldFactor, unfoldFactor, unfoldFactor]}
      >
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Front-Mounted RCA Color Television Camera Assembly */}
        <group ref={tvCameraRef} position={[0, 0.72, 0.85]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.12, 0.22]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

