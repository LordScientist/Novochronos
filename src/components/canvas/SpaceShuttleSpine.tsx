import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceShuttleSpineProps {
  scrollProgress?: number;
  scrollVelocity?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const SpaceShuttleSpine: React.FC<SpaceShuttleSpineProps> = ({
  scrollProgress = 0,
  scrollVelocity = 0,
  scale = 0.085,
  position = [0, 0, 0],
  rotation = [0.2, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const thrustersRef = useRef<THREE.Group>(null);

  // Load the official NASA Space Shuttle 3D Model
  const { scene } = useGLTF('/models/space-shuttle.glb');

  // Clone scene so multiple instances don't conflict
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Enhance materials for deep space contrast and specular highlights
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.2, mat.roughness ?? 0.5);
          mat.metalness = Math.min(0.8, (mat.metalness ?? 0.2) + 0.1);
          mat.envMapIntensity = 1.2;
        }
      }
    });
    return clone;
  }, [scene]);

  // Particle plume points for SSME engine exhaust
  const { plumeGeometry, plumeMaterial } = useMemo(() => {
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const baseColor = new THREE.Color('#38bdf8'); // Cyan/plasma
    const coreColor = new THREE.Color('#ffffff'); // High heat core

    for (let i = 0; i < particleCount; i++) {
      // Distribute along the trailing Z axis behind the engines
      const zOffset = Math.random() * 4.5;
      const spread = (zOffset * 0.18 + 0.1) * (Math.random() - 0.5);
      const spreadY = (zOffset * 0.18 + 0.1) * (Math.random() - 0.5);

      positions[i * 3] = spread;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = zOffset;

      const mixed = baseColor.clone().lerp(coreColor, 1.0 - zOffset / 4.5);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;

      sizes[i] = (1.0 - zOffset / 4.5) * 6.0 + 2.0;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { plumeGeometry: geom, plumeMaterial: mat };
  }, []);

  // Frame animation loop: Idle hover sway + Dynamic roll banking based on scroll
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Subtle micro-gravity orbital float
    const floatY = Math.sin(time * 1.2) * 0.08;
    const floatPitch = Math.sin(time * 0.8) * 0.03;
    const floatYaw = Math.cos(time * 0.6) * 0.02;

    // Banking and trajectory response based on scroll progress and velocity
    const targetRoll = -scrollVelocity * 0.003;
    const targetPitch = rotation[0] + floatPitch + scrollVelocity * 0.0015 + scrollProgress * 0.05;

    // Smooth lerp for weight and inertia
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + floatY,
      3,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetPitch,
      4,
      delta
    );

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      rotation[1] + floatYaw,
      3,
      delta
    );

    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRoll,
      4,
      delta
    );

    // Dynamic thruster pulse
    if (thrustersRef.current) {
      const pulse = 1.0 + Math.sin(time * 25.0) * 0.15 + Math.abs(scrollVelocity) * 0.005;
      thrustersRef.current.scale.set(pulse, pulse, pulse * 1.2);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 
        The Space Shuttle Orbiter model:
        Dimensions are ~20 (X) x 14 (Y) x 42 (Z).
        Nose points towards -Z, Engines towards +Z.
        Offset Z by -6 to align center-of-mass with origin.
      */}
      <group scale={scale} position={[0, -0.2, -6 * scale]}>
        <primitive object={clonedScene} />

        {/* SSME Engine Plumes (Trailing behind aft section at Z ~ 24) */}
        <group ref={thrustersRef} position={[0, 2.5, 24]}>
          {/* Main Top Center Engine */}
          <points geometry={plumeGeometry} material={plumeMaterial} position={[0, 0.8, 0]} />
          {/* Port Engine */}
          <points geometry={plumeGeometry} material={plumeMaterial} position={[-1.6, -0.6, 0]} />
          {/* Starboard Engine */}
          <points geometry={plumeGeometry} material={plumeMaterial} position={[1.6, -0.6, 0]} />

          {/* Engine Core Glow Spheres */}
          <mesh position={[0, 0.8, 0.2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
          <mesh position={[-1.6, -0.6, 0.2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
          <mesh position={[1.6, -0.6, 0.2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Preload the NASA 3D asset into cache
useGLTF.preload('/models/space-shuttle.glb');
