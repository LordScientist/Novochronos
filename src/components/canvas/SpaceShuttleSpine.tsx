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
  scale = 1.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const stackMeshRef = useRef<THREE.Group>(null);
  const vaporRef = useRef<THREE.Points>(null);

  // Load the official NASA 3D Models: Orbiter + External Tank + Solid Rocket Booster
  const orbiterGLTF = useGLTF('/models/space-shuttle.glb');
  const etGLTF = useGLTF('/models/external-tank.glb');
  const srbGLTF = useGLTF('/models/srb.glb');

  // Photorealistic Orbiter materials (silica tiles, Inconel engines, flight deck glass)
  const clonedOrbiter = useMemo(() => {
    const clone = orbiterGLTF.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          const name = (mesh.name || '').toLowerCase();

          if (name.includes('cylinder') || name.includes('engine')) {
            mat.metalness = 0.85;
            mat.roughness = 0.35;
            mat.color = new THREE.Color('#334155');
          } else if (name.includes('cube') || name.includes('sphere')) {
            mat.metalness = 0.95;
            mat.roughness = 0.08;
            mat.color = new THREE.Color('#0f172a');
          } else {
            mat.metalness = 0.12;
            mat.roughness = 0.65;
            mat.envMapIntensity = 1.3;
          }
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [orbiterGLTF.scene]);

  // Photorealistic External Tank with spray-on terracotta foam insulation
  const clonedET = useMemo(() => {
    const clone = etGLTF.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          const name = (mesh.name || '').toLowerCase();

          if (name.includes('bar') || name.includes('attach')) {
            mat.color = new THREE.Color('#64748b');
            mat.metalness = 0.8;
            mat.roughness = 0.3;
          } else {
            mat.color = new THREE.Color('#c25e19');
            mat.roughness = 0.85;
            mat.metalness = 0.08;
          }
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [etGLTF.scene]);

  // Port and Starboard Solid Rocket Boosters (white steel casing, dark aft skirts)
  const clonedPortSRB = useMemo(() => {
    const clone = srbGLTF.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = 0.45;
          mat.metalness = 0.2;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [srbGLTF.scene]);

  const clonedStarboardSRB = useMemo(() => {
    return clonedPortSRB.clone(true);
  }, [clonedPortSRB]);

  // Cryogenic LOX boil-off vapor venting
  const { vaporGeometry, vaporMaterial } = useMemo(() => {
    const count = 220;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color('#38bdf8');
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const y = -5.5 + Math.random() * 11.0;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 2.2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 0.4;

      const col = Math.random() > 0.45 ? whiteColor : baseColor;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { vaporGeometry: geom, vaporMaterial: mat };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !stackMeshRef.current) return;

    const time = state.clock.getElapsedTime();

    const launchTremorX = (Math.random() - 0.5) * 0.002;
    const launchTremorY = (Math.random() - 0.5) * 0.0015;

    const targetTwistY = rotation[1] + scrollVelocity * 0.002 + Math.sin(time * 0.6) * 0.03;
    const targetPitchX = rotation[0] + Math.cos(time * 0.5) * 0.015 - scrollVelocity * 0.0008;

    stackMeshRef.current.rotation.y = THREE.MathUtils.damp(
      stackMeshRef.current.rotation.y,
      targetTwistY,
      3.5,
      delta
    );

    stackMeshRef.current.rotation.z = THREE.MathUtils.damp(
      stackMeshRef.current.rotation.z,
      targetPitchX + launchTremorX,
      4.0,
      delta
    );

    const verticalAscent = scrollProgress * 0.35;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + Math.sin(time * 0.9) * 0.04 + launchTremorY + verticalAscent,
      3.0,
      delta
    );

    if (vaporRef.current) {
      vaporRef.current.rotation.y = time * 0.05;
      const attr = vaporRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < 220; i++) {
        arr[i * 3 + 1] += delta * 0.6;
        if (arr[i * 3 + 1] > 6.0) {
          arr[i * 3 + 1] = -5.5;
        }
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <group ref={stackMeshRef}>
        {/* 1. External Tank (Orange) */}
        <group
          position={[0, 0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedET} />
        </group>

        {/* 2. Twin Solid Rocket Boosters (White) */}
        <group
          position={[-2.15, -0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedPortSRB} />
        </group>

        <group
          position={[2.15, -0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedStarboardSRB} />
        </group>

        {/* 3. Space Shuttle Orbiter */}
        <group
          position={[0, -0.5, 0.45]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.19}
        >
          <primitive object={clonedOrbiter} />
          <pointLight position={[0, 0, 24]} intensity={2.5} color="#38bdf8" distance={10} />
          <pointLight position={[0, -4, 24]} intensity={2.0} color="#f59e0b" distance={8} />
        </group>
      </group>

      {/* Cryogenic Boil-off Plumes */}
      <points ref={vaporRef} geometry={vaporGeometry} material={vaporMaterial} />
    </group>
  );
};

useGLTF.preload('/models/space-shuttle.glb');
useGLTF.preload('/models/external-tank.glb');
useGLTF.preload('/models/srb.glb');
