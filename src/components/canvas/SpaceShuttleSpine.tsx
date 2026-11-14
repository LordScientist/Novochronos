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
  scale = 0.22, // Scaled to anchor the center of the viewport from bottom to top
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  showAnnotations = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shuttleMeshRef = useRef<THREE.Group>(null);
  const vaporRef = useRef<THREE.Points>(null);

  // Load the official NASA Space Shuttle 3D Model
  const { scene } = useGLTF('/models/space-shuttle.glb');

  // Clone scene and apply photorealistic PBR material properties based on authentic shuttle metallurgy
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          const name = (mesh.name || '').toLowerCase();

          // Differentiate materials by shuttle component:
          if (name.includes('cylinder') || name.includes('engine')) {
            // SSME rocket engine bells: High-temp Inconel metallic alloy
            mat.metalness = 0.85;
            mat.roughness = 0.35;
            mat.color = new THREE.Color('#334155');
          } else if (name.includes('cube') || name.includes('sphere')) {
            // Cockpit flight deck windows: High-specular reflective glass
            mat.metalness = 0.95;
            mat.roughness = 0.08;
            mat.color = new THREE.Color('#0f172a');
          } else {
            // Authentic ceramic silica thermal tiles & Nomex blankets
            mat.metalness = 0.12;
            mat.roughness = 0.68;
            mat.envMapIntensity = 1.3;
          }

          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  // Cryogenic LOX boil-off vapor venting along the vertical fuselage
  const { vaporGeometry, vaporMaterial } = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color('#38bdf8'); // LOX cryogenic cyan
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const y = -4.5 + Math.random() * 9.0;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.45 + Math.random() * 1.5;

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
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { vaporGeometry: geom, vaporMaterial: mat };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !shuttleMeshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Launch readiness micro-tremor (cryogenic pumps active)
    const launchTremorX = (Math.random() - 0.5) * 0.002;
    const launchTremorY = (Math.random() - 0.5) * 0.0015;

    // Active Theory scroll response: Organic vertical twist based on scroll velocity
    const targetTwistY = rotation[1] + scrollVelocity * 0.0022 + Math.sin(time * 0.7) * 0.035;
    const targetPitchX = rotation[0] + Math.cos(time * 0.5) * 0.018 - scrollVelocity * 0.0008;

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

    // Subtle vertical breathing float + launch lift on scroll
    const verticalAscent = scrollProgress * 0.4;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + Math.sin(time * 1.0) * 0.05 + launchTremorY + verticalAscent,
      3.0,
      delta
    );

    // Cryogenic vapor rising slowly upward
    if (vaporRef.current) {
      vaporRef.current.rotation.y = time * 0.06;
      const attr = vaporRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < 180; i++) {
        arr[i * 3 + 1] += delta * 0.55;
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
        The NASA Space Shuttle Orbiter in True Vertical Launch Posture:
        Nose points UP (+Y), Engines point DOWN (-Y) towards KSC Launch Pad 39A.
      */}
      <group ref={shuttleMeshRef}>
        <group
          scale={scale}
          position={[0, 5.5 * scale, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <primitive object={clonedScene} />

          {/* Engine Ignition Sparkler Point Lights at Aft Base */}
          <pointLight position={[0, 0, 24]} intensity={2.6} color="#38bdf8" distance={10} />
          <pointLight position={[0, -4, 24]} intensity={1.8} color="#f59e0b" distance={8} />
        </group>

        {/* 
          Beginner-Friendly 3D Technical Callouts
          Helps students and beginners identify the authentic anatomy of the Orbiter
        */}
        {showAnnotations && (
          <group position={[0, 0, 1.2]}>
            {/* Cockpit / Flight Deck Callout */}
            <group position={[1.4, 2.6, 0]}>
              <mesh position={[-0.4, 0, 0]}>
                <planeGeometry args={[0.6, 0.015]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
              </mesh>
              <Text
                fontSize={0.1}
                color="#e0f2fe"
                anchorX="left"
                anchorY="middle"
                letterSpacing={0.1}
              >
                STS COCKPIT // FLIGHT DECK
              </Text>
            </group>

            {/* Payload Cargo Bay Callout */}
            <group position={[-1.4, 0.2, 0]}>
              <mesh position={[0.4, 0, 0]}>
                <planeGeometry args={[0.6, 0.015]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
              </mesh>
              <Text
                fontSize={0.1}
                color="#e0f2fe"
                anchorX="right"
                anchorY="middle"
                letterSpacing={0.1}
              >
                18M PAYLOAD CARGO BAY
              </Text>
            </group>

            {/* SSME Rocket Engines Callout */}
            <group position={[1.4, -2.8, 0]}>
              <mesh position={[-0.4, 0, 0]}>
                <planeGeometry args={[0.6, 0.015]} />
                <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
              </mesh>
              <Text
                fontSize={0.1}
                color="#fef3c7"
                anchorX="left"
                anchorY="middle"
                letterSpacing={0.1}
              >
                3x RS-25 MAIN ENGINES
              </Text>
            </group>
          </group>
        )}
      </group>

      {/* Cryogenic Boil-off Vapor Plumes */}
      <points ref={vaporRef} geometry={vaporGeometry} material={vaporMaterial} />
    </group>
  );
};

useGLTF.preload('/models/space-shuttle.glb');
