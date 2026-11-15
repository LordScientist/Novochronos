import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Artifact } from '../../types/artifact';
import { ArtifactModel } from './ArtifactModel';
import { RotateCcw, Maximize2, Moon, Flame, Compass } from 'lucide-react';

interface ContextualArtifactViewerProps {
  artifact: Artifact;
  autoRotate?: boolean;
}

export const ContextualArtifactViewer: React.FC<ContextualArtifactViewerProps> = ({
  artifact,
  autoRotate: initialAutoRotate = true,
}) => {
  const [autoRotate, setAutoRotate] = useState<boolean>(initialAutoRotate);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const controlsRef = useRef<any>(null);

  // Determine environmental context based on artifact's celestial body
  const environmentType = useMemo<'mars' | 'moon' | 'deep-space'>(() => {
    if (artifact.celestialBody === 'Mars') return 'mars';
    if (artifact.celestialBody === 'Moon') return 'moon';
    return 'deep-space';
  }, [artifact.celestialBody]);

  // Environment-specific lighting and color grading parameters
  const envConfig = useMemo(() => {
    switch (environmentType) {
      case 'mars':
        return {
          bgColor: '#080505',
          ambientColor: '#2d150f',
          ambientIntensity: 0.9,
          sunColor: '#ffedd5',
          sunIntensity: 3.4,
          sunPos: [10, 16, 12] as [number, number, number],
          rimColor: '#e05a36',
          rimIntensity: 2.2,
          rimPos: [-12, -4, -10] as [number, number, number],
          fillColor: '#fdba74',
          fillIntensity: 1.4,
          plinthColor: '#1c100c',
          plinthAccent: '#e05a36',
          dustColor: '#fdba74',
          dustCount: 120,
          label: 'Martian Basalt Regolith',
          icon: <Flame className="w-3 h-3 text-orange-400" />,
        };
      case 'moon':
        return {
          bgColor: '#020307',
          ambientColor: '#0f172a',
          ambientIntensity: 0.6,
          sunColor: '#ffffff',
          sunIntensity: 4.2, // Harsh direct solar radiation on the Moon (no atmosphere)
          sunPos: [14, 20, 12] as [number, number, number],
          rimColor: '#93c5fd',
          rimIntensity: 1.8,
          rimPos: [-14, -2, -12] as [number, number, number],
          fillColor: '#cbd5e1',
          fillIntensity: 0.8,
          plinthColor: '#0a0f1d',
          plinthAccent: '#cbd5e1',
          dustColor: '#e2e8f0',
          dustCount: 60,
          label: 'Lunar Anorthosite Regolith',
          icon: <Moon className="w-3 h-3 text-slate-300" />,
        };
      case 'deep-space':
      default:
        return {
          bgColor: '#010206',
          ambientColor: '#090d16',
          ambientIntensity: 0.7,
          sunColor: '#f8fafc',
          sunIntensity: 3.0,
          sunPos: [8, 14, 10] as [number, number, number],
          rimColor: '#a855f7',
          rimIntensity: 2.5,
          rimPos: [-10, -6, -8] as [number, number, number],
          fillColor: '#38bdf8',
          fillIntensity: 1.6,
          plinthColor: '#05070e',
          plinthAccent: '#a855f7',
          dustColor: '#c084fc',
          dustCount: 160,
          label: 'Interstellar Cosmic Ocean',
          icon: <Compass className="w-3 h-3 text-purple-400" />,
        };
    }
  }, [environmentType]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setAutoRotate(true);
      setZoomLevel(1.0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-black rounded-2xl overflow-hidden select-none group">
      {/* 3D WebGL Canvas Stage */}
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[envConfig.bgColor]} />

        {/* Dynamic Contextual Atmosphere & Lighting */}
        <ambientLight intensity={envConfig.ambientIntensity} color={envConfig.ambientColor} />

        {/* Primary Key Sunlight (Directional with contact shadows) */}
        <directionalLight
          position={envConfig.sunPos}
          intensity={envConfig.sunIntensity}
          color={envConfig.sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Contextual Horizon Rim Light (Sharp edge separation) */}
        <directionalLight
          position={envConfig.rimPos}
          intensity={envConfig.rimIntensity}
          color={envConfig.rimColor}
        />

        {/* Soft Ground/Terrain Fill Light */}
        <pointLight
          position={[0, -2, 2]}
          intensity={envConfig.fillIntensity}
          color={envConfig.fillColor}
          distance={10}
        />

        {/* Deep Celestial Starfield */}
        <Stars
          radius={70}
          depth={45}
          count={environmentType === 'moon' ? 4500 : 2500}
          factor={3.5}
          fade
          speed={0.6}
        />

        {/* Contextual Atmospheric Particulates (Basalt dust for Mars / Cosmic stardust for Pioneer) */}
        <Sparkles
          count={envConfig.dustCount}
          scale={[12, 6, 12]}
          size={environmentType === 'mars' ? 2.8 : 2.0}
          speed={environmentType === 'mars' ? 0.35 : 0.2}
          color={envConfig.dustColor}
          opacity={0.65}
        />

        {/* Contextual Ground Plinth (Except Deep Space Pioneer, which perpetually drifts in microgravity) */}
        {environmentType !== 'deep-space' && (
          <group position={[0, -1.05, 0]}>
            {/* Main Stage Disc */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.4, 64]} />
              <meshStandardMaterial
                color={envConfig.plinthColor}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>

            {/* Glowing Perimeter Ring Marker */}
            <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.34, 2.4, 64]} />
              <meshBasicMaterial color={envConfig.plinthAccent} transparent opacity={0.7} />
            </mesh>

            {/* Subtle Inner Concentric Ring */}
            <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.65, 1.67, 64]} />
              <meshBasicMaterial color={envConfig.plinthAccent} transparent opacity={0.35} />
            </mesh>
          </group>
        )}

        {/* The Centered 3D Artifact Model */}
        <group position={[0, environmentType === 'deep-space' ? 0 : -0.4, 0]}>
          <ArtifactModel
            artifact={artifact}
            autoRotate={false}
            highlightMechanical={true}
          />
        </group>

        {/* Smooth Inertial OrbitControls */}
        <OrbitControls
          makeDefault
          ref={(controls: any) => {
            controlsRef.current = controls;
            if (controls) {
              controls.enablePan = false;
              controls.enableZoom = true;
              controls.minDistance = 1.6;
              controls.maxDistance = 7.5;
              controls.maxPolarAngle = environmentType === 'deep-space' ? Math.PI : Math.PI / 2 - 0.02;
              controls.autoRotate = autoRotate;
              controls.autoRotateSpeed = 0.9;
            }
          }}
          onChange={() => {
            if (controlsRef.current) {
              const cam = controlsRef.current.object;
              if (cam) {
                const dist = cam.position.distanceTo(new THREE.Vector3(0, 0, 0));
                setZoomLevel(Math.round((4.2 / dist) * 10) / 10);
              }
            }
          }}
        />
      </Canvas>

      {/* Environmental Context Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/70 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
        {envConfig.icon}
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-medium">
          {envConfig.label}
        </span>
      </div>

      {/* Top-Right Interactive Controls HUD */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        {/* Toggle Auto-Rotation */}
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            autoRotate
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-950/70 text-slate-400 border-slate-800/80 hover:text-white'
          }`}
          title={autoRotate ? 'Pause 360° Rotation' : 'Enable 360° Rotation'}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
        </button>

        {/* Reset Camera Position */}
        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-slate-950/70 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-900 backdrop-blur-md transition-all cursor-pointer"
          title="Reset Camera View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Hint HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none text-slate-400 font-mono text-[10px]">
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/60 px-3 py-1 rounded-full backdrop-blur-sm">
          <span>🖱️ Drag to orbit 360°</span>
          <span className="text-slate-600">•</span>
          <span>Scroll to zoom detail</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
          <span className="text-slate-500">OPTICAL ZOOM:</span>
          <span className="text-amber-400 font-bold">{zoomLevel}x</span>
        </div>
      </div>
    </div>
  );
};
