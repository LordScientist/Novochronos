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

export const IngenuityScienceScene: React.FC<ScienceSceneProps> = ({
  artifact,
  currentTime,
  isInspecting = false,
}) => {
  const craftGroupRef = useRef<THREE.Group>(null);
  const upperRotorRef = useRef<THREE.Group>(null);
  const lowerRotorRef = useRef<THREE.Group>(null);
  const downwashRingsRef = useRef<THREE.Group>(null);
  const fabricCalloutRef = useRef<THREE.Group>(null);

  // Timecode phases based on 02-novo2-analysis.md:
  // 00.0 - 12.5s: Thin air aerodynamics introduction (resting on ground)
  // 13.0 - 20.6s: Spin-up, takeoff to 3m, rock-steady hover
  // 21.2 - 32.2s: Wright Flyer muslin fabric inspection
  // 33.0 - 49.6s: Rapid forward flight (72 flights, scouting for Perseverance)
  // 50.1 - 56.5s: Flight 72 descent, rotor tip strike on sand ripple
  // 56.5 - 76.5s: Permanent rest at Airfield Valinor Hills, weather station awakenings

  const isFlying = currentTime >= 13.0 && currentTime <= 56.5;
  const isHovering = currentTime >= 13.0 && currentTime <= 21.0;
  const isCruising = currentTime >= 33.0 && currentTime <= 49.6;
  const isFlight72Crash = currentTime >= 50.0 && currentTime <= 56.5;

  // Compute flight altitude Y
  const altitude = useMemo(() => {
    if (currentTime < 13.0) return 0.0;
    if (currentTime < 16.0) return THREE.MathUtils.lerp(0.0, 1.8, (currentTime - 13.0) / 3.0);
    if (currentTime < 52.0) return 1.8;
    if (currentTime <= 56.0) return THREE.MathUtils.lerp(1.8, 0.0, (currentTime - 52.0) / 4.0);
    return 0.0;
  }, [currentTime]);

  // Compute forward horizontal displacement & bank angle
  const cruiseX = useMemo(() => {
    if (isCruising) {
      return Math.sin((currentTime - 33.0) * 0.8) * 1.5;
    }
    return 0.0;
  }, [currentTime, isCruising]);

  useFrame((_, delta) => {
    if (isInspecting) return;

    // Coaxial counter-rotating rotors
    const rotorSpeed = isFlying ? delta * 36 : (currentTime >= 56.5 ? 0 : delta * 4);
    if (upperRotorRef.current) upperRotorRef.current.rotation.y += rotorSpeed;
    if (lowerRotorRef.current) lowerRotorRef.current.rotation.y -= rotorSpeed;

    // Craft group position & flight dynamics
    if (craftGroupRef.current) {
      craftGroupRef.current.position.y = altitude - 0.4;
      craftGroupRef.current.position.x = cruiseX;

      if (isCruising) {
        // Dynamic pitch and roll banking into the turn
        craftGroupRef.current.rotation.z = Math.sin((currentTime - 33.0) * 0.8) * -0.18;
        craftGroupRef.current.rotation.x = 0.12;
      } else if (isHovering) {
        craftGroupRef.current.rotation.z = Math.sin(currentTime * 4.0) * 0.015;
        craftGroupRef.current.rotation.x = Math.cos(currentTime * 3.5) * 0.015;
      } else if (isFlight72Crash) {
        // High-frequency vibration and abrupt tilt during ground strike
        craftGroupRef.current.rotation.z = (Math.sin(currentTime * 20.0) * 0.05) - 0.15;
        craftGroupRef.current.rotation.x = -0.1;
      } else {
        craftGroupRef.current.rotation.z = 0;
        craftGroupRef.current.rotation.x = 0;
      }
    }

    // Downwash sand disturbance ring scaling
    if (downwashRingsRef.current && isFlying) {
      downwashRingsRef.current.scale.x = (currentTime % 1.2) * 1.8 + 0.8;
      downwashRingsRef.current.scale.z = (currentTime % 1.2) * 1.8 + 0.8;
    }
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={1.1} color="#fcd34d" />
      <directionalLight position={[6, 16, 8]} intensity={3.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 4, -6]} intensity={1.2} color="#ea580c" />

      {/* Atmospheric Dust Particles */}
      <Sparkles
        count={isFlying ? 300 : 90}
        scale={[18, 10, 18]}
        size={isFlying ? 3.5 : 1.8}
        speed={isFlying ? 1.8 : 0.3}
        opacity={0.5}
        color="#fdba74"
      />

      {/* Jezero Crater Terrain: Sand Ripples & Valinor Hills */}
      <group position={[0, -0.4, 0]}>
        {/* Ground Base */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[4.5, 4.8, 0.1, 64]} />
          <meshStandardMaterial color="#9a3412" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Dynamic Rotor Downwash Ripple Disk */}
        {isFlying && (
          <group ref={downwashRingsRef} position={[cruiseX, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.35, 48]} />
            <meshBasicMaterial color="#fdba74" transparent opacity={0.4} />
          </group>
        )}

        {/* Flight 72 Sand Ripple Ridge with Rotor Impact Mark */}
        <group position={[0.6, 0.04, -0.2]} rotation={[0, 0.3, 0]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[1.2, 1.4, 0.08, 32]} />
            <meshStandardMaterial color="#b45309" roughness={0.94} />
          </mesh>
          {/* Debris particles from rotor strike (51s onwards) */}
          {currentTime >= 51.0 && (
            <mesh position={[0.3, 0.06, 0.1]}>
              <boxGeometry args={[0.08, 0.02, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
          )}
        </group>
      </group>

      {/* The Animated Ingenuity Helicopter Model */}
      <group ref={craftGroupRef} position={[0, -0.4, 0]}>
        <ArtifactModel
          artifact={artifact}
          autoRotate={false}
          isActionActive={true}
          actionTime={currentTime}
        />

        {/* High-Fidelity Upper Counter-Rotating Rotor Assembly */}
        <group ref={upperRotorRef} position={[0, 0.58, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.015, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
          </mesh>
        </group>

        {/* High-Fidelity Lower Counter-Rotating Rotor Assembly */}
        <group ref={lowerRotorRef} position={[0, 0.46, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.015, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
          </mesh>
        </group>

        {/* 1903 Wright Flyer Muslin Fabric Swatch Callout (Active 21.2s - 32.2s) */}
        {currentTime >= 21.0 && currentTime <= 32.5 && (
          <group ref={fabricCalloutRef} position={[0, 0.68, 0]}>
            {/* Glowing Callout Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.1, 32]} />
              <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
            </mesh>

            {/* The Tiny Square Muslin Swatch */}
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.07, 0.07]} />
              <meshStandardMaterial color="#fef08a" roughness={0.95} />
            </mesh>
          </group>
        )}

        {/* Post-Flight 72 Weather Station Telemetry Pulse (57.0s - 76.5s) */}
        {currentTime >= 57.0 && (
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={Math.sin(currentTime * 3.0) * 0.5 + 0.5}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
