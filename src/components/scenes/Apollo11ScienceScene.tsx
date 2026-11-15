import React, { useRef } from 'react';
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

export const Apollo11ScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const ascentStageRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);
  const lrrrPrismsRef = useRef<THREE.Group>(null);

  // Timecode phases based on 03-novo3-analysis.md:
  // 00.0 - 22.1s: Sea of Tranquility, pristine bootprints in vacuum
  // 22.8 - 33.4s: Ascent Stage rocket ignition and staging separation
  // 33.9 - 47.8s: Pedestal of humanity, "We came in peace" steel plaque
  // 48.7 - 61.0s: Laser Retroreflector 100 corner-cube silica prisms
  // 61.6 - 75.7s: Green laser beam firing from Earth observatory (380,000 km)
  // 76.2 - 86.4s: Laser hit, return bounce, 4cm/yr lunar drift discovery
  // 86.4 - 94.3s: 50 years of answering Earth's call

  const isAscentSeparation = currentTime >= 22.8 && currentTime <= 34.0;
  const isPlaqueFocus = currentTime >= 34.0 && currentTime <= 48.0;
  const isLaserActive = currentTime >= 61.0 && currentTime <= 88.0;

  useFrame((_, delta) => {
    if (isInspecting) return;

    // Ascent Stage departure trajectory
    if (ascentStageRef.current) {
      if (currentTime >= 23.0 && currentTime <= 34.0) {
        ascentStageRef.current.position.y += delta * 1.8;
        ascentStageRef.current.position.z -= delta * 0.5;
      }
    }

    // Laser beam pulse animation
    if (laserBeamRef.current && isLaserActive) {
      const pulse = Math.sin(currentTime * 6.0) * 0.25 + 0.75;
      if (laserBeamRef.current.material instanceof THREE.Material) {
        laserBeamRef.current.material.opacity = pulse;
      }
    }
  });

  return (
    <group>
      {/* Harsh Vacuum Lunar Solar Illumination */}
      <ambientLight intensity={0.25} color="#cbd5e1" />
      <directionalLight position={[10, 18, 12]} intensity={4.5} color="#ffffff" castShadow />
      {/* Earthshine fill light */}
      <directionalLight position={[-12, 10, -10]} intensity={0.45} color="#38bdf8" />

      {/* Lunar Surface: Sea of Tranquility */}
      <group position={[0, -0.4, 0]}>
        {/* Basaltic Regolith Ground Plinth */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.8, 5.0, 0.12, 64]} />
          <meshStandardMaterial color="#1e293b" roughness={0.96} metalness={0.04} />
        </mesh>

        {/* Embossed Apollo EVA Bootprints (Chevron Treads) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} position={[-0.8 + i * 0.22, 0.015, 0.6 + i * 0.25]} rotation={[-Math.PI / 2, 0, 0.3]}>
            <planeGeometry args={[0.14, 0.28]} />
            <meshStandardMaterial color="#0f172a" roughness={0.98} />
          </group>
        ))}

        {/* The Laser Ranging Retroreflector (LRRR) Pallet (30 paces away) */}
        <group ref={lrrrPrismsRef} position={[1.8, 0.08, 1.2]} rotation={[0.2, -0.4, 0]}>
          {/* Pallet Housing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.12, 0.55]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* 100 Silica Quartz Corner-Cube Prisms Matrix */}
          <group position={[0, 0.07, 0]}>
            {Array.from({ length: 25 }).map((_, idx) => {
              const row = Math.floor(idx / 5) - 2;
              const col = (idx % 5) - 2;
              return (
                <mesh key={idx} position={[col * 0.085, 0, row * 0.085]}>
                  <cylinderGeometry args={[0.032, 0.032, 0.025, 6]} />
                  <meshStandardMaterial
                    color="#ecfdf5"
                    roughness={0.05}
                    metalness={0.95}
                    emissive={isLaserActive ? '#10b981' : '#000000'}
                    emissiveIntensity={isLaserActive ? 0.6 : 0}
                  />
                </mesh>
              );
            })}
          </group>

          {/* Incoming Emerald Green Laser Beam (532nm) */}
          {isLaserActive && (
            <mesh ref={laserBeamRef} position={[0, 4.5, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 9.0, 16]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.85} />
            </mesh>
          )}
        </group>
      </group>

      {/* The Apollo 11 Lunar Module Descent Stage */}
      <group position={[0, -0.4, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Commemorative Stainless Steel Plaque on Ladder Leg #1 */}
        <group position={[-0.45, 0.52, 0.95]} rotation={[0, 0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.12, 0.008]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.92}
              roughness={isPlaqueFocus ? 0.15 : 0.35}
            />
          </mesh>
          {isPlaqueFocus && (
            <pointLight position={[0, 0, 0.15]} intensity={2.0} color="#ffffff" distance={0.8} />
          )}
        </group>

        {/* Translucent Ghost Ascent Stage Separating during Launch (22.8s - 34.0s) */}
        {isAscentSeparation && (
          <group ref={ascentStageRef} position={[0, 1.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.9, 1.4]} />
              <meshStandardMaterial
                color="#64748b"
                transparent
                opacity={0.65}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Rocket exhaust plume */}
            <mesh position={[0, -0.6, 0]}>
              <coneGeometry args={[0.3, 0.8, 16]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
