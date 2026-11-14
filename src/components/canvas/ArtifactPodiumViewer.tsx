import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Artifact3DModel } from './Artifact3DModel';

interface ArtifactPodiumViewerProps {
  sentinelId: string;
}

export const ArtifactPodiumViewer: React.FC<ArtifactPodiumViewerProps> = ({
  sentinelId,
}) => {
  return (
    <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-black border border-white/10 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
      {/* 3D WebGL Canvas Stage */}
      <Canvas
        camera={{ position: [0, 0.8, 3.4], fov: 45, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030712']} />

        {/* Ambient & Studio Stage Lighting */}
        <ambientLight intensity={0.5} color="#0f172a" />
        <directionalLight position={[8, 12, 10]} intensity={3.0} color="#ffffff" castShadow />
        <directionalLight position={[-8, -4, -6]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[0, 3, 2]} intensity={1.5} color="#f8fafc" distance={8} />

        {/* Interactive OrbitControls: drag to orbit, scroll to zoom */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={6.0}
          autoRotate={true}
          autoRotateSpeed={0.9}
        />

        {/* Circular Glowing Podium Platform beneath Artifact */}
        <group position={[0, -1.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 64]} />
            <meshStandardMaterial color="#080e1c" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <ringGeometry args={[1.46, 1.5, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
            <ringGeometry args={[0.9, 0.92, 48]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
          </mesh>
        </group>

        {/* The 3D Artifact Model */}
        <Suspense fallback={null}>
          <Artifact3DModel sentinelId={sentinelId} targetSize={2.2} />
        </Suspense>
      </Canvas>

      {/* Interactive Controls Overlay Badge */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-sky-300">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          DRAG TO ROTATE 360° • SCROLL TO ZOOM
        </span>
        <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300">
          NASA SCIENCE 3D DATA
        </span>
      </div>
    </div>
  );
};
