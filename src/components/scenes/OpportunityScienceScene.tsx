import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
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

export const OpportunityScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const roverGroupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);
  const dustParticlesRef = useRef<any>(null);

  // Timecode phases based on 01-novo1-analysis.md:
  // 00.0 - 17.3s: Landing & deployment out of Eagle Crater
  // 17.9 - 24.3s: Rocker-bogie desert traversal
  // 25.0 - 35.3s: Blueberry hematite discovery on rock face
  // 35.9 - 46.7s: 28-mile marathon traversal
  // 47.2 - 58.2s: 2018 global dust storm darkening
  // 58.7 - 67.8s: Last heartbeat signal transmission
  // 69.1 - 85.9s: Peaceful rest at Endeavour Crater rim

  const stormProgress = useMemo(() => {
    if (currentTime < 47.0) return 0.0;
    if (currentTime > 58.0) return 1.0;
    return (currentTime - 47.0) / 11.0;
  }, [currentTime]);

  const isArmDeploying = currentTime >= 24.0 && currentTime <= 36.0;
  const isTransmitting = currentTime >= 58.0 && currentTime <= 68.0;

  // Sky & lighting parameters modulated by the dust storm
  const skyColor = useMemo(() => {
    if (currentTime >= 68.0) return '#c27852'; // Calm post-storm dawn
    const baseColor = new THREE.Color('#d47b4a');
    const stormColor = new THREE.Color('#140502');
    return '#' + baseColor.lerp(stormColor, stormProgress).getHexString();
  }, [currentTime, stormProgress]);

  const sunIntensity = useMemo(() => {
    if (currentTime >= 68.0) return 2.8; // Dawn sun
    return THREE.MathUtils.lerp(3.6, 0.08, stormProgress);
  }, [currentTime, stormProgress]);

  // Frame loop animating kinematics
  useFrame((_, delta) => {
    if (isInspecting) return;

    // Rover chassis drive displacement & suspension bounce during travel phases
    if (roverGroupRef.current) {
      if ((currentTime >= 8.0 && currentTime <= 24.0) || (currentTime >= 35.0 && currentTime <= 46.0)) {
        // Forward roll motion
        roverGroupRef.current.position.z = THREE.MathUtils.lerp(
          roverGroupRef.current.position.z,
          Math.sin(currentTime * 0.8) * 0.4,
          delta * 2
        );
        // Suspension pitch sway
        roverGroupRef.current.rotation.x = Math.sin(currentTime * 3.5) * 0.02;
        roverGroupRef.current.rotation.z = Math.cos(currentTime * 2.8) * 0.015;
      } else {
        roverGroupRef.current.rotation.x = 0;
        roverGroupRef.current.rotation.z = 0;
      }
    }

    // Robotic arm (IDD) deployment articulation
    if (armRef.current) {
      if (isArmDeploying) {
        armRef.current.position.y = THREE.MathUtils.lerp(armRef.current.position.y, -0.15, delta * 2.5);
        armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, 0.65, delta * 2.5);
      } else {
        armRef.current.position.y = THREE.MathUtils.lerp(armRef.current.position.y, 0.1, delta * 2.0);
        armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, 0.0, delta * 2.0);
      }
    }

    // High-Gain Antenna Earth-tracking gimbal
    if (antennaRef.current) {
      if (isTransmitting) {
        antennaRef.current.rotation.y = Math.sin(currentTime * 1.5) * 0.35 + 0.5;
        antennaRef.current.rotation.x = 0.4;
      }
    }
  });

  return (
    <group>
      {/* Dynamic Lighting System */}
      <ambientLight intensity={Math.max(0.12, 1.0 - stormProgress * 0.88)} color={skyColor} />
      <directionalLight
        position={[8, 14, 10]}
        intensity={sunIntensity}
        color={currentTime >= 68.0 ? '#ffedd5' : '#fed7aa'}
        castShadow
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.4 * (1.0 - stormProgress)} color="#991b1b" />

      {/* Atmospheric Martian Dust Particles */}
      <Sparkles
        ref={dustParticlesRef}
        count={stormProgress > 0.4 ? 450 : 80}
        scale={[20, 8, 20]}
        size={stormProgress > 0.4 ? 4.5 : 2.0}
        speed={stormProgress > 0.4 ? 2.5 : 0.4}
        opacity={stormProgress > 0.4 ? 0.85 : 0.3}
        color={stormProgress > 0.4 ? '#991b1b' : '#fdba74'}
      />

      {/* Terrain: Layered Meridiani Planum Sand & Rock Outcrop */}
      <group position={[0, -0.4, 0]}>
        {/* Main Martian Ground Plinth */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.2, 4.5, 0.12, 64]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.92} metalness={0.08} />
        </mesh>

        {/* Sand Ripple Ridges */}
        <mesh receiveShadow position={[0, 0.015, -0.6]} rotation={[-Math.PI / 2, 0, 0.2]}>
          <planeGeometry args={[7.5, 7.5, 32, 32]} />
          <meshStandardMaterial color="#9a3412" roughness={0.88} metalness={0.05} />
        </mesh>

        {/* Rover Tire Tracks Embedded in Soil */}
        <mesh position={[0, 0.022, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 3.8]} />
          <meshStandardMaterial
            color="#5e1a07"
            roughness={0.95}
            transparent
            opacity={currentTime >= 8.0 ? 0.75 : 0.0}
          />
        </mesh>

        {/* Rock Outcrop Face for "Blueberries" Demonstration */}
        <group position={[1.4, 0.18, 0.8]} rotation={[0, -0.4, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.45, 0.8]} />
            <meshStandardMaterial color="#a8715a" roughness={0.85} metalness={0.1} />
          </mesh>

          {/* Hematite Spherules ("Blueberries") */}
          {Array.from({ length: 14 }).map((_, i) => {
            const bx = (Math.sin(i * 1.7) * 0.35);
            const by = 0.23 + (Math.cos(i * 2.3) * 0.06);
            const bz = (Math.cos(i * 1.4) * 0.25);
            return (
              <mesh key={i} position={[bx, by, bz]}>
                <sphereGeometry args={[0.028, 16, 16]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
              </mesh>
            );
          })}

          {/* Prehistoric Liquid Water Shimmer Reveal (Active 25.0s - 35.0s) */}
          {currentTime >= 25.0 && currentTime <= 36.0 && (
            <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.9, 0.6]} />
              <meshStandardMaterial
                color="#60a5fa"
                transparent
                opacity={Math.sin((currentTime - 25.0) * 0.6) * 0.45}
                roughness={0.1}
                metalness={0.6}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* The Animated Opportunity Rover Model */}
      <group ref={roverGroupRef} position={[0, -0.4, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Articulated Robotic Arm (IDD) Rig */}
        <group ref={armRef} position={[0.45, 0.25, 0.65]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.28, 0.06]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.14, 0.08]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Gimballed High-Gain Antenna (HGA) */}
        <group ref={antennaRef} position={[-0.35, 0.65, -0.2]}>
          <mesh castShadow rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.02, 0.06, 24]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Pulsating Telemetry Pulse Wave during Final Transmission (58.7s - 67.8s) */}
        {isTransmitting && (
          <Float speed={4} rotationIntensity={0.2} floatIntensity={0.3}>
            <mesh position={[-0.35, 1.2, -0.2]}>
              <ringGeometry args={[0.4, 0.45, 32]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={Math.sin((currentTime - 58.7) * 4.0) * 0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Float>
        )}
      </group>
    </group>
  );
};
