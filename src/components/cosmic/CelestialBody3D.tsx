// Realistic Procedural Celestial Bodies for Three.js / React Three Fiber
// Earth, Moon, Mars, Jupiter, Saturn, and Distant Sun with authentic day/night terminators and atmospheric limbs

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type CelestialType = 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'sun';

interface CelestialBody3DProps {
  type: CelestialType;
  position?: [number, number, number];
  radius?: number;
  rotation?: [number, number, number];
  spinSpeed?: number;
  opacity?: number;
}

export const CelestialBody3D: React.FC<CelestialBody3DProps> = ({
  type,
  position = [0, 0, -40],
  radius = 6,
  rotation = [0, 0, 0],
  spinSpeed = 0.05,
  opacity = 1.0,
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += delta * spinSpeed * 0.2;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * spinSpeed * 0.28;
    }
  });

  switch (type) {
    case 'earth': {
      return (
        <group ref={planetRef} position={position} rotation={rotation}>
          <mesh ref={surfaceRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshStandardMaterial
              color="#1d4ed8"
              roughness={0.65}
              metalness={0.1}
              emissive="#021430"
              emissiveIntensity={0.2}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.002, 36, 36]} />
            <meshStandardMaterial
              color="#15803d"
              roughness={0.9}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>

          <mesh ref={cloudsRef} position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.015, 36, 36]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.9}
              transparent
              opacity={0.42 * opacity}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.06, 32, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.35 * opacity}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }

    case 'moon': {
      return (
        <group ref={planetRef} position={position} rotation={rotation}>
          <mesh ref={surfaceRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 40, 40]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={0.96}
              metalness={0.04}
              flatShading
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.003, 24, 24]} />
            <meshBasicMaterial
              color="#334155"
              transparent
              opacity={0.38 * opacity}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }

    case 'mars': {
      return (
        <group ref={planetRef} position={position} rotation={rotation}>
          <mesh ref={surfaceRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 44, 44]} />
            <meshStandardMaterial
              color="#c2410c"
              roughness={0.88}
              metalness={0.12}
            />
          </mesh>

          <mesh position={[0, radius * 0.94, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.32, 24]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.04, 32, 32]} />
            <meshBasicMaterial
              color="#fb923c"
              transparent
              opacity={0.22 * opacity}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }

    case 'jupiter': {
      return (
        <group ref={planetRef} position={position} rotation={rotation}>
          <mesh ref={surfaceRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius * 1.003, 32, 32]} />
            <meshStandardMaterial
              color="#78350f"
              roughness={0.8}
              transparent
              opacity={0.65 * opacity}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[radius * 0.65, -radius * 0.28, radius * 0.7]} rotation={[0, 0.4, 0]}>
            <sphereGeometry args={[radius * 0.22, 16, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} />
          </mesh>
        </group>
      );
    }

    case 'saturn': {
      return (
        <group ref={planetRef} position={position} rotation={rotation}>
          <mesh ref={surfaceRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 44, 44]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.75}
              metalness={0.05}
            />
          </mesh>

          <mesh rotation={[Math.PI / 3, 0.2, -0.4]}>
            <ringGeometry args={[radius * 1.35, radius * 2.3, 64]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.8}
              transparent
              opacity={0.68 * opacity}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }

    case 'sun':
    default: {
      return (
        <group position={position}>
          <mesh>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius * 1.8, 24, 24]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.35 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius * 3.2, 24, 24]} />
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.12 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }
  }
};

