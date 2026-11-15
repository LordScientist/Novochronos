import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
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

export const Pioneer10ScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const probeGroupRef = useRef<THREE.Group>(null);
  const asteroidsGroupRef = useRef<THREE.Group>(null);
  const jupiterGroupRef = useRef<THREE.Group>(null);
  const plaqueGlowRef = useRef<THREE.Mesh>(null);

  // Timecode phases based on 07-novo7-analysis.md:
  // 00.0 - 18.9s: Deep space void beyond planets, sun as a distant diamond
  // 19.7 - 33.5s: Asteroid belt passage, sailing through without a scratch
  // 34.1 - 46.0s: Jupiter radiation belts & close-up flyby of Great Red Spot
  // 46.0 - 65.0s: Golden Pioneer Plaque, pulsar clock address of Earth
  // 65.0 - 79.5s: Radio fades in 2003, coasting toward Aldebaran in Taurus (2 million years)
  // 79.5 - 92.8s: Humanity's postcard drifting through the Milky Way

  const isAsteroidBelt = currentTime >= 19.5 && currentTime <= 34.0;
  const isJupiterFlyby = currentTime >= 34.0 && currentTime <= 46.0;
  const isPlaqueHighlight = currentTime >= 46.0 && currentTime <= 65.0;

  useFrame((_, delta) => {
    if (isInspecting) return;

    // 4.8 RPM spin stabilization around antenna boresight axis Z
    if (probeGroupRef.current) {
      probeGroupRef.current.rotation.z += delta * 0.5;
    }

    // Asteroids tumbling past in foreground parallax
    if (asteroidsGroupRef.current && isAsteroidBelt) {
      asteroidsGroupRef.current.position.z += delta * 1.5;
      asteroidsGroupRef.current.rotation.y += delta * 0.2;
    }

    // Jupiter orbiting flyby
    if (jupiterGroupRef.current && isJupiterFlyby) {
      jupiterGroupRef.current.position.x = THREE.MathUtils.lerp(
        jupiterGroupRef.current.position.x,
        -4.5,
        delta * 0.8
      );
    }
  });

  return (
    <group>
      {/* Deep Space Vacuum Starfield */}
      <Stars radius={120} depth={80} count={6000} factor={4.5} saturation={0.8} fade />

      {/* Point-like Distant Solar Key Light */}
      <directionalLight position={[15, 12, 20]} intensity={2.8} color="#ffffff" />
      {/* Subdued Cosmic Void Ambient */}
      <ambientLight intensity={0.25} color="#6366f1" />

      {/* Jupiter Planetary Spherical Presence during Flyby (Active 34.1s - 46.0s) */}
      {isJupiterFlyby && (
        <group ref={jupiterGroupRef} position={[-2.5, 0.5, -6.5]}>
          {/* Banded Gas Giant Sphere */}
          <mesh>
            <sphereGeometry args={[3.2, 48, 48]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.6}
              metalness={0.1}
              emissive="#78350f"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Glowing Toroidal Magnetic Radiation Belt Ring */}
          <mesh rotation={[0.4, 0, 0]}>
            <torusGeometry args={[4.2, 0.15, 16, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {/* Asteroid Belt Rocks Tumbling Past (Active 19.5s - 34.0s) */}
      {isAsteroidBelt && (
        <group ref={asteroidsGroupRef} position={[0, 0, -4.0]}>
          <mesh position={[-2.4, 1.2, 0]}>
            <dodecahedronGeometry args={[0.55, 1]} />
            <meshStandardMaterial color="#475569" roughness={0.9} metalness={0.1} />
          </mesh>
          <mesh position={[2.8, -1.4, 1.5]}>
            <dodecahedronGeometry args={[0.75, 1]} />
            <meshStandardMaterial color="#334155" roughness={0.92} metalness={0.1} />
          </mesh>
          <mesh position={[-1.2, -2.1, 2.5]}>
            <dodecahedronGeometry args={[0.35, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} metalness={0.15} />
          </mesh>
        </group>
      )}

      {/* The Animated Pioneer 10 Spacecraft Model (Hovering in Microgravity) */}
      <group ref={probeGroupRef} position={[0, 0, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* The Gold-Anodized Pioneer Plaque Mounted on Antenna Strut */}
        <group position={[0.45, -0.28, 0.55]} rotation={[0, -0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.18, 0.006]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.96}
              roughness={isPlaqueHighlight ? 0.12 : 0.25}
              emissive={isPlaqueHighlight ? '#ca8a04' : '#000000'}
              emissiveIntensity={isPlaqueHighlight ? 0.35 : 0}
            />
          </mesh>

          {/* Specular Glint Highlight when Inspected (46.0s - 65.0s) */}
          {isPlaqueHighlight && (
            <mesh ref={plaqueGlowRef} position={[0, 0, 0.02]}>
              <ringGeometry args={[0.18, 0.22, 32]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>

        {/* SNAP-19 RTG Booms Thermal Infrared Emission Glow */}
        <group position={[-1.8, 0.2, 0]}>
          <pointLight color="#f97316" intensity={currentTime >= 65.0 ? 0.4 : 1.2} distance={1.2} />
        </group>
        <group position={[1.8, 0.2, 0]}>
          <pointLight color="#f97316" intensity={currentTime >= 65.0 ? 0.4 : 1.2} distance={1.2} />
        </group>
      </group>

      {/* Distant Destination: Glowing Red Giant Star Aldebaran in Taurus */}
      <group position={[14, 8, -30]}>
        <mesh>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        <pointLight color="#ea580c" intensity={3.5} distance={20} />
      </group>
    </group>
  );
};
