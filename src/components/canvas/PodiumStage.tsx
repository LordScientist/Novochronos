import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { Artifact } from '../../types/artifact';
import { ArtifactModel } from './ArtifactModel';

interface PodiumStageProps {
  artifact: Artifact;
}

export const PodiumStage: React.FC<PodiumStageProps> = ({ artifact }) => {
  // Dust particle color based on celestial body
  const particleColor =
    artifact.celestialBody === 'Mars'
      ? '#f97316'
      : artifact.celestialBody === 'Moon'
      ? '#cbd5e1'
      : '#38bdf8';

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 6.5], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#030712']} />

        {/* 3-Point Museum Gallery Lighting Rig */}
        <ambientLight intensity={0.7} color="#0f172a" />

        {/* Key Spotlight focusing intently on the podium */}
        <spotLight
          position={[0, 9, 3]}
          intensity={3.8}
          angle={0.55}
          penumbra={0.75}
          color="#f8fafc"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Fill light */}
        <directionalLight
          position={[-6, 4, 4]}
          intensity={1.2}
          color={artifact.accentColor}
        />

        {/* Rim light */}
        <directionalLight
          position={[6, 3, -6]}
          intensity={1.5}
          color="#38bdf8"
        />

        {/* Background starfield */}
        <Stars radius={80} depth={50} count={2500} factor={4} fade />

        {/* Floating celestial dust particles */}
        <Sparkles
          count={75}
          scale={[10, 6, 10]}
          size={3}
          speed={0.3}
          color={particleColor}
        />

        {/* Physical Museum Pedestal Plinth */}
        <group position={[0, -1.2, 0]}>
          {/* Main tiered plinth */}
          <mesh receiveShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[2.8, 3.2, 0.4, 48]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Elevated inner turntable */}
          <mesh receiveShadow position={[0, 0.05, 0]}>
            <cylinderGeometry args={[2.5, 2.6, 0.1, 48]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Glowing stasis ring channel on perimeter */}
          <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.35, 2.45, 48]} />
            <meshBasicMaterial color={artifact.accentColor} transparent opacity={0.75} />
          </mesh>
        </group>

        {/* Centered Artifact Model */}
        <group position={[0, -0.6, 0]}>
          <ArtifactModel artifact={artifact} autoRotate={false} />
        </group>

        {/* Constrained OrbitControls */}
        <OrbitControls
          makeDefault
          ref={(controls) => {
            if (controls) {
              controls.minDistance = 3.5;
              controls.maxDistance = 12;
              controls.maxPolarAngle = Math.PI / 2 - 0.05;
            }
          }}
        />
      </Canvas>

      {/* Orbit Hint Badge */}
      <div className="absolute bottom-6 left-6 pointer-events-none glass-panel px-3 py-1.5 rounded-full border border-slate-700/60 font-mono text-[10px] text-slate-400">
        🖱️ Click & Drag to Orbit 360° // Scroll to Zoom
      </div>
    </div>
  );
};
