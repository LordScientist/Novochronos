// Realistic Multi-Layered Cosmic Starfield for Three.js / React Three Fiber
// Deterministic pseudo-random generation with physically authentic stellar color temperatures (B-V spectral classes)

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Stellar Color Temperatures based on astronomical Harvard spectral classification
const STELLAR_PALETTE = [
  new THREE.Color('#9db4ff'), // O/B: 20%
  new THREE.Color('#cad8ff'), // A: 30%
  new THREE.Color('#f8f9fa'), // F: 25%
  new THREE.Color('#fff4e8'), // G: 15%
  new THREE.Color('#ffd2a1'), // K: 8%
  new THREE.Color('#ffad99'), // M: 2%
];

// Seeded pseudo-random number generator (Mulberry32) for deterministic, flicker-free distribution
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface CosmicStarfield3DProps {
  count?: number;
  radius?: number;
  depth?: number;
  speed?: number;
  twinkleFactor?: number;
  seed?: number;
}

export const CosmicStarfield3D: React.FC<CosmicStarfield3DProps> = ({
  count = 4200,
  radius = 120,
  depth = 60,
  speed = 0.05,
  twinkleFactor = 0.15,
  seed = 42,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate deterministic positions, colors, and twinkle phases
  const { positions, colors, phases } = useMemo(() => {
    const random = mulberry32(seed);

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = random();
      const v = random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (random() - 0.5) * depth;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const colorRoll = random();
      let starColor: THREE.Color;
      if (colorRoll < 0.2) starColor = STELLAR_PALETTE[0];
      else if (colorRoll < 0.5) starColor = STELLAR_PALETTE[1];
      else if (colorRoll < 0.75) starColor = STELLAR_PALETTE[2];
      else if (colorRoll < 0.9) starColor = STELLAR_PALETTE[3];
      else if (colorRoll < 0.98) starColor = STELLAR_PALETTE[4];
      else starColor = STELLAR_PALETTE[5];

      const lum = Math.pow(random(), 2.2) * 0.7 + 0.3;
      col[i * 3] = starColor.r * lum;
      col[i * 3 + 1] = starColor.g * lum;
      col[i * 3 + 2] = starColor.b * lum;

      ph[i] = random() * Math.PI * 2;
    }

    return {
      positions: pos,
      colors: col,
      phases: ph,
    };
  }, [count, radius, depth, seed]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    pointsRef.current.rotation.y = time * 0.0008 * speed * 10;
    pointsRef.current.rotation.x = Math.sin(time * 0.0004) * 0.002;

    const geo = pointsRef.current.geometry;
    const colorAttr = geo.attributes.color;
    if (colorAttr && twinkleFactor > 0) {
      const arr = colorAttr.array as Float32Array;
      const step = 8;
      for (let i = 0; i < count; i += step) {
        const twinkle = Math.sin(time * 2.5 + phases[i]) * 0.18 + 0.82;
        arr[i * 3] = colors[i * 3] * twinkle;
        arr[i * 3 + 1] = colors[i * 3 + 1] * twinkle;
        arr[i * 3 + 2] = colors[i * 3 + 2] * twinkle;
      }
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

