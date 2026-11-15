// POWER RUN: The Last Signal — Cinematic Rocket Launch Transition
// Clear unobstructed rocket visibility, physically grounded liftoff, and seamless space countdown

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SpaceShuttleSpine } from '../canvas/SpaceShuttleSpine';
import { LaunchState } from '../../types/game';
import { Artifact } from '../../types/artifact';
import { gameAudio } from '../../utils/gameAudio';
import { FastForward, ShieldCheck } from 'lucide-react';

interface RocketLaunchTransitionProps {
  launchState: LaunchState;
  selectedArtifact: Artifact;
  onLaunchProgress: (state: LaunchState) => void;
  onLaunchComplete: () => void;
}

export const RocketLaunchTransition: React.FC<RocketLaunchTransitionProps> = ({
  launchState,
  selectedArtifact,
  onLaunchProgress,
  onLaunchComplete,
}) => {
  const { camera } = useThree();
  const rocketGroupRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);

  // Animation timeline tracking
  const stateTimerRef = useRef<number>(0);
  const altitudeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Smooth camera targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 14.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Countdown state for pre-run transition
  const [countdownText, setCountdownText] = useState<string>('READY');
  const [countdownSub, setCountdownSub] = useState<string>('CALIBRATING NAVIGATION LANES');

  // Reset timer on stage transition
  useEffect(() => {
    stateTimerRef.current = 0;
  }, [launchState]);

  // Handle launch stages
  useFrame((_, delta) => {
    stateTimerRef.current += delta;
    const t = stateTimerRef.current;

    let shakeX = 0;
    let shakeY = 0;

    switch (launchState) {
      case 'LAUNCH_PREPARATION': {
        // Camera frames the complete rocket stack cleanly from head to nozzle
        targetCamPos.current.set(0, 0.2, 13.5);
        targetLookAt.current.set(0, -0.2, 0);

        if (t > 1.2) {
          stateTimerRef.current = 0;
          gameAudio.playEngineIgnition(3.5);
          onLaunchProgress('ENGINE_IGNITION');
        }
        break;
      }

      case 'ENGINE_IGNITION': {
        // Subdued pad rumbling (subtle camera vibration, strictly NOT obscuring the vehicle)
        const rumble = Math.min(t / 1.5, 1.0) * 0.035;
        shakeX = (Math.random() - 0.5) * rumble;
        shakeY = (Math.random() - 0.5) * rumble;

        targetCamPos.current.set(0, -0.6, 13.0);
        targetLookAt.current.set(0, -1.2, 0);

        if (flameLightRef.current) {
          flameLightRef.current.intensity = Math.min(t * 12.0, 18.0);
        }

        if (t > 1.5) {
          stateTimerRef.current = 0;
          onLaunchProgress('LIFTOFF');
        }
        break;
      }

      case 'LIFTOFF': {
        // Liftoff: Progressive vertical acceleration
        const liftoffShake = 0.045 * (1.0 - Math.min(t / 2.2, 0.6));
        shakeX = (Math.sin(t * 50) + Math.cos(t * 35)) * liftoffShake;
        shakeY = (Math.cos(t * 45) + Math.sin(t * 30)) * liftoffShake;

        // Quadratic vertical climb
        velocityRef.current += 5.5 * delta;
        altitudeRef.current += velocityRef.current * delta;

        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
        }

        // Camera tracks the ascending rocket while keeping it in the upper-third
        targetCamPos.current.set(0, altitudeRef.current * 0.65 - 0.5, 14.0);
        targetLookAt.current.set(0, altitudeRef.current * 0.85, 0);

        if (t > 2.2) {
          stateTimerRef.current = 0;
          onLaunchProgress('ASCENT');
        }
        break;
      }

      case 'ASCENT': {
        // Transonic atmospheric climb
        velocityRef.current += 9.5 * delta;
        altitudeRef.current += velocityRef.current * delta;

        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
        }

        // Camera tilts up towards sky
        targetCamPos.current.set(0, altitudeRef.current * 0.75, 15.0);
        targetLookAt.current.set(0, altitudeRef.current + 1.0, 0);

        if (t > 1.8) {
          stateTimerRef.current = 0;
          onLaunchProgress('SPACE_TRANSITION');
        }
        break;
      }

      case 'SPACE_TRANSITION': {
        // Space transition: Rocket accelerates into the orbital cosmos
        velocityRef.current += 14.0 * delta;
        altitudeRef.current += velocityRef.current * delta;

        if (rocketGroupRef.current) {
          rocketGroupRef.current.position.y = altitudeRef.current;
        }

        targetCamPos.current.set(0, altitudeRef.current * 0.85, 17.0);
        targetLookAt.current.set(0, altitudeRef.current + 4.0, 0);

        if (t > 1.5) {
          stateTimerRef.current = 0;
          onLaunchProgress('COUNTDOWN');
        }
        break;
      }

      case 'COUNTDOWN': {
        // Countdown sequence leading directly into gameplay
        if (t < 0.5) {
          if (countdownText !== '3') {
            setCountdownText('3');
            setCountdownSub('INITIALIZING ARTIFACT ONBOARD POWER');
            gameAudio.playCountdownBeep(false);
          }
        } else if (t < 1.0) {
          if (countdownText !== '2') {
            setCountdownText('2');
            setCountdownSub('SYNCHRONIZING 3-LANE RECON GRID');
            gameAudio.playCountdownBeep(false);
          }
        } else if (t < 1.5) {
          if (countdownText !== '1') {
            setCountdownText('1');
            setCountdownSub('HAZARD SENSORS ENGAGED');
            gameAudio.playCountdownBeep(false);
          }
        } else if (t < 2.0) {
          if (countdownText !== 'GO!') {
            setCountdownText('GO!');
            setCountdownSub('THE LAST SIGNAL — RUN ACTIVE');
            gameAudio.playCountdownBeep(true);
          }
        } else {
          onLaunchComplete();
        }
        break;
      }

      default:
        break;
    }

    // Smooth camera interpolation
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + shakeX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + shakeY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, 0.08);
    camera.lookAt(targetLookAt.current);
  });

  const isIgnited =
    launchState === 'ENGINE_IGNITION' ||
    launchState === 'LIFTOFF' ||
    launchState === 'ASCENT' ||
    launchState === 'SPACE_TRANSITION';

  const isAscending =
    launchState === 'LIFTOFF' ||
    launchState === 'ASCENT' ||
    launchState === 'SPACE_TRANSITION';

  return (
    <>
      {/* ----------------------------------------------------------- */}
      {/* 3D WebGL Scene Elements                                     */}
      {/* ----------------------------------------------------------- */}
      <group>
        {/* Deep Stars in Upper Atmosphere and Space */}
        <Stars
          radius={100}
          depth={50}
          count={4000}
          factor={isAscending ? 5.0 : 2.5}
          fade
          speed={1.0}
        />

        {/* Crisp Studio Key & Fill Lights (Accentuates Rocket Silhouette) */}
        <ambientLight intensity={isAscending ? 0.45 : 0.75} color="#0f172a" />
        <directionalLight position={[16, 24, 18]} intensity={3.8} color="#ffffff" />
        <directionalLight position={[-16, 10, 10]} intensity={2.0} color="#38bdf8" />
        <directionalLight position={[0, -10, 12]} intensity={1.2} color="#f59e0b" />

        {/* Engine Plume Light (Placed strictly under nozzles) */}
        {isIgnited && (
          <pointLight
            ref={flameLightRef}
            position={[0, (rocketGroupRef.current?.position.y || 0) - 4.5, -0.2]}
            intensity={16}
            distance={28}
            color="#f59e0b"
          />
        )}

        {/* --------------------------------------------------------- */}
        {/* THE CENTRAL SPACE SHUTTLE STACK (Fully Visible Foreground) */}
        {/* --------------------------------------------------------- */}
        <group ref={rocketGroupRef} position={[0, 0, 0]}>
          <SpaceShuttleSpine scale={0.94} position={[0, 0, 0]} rotation={[0, 0, 0]} />

          {/* Focused Engine Plumes Placed STRICTLY Beneath the Rocket */}
          {isIgnited && (
            <group position={[0, -4.25, -0.3]}>
              {/* Center Superheated White-Hot Core */}
              <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.6, 0]}>
                <coneGeometry args={[0.42, 2.4, 16]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
              </mesh>

              {/* Main SSME & SRB Orange Plume Column */}
              <mesh rotation={[Math.PI, 0, 0]} position={[0, -1.8, 0]}>
                <coneGeometry args={[0.95, 4.6, 16]} />
                <meshBasicMaterial
                  color="#ea580c"
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Outer Amber Expansion Plume (Far below the vehicle) */}
              <mesh rotation={[Math.PI, 0, 0]} position={[0, -3.2, 0]}>
                <coneGeometry args={[1.5, 7.5, 16]} />
                <meshBasicMaterial
                  color="#f59e0b"
                  transparent
                  opacity={0.35}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          )}
        </group>

        {/* Launch Pad Mobile Launcher Platform Base */}
        <group position={[0, -4.8, 0]}>
          {/* Main Pad Platform */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[10, 1.0, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Flame Trench Cutout */}
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[4.5, 0.4, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>

        {/* Curved Earth Horizon in Space Transition */}
        {launchState === 'SPACE_TRANSITION' && (
          <mesh position={[0, -26, -30]} rotation={[-0.4, 0, 0]}>
            <sphereGeometry args={[22, 32, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.6}
              emissive="#0369a1"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
      </group>

      {/* ----------------------------------------------------------- */}
      {/* HTML TELEMETRY & COUNTDOWN BROADCAST OVERLAY                */}
      {/* ----------------------------------------------------------- */}
      <Html fullscreen zIndexRange={[40, 50]}>
        <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6">
          {/* Top Telemetry Header */}
          <div className="w-full flex items-center justify-between pointer-events-auto">
            <div className="bg-slate-950/85 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2.5 shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
                NASA LAUNCH CONTROL // {launchState.replace('_', ' ')}
              </span>
            </div>

            {/* Skip Button */}
            <button
              onClick={onLaunchComplete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/20 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all shadow-lg cursor-pointer pointer-events-auto active:scale-95"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>SKIP LAUNCH</span>
            </button>
          </div>

          {/* Pre-Game COUNTDOWN Overlay: Reveals Selected Artifact */}
          {launchState === 'COUNTDOWN' && (
            <div className="my-auto mx-auto max-w-md w-full text-center space-y-4 animate-fadeIn">
              {/* Artifact Identification Badge */}
              <div className="bg-slate-950/90 border border-sky-400/40 p-4 rounded-2xl backdrop-blur-md shadow-2xl space-y-2">
                <div className="flex items-center justify-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SPACECRAFT DEPLOYMENT CONFIRMED</span>
                </div>

                <h3 className="text-xl font-bold font-orbitron text-white">
                  {selectedArtifact.name}
                </h3>

                <p className="text-xs font-mono text-slate-300">
                  DESTINATION: <span className="text-amber-400 font-bold">{selectedArtifact.celestialBody.toUpperCase()}</span> ({selectedArtifact.landingSite})
                </p>
              </div>

              {/* Giant Countdown Callout */}
              <div className="space-y-1">
                <h1 className="text-6xl sm:text-7xl font-orbitron font-black text-amber-400 tracking-wider animate-pulse drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">
                  {countdownText}
                </h1>
                <p className="font-mono text-xs text-slate-300 tracking-widest uppercase">
                  {countdownSub}
                </p>
              </div>
            </div>
          )}

          <div />
        </div>
      </Html>
    </>
  );
};
