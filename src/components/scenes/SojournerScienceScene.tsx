import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
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

export const SojournerScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const roverGroupRef = useRef<THREE.Group>(null);
  const apxsSensorRef = useRef<THREE.Group>(null);
  const pathfinderPetalsRef = useRef<THREE.Group>(null);
  const floodPlaneRef = useRef<THREE.Mesh>(null);

  // Timecode phases based on 06-novo6-analysis.md:
  // 00.0 - 18.6s: Backpack-size micro-rover (23 lb), critics laughed
  // 19.0 - 34.5s: July 4, 1997 airbag bounce, petals unfold, rolling down ramps
  // 35.2 - 45.3s: Named for Sojourner Truth, 7 days vs 83 days survival
  // 45.9 - 57.2s: Trundling up to Barnacle Bill & Yogi, APXS contact spectrometry, ancient floods
  // 57.9 - 66.4s: Winter cold drains circuits, resting in Ares Vallis
  // 66.4 - 77.0s: Lineage of Spirit, Opportunity, Curiosity, Perseverance. Big dreams start small.

  const isRampRoll = currentTime >= 19.0 && currentTime <= 34.0;
  const isAPXSMeasuring = currentTime >= 46.0 && currentTime <= 57.0;
  const isFloodVisualized = currentTime >= 50.0 && currentTime <= 57.5;
  const isGenerationalLineup = currentTime >= 66.0 && currentTime <= 77.0;

  useFrame((_, delta) => {
    if (isInspecting) return;

    // Rolling down deployer ramp onto sand (19.0s - 34.0s)
    if (roverGroupRef.current) {
      if (isRampRoll) {
        const t = (currentTime - 19.0) / 15.0;
        roverGroupRef.current.position.z = THREE.MathUtils.lerp(-1.2, 0.4, t);
        roverGroupRef.current.position.y = THREE.MathUtils.lerp(0.18, -0.38, Math.min(t * 1.5, 1.0));
      } else if (isAPXSMeasuring) {
        // Reverse maneuver up to Barnacle Bill
        roverGroupRef.current.position.x = THREE.MathUtils.lerp(roverGroupRef.current.position.x, 0.9, delta * 2.0);
        roverGroupRef.current.position.z = THREE.MathUtils.lerp(roverGroupRef.current.position.z, 0.6, delta * 2.0);
      }
    }

    // Prehistoric flood water surge animation
    if (floodPlaneRef.current && isFloodVisualized) {
      if (floodPlaneRef.current.material instanceof THREE.Material) {
        floodPlaneRef.current.material.opacity = Math.sin((currentTime - 50.0) * 0.8) * 0.5;
      }
    }
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={1.0} color="#fed7aa" />
      <directionalLight position={[10, 14, 8]} intensity={3.6} color="#ffffff" castShadow />
      <directionalLight position={[-8, 6, -6]} intensity={1.1} color="#c2410c" />

      {/* Atmospheric Martian Dust Particles */}
      <Sparkles count={110} scale={[18, 8, 18]} size={2.2} speed={0.35} opacity={0.4} color="#fdba74" />

      {/* Terrain: Ares Vallis Catastrophic Outflow Plain */}
      <group position={[0, -0.4, 0]}>
        {/* Ground Base */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.5, 4.8, 0.1, 64]} />
          <meshStandardMaterial color="#9a3412" roughness={0.92} metalness={0.08} />
        </mesh>

        {/* Pathfinder Lander Tetrahedral Petal Base & Deployer Ramps */}
        <group ref={pathfinderPetalsRef} position={[0, 0.05, -1.2]}>
          {/* Central Lander Core */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, 0.15, 3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Triangular Unfolded Petals */}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, -0.02, 0.9]}>
              <boxGeometry args={[0.8, 0.04, 0.9]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          {/* Metallic Egress Ramps */}
          <mesh position={[0, -0.08, 1.1]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.45, 0.02, 1.2]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* Boulder "Barnacle Bill" (Target for APXS Spectrometer) */}
        <group position={[1.3, 0.18, 0.8]} rotation={[0, -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[0.45, 1]} />
            <meshStandardMaterial color="#57534e" roughness={0.92} metalness={0.15} />
          </mesh>
        </group>

        {/* Boulder "Yogi" (Large rounded basalt rock in background) */}
        <group position={[-1.6, 0.35, 1.2]} rotation={[0, 0.6, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.85, 24, 16]} />
            <meshStandardMaterial color="#44403c" roughness={0.96} metalness={0.1} />
          </mesh>
        </group>

        {/* Prehistoric Outflow Mega-Flood Surge Simulation (Active 50.0s - 57.5s) */}
        {isFloodVisualized && (
          <mesh ref={floodPlaneRef} position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[7.0, 7.0]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.6} />
          </mesh>
        )}

        {/* Successor Rovers Lineup Hologram (Active 66.4s - 77.0s) */}
        {isGenerationalLineup && (
          <group position={[0, 0.2, -0.4]}>
            {/* Holographic outlines of Spirit/Opportunity/Curiosity/Perseverance */}
            <mesh position={[-1.4, 0.6, 0]}>
              <boxGeometry args={[1.2, 0.8, 1.0]} />
              <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.35} />
            </mesh>
            <mesh position={[1.4, 0.9, 0]}>
              <boxGeometry args={[1.6, 1.2, 1.4]} />
              <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.35} />
            </mesh>
          </group>
        )}
      </group>

      {/* The Animated Sojourner Micro-Rover Model */}
      <group ref={roverGroupRef} position={[0, -0.38, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Rear Deployable APXS Spectrometer Sensor Head */}
        <group ref={apxsSensorRef} position={[0, 0.12, -0.32]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.1, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Alpha Particle & X-Ray Emission Beam (Active during measurement) */}
          {isAPXSMeasuring && (
            <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.03, 0.15, 12]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};
