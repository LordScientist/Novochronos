import React, { useRef, useMemo } from 'react';
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

export const InSightScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const armRef = useRef<THREE.Group>(null);
  const wtsDomeRef = useRef<THREE.Group>(null);
  const seismicRipplesRef = useRef<THREE.Group>(null);
  const moltenCoreRef = useRef<THREE.Mesh>(null);

  // Timecode phases based on 04-novo4-analysis.md:
  // 00.0 - 05.8s: Touchdown on volcanic plains of Elysium Planitia
  // 06.4 - 19.2s: Robotic arm places golden dome (SEIS seismometer, sub-atomic precision)
  // 19.7 - 33.9s: 1,300 Mars quakes & meteorite impacts rumbling through mantle
  // 34.6 - 44.7s: First ultrasound of alien world (giant molten liquid core reveal)
  // 45.4 - 56.4s: Red dust settling over solar wings (no wipers)
  // 56.4 - 72.4s: Power fading, final message & serene farewell
  // 73.0 - 78.8s: Sleeping peacefully in crimson dust

  const isPlacingDome = currentTime >= 6.0 && currentTime <= 19.0;
  const isQuakeActive = (currentTime >= 20.0 && currentTime <= 34.0) || (currentTime >= 35.0 && currentTime <= 44.0);
  const isCoreVisible = currentTime >= 34.5 && currentTime <= 45.0;

  const dustCoverage = useMemo(() => {
    if (currentTime < 45.0) return 0.15;
    if (currentTime > 65.0) return 0.95;
    return THREE.MathUtils.lerp(0.15, 0.95, (currentTime - 45.0) / 20.0);
  }, [currentTime]);

  useFrame((_, delta) => {
    if (isInspecting) return;

    // Robotic arm placing WTS dome
    if (armRef.current && wtsDomeRef.current) {
      if (isPlacingDome) {
        armRef.current.rotation.z = Math.sin((currentTime - 6.0) * 0.4) * 0.3;
        wtsDomeRef.current.position.y = THREE.MathUtils.lerp(0.3, 0.05, (currentTime - 6.0) / 12.0);
      } else {
        wtsDomeRef.current.position.y = 0.05;
      }
    }

    // Expanding seismic shockwave ripples
    if (seismicRipplesRef.current && isQuakeActive) {
      const s = ((currentTime * 1.8) % 2.5) + 0.5;
      seismicRipplesRef.current.scale.set(s, s, s);
    }

    // Molten liquid core pulsation
    if (moltenCoreRef.current && isCoreVisible) {
      moltenCoreRef.current.rotation.y += delta * 0.4;
      const pulse = Math.sin(currentTime * 3.0) * 0.05 + 1.0;
      moltenCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.9} color="#fdba74" />
      <directionalLight position={[8, 14, 10]} intensity={3.5} color="#ffffff" castShadow />
      <directionalLight position={[-8, 6, -6]} intensity={1.0} color="#b45309" />

      {/* Atmospheric Settling Dust Particles */}
      <Sparkles
        count={dustCoverage > 0.5 ? 250 : 80}
        scale={[18, 8, 18]}
        size={2.2}
        speed={0.25}
        opacity={0.4}
        color="#fdba74"
      />

      {/* Terrain: Elysium Planitia Volcanic Plains */}
      <group position={[0, -0.4, 0]}>
        {/* Basalt Ground Base */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.5, 4.8, 0.1, 64]} />
          <meshStandardMaterial color="#854d0e" roughness={0.92} metalness={0.08} />
        </mesh>

        {/* The Golden WTS Dome (Seismometer Shield placed on the soil) */}
        <group ref={wtsDomeRef} position={[1.3, 0.05, 0.6]}>
          {/* Gleaming Gold Dome */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.12} />
          </mesh>

          {/* Chainmail Thermal Skirt */}
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.33, 0.35, 0.04, 32]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.4} />
          </mesh>

          {/* Concentric Seismic Wavefront Ripples (Active during Marsquakes) */}
          {isQuakeActive && (
            <group ref={seismicRipplesRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.68, 48]} />
              <meshBasicMaterial
                color="#ef4444"
                transparent
                opacity={Math.sin(currentTime * 4.0) * 0.4 + 0.4}
                side={THREE.DoubleSide}
              />
            </group>
          )}
        </group>

        {/* 3D Planetary Ultrasound: Subterranean Liquid Core Reveal (Active 34.5s - 45.0s) */}
        {isCoreVisible && (
          <group position={[0, -2.4, 0]}>
            {/* Mantle Stratum Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 2.2, 48]} />
              <meshBasicMaterial color="#b45309" transparent opacity={0.5} />
            </mesh>

            {/* Glowing Molten Liquid Iron Core (r = 1,830 km) */}
            <mesh ref={moltenCoreRef}>
              <sphereGeometry args={[0.95, 32, 32]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#ea580c"
                emissiveIntensity={1.2}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={4.0} color="#ffedd5" distance={5.0} />
          </group>
        )}
      </group>

      {/* The Animated InSight Lander Model */}
      <group position={[0, -0.4, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Deployable Robotic Arm (IDA) */}
        <group ref={armRef} position={[0.4, 0.35, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.45, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, -0.2, 0.15]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Accumulating Red Dust Layer over UltraFlex Solar Arrays */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.01, 32]} />
          <meshStandardMaterial
            color="#9a3412"
            transparent
            opacity={dustCoverage * 0.75}
            roughness={0.95}
          />
        </mesh>
      </group>
    </group>
  );
};
