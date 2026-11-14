import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceShuttleSpineProps {
  scrollProgress?: number;
  scrollVelocity?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  showAnnotations?: boolean;
}

export const SpaceShuttleSpine: React.FC<SpaceShuttleSpineProps> = ({
  scrollProgress = 0,
  scrollVelocity = 0,
  scale = 1.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  showAnnotations = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const stackMeshRef = useRef<THREE.Group>(null);
  const vaporRef = useRef<THREE.Points>(null);

  // Load the official NASA 3D Models: Orbiter + External Tank + Solid Rocket Booster
  const orbiterGLTF = useGLTF('/models/space-shuttle.glb');
  const etGLTF = useGLTF('/models/external-tank.glb');
  const srbGLTF = useGLTF('/models/srb.glb');

  // Clone & configure photorealistic Orbiter materials
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

  // Clone & configure External Tank with authentic rust-orange foam insulation (matching inspiration reference)
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
            mat.color = new THREE.Color('#64748b'); // Steel attachment struts
            mat.metalness = 0.8;
            mat.roughness = 0.3;
          } else {
            // Iconic Terracotta / Rust-Orange Spray-on Foam Insulation
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

  // Clone & configure Port and Starboard Solid Rocket Boosters (white steel casings)
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

  // Cryogenic LOX boil-off vapor venting around the launch stack
  const { vaporGeometry, vaporMaterial } = useMemo(() => {
    const count = 220;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color('#38bdf8'); // LOX cryogenic cyan
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

    // Launch countdown micro-vibration (cryogenic turbopump priming)
    const launchTremorX = (Math.random() - 0.5) * 0.002;
    const launchTremorY = (Math.random() - 0.5) * 0.0015;

    // Organic twist and sway reacting to scroll momentum
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

    // Subtle vertical breathing float + launch lift on scroll
    const verticalAscent = scrollProgress * 0.35;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + Math.sin(time * 0.9) * 0.04 + launchTremorY + verticalAscent,
      3.0,
      delta
    );

    // Rising boil-off cryogenic vapor plumes
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
        {/* 
          1. THE GIANT ORANGE EXTERNAL TANK (ET)
          Center spine of the entire launch configuration.
          Model axis: tip at +X, nozzle at -X.
          Rotate around Z by +PI/2 so tip points UP (+Y).
        */}
        <group
          position={[0, 0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedET} />
        </group>

        {/* 
          2. TWIN WHITE SOLID ROCKET BOOSTERS (SRBs)
          Flanking both sides of the External Tank.
        */}
        {/* Port SRB (Left) */}
        <group
          position={[-2.15, -0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedPortSRB} />
        </group>

        {/* Starboard SRB (Right) */}
        <group
          position={[2.15, -0.2, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.0058}
        >
          <primitive object={clonedStarboardSRB} />
        </group>

        {/* 
          3. THE SPACE SHUTTLE ORBITER (ATLANTIS)
          Mounted on the front face of the External Tank.
          Nose points UP (+Y), cockpit windows and wings facing forward toward viewer.
        */}
        <group
          position={[0, -0.5, 0.45]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.19}
        >
          <primitive object={clonedOrbiter} />

          {/* Engine Ignition Sparkler Lights at Aft Base */}
          <pointLight position={[0, 0, 24]} intensity={2.5} color="#38bdf8" distance={10} />
          <pointLight position={[0, -4, 24]} intensity={2.0} color="#f59e0b" distance={8} />
        </group>

        {/* 
          4. BEGINNER-FRIENDLY EDUCATIONAL CALLOUTS
          Clear, inspiring labels identifying the major components of the launch stack
        */}
        {showAnnotations && (
          <group position={[0, 0, 1.4]}>
            {/* External Tank Label */}
            <group position={[0, 4.4, 0]}>
              <Text
                fontSize={0.11}
                color="#fdba74"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.12}
              >
                EXTERNAL TANK // ORANGE FOAM INSULATION
              </Text>
            </group>

            {/* Solid Rocket Booster Label (Left) */}
            <group position={[-2.4, 2.2, 0]}>
              <Text
                fontSize={0.095}
                color="#e2e8f0"
                anchorX="right"
                anchorY="middle"
                letterSpacing={0.08}
              >
                SOLID ROCKET BOOSTER (SRB) →
              </Text>
            </group>

            {/* Orbiter Cockpit Label */}
            <group position={[1.6, 1.6, 0]}>
              <Text
                fontSize={0.095}
                color="#38bdf8"
                anchorX="left"
                anchorY="middle"
                letterSpacing={0.08}
              >
                ← STS ORBITER // FLIGHT DECK
              </Text>
            </group>

            {/* Main Engines Label */}
            <group position={[0, -4.2, 0]}>
              <Text
                fontSize={0.1}
                color="#fde047"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
              >
                3x RS-25 MAIN ENGINES & SRB EXHAUST SKIRTS
              </Text>
            </group>
          </group>
        )}
      </group>

      {/* Cryogenic Boil-off Vapor System */}
      <points ref={vaporRef} geometry={vaporGeometry} material={vaporMaterial} />
    </group>
  );
};

// Preload all 3 official NASA models into memory
useGLTF.preload('/models/space-shuttle.glb');
useGLTF.preload('/models/external-tank.glb');
useGLTF.preload('/models/srb.glb');
