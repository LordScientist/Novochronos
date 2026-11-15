import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface LusionAstronautSceneProps {
  scrollProgress: number; // 0.0 (idle landing) to 1.0 (hyperspace complete)
  pointerPos?: { x: number; y: number };
  isExpanded?: boolean;
}

export const LusionAstronautScene: React.FC<LusionAstronautSceneProps> = ({
  scrollProgress,
  pointerPos = { x: 0, y: 0 },
  isExpanded = false,
}) => {
  const astronautRef = useRef<THREE.Group>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cyberCorridorGroupRef = useRef<THREE.Group>(null);
  const crystalTunnelGroupRef = useRef<THREE.Group>(null);
  const supernovaRef = useRef<THREE.Mesh>(null);

  // Load NASA astronaut 3D model
  const { scene: astronautModel } = useGLTF('/models/astronaut.glb');

  // Load photorealistic Earth texture
  const earthTexture = useTexture('/textures/earth.jpg');

  // Clone astronaut with glossy spacesuit specular highlights and visor reflections
  const astronautScene = useMemo(() => {
    const clone = astronautModel.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const orig = mesh.material as THREE.MeshStandardMaterial;
          const enhanced = orig.clone();
          // Boost glossiness and specular response
          enhanced.roughness = 0.32;
          enhanced.metalness = 0.30;
          enhanced.envMapIntensity = 2.2;
          mesh.material = enhanced;
        }
      }
    });
    return clone;
  }, [astronautModel]);

  // ---------------------------------------------------------------------------
  // 1. DENSE PROCEDURAL SCI-FI ARCHITECTURAL CORRIDOR (Frames 022, 028, 034, 045)
  // Structural columns, cross-girders, catwalk frames, specular chrome panels,
  // neon emerald green & cyber cyan LED conduits, warm amber beacons
  // ---------------------------------------------------------------------------
  const corridorFrames = useMemo(() => {
    const count = 24;
    return Array.from({ length: count }, (_, i) => {
      const z = -8 - i * 3.4;
      const rotZ = i * 0.06;
      // Color shifts along corridor depth: Emerald Green -> Warm Amber/Red -> Electric Cyan
      let themeColor = '#22c55e'; // emerald green (Frame 028 & 045)
      let beaconColor = '#f59e0b';
      if (i > 8 && i <= 16) {
        themeColor = '#ef4444'; // fiery red / amber (Frame 034)
        beaconColor = '#f97316';
      } else if (i > 16) {
        themeColor = '#06b6d4'; // electric cyber cyan
        beaconColor = '#38bdf8';
      }
      return { z, rotZ, themeColor, beaconColor, index: i };
    });
  }, []);

  // Floating plasma particles and embers drifting in the corridor (Frame 026 & 034)
  const corridorEmbers = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, (_, i) => {
      const z = -10 - (i % 20) * 3.8;
      const angle = (i * 0.85);
      const r = 1.3 + (i % 4) * 0.35;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const size = 0.05 + (i % 3) * 0.04;
      const color = i % 2 === 0 ? '#22c55e' : i % 3 === 0 ? '#f97316' : '#06b6d4';
      return { x, y, z, size, color };
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 2. CRYSTALLINE KALEIDOSCOPE FRACTAL TUNNEL (Frame 032)
  // Geodesic lattice rings, neon magenta & electric cyan struts, crystal shards
  // ---------------------------------------------------------------------------
  const crystalSegments = useMemo(() => {
    const count = 26;
    return Array.from({ length: count }, (_, i) => {
      const z = -25 - i * 3.0;
      const rotZ = i * 0.24;
      const scale = 1.0 + Math.sin(i * 0.6) * 0.22;
      const color = i % 2 === 0 ? '#ec4899' : '#06b6d4'; // neon magenta & cyber cyan
      return { z, rotZ, scale, color, index: i };
    });
  }, []);

  const crystalShards = useMemo(() => {
    const count = 36;
    return Array.from({ length: count }, (_, i) => {
      const z = -26 - i * 2.2;
      const angle = i * 1.1;
      const r = 1.8 + (i % 3) * 0.4;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const color = i % 2 === 0 ? '#f43f5e' : '#38bdf8';
      return { x, y, z, color };
    });
  }, []);

  // ---------------------------------------------------------------------------
  // KINEMATICS & CAMERA FLIGHT FRAME LOOP
  // ---------------------------------------------------------------------------
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // -------------------------------------------------------------
    // A. DYNAMIC CINEMATIC CAMERA FLIGHT & FIELD OF VIEW
    // Camera actively pushes in, tracks the dive, rolls into turns!
    // -------------------------------------------------------------
    let camTargetZ = 3.6;
    let camTargetY = 0.0;
    let camTargetRotX = 0.0;
    let camTargetRotZ = 0.0;
    let targetFov = 42;

    if (scrollProgress <= 0.20) {
      // Stage 0: Tablet idle landing with mouse parallax tracking
      camTargetZ = 3.6;
      camTargetY = 0.0;
      camTargetRotX = -pointerPos.y * 0.12;
      camTargetRotZ = pointerPos.x * 0.08;
      targetFov = 42;
    } else if (scrollProgress <= 0.38) {
      // Stage 1: Fullscreen expansion hero push-in
      const p = (scrollProgress - 0.20) / 0.18;
      camTargetZ = 3.6 - p * 0.7; // Pushes in close to astronaut
      camTargetY = -p * 0.15;
      camTargetRotX = -0.05 * p;
      targetFov = 42 + p * 4;
    } else if (scrollProgress <= 0.65) {
      // Stage 2: Following the astronaut's space dive into the distance
      const p = (scrollProgress - 0.38) / 0.27;
      camTargetZ = 2.9 - p * 6.5;
      camTargetY = -0.15 - p * 0.4;
      camTargetRotX = -0.05 - p * 0.18; // Pitch down following the diving astronaut
      camTargetRotZ = Math.sin(time * 1.5) * 0.05 * p; // Subtle cinematic camera bank
      targetFov = 46 + p * 8;
    } else if (scrollProgress <= 0.88) {
      // Stage 3: Corridor & Kaleidoscope acceleration
      const p = (scrollProgress - 0.65) / 0.23;
      camTargetZ = -3.6 - p * 18.0;
      camTargetY = -0.55 + Math.sin(time * 2.0) * 0.1;
      camTargetRotX = -0.23 + Math.cos(time * 1.8) * 0.08;
      camTargetRotZ = Math.sin(time * 2.2) * 0.12; // Bank into corridor turns
      targetFov = 54 + p * 10; // Hyperspace perspective expansion
    } else {
      // Stage 4: Supernova warp burst
      const p = (scrollProgress - 0.88) / 0.12;
      camTargetZ = -21.6 - p * 25.0;
      camTargetRotX = 0;
      camTargetRotZ = 0;
      targetFov = 64 + p * 12;
    }

    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camTargetZ, 5.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camTargetY, 5.0, delta);
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      pointerPos.x * 0.35 * (1 - scrollProgress * 0.8),
      5.0,
      delta
    );

    state.camera.rotation.x = THREE.MathUtils.damp(state.camera.rotation.x, camTargetRotX, 5.0, delta);
    state.camera.rotation.z = THREE.MathUtils.damp(state.camera.rotation.z, camTargetRotZ, 5.0, delta);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, targetFov, 4.0, delta);
      state.camera.updateProjectionMatrix();
    }

    // -------------------------------------------------------------
    // B. ASTRONAUT CHOREOGRAPHY (Matches lucio.webm Frame 001 -> 045)
    // - Idle: facing camera, zero-g floating
    // - Expansion: heroic pose
    // - Dive: TURNS AWAY (faces -Z), pitches forward head-first, dives into depth!
    // - Corridor: acrobatic multi-axis zero-g tumble through neon beams!
    // -------------------------------------------------------------
    if (astronautRef.current) {
      const idleFloatY = Math.sin(time * 1.6) * 0.05;
      const idleFloatX = Math.cos(time * 1.1) * 0.03;
      const idleTiltZ = Math.sin(time * 1.0) * 0.03;

      let targetX = idleFloatX;
      let targetY = -0.45 + idleFloatY;
      let targetZ = 0.0;
      let targetScale = 1.35;
      let targetRotX = idleTiltZ;
      let targetRotY = Math.PI; // Facing camera in landing
      let targetRotZ = 0.0;

      if (scrollProgress <= 0.20) {
        // Idle landing in tablet
        targetZ = 0.0;
        targetScale = 1.35;
        targetRotY = Math.PI + pointerPos.x * 0.35;
        targetRotX = -pointerPos.y * 0.25;
      } else if (scrollProgress <= 0.35) {
        // Fullscreen expansion hero scale
        const p = (scrollProgress - 0.20) / 0.15;
        targetZ = p * 0.4;
        targetScale = 1.35 + p * 0.35;
        targetRotY = Math.PI + pointerPos.x * 0.25 * (1 - p);
        targetRotX = -pointerPos.y * 0.15 * (1 - p) + p * 0.15;
      } else if (scrollProgress <= 0.60) {
        // ---------------------------------------------------------
        // THE ICONIC SPACE DIVE (Matches Frame 018 & 024 of lucio.webm)
        // Astronaut turns around (facing away from camera into depth),
        // pitches forward into a head-first wingsuit/skydiver posture,
        // and dives rapidly toward the planet horizon center!
        // ---------------------------------------------------------
        const p = (scrollProgress - 0.35) / 0.25;
        targetZ = 0.4 - p * 16.0; // Dives deep along -Z
        targetY = -0.45 - p * 0.6;
        targetScale = 1.7 - p * 0.85;

        // Turn around smoothly so back faces camera, facing into depth
        targetRotY = Math.PI + p * Math.PI; // Rotates to 2*PI (facing -Z)
        // Pitch forward head-first into dive
        targetRotX = p * 0.95; // Head tilted down, diving into abyss
        targetRotZ = Math.sin(p * Math.PI) * 0.25;
      } else if (scrollProgress <= 0.85) {
        // ---------------------------------------------------------
        // CORRIDOR TUMBLE (Matches Frame 028, 034, 045 of lucio.webm)
        // Fluid, acrobatic zero-g multi-axis roll and pitch through
        // the neon emerald and amber structural corridor!
        // ---------------------------------------------------------
        const p = (scrollProgress - 0.60) / 0.25;
        targetZ = -15.6 - p * 24.0;
        targetY = -1.05 + Math.sin(time * 2.5) * 0.3;
        targetX = Math.cos(time * 2.0) * 0.35;
        targetScale = 0.85 - p * 0.35;

        // Dynamic 3-axis acrobatic tumbling
        targetRotX = 0.95 + p * Math.PI * 3.2; // Pitching forward
        targetRotY = (Math.PI * 2) + p * Math.PI * 2.8; // Yawing
        targetRotZ = p * Math.PI * 2.2 + Math.sin(time * 3.0) * 0.4; // Barrel rolling
      } else {
        // ---------------------------------------------------------
        // KALEIDOSCOPE & SUPERNOVA WARP (Matches Frame 032 & 036)
        // High-velocity hyperspace vortex dive
        // ---------------------------------------------------------
        const p = (scrollProgress - 0.85) / 0.15;
        targetZ = -39.6 - p * 35.0;
        targetScale = 0.5 - p * 0.35;
        targetRotX = (Math.PI * 4.15) + p * Math.PI * 4.0;
        targetRotY = (Math.PI * 4.8) + p * Math.PI * 4.0;
        targetRotZ = (Math.PI * 2.2) + p * Math.PI * 3.0;
      }

      astronautRef.current.position.x = THREE.MathUtils.damp(
        astronautRef.current.position.x,
        targetX,
        6.0,
        delta
      );
      astronautRef.current.position.y = THREE.MathUtils.damp(
        astronautRef.current.position.y,
        targetY,
        6.0,
        delta
      );
      astronautRef.current.position.z = THREE.MathUtils.damp(
        astronautRef.current.position.z,
        targetZ,
        6.0,
        delta
      );

      astronautRef.current.scale.setScalar(
        THREE.MathUtils.damp(astronautRef.current.scale.x, targetScale, 6.0, delta)
      );

      astronautRef.current.rotation.x = THREE.MathUtils.damp(
        astronautRef.current.rotation.x,
        targetRotX,
        5.0,
        delta
      );
      astronautRef.current.rotation.y = THREE.MathUtils.damp(
        astronautRef.current.rotation.y,
        targetRotY,
        5.0,
        delta
      );
      astronautRef.current.rotation.z = THREE.MathUtils.damp(
        astronautRef.current.rotation.z,
        targetRotZ,
        5.0,
        delta
      );
    }

    // -------------------------------------------------------------
    // C. EARTH HORIZON ROTATION
    // -------------------------------------------------------------
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * 0.02;
    }

    // -------------------------------------------------------------
    // D. CORRIDOR KINEMATICS & LIGHT PULSATION
    // -------------------------------------------------------------
    if (cyberCorridorGroupRef.current) {
      const speed = 0.3 + scrollProgress * 2.5;
      cyberCorridorGroupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 * speed;
    }

    // -------------------------------------------------------------
    // E. CRYSTALLINE KALEIDOSCOPE ROTATION
    // -------------------------------------------------------------
    if (crystalTunnelGroupRef.current) {
      const warpSpin = 0.6 + scrollProgress * 3.0;
      crystalTunnelGroupRef.current.rotation.z += delta * warpSpin * 0.45;
    }

    // -------------------------------------------------------------
    // F. SUPERNOVA PORTAL BLOOM (Frame 036)
    // -------------------------------------------------------------
    if (supernovaRef.current) {
      if (scrollProgress > 0.88) {
        const p = (scrollProgress - 0.88) / 0.12;
        const scale = 8.0 + Math.pow(p, 2.0) * 60.0;
        supernovaRef.current.scale.set(scale, scale, 1);
        (supernovaRef.current.material as THREE.MeshBasicMaterial).opacity = Math.min(1, p * 1.8);
      } else {
        (supernovaRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  // Calculate corridor & crystal visibility opacities based on scroll phase
  const cyberCorridorOpacity = Math.max(
    0,
    Math.min(1, (scrollProgress - 0.45) * 5.0) * (1 - Math.max(0, (scrollProgress - 0.82) * 4.0))
  );

  const crystalTunnelOpacity = Math.max(
    0,
    Math.min(1, (scrollProgress - 0.72) * 5.0) * (1 - Math.max(0, (scrollProgress - 0.95) * 6.0))
  );

  return (
    <group>
      {/* -------------------------------------------------------------
          1. CINEMATIC HIGH-DYNAMIC-RANGE LIGHTING
          ------------------------------------------------------------- */}
      <ambientLight intensity={0.65} color="#0f172a" />

      {/* Main sun keylight casting crisp specular highlights on spacesuit fabric */}
      <directionalLight position={[6, 9, 6]} intensity={4.5} color="#ffffff" />

      {/* Blue Rayleigh atmospheric bounce from Earth horizon */}
      <directionalLight position={[-5, -6, 2]} intensity={2.8} color="#38bdf8" />

      {/* Warm sun rim backlight highlighting astronaut shoulders and helmet contours */}
      <pointLight position={[0, 4, -3]} intensity={4.0} color="#f59e0b" distance={15} />

      {/* Dynamic Emerald Green volumetric fill light (Frames 028 & 045) */}
      {scrollProgress > 0.45 && (
        <pointLight
          position={[0, 0, -18]}
          intensity={9.0 * cyberCorridorOpacity}
          color="#22c55e"
          distance={28}
        />
      )}

      {/* Dynamic Fiery Amber/Crimson fill light (Frame 034) */}
      {scrollProgress > 0.58 && (
        <pointLight
          position={[0, 0, -28]}
          intensity={8.0 * cyberCorridorOpacity}
          color="#f97316"
          distance={30}
        />
      )}

      {/* Dynamic Neon Magenta warp fill light (Frame 032) */}
      {scrollProgress > 0.70 && (
        <pointLight
          position={[0, 0, -42]}
          intensity={10.0 * crystalTunnelOpacity}
          color="#ec4899"
          distance={35}
        />
      )}

      {/* -------------------------------------------------------------
          2. THE 3D FLOATING & DIVING ASTRONAUT
          ------------------------------------------------------------- */}
      <group ref={astronautRef} position={[0, -0.45, 0]} scale={1.35}>
        <primitive object={astronautScene} />
      </group>

      {/* -------------------------------------------------------------
          3. CURVED EARTH HORIZON (Visible in Landing, Expansion & Dive)
          ------------------------------------------------------------- */}
      <group
        ref={earthGroupRef}
        position={[0, -12.0, -6.5]}
        rotation={[0.22, 0, 0]}
        visible={scrollProgress < 0.88}
      >
        {/* Photorealistic Earth Sphere */}
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>

        {/* Outer Atmospheric Rayleigh Scattering Rim (Cyan #38bdf8) */}
        <mesh scale={1.026}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.45}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Deep Stratosphere Rim (Blue #0ea5e9) */}
        <mesh scale={1.055}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.22}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* -------------------------------------------------------------
          4. 3D SCI-FI CYBER ARCHITECTURAL CORRIDOR (Frames 022, 028, 034, 045)
          Chrome structural frames, neon green & cyan LED conduits, beacons
          ------------------------------------------------------------- */}
      {scrollProgress > 0.42 && (
        <group ref={cyberCorridorGroupRef} position={[0, 0, 0]}>
          {corridorFrames.map((frame) => (
            <group
              key={frame.index}
              position={[0, 0, frame.z]}
              rotation={[0, 0, frame.rotZ]}
            >
              {/* Top & Bottom Heavy Metallic Beams */}
              <mesh position={[0, 2.3, 0]}>
                <boxGeometry args={[5.2, 0.28, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={cyberCorridorOpacity}
                />
              </mesh>
              <mesh position={[0, -2.3, 0]}>
                <boxGeometry args={[5.2, 0.28, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={cyberCorridorOpacity}
                />
              </mesh>

              {/* Left & Right Structural Columns */}
              <mesh position={[-2.6, 0, 0]}>
                <boxGeometry args={[0.28, 4.6, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={cyberCorridorOpacity}
                />
              </mesh>
              <mesh position={[2.6, 0, 0]}>
                <boxGeometry args={[0.28, 4.6, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={cyberCorridorOpacity}
                />
              </mesh>

              {/* Glowing Neon LED Conduit Strips (Frame 022 & 028) */}
              <mesh position={[0, 2.18, 0.24]}>
                <boxGeometry args={[5.0, 0.05, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={cyberCorridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[0, -2.18, 0.24]}>
                <boxGeometry args={[5.0, 0.05, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={cyberCorridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[-2.48, 0, 0.24]}>
                <boxGeometry args={[0.05, 4.4, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={cyberCorridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[2.48, 0, 0.24]}>
                <boxGeometry args={[0.05, 4.4, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={cyberCorridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Specular Chrome Corner Brackets */}
              {[
                [-2.5, 2.2],
                [2.5, 2.2],
                [-2.5, -2.2],
                [2.5, -2.2],
              ].map(([cx, cy], cIdx) => (
                <mesh key={cIdx} position={[cx, cy, 0.25]}>
                  <boxGeometry args={[0.24, 0.24, 0.24]} />
                  <meshBasicMaterial
                    color={frame.beaconColor}
                    transparent
                    opacity={cyberCorridorOpacity}
                  />
                </mesh>
              ))}
            </group>
          ))}

          {/* Floating Plasma Embers & Wisps (Frame 026 & 034) */}
          {corridorEmbers.map((ember, eIdx) => (
            <mesh key={eIdx} position={[ember.x, ember.y, ember.z]}>
              <sphereGeometry args={[ember.size, 16, 16]} />
              <meshBasicMaterial
                color={ember.color}
                transparent
                opacity={cyberCorridorOpacity * 0.9}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* -------------------------------------------------------------
          5. CRYSTALLINE KALEIDOSCOPE FRACTAL TUNNEL (Frame 032)
          Interlocking hexagonal diamond struts, magenta & cyan vertices
          ------------------------------------------------------------- */}
      {scrollProgress > 0.68 && (
        <group ref={crystalTunnelGroupRef} position={[0, 0, 0]}>
          {crystalSegments.map((seg) => (
            <group
              key={seg.index}
              position={[0, 0, seg.z]}
              rotation={[0, 0, seg.rotZ]}
            >
              {/* Outer Geodesic Diamond Ring */}
              <mesh>
                <ringGeometry args={[3.0 * seg.scale, 3.2 * seg.scale, 6]} />
                <meshBasicMaterial
                  color={seg.color}
                  transparent
                  opacity={crystalTunnelOpacity * 0.9}
                  blending={THREE.AdditiveBlending}
                  wireframe
                />
              </mesh>

              {/* Inner Concentric Diamond Ring */}
              <mesh rotation={[0, 0, Math.PI / 6]}>
                <ringGeometry args={[2.2 * seg.scale, 2.35 * seg.scale, 6]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={crystalTunnelOpacity * 0.85}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Connecting Radial Geometric Struts */}
              {[0, 1, 2, 3, 4, 5].map((strut) => {
                const angle = (strut / 6) * Math.PI * 2;
                const r = 2.6 * seg.scale;
                return (
                  <mesh
                    key={strut}
                    position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
                    rotation={[0, 0, angle]}
                  >
                    <boxGeometry args={[0.08, 0.95, 0.08]} />
                    <meshBasicMaterial
                      color={seg.color}
                      transparent
                      opacity={crystalTunnelOpacity}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}

          {/* Floating Reflective Crystal Shards (Frame 032) */}
          {crystalShards.map((shard, sIdx) => (
            <mesh
              key={sIdx}
              position={[shard.x, shard.y, shard.z]}
              rotation={[sIdx * 0.4, sIdx * 0.6, sIdx * 0.8]}
            >
              <octahedronGeometry args={[0.24, 0]} />
              <meshStandardMaterial
                color={shard.color}
                emissive={shard.color}
                emissiveIntensity={0.65}
                metalness={0.92}
                roughness={0.12}
                transparent
                opacity={crystalTunnelOpacity}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* -------------------------------------------------------------
          6. SUPERNOVA PORTAL BLOOM (Matches Frame 036 of lucio.webm)
          Radiant white-cyan bloom disk at hyperspace completion
          ------------------------------------------------------------- */}
      <mesh
        ref={supernovaRef}
        position={[0, 0, -75]}
        scale={[8, 8, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* -------------------------------------------------------------
          7. STARFIELD & HYPERSPACE SPEED STREAKS
          ------------------------------------------------------------- */}
      <Stars
        radius={150}
        depth={80}
        count={5000}
        factor={isExpanded ? 6.0 : 3.5}
        saturation={0.6}
        fade
        speed={1.4}
      />

      {/* High-speed warp particle stream during dive and corridor */}
      {scrollProgress > 0.35 && (
        <Sparkles
          count={650}
          scale={[18, 18, 85]}
          size={5.5}
          speed={7.0}
          color={scrollProgress > 0.70 ? '#ec4899' : '#38bdf8'}
          opacity={Math.min(0.95, (scrollProgress - 0.35) * 2.2)}
        />
      )}
    </group>
  );
};
