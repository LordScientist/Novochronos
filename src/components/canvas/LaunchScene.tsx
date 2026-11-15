import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { SkipForward } from 'lucide-react';

interface LaunchSceneProps {
  onComplete: () => void;
}

const RocketMesh: React.FC<{ altitude: number }> = ({ altitude }) => {
  const rocketRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(Date.now() * 0.05) * 0.3;
    }
  });

  return (
    <group ref={rocketRef} position={[0, Math.min(altitude * 0.05, 12), 0]}>
      {/* Rocket Main Core Body */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Aerodynamic Nose Cone */}
      <mesh castShadow position={[0, 4.5, 0]}>
        <coneGeometry args={[0.4, 1.2, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 4 Stabilizing Base Fins */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} position={[0, 0.4, 0]} rotation={[0, angle, 0]}>
          <boxGeometry args={[1.2, 0.6, 0.05]} />
          <meshStandardMaterial color="#e05a36" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Rocket Engine Exhaust Flame */}
      <mesh ref={flameRef} position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 1.6, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 1.0, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Engine Exhaust Light */}
      <pointLight position={[0, -1, 0]} intensity={4.5} distance={15} color="#f59e0b" />
    </group>
  );
};

export const LaunchScene: React.FC<LaunchSceneProps> = ({ onComplete }) => {
  const [altitude, setAltitude] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  const [hasLaunched, setHasLaunched] = useState<boolean>(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasLaunched(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (!hasLaunched) return;

    const interval = setInterval(() => {
      setAltitude((prev) => {
        const next = prev + 4.5;
        setVelocity(Math.round(next * 28));

        if (next >= 400) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [hasLaunched, onComplete]);

  return (
    <div className="relative w-full h-screen bg-space-950 overflow-hidden select-none">
      {/* 3D Launch Viewport */}
      <div className="absolute inset-0">
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
          <color attach="background" args={['#030712']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />

          <Stars radius={100} depth={50} count={3000} factor={4} fade />
          <Sparkles count={80} scale={[10, 10, 10]} size={3} color="#f59e0b" />

          {/* Launch Pad Ground Base */}
          <mesh receiveShadow position={[0, -2, 0]}>
            <cylinderGeometry args={[8, 9, 1, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>

          <RocketMesh altitude={altitude} />
        </Canvas>
      </div>

      {/* HUD Telemetry Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 md:p-10 flex flex-col justify-between font-mono z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <img src="/nasa-logo.svg" alt="NASA" className="w-10 h-8 object-contain" />
            <div>
              <span className="text-[10px] text-amber-400 block tracking-widest uppercase">
                STAGE 3 // ATMOSPHERIC ASCENT
              </span>
              <h3 className="font-orbitron text-sm font-bold text-white tracking-wider">
                TRAJECTORY INSERTION
              </h3>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs backdrop-blur-md transition-colors"
          >
            <span>SKIP LAUNCH</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Countdown or Velocity Display */}
        <div className="text-center">
          {!hasLaunched ? (
            <div className="animate-pulse">
              <span className="font-orbitron text-7xl md:text-9xl font-black text-amber-400 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                T-{countdown}
              </span>
              <p className="text-xs text-slate-400 tracking-widest mt-2">IGNITION SEQUENCE COMMENCING</p>
            </div>
          ) : (
            <div className="glass-panel px-6 py-4 rounded-2xl max-w-sm mx-auto border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">CURRENT ALTITUDE</span>
              <span className="font-orbitron text-3xl md:text-4xl font-extrabold text-white">
                {Math.round(altitude)} KM
              </span>
              <div className="mt-2 text-xs text-amber-400 flex justify-between font-bold">
                <span>VELOCITY: {velocity} KM/H</span>
                <span>{altitude >= 100 ? 'KÁRMÁN LINE BREACHED' : 'TROPOSPHERE'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar */}
        <div className="w-full max-w-xl mx-auto">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-sky-400 h-full transition-all duration-100"
              style={{ width: `${Math.min((altitude / 400) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>GROUND (0 KM)</span>
            <span>KÁRMÁN LINE (100 KM)</span>
            <span>LEO INSERTION (400 KM)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
