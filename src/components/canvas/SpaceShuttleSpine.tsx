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
  scale = 0.2, // Scaled to span vertically across the viewport like an imposing launch tower
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shuttleMeshRef = useRef<THREE.Group>(null);
  const vaporRef = useRef<THREE.Points>(null);

  // Load the official NASA Space Shuttle 3D Model
  const { scene } = useGLTF('/models/space-shuttle.glb');

  // Clone scene with high-contrast space & launchpad lighting materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.3, mat.roughness ?? 0.5);
          mat.metalness = Math.min(0.7, (mat.metalness ?? 0.2) + 0.15);
          mat.envMapIntensity = 1.4;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  // Cryogenic LOX boil-off vapor & launchpad atmospheric mist
  const { vaporGeometry, vaporMaterial } = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color('#38bdf8'); // LOX cryogenic cyan
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Concentrated at the base (engines) and along the vertical fuselage
      const y = -4.5 + Math.random() * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 1.6;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const col = Math.random() > 0.4 ? whiteColor : baseColor;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { vaporGeometry: geom, vaporMaterial: mat };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !shuttleMeshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Pre-launch tension: subtle cryogenic pressure shudder / micro-tremor
    const launchTremorX = (Math.random() - 0.5) * 0.003;
    const launchTremorY = (Math.random() - 0.5) * 0.002;

    // Active Theory spine mechanics: Vertical undulation, twist, and slight launch ascent on scroll
    const targetTwistY = rotation[1] + scrollVelocity * 0.0025 + Math.sin(time * 0.7) * 0.04;
    const targetPitchX = rotation[0] + Math.cos(time * 0.5) * 0.02 - scrollVelocity * 0.001;

    // Smooth inertial damping
    shuttleMeshRef.current.rotation.y = THREE.MathUtils.damp(
      shuttleMeshRef.current.rotation.y,
      targetTwistY,
      3.5,
      delta
    );

    shuttleMeshRef.current.rotation.z = THREE.MathUtils.damp(
      shuttleMeshRef.current.rotation.z,
      targetPitchX + launchTremorX,
      4.0,
      delta
    );

    // Subtle breathing float on Y + gradual vertical lift with scroll progress
    const verticalAscent = scrollProgress * 0.5;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + Math.sin(time * 1.0) * 0.06 + launchTremorY + verticalAscent,
      3.0,
      delta
    );

    // Animate cryogenic vapor drift slowly upward
    if (vaporRef.current) {
      vaporRef.current.rotation.y = time * 0.08;
      const attr = vaporRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < 160; i++) {
        arr[i * 3 + 1] += delta * 0.6;
        if (arr[i * 3 + 1] > 4.5) {
          arr[i * 3 + 1] = -4.5;
        }
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 
        Vertical Launch Posture:
        Model original axes:
          - Nose is at Z = -13
          - Engines are at Z = +24
          - Vertical stabilizer tail is at Y = +7.5
        Rotation:
          - Rotate X by +PI/2:
              Z = -13 -> Y = +13 (Nose points UP towards the stars)
              Z = +24 -> Y = -24 (Engines point DOWN towards the launch pad)
          - Center the pivot vertically by offsetting Y by +5.5 * scale.
      */}
      <group ref={shuttleMeshRef}>
        <group
          scale={scale}
          position={[0, 5.5 * scale, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <primitive object={clonedScene} />

          {/* Engine Ignition Sparklers / Warm Gantry Lighting at base */}
          <pointLight position={[0, 0, 24]} intensity={2.5} color="#38bdf8" distance={12} />
          <pointLight position={[0, -5, 24]} intensity={1.8} color="#f59e0b" distance={8} />
        </group>
      </group>

      {/* Cryogenic Boil-off Vapor System along the Vertical Fuselage */}
      <points ref={vaporRef} geometry={vaporGeometry} material={vaporMaterial} />
    </group>
  );
};

useGLTF.preload('/models/space-shuttle.glb');
