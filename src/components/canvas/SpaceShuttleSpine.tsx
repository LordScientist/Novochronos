import React, { useRef, useMemo } from 'react';
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
  scale = 1.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);

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

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
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

      {/* 3. Space Shuttle Orbiter (Solid, stable, majestic) */}
      <group
        position={[0, -0.5, 0.45]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.19}
      >
        <primitive object={clonedOrbiter} />
        <pointLight position={[0, 0, 24]} intensity={2.5} color="#38bdf8" distance={10} />
        <pointLight position={[0, -4, 24]} intensity={2.0} color="#f59e0b" distance={8} />
      </group>

      {/* 
        4. STS Rocket Engine Thrusters & Gantry Flame Trench Heat:
        "where we can see where all the heat come from"
        Features 3 SSME rocket main engine bells + 2 SRB booster exhaust plumes
        illuminating the base with glowing rocket exhaust plasma!
      */}
      <group position={[0, -3.8, 0]}>
        {/* Main Center Engine Nozzle Flame Cone */}
        <group position={[0, 0.2, 0.45]}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.5, 0]}>
            <coneGeometry args={[0.32, 1.1, 16]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.75, 0]}>
            <coneGeometry args={[0.48, 1.5, 16]} />
            <meshBasicMaterial
              color="#ea580c"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Port Main Engine Flame */}
        <group position={[-0.45, -0.05, 0.45]}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.45, 0]}>
            <coneGeometry args={[0.28, 1.0, 16]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.7, 0]}>
            <coneGeometry args={[0.42, 1.35, 16]} />
            <meshBasicMaterial
              color="#f97316"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Starboard Main Engine Flame */}
        <group position={[0.45, -0.05, 0.45]}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.45, 0]}>
            <coneGeometry args={[0.28, 1.0, 16]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.7, 0]}>
            <coneGeometry args={[0.42, 1.35, 16]} />
            <meshBasicMaterial
              color="#f97316"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Port SRB Rocket Booster Exhaust Plume */}
        <group position={[-2.15, -0.15, -0.6]}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.75, 0]}>
            <coneGeometry args={[0.55, 1.8, 16]} />
            <meshBasicMaterial
              color="#ffedd5"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -1.1, 0]}>
            <coneGeometry args={[0.75, 2.3, 16]} />
            <meshBasicMaterial
              color="#ea580c"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Starboard SRB Rocket Booster Exhaust Plume */}
        <group position={[2.15, -0.15, -0.6]}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.75, 0]}>
            <coneGeometry args={[0.55, 1.8, 16]} />
            <meshBasicMaterial
              color="#ffedd5"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -1.1, 0]}>
            <coneGeometry args={[0.75, 2.3, 16]} />
            <meshBasicMaterial
              color="#ea580c"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Launchpad Flame Trench & Radiant Heat Glow Lights */}
        <pointLight position={[0, -1.0, 0]} intensity={6.5} color="#f97316" distance={20} />
        <pointLight position={[0, -0.4, 0.5]} intensity={4.5} color="#fbbf24" distance={12} />
      </group>
    </group>
  );
};

useGLTF.preload('/models/space-shuttle.glb');
useGLTF.preload('/models/external-tank.glb');
useGLTF.preload('/models/srb.glb');
