import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicDustField: React.FC<{ count?: number }> = ({ count = 450 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, initialY } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    const palette = [
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#818cf8'), // Indigo / Violet
      new THREE.Color('#f43f5e'), // Rose
      new THREE.Color('#e2e8f0'), // Starlight white
      new THREE.Color('#f59e0b'), // Amber dust
    ];

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around the space shuttle corridor
      const radius = 2.0 + Math.random() * 9.0;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 16.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 2.0;

      initY[i] = y;

      const col = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    return { positions: pos, colors: cols, initialY: initY };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle cosmic drift and swirl
      posArray[i * 3 + 1] = ((initialY[i] - time * 0.4 + 8) % 16) - 8;
    }
    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y = time * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
