import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Artifact } from '../../types/artifact';
import { GameTelemetry, PlayerControls } from '../../types/game';
import { ArtifactModel } from '../canvas/ArtifactModel';
import { getMartianTerrainHeight } from '../canvas/PlanetaryMartianEnvironment';
import { GameHUD } from './GameHUD';
import { gameAudio } from '../../utils/gameAudio';

interface PowerRunGameProps {
  selectedArtifact: Artifact;
  onExit: () => void;
  onRestart: () => void;
}

// -------------------------------------------------------------
// Surface Height Calculation for Celestial Worlds
// -------------------------------------------------------------
function getTerrainHeight(x: number, z: number, destination: 'Moon' | 'Mars' | 'Deep Space'): number {
  if (destination === 'Deep Space') {
    // In deep space, zero-g floating with gentle cosmic drift
    return Math.sin(x * 0.1) * 0.3 + Math.cos(z * 0.1) * 0.3;
  }
  if (destination === 'Moon') {
    // Lunar rolling terrain with subtle impact crater depressions
    const crater = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.6;
    const micro = Math.sin(x * 0.2 + z * 0.15) * 0.18;
    return -0.2 + crater + micro;
  }
  // Default to Mars dunes
  return getMartianTerrainHeight(x, z);
}

// -------------------------------------------------------------
// Interactive 3D World Scene
// -------------------------------------------------------------
interface GameWorldSceneProps {
  selectedArtifact: Artifact;
  destination: 'Moon' | 'Mars' | 'Deep Space';
  controlsRef: React.MutableRefObject<PlayerControls>;
  telemetry: GameTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<GameTelemetry>>;
  isControlActive: boolean;
}

const GameWorldScene: React.FC<GameWorldSceneProps> = ({
  selectedArtifact,
  destination,
  controlsRef,
  telemetry,
  setTelemetry,
  isControlActive,
}) => {
  const { camera } = useThree();

  // Vehicle kinematic state
  const vehiclePos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const vehicleRotY = useRef<number>(0);
  const vehicleSpeed = useRef<number>(0);
  const vehicleMeshRef = useRef<THREE.Group>(null);

  // Power pickups & Science Samples
  const [powerCells] = useState<{ id: number; x: number; z: number; collected: boolean }[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 60,
      z: -20 - i * 22,
      collected: false,
    }));
  });

  const [scienceSamples] = useState<{ id: number; x: number; z: number; collected: boolean }[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 50,
      z: -30 - i * 35,
      collected: false,
    }));
  });

  // Procedural Ground Terrain Mesh
  const terrainMesh = useMemo(() => {
    if (destination === 'Deep Space') return null;

    const size = 320;
    const segments = 120;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const worldZ = -vy;
      const yWorld = getTerrainHeight(vx, worldZ, destination);
      pos.setZ(i, yWorld);
    }
    geom.computeVertexNormals();

    const isMars = destination === 'Mars';
    const mat = new THREE.MeshStandardMaterial({
      color: isMars ? '#853823' : '#475569',
      roughness: 0.95,
      metalness: 0.05,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0;
    mesh.receiveShadow = true;
    return mesh;
  }, [destination]);

  // Scattered rocks / boulders / space debris
  const obstacles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const ox = (Math.random() - 0.5) * 120;
      const oz = -15 - i * 7.5;
      const oy = getTerrainHeight(ox, oz, destination);
      const s = 0.6 + Math.random() * 1.4;
      return { ox, oy, oz, s };
    });
  }, [destination]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const ctrl = controlsRef.current;

    // Movement physics
    if (isControlActive && !telemetry.isGameOver) {
      const maxSpeed = ctrl.boost ? 22 : 11;
      const accel = ctrl.boost ? 14 : 7;
      const decel = 5;
      const turnSpeed = 2.2;

      // Steering
      if (ctrl.left) {
        vehicleRotY.current += turnSpeed * dt;
      }
      if (ctrl.right) {
        vehicleRotY.current -= turnSpeed * dt;
      }

      // Acceleration / Braking
      if (ctrl.forward) {
        vehicleSpeed.current = Math.min(vehicleSpeed.current + accel * dt, maxSpeed);
      } else if (ctrl.backward) {
        vehicleSpeed.current = Math.max(vehicleSpeed.current - accel * dt, -4);
      } else {
        // Natural friction coasting
        if (vehicleSpeed.current > 0) {
          vehicleSpeed.current = Math.max(0, vehicleSpeed.current - decel * dt);
        } else if (vehicleSpeed.current < 0) {
          vehicleSpeed.current = Math.min(0, vehicleSpeed.current + decel * dt);
        }
      }

      // Update vehicle coordinates
      const forwardX = Math.sin(vehicleRotY.current);
      const forwardZ = -Math.cos(vehicleRotY.current);

      vehiclePos.current.x += forwardX * vehicleSpeed.current * dt;
      vehiclePos.current.z += forwardZ * vehicleSpeed.current * dt;

      // Adjust height to terrain
      const groundY = getTerrainHeight(vehiclePos.current.x, vehiclePos.current.z, destination);
      const isFlyingDrone = selectedArtifact.id === 'ingenuity-helicopter';
      const targetY = isFlyingDrone ? groundY + 2.2 + Math.sin(state.clock.elapsedTime * 3) * 0.2 : groundY + 0.35;
      vehiclePos.current.y = THREE.MathUtils.lerp(vehiclePos.current.y, targetY, dt * 10);

      // Power depletion
      const baseDrain = 0.65; // % per sec
      const moveDrain = Math.abs(vehicleSpeed.current) * 0.45;
      const boostDrain = ctrl.boost ? 4.5 : 0;
      const totalDrain = (baseDrain + moveDrain + boostDrain) * dt;

      setTelemetry((prev) => {
        const nextPower = Math.max(0, prev.power - totalDrain);
        const distanceDelta = Math.abs(vehicleSpeed.current) * dt;
        const speedKmh = Math.abs(vehicleSpeed.current) * 3.6;

        if (nextPower <= 0 && !prev.isGameOver) {
          gameAudio.playDepletedAlarm();
          return {
            ...prev,
            power: 0,
            distance: prev.distance + distanceDelta,
            speed: 0,
            isGameOver: true,
          };
        }

        return {
          ...prev,
          power: nextPower,
          distance: prev.distance + distanceDelta,
          speed: speedKmh,
        };
      });

      // Check collision with Power Pickups
      powerCells.forEach((cell) => {
        if (!cell.collected) {
          const dx = vehiclePos.current.x - cell.x;
          const dz = vehiclePos.current.z - cell.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 3.2) {
            cell.collected = true;
            gameAudio.playPowerPickup();
            setTelemetry((prev) => ({
              ...prev,
              power: Math.min(100, prev.power + 28),
            }));
            // Reposition cell further ahead down the terrain
            cell.z -= 240;
            cell.x = vehiclePos.current.x + (Math.random() - 0.5) * 50;
            cell.collected = false;
          }
        }
      });

      // Check collision with Science Samples
      scienceSamples.forEach((sample) => {
        if (!sample.collected) {
          const dx = vehiclePos.current.x - sample.x;
          const dz = vehiclePos.current.z - sample.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 3.2) {
            sample.collected = true;
            gameAudio.playSampleCollected();
            setTelemetry((prev) => ({
              ...prev,
              samplesCollected: prev.samplesCollected + 1,
              distance: prev.distance + 150, // Bonus distance reward
            }));
            sample.z -= 280;
            sample.x = vehiclePos.current.x + (Math.random() - 0.5) * 45;
            sample.collected = false;
          }
        }
      });
    }

    // Position the Vehicle 3D Group
    if (vehicleMeshRef.current) {
      vehicleMeshRef.current.position.copy(vehiclePos.current);
      vehicleMeshRef.current.rotation.y = vehicleRotY.current;

      // Slight tilt when steering
      if (controlsRef.current.left) {
        vehicleMeshRef.current.rotation.z = THREE.MathUtils.lerp(vehicleMeshRef.current.rotation.z, 0.12, dt * 6);
      } else if (controlsRef.current.right) {
        vehicleMeshRef.current.rotation.z = THREE.MathUtils.lerp(vehicleMeshRef.current.rotation.z, -0.12, dt * 6);
      } else {
        vehicleMeshRef.current.rotation.z = THREE.MathUtils.lerp(vehicleMeshRef.current.rotation.z, 0, dt * 6);
      }
    }

    // Dynamic Third-Person Chase Camera
    const camDistance = 8.5;
    const camHeight = 3.6;
    const targetCamX = vehiclePos.current.x - Math.sin(vehicleRotY.current) * camDistance;
    const targetCamZ = vehiclePos.current.z + Math.cos(vehicleRotY.current) * camDistance;
    const targetCamY = vehiclePos.current.y + camHeight;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, dt * 4.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, dt * 4.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, dt * 4.5);

    // Camera looks slightly ahead of the vehicle
    const lookTarget = new THREE.Vector3(
      vehiclePos.current.x + Math.sin(vehicleRotY.current) * 4.0,
      vehiclePos.current.y + 0.8,
      vehiclePos.current.z - Math.cos(vehicleRotY.current) * 4.0
    );
    camera.lookAt(lookTarget);
  });

  const isMars = destination === 'Mars';
  const isMoon = destination === 'Moon';

  return (
    <group>
      {/* Planetary Atmosphere Fog */}
      {isMars && <fog attach="fog" args={['#240d07', 20, 160]} />}
      {isMoon && <fog attach="fog" args={['#050811', 25, 180]} />}

      {/* Starfield */}
      <Stars radius={140} depth={60} count={6000} factor={4} saturation={0.6} fade speed={1} />

      {/* Planetary Lighting */}
      <ambientLight intensity={isMars ? 0.6 : 0.35} color={isMars ? '#fda4af' : '#94a3b8'} />
      <directionalLight
        position={[25, 45, 25]}
        intensity={isMars ? 2.8 : 3.8}
        color={isMars ? '#fff1f2' : '#ffffff'}
        castShadow
      />
      <directionalLight
        position={[-20, 15, -20]}
        intensity={1.2}
        color={isMars ? '#b91c1c' : '#38bdf8'}
      />

      {/* Procedural Terrain Mesh */}
      {terrainMesh && <primitive object={terrainMesh} />}

      {/* Distant Earth for Moon Missions */}
      {isMoon && (
        <mesh position={[40, 35, -90]}>
          <sphereGeometry args={[14, 32, 32]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.7}
            metalness={0.2}
            emissive="#0369a1"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Planetary Rocks / Boulders */}
      {obstacles.map((obs, idx) => (
        <mesh key={idx} position={[obs.ox, obs.oy + obs.s * 0.35, obs.oz]} scale={[obs.s, obs.s * 0.8, obs.s]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={isMars ? '#571c14' : '#334155'}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Floating Solar Recharge Power Cells */}
      {powerCells.map((cell) => (
        <group key={cell.id} position={[cell.x, getTerrainHeight(cell.x, cell.z, destination) + 1.2, cell.z]}>
          <mesh rotation={[0.4, 0.4, 0]}>
            <octahedronGeometry args={[0.75, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.8}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <pointLight color="#38bdf8" intensity={2.2} distance={8} />
          <Sparkles count={15} scale={[2, 2, 2]} size={3.5} color="#38bdf8" speed={2} />
        </group>
      ))}

      {/* Geological Science Sample Nodes */}
      {scienceSamples.map((sample) => (
        <group key={sample.id} position={[sample.x, getTerrainHeight(sample.x, sample.z, destination) + 0.9, sample.z]}>
          <mesh>
            <icosahedronGeometry args={[0.65, 1]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#d97706"
              emissiveIntensity={1.6}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <pointLight color="#f59e0b" intensity={2.0} distance={7} />
          <Sparkles count={15} scale={[1.8, 1.8, 1.8]} size={3.0} color="#f59e0b" speed={1.5} />
        </group>
      ))}

      {/* The Player's Selected Artifact in Full Driving/Flying Action */}
      <group ref={vehicleMeshRef}>
        <ArtifactModel
          artifact={selectedArtifact}
          autoRotate={false}
          isActionActive={true}
        />

        {/* Thruster / Dust Particles when Driving */}
        {vehicleSpeed.current > 1 && (
          <Sparkles
            count={25}
            scale={[1.5, 0.5, 2.5]}
            position={[0, 0, 1.2]}
            size={2.5}
            color={isMars ? '#f97316' : '#cbd5e1'}
            speed={3}
          />
        )}
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// Root POWER RUN Component
// -------------------------------------------------------------
export const PowerRunGame: React.FC<PowerRunGameProps> = ({
  selectedArtifact,
  onExit,
  onRestart,
}) => {
  // Determine Destination Realm based on Artifact
  const destination: 'Moon' | 'Mars' | 'Deep Space' = useMemo(() => {
    if (selectedArtifact.celestialBody === 'Mars') return 'Mars';
    if (selectedArtifact.celestialBody === 'Moon') return 'Moon';
    return 'Deep Space';
  }, [selectedArtifact]);

  // Live Telemetry
  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    power: 100,
    maxPower: 100,
    distance: 0,
    speed: 0,
    samplesCollected: 0,
    boostAvailable: true,
    isGameOver: false,
    destination,
  });

  // Countdown State: READY -> 3 -> 2 -> 1 -> GO!
  const [countdown, setCountdown] = useState<string | null>('READY');
  const [isControlActive, setIsControlActive] = useState<boolean>(false);

  // Player controls reference for 60fps frame loop
  const controlsRef = useRef<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
  });

  // Countdown Sequence on Mount
  useEffect(() => {
    const steps = [
      { text: 'READY', time: 0 },
      { text: '3', time: 900 },
      { text: '2', time: 1800 },
      { text: '1', time: 2700 },
      { text: 'GO!', time: 3600 },
    ];

    steps.forEach(({ text, time }) => {
      setTimeout(() => {
        setCountdown(text);
        gameAudio.playCountdownBeep(text === 'GO!');
      }, time);
    });

    const finishTimeout = setTimeout(() => {
      setCountdown(null);
      setIsControlActive(true);
    }, 4500);

    return () => clearTimeout(finishTimeout);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isControlActive || telemetry.isGameOver) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsRef.current.right = true;
          break;
        case 'Space':
          if (!controlsRef.current.boost) {
            controlsRef.current.boost = true;
            gameAudio.playBoostSound();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsRef.current.right = false;
          break;
        case 'Space':
          controlsRef.current.boost = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isControlActive, telemetry.isGameOver]);

  const handleBoostClick = useCallback(() => {
    if (!isControlActive || telemetry.isGameOver) return;
    controlsRef.current.boost = true;
    gameAudio.playBoostSound();
    setTimeout(() => {
      controlsRef.current.boost = false;
    }, 800);
  }, [isControlActive, telemetry.isGameOver]);

  return (
    <div className="fixed inset-0 z-30 bg-black">
      {/* 3D WebGL Canvas Layer */}
      <Canvas
        camera={{ position: [0, 4, 10], fov: 50, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color
          attach="background"
          args={[destination === 'Mars' ? '#1c0a06' : destination === 'Moon' ? '#03050c' : '#010206']}
        />
        <GameWorldScene
          selectedArtifact={selectedArtifact}
          destination={destination}
          controlsRef={controlsRef}
          telemetry={telemetry}
          setTelemetry={setTelemetry}
          isControlActive={isControlActive}
        />
      </Canvas>

      {/* Live Telemetry HUD & Overlay Controls */}
      <GameHUD
        telemetry={telemetry}
        selectedArtifact={selectedArtifact}
        countdown={countdown}
        onRestart={onRestart}
        onExit={onExit}
        onBoost={handleBoostClick}
      />
    </div>
  );
};
