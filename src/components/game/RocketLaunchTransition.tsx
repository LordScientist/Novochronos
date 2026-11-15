import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { SpaceShuttleSpine } from '../canvas/SpaceShuttleSpine';
import { LaunchState } from '../../types/game';
import { Artifact } from '../../types/artifact';
import { gameAudio } from '../../utils/gameAudio';

interface RocketLaunchTransitionProps {
  launchState: LaunchState;
  selectedArtifact: Artifact;
  onLaunchProgress: (state: LaunchState) => void;
  onLaunchComplete: () => void;
}

export const RocketLaunchTransition: React.FC<RocketLaunchTransitionProps> = ({
  launchState,
  selectedArtifact: _selectedArtifact,
  onLaunchProgress,
  onLaunchComplete,
}) => {
  const { camera } = useThree();
  const rocketGroupRef = useRef<THREE.Group>(null);
  const smokeParticlesRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);

  // Time elapsed in current animation phase
  const stateTimerRef = useRef<number>(0);
  const altitudeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Dynamic camera targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 11));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Billowing ground launch smoke puffs
  const groundSmokePuffs = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const angle = (i / 48) * Math.PI * 2;
      const dist = 1.8 + (i % 5) * 0.7;
      return {
        x: Math.cos(angle) * dist,
        y: -3.8 + (Math.random() - 0.5) * 0.4,
        z: Math.sin(angle) * dist,
        scale: 0.8 + Math.random() * 0.8,
        speed: 0.4 + Math.random() * 0.6,
      };
    });
  }, []);

  useFrame((_, delta) => {
    stateTimerRef.current += delta;
    const t = stateTimerRef.current;

    // Camera shake calculation for engine roar
    let shakeX = 0;
    let shakeY = 0;

    switch (launchState) {
      case 'LAUNCH_PREPARATION': {
        // Camera centers on rocket at ground level
        targetCamPos.current.set(0, -1.5, 9.5);
        targetLookAt.current.set(0, -0.5, 0);

        if (t > 2.2) {
          stateTimerRef.current = 0;
          gameAudio.playEngineIgnition(6.0);
          onLaunchProgress('ENGINE_IGNITION');
        }
        break;
      }

      case 'ENGINE_IGNITION': {
        // Low rumble camera shake
        const rumble = Math.min(t / 2.8, 1.0) * 0.045;
        shakeX = (Math.random() - 0.5) * rumble;
        shakeY = (Math.random() - 0.5) * rumble;

        targetCamPos.current.set(0, -2.2, 8.8);
        targetLookAt.current.set(0, -2.5, 0);

        if (flameLightRef.current) {
          flameLightRef.current.intensity = Math.min(t * 5.0, 14.0);
        }

        if (t > 2.8) {
          stateTimerRef.current = 0;
          onLaunchProgress('LIFTOFF');
        }
        break;
      }

      case 'LIFTOFF': {
        // High-frequency acoustic vibration
        const violentShake = 0.08 * (1.0 - Math.min(t / 4.0, 0.7));
        shakeX = (Math.sin(t * 60) + Math.cos(t * 45)) * violentShake;
        shakeY = (Math.cos(t * 55) + Math.sin(t * 38)) * violentShake;

        // Quadratic liftoff acceleration: y = 0.5 * a * t^2
        const accel = 2.4;
        velocityRef.current += accel * delta;
        altitudeRef.current += velocityRef.current * delta;

        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
        }

        // Camera tilts upward tracking the ascending rocket
        targetCamPos.current.set(0, altitudeRef.current * 0.4 - 2.0, 9.2 + altitudeRef.current * 0.15);
        targetLookAt.current.set(0, altitudeRef.current + 0.5, 0);

        if (t > 3.2) {
          stateTimerRef.current = 0;
          onLaunchProgress('ASCENT');
        }
        break;
      }

      case 'ASCENT': {
        // Supersonic vertical acceleration
        const ascentAccel = 7.5;
        velocityRef.current += ascentAccel * delta;
        altitudeRef.current += velocityRef.current * delta;

        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
          // Slight roll along vertical axis during gravity turn
          rocketGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.06;
          rocketGroupRef.current.rotation.x = -Math.min(t * 0.05, 0.35); // Arcing towards orbit
        }

        // Subtle high-speed aerodynamic shudder
        shakeX = Math.sin(t * 40) * 0.025;
        shakeY = Math.cos(t * 35) * 0.025;

        // Camera tracks from behind and below the fire plume
        targetCamPos.current.set(
          Math.sin(t * 0.4) * 2.5,
          altitudeRef.current - 4.5,
          8.5 + Math.min(altitudeRef.current * 0.08, 12.0)
        );
        targetLookAt.current.set(0, altitudeRef.current + 2.0, 0);

        if (t > 4.5) {
          stateTimerRef.current = 0;
          onLaunchProgress('SPACE_TRANSITION');
        }
        break;
      }

      case 'SPACE_TRANSITION': {
        // Rocket continues arcing into orbit and exits frame
        altitudeRef.current += velocityRef.current * delta;
        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
          rocketGroupRef.current.position.z -= delta * 18.0; // Heading into deep space
        }

        // Camera steadies and pans towards the stars and destination world
        targetCamPos.current.set(0, 1.5, 6.0);
        targetLookAt.current.set(0, 0, -25);

        if (t > 3.4) {
          onLaunchComplete();
        }
        break;
      }

      default:
        break;
    }

    // Smooth camera lerp
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + shakeX, delta * 3.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + shakeY, delta * 3.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, delta * 3.5);

    camera.lookAt(targetLookAt.current);

    // Expand ground launch smoke cloud
    if (smokeParticlesRef.current && (launchState === 'ENGINE_IGNITION' || launchState === 'LIFTOFF')) {
      smokeParticlesRef.current.children.forEach((child, i) => {
        const puff = groundSmokePuffs[i];
        if (puff) {
          child.scale.x += delta * puff.speed * 2.2;
          child.scale.y += delta * puff.speed * 1.8;
          child.scale.z += delta * puff.speed * 2.2;
          child.position.x += Math.cos(i) * delta * puff.speed * 1.5;
          child.position.z += Math.sin(i) * delta * puff.speed * 1.5;
        }
      });
    }
  });

  // Calculate sky atmosphere color transitioning into black space
  const isIgnited = launchState !== 'GALLERY' && launchState !== 'LAUNCH_PREPARATION';
  const isAscending = launchState === 'ASCENT' || launchState === 'SPACE_TRANSITION';

  return (
    <group>
      {/* Dynamic Starfield that brightens as atmosphere clears */}
      <Stars
        radius={120}
        depth={60}
        count={5000}
        factor={isAscending ? 5.5 : 2.5}
        saturation={0.5}
        fade
        speed={1.5}
      />

      {/* Atmospheric Ascent Speed Streaks */}
      {isAscending && (
        <Sparkles
          count={350}
          scale={[15, 45, 15]}
          size={5.0}
          speed={4.5}
          color="#ffffff"
          opacity={0.85}
        />
      )}

      {/* Primary Key Lighting */}
      <ambientLight intensity={isAscending ? 0.35 : 0.65} color="#0f172a" />
      <directionalLight position={[18, 28, 16]} intensity={3.5} color="#ffffff" castShadow />
      <directionalLight position={[-16, 12, -14]} intensity={1.8} color="#38bdf8" />

      {/* Massive Engine Plume Point Light */}
      {isIgnited && (
        <pointLight
          ref={flameLightRef}
          position={[0, (rocketGroupRef.current?.position.y || 0) - 4.2, 0]}
          intensity={12}
          distance={35}
          color="#f59e0b"
        />
      )}

      {/* The Central Space Shuttle Launch Stack in Action */}
      <group ref={rocketGroupRef} position={[0, 0, 0]}>
        <SpaceShuttleSpine
          scale={0.92}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        />

        {/* Dynamic Massive Liftoff Flame Cones */}
        {isIgnited && (
          <group position={[0, -4.2, 0]}>
            {/* Center Superheated Core */}
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.8, 0]}>
              <coneGeometry args={[0.65, 2.8, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
            </mesh>
            {/* Outer Expanding Fire Column */}
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -1.6, 0]}>
              <coneGeometry args={[1.2, 4.5, 16]} />
              <meshBasicMaterial color="#ea580c" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -2.4, 0]}>
              <coneGeometry args={[1.8, 6.5, 16]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        )}
      </group>

      {/* Expanding Billowing Launch Smoke Clouds */}
      {isIgnited && (
        <group ref={smokeParticlesRef}>
          {groundSmokePuffs.map((puff, idx) => (
            <mesh key={idx} position={[puff.x, puff.y, puff.z]}>
              <sphereGeometry args={[puff.scale, 8, 8]} />
              <meshStandardMaterial
                color="#cbd5e1"
                roughness={0.9}
                metalness={0.1}
                transparent
                opacity={0.65}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Distant Earth Horizon Curvature in Space Transition */}
      {launchState === 'SPACE_TRANSITION' && (
        <mesh position={[0, -22, -35]} rotation={[-0.4, 0, 0]}>
          <sphereGeometry args={[26, 32, 32]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.6}
            metalness={0.3}
            emissive="#0369a1"
            emissiveIntensity={0.25}
          />
        </mesh>
      )}
    </group>
  );
};
