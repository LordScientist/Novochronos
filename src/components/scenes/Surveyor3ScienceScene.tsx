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

export const Surveyor3ScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const landerGroupRef = useRef<THREE.Group>(null);
  const scoopArmRef = useRef<THREE.Group>(null);
  const apollo12LanderRef = useRef<THREE.Group>(null);
  const astronautGroupRef = useRef<THREE.Group>(null);

  // Timecode phases based on 08-novo8-analysis.md:
  // 00.0 - 22.5s: 1967 quicksand dust fears, sent into the dark to find out
  // 22.7 - 39.5s: 3-bounce landing, surface sampler digs trenches, ground will hold you
  // 40.2 - 54.1s: 2.5 years later, thunderous roar, Apollo 12 lands 500 feet away
  // 54.1 - 64.7s: Pete Conrad & Alan Bean walk up, unbolt TV camera to study space weathering
  // 64.7 - 76.4s: Only robot visited by human travelers on alien world, friends came to visit

  const isBouncing = currentTime >= 22.7 && currentTime <= 30.0;
  const isTrenching = currentTime >= 30.0 && currentTime <= 40.0;
  const isApollo12Landing = currentTime >= 42.0 && currentTime <= 54.0;
  const isAstronautVisit = currentTime >= 54.0 && currentTime <= 76.4;

  useFrame((_, delta) => {
    if (isInspecting) return;

    // 3-bounce landing kinematics (22.7s - 30.0s)
    if (landerGroupRef.current) {
      if (isBouncing) {
        // Multi-bounce parabolic leaps
        const bounceTime = (currentTime - 22.7) * 2.2;
        const bounceHeight = Math.max(0, Math.sin(bounceTime) * 1.2 * Math.exp(-bounceTime * 0.4));
        landerGroupRef.current.position.y = bounceHeight - 0.4;
      } else {
        landerGroupRef.current.position.y = -0.4;
      }
    }

    // Scissor pantograph trenching scoop digging into regolith
    if (scoopArmRef.current) {
      if (isTrenching) {
        scoopArmRef.current.position.z = THREE.MathUtils.lerp(
          scoopArmRef.current.position.z,
          0.9 + Math.sin(currentTime * 2.0) * 0.3,
          delta * 2.5
        );
        scoopArmRef.current.position.y = Math.sin(currentTime * 2.0) * 0.08 - 0.12;
      }
    }

    // Astronauts walking toward Surveyor 3
    if (astronautGroupRef.current && isAstronautVisit) {
      astronautGroupRef.current.position.x = THREE.MathUtils.lerp(
        astronautGroupRef.current.position.x,
        0.8,
        delta * 0.8
      );
      astronautGroupRef.current.position.z = THREE.MathUtils.lerp(
        astronautGroupRef.current.position.z,
        0.6,
        delta * 0.8
      );
    }
  });

  return (
    <group>
      {/* Harsh Vacuum Lunar Solar Illumination */}
      <ambientLight intensity={0.26} color="#94a3b8" />
      <directionalLight position={[10, 16, 12]} intensity={4.2} color="#ffffff" castShadow />
      <directionalLight position={[-12, 6, -8]} intensity={0.35} color="#38bdf8" />

      {/* Terrain: Surveyor Crater Slope (12-degree incline in Ocean of Storms) */}
      <group position={[0, -0.4, 0]}>
        {/* Crater Slope Ground Base */}
        <mesh receiveShadow position={[0, -0.05, 0]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[4.8, 5.0, 0.12, 64]} />
          <meshStandardMaterial color="#1e293b" roughness={0.96} metalness={0.04} />
        </mesh>

        {/* Dug Trenches in Lunar Soil from Surface Sampler Arm */}
        <group position={[0.4, 0.015, 0.7]} rotation={[-Math.PI / 2, 0, 0.2]}>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[i * 0.18, 0, 0]}>
              <planeGeometry args={[0.08, 0.45]} />
              <meshStandardMaterial color="#020617" roughness={0.98} />
            </mesh>
          ))}
        </group>

        {/* Apollo 12 Lunar Module (Intrepid) on the Crater Rim 183m away (Active 42.0s+) */}
        {currentTime >= 42.0 && (
          <group ref={apollo12LanderRef} position={[-2.8, 0.9, -3.2]}>
            {/* Descent Stage */}
            <mesh castShadow>
              <cylinderGeometry args={[0.7, 0.9, 0.5, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Ascent Stage */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.75, 0.5, 0.75]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Rocket Descent Plume (Active during touchdown 42.0s - 50.0s) */}
            {isApollo12Landing && (
              <mesh position={[0, -0.6, 0]}>
                <coneGeometry args={[0.4, 1.2, 16]} />
                <meshBasicMaterial color="#f59e0b" transparent opacity={0.75} />
              </mesh>
            )}
          </group>
        )}

        {/* Apollo 12 Astronauts (Pete Conrad & Alan Bean) Visiting Surveyor 3 (54.0s - 76.4s) */}
        {isAstronautVisit && (
          <group ref={astronautGroupRef} position={[2.5, 0, 2.2]}>
            {/* Pete Conrad Model */}
            <group position={[-0.3, 0.45, 0]}>
              <mesh castShadow>
                <capsuleGeometry args={[0.18, 0.6, 8, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.7} />
              </mesh>
              {/* Gold Mirrored Helmet Visor */}
              <mesh position={[0, 0.35, 0.12]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#eab308" metalness={0.98} roughness={0.05} />
              </mesh>
            </group>

            {/* Alan Bean Model */}
            <group position={[0.3, 0.45, -0.2]}>
              <mesh castShadow>
                <capsuleGeometry args={[0.18, 0.6, 8, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.7} />
              </mesh>
              {/* Gold Mirrored Helmet Visor */}
              <mesh position={[0, 0.35, 0.12]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#eab308" metalness={0.98} roughness={0.05} />
              </mesh>
            </group>
          </group>
        )}
      </group>

      {/* The Animated Surveyor 3 Robotic Lander Model */}
      <group ref={landerGroupRef} position={[0, -0.4, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* Motorized Scissor Pantograph Surface Sampler Arm */}
        <group ref={scoopArmRef} position={[0.35, 0.25, 0.45]}>
          {/* Pantograph Linkage Tubes */}
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.04, 0.65]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Miniature Trenching Scoop Bucket */}
          <mesh position={[0, -0.06, 0.35]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.14]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Cylindrical Vidicon TV Camera on Mast (Unbolted by Conrad & Bean) */}
        <group position={[-0.2, 0.72, 0.15]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.24, 16]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.25}
              transparent
              opacity={currentTime >= 60.0 ? 0.3 : 1.0}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
