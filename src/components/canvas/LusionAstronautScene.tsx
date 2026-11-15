import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

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

  // Dynamic Point Lights
  const greenLightRef = useRef<THREE.PointLight>(null);
  const amberLightRef = useRef<THREE.PointLight>(null);
  const magentaLightRef = useRef<THREE.PointLight>(null);

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
          enhanced.roughness = 0.32;
          enhanced.metalness = 0.32;
          enhanced.envMapIntensity = 2.4;
          mesh.material = enhanced;
        }
      }
    });
    return clone;
  }, [astronautModel]);

  // ---------------------------------------------------------------------------
  // GSAP ANIMATION STATE PROXY & MASTER 3D TIMELINE
  // Exactly models the multi-stage visual choreography from lucio.webm
  // ---------------------------------------------------------------------------
  const animState = useRef({
    // Camera
    camZ: 3.6,
    camY: 0.0,
    camRotX: 0.0,
    camRotZ: 0.0,
    camFov: 42,

    // Astronaut Position & Scale
    astroX: 0.0,
    astroY: -0.32,
    astroZ: 0.0,
    astroScale: 1.35,

    // Astronaut Rotation (Euler Angles)
    astroRotX: 0.0,
    astroRotY: Math.PI, // Facing camera in landing
    astroRotZ: 0.0,

    // Environment & Volumetric Lighting
    corridorOpacity: 0.0,
    corridorColorMix: 0.0, // 0 = Emerald Green / Cyan, 1 = Fiery Amber / Crimson
    crystalOpacity: 0.0,
    sparklesOpacity: 0.0,

    // Supernova Bloom Flash (Frame 036)
    supernovaScale: 8.0,
    supernovaOpacity: 0.0,
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Construct master GSAP timeline (duration = 1.0 for normalized scrub)
    const tl = gsap.timeline({ paused: true });

    // -------------------------------------------------------------
    // STAGE 1: Fullscreen Expansion Hero Push-In (0.00 -> 0.30)
    // -------------------------------------------------------------
    tl.to(
      animState.current,
      {
        camZ: 3.0,
        camFov: 44,
        astroScale: 1.55,
        astroZ: 0.3,
        duration: 0.30,
        ease: 'power2.inOut',
      },
      0
    );

    // -------------------------------------------------------------
    // STAGE 2: The Space Dive & Turnaround (0.30 -> 0.55)
    // Matches lucio.webm Frames 018 & 024:
    // Astronaut turns completely around to face into depth (-Z),
    // pitches forward head-first into a steep wingsuit dive,
    // hurtles away from camera toward the glowing Earth horizon!
    // -------------------------------------------------------------
    tl.to(
      animState.current,
      {
        astroRotY: Math.PI * 2, // Turns around to face -Z
        astroRotX: 1.1, // Pitches forward head-down into dive
        astroZ: -18.0, // Dives deep into space
        astroY: -1.1,
        astroScale: 0.85,
        camY: -0.38,
        camRotX: -0.16, // Camera pitches down following dive
        camZ: 2.2,
        duration: 0.25,
        ease: 'power2.in',
      },
      0.30
    );

    // -------------------------------------------------------------
    // STAGE 3: Plunging into the Sci-Fi Cyber Corridor (0.55 -> 0.78)
    // Matches lucio.webm Frames 028, 034 & 045:
    // Architectural metallic corridor with emerald green/cyan lights,
    // shifting to amber/crimson plasma. Astronaut executes continuous
    // acrobatic zero-g rolls and tumbling through the beams!
    // -------------------------------------------------------------
    tl.to(
      animState.current,
      {
        corridorOpacity: 1.0,
        sparklesOpacity: 1.0,
        duration: 0.08,
        ease: 'power1.in',
      },
      0.55
    );

    tl.to(
      animState.current,
      {
        astroZ: -42.0,
        astroY: -0.75,
        astroScale: 0.65,
        astroRotX: 1.1 + Math.PI * 3.5, // 3.5 tumbling rolls
        astroRotY: Math.PI * 2 + Math.PI * 2.8, // yaw spin
        astroRotZ: Math.PI * 2.4, // barrel rolls
        camZ: -16.0,
        camFov: 52,
        duration: 0.23,
        ease: 'power1.inOut',
      },
      0.55
    );

    // Color shift in corridor: Emerald/Cyan -> Fiery Amber/Crimson
    tl.to(
      animState.current,
      {
        corridorColorMix: 1.0,
        duration: 0.12,
        ease: 'sine.inOut',
      },
      0.65
    );

    tl.to(
      animState.current,
      {
        corridorOpacity: 0.0,
        duration: 0.06,
        ease: 'power2.out',
      },
      0.74
    );

    // -------------------------------------------------------------
    // STAGE 4: Crystalline Kaleidoscope Fractal Warp (0.78 -> 0.92)
    // Matches lucio.webm Frame 032:
    // Concentric geometric hexagonal struts with neon magenta & cyan
    // lights, speed streaks, and dynamic FOV warp expansion!
    // -------------------------------------------------------------
    tl.to(
      animState.current,
      {
        crystalOpacity: 1.0,
        duration: 0.06,
        ease: 'power1.in',
      },
      0.78
    );

    tl.to(
      animState.current,
      {
        astroZ: -75.0,
        astroScale: 0.35,
        astroRotX: 1.1 + Math.PI * 7.5,
        astroRotY: Math.PI * 2 + Math.PI * 6.8,
        astroRotZ: Math.PI * 5.4,
        camZ: -46.0,
        camFov: 66, // Dramatic warp perspective speed expansion
        duration: 0.14,
        ease: 'power2.in',
      },
      0.78
    );

    tl.to(
      animState.current,
      {
        crystalOpacity: 0.0,
        duration: 0.05,
        ease: 'power2.out',
      },
      0.88
    );

    // -------------------------------------------------------------
    // STAGE 5: Supernova Portal Bloom (0.90 -> 1.00)
    // Matches lucio.webm Frame 036:
    // Pure radiant white-and-cyan bloom flash engulfs the screen!
    // -------------------------------------------------------------
    tl.to(
      animState.current,
      {
        supernovaScale: 85.0,
        supernovaOpacity: 1.0,
        duration: 0.10,
        ease: 'expo.in',
      },
      0.90
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  // Update GSAP timeline progress on scroll/playback changes
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.progress(Math.max(0, Math.min(1.0, scrollProgress)));
    }
  }, [scrollProgress]);

  // ---------------------------------------------------------------------------
  // PROCEDURAL SCENE GEOMETRIES (Corridor & Crystal Fractal)
  // ---------------------------------------------------------------------------
  const corridorFrames = useMemo(() => {
    const count = 24;
    return Array.from({ length: count }, (_, i) => {
      const z = -8 - i * 3.4;
      const rotZ = i * 0.06;
      let themeColor = '#22c55e'; // emerald green (Frames 028 & 045)
      let beaconColor = '#f59e0b';
      if (i > 8 && i <= 16) {
        themeColor = '#ef4444'; // fiery red / amber (Frame 034)
        beaconColor = '#f97316';
      } else if (i > 16) {
        themeColor = '#06b6d4'; // cyber cyan
        beaconColor = '#38bdf8';
      }
      return { z, rotZ, themeColor, beaconColor, index: i };
    });
  }, []);

  const corridorEmbers = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, (_, i) => {
      const z = -10 - (i % 20) * 3.8;
      const angle = i * 0.85;
      const r = 1.3 + (i % 4) * 0.35;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const size = 0.05 + (i % 3) * 0.04;
      const color = i % 2 === 0 ? '#22c55e' : i % 3 === 0 ? '#f97316' : '#06b6d4';
      return { x, y, z, size, color };
    });
  }, []);

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
  // 60FPS THREE.JS KINEMATICS LOOP
  // Binds GSAP-interpolated coordinates directly to 3D meshes & camera
  // ---------------------------------------------------------------------------
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const anim = animState.current;

    // Organic zero-g idle floating harmonics (fades away as dive speed increases)
    const idleWeight = Math.max(0, 1 - scrollProgress * 3.0);
    const idleFloatY = Math.sin(time * 1.6) * 0.05 * idleWeight;
    const idleFloatX = Math.cos(time * 1.1) * 0.03 * idleWeight;
    const idleTiltZ = Math.sin(time * 1.0) * 0.03 * idleWeight;

    // Mouse parallax tracking (active in landing/expansion phase)
    const mouseX = pointerPos.x * 0.35 * idleWeight;
    const mouseY = pointerPos.y * 0.25 * idleWeight;

    // 1. Apply to Camera
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, anim.camZ, 8.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, anim.camY, 8.0, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mouseX, 8.0, delta);

    state.camera.rotation.x = THREE.MathUtils.damp(state.camera.rotation.x, anim.camRotX - mouseY * 0.2, 8.0, delta);
    state.camera.rotation.z = THREE.MathUtils.damp(
      state.camera.rotation.z,
      anim.camRotZ + Math.sin(time * 2.0) * 0.04 * (1 - idleWeight),
      8.0,
      delta
    );

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, anim.camFov, 6.0, delta);
      state.camera.updateProjectionMatrix();
    }

    // 2. Apply to Astronaut
    if (astronautRef.current) {
      astronautRef.current.position.x = THREE.MathUtils.damp(
        astronautRef.current.position.x,
        anim.astroX + idleFloatX + mouseX * 0.5,
        8.0,
        delta
      );
      astronautRef.current.position.y = THREE.MathUtils.damp(
        astronautRef.current.position.y,
        anim.astroY + idleFloatY - mouseY * 0.4,
        8.0,
        delta
      );
      astronautRef.current.position.z = THREE.MathUtils.damp(
        astronautRef.current.position.z,
        anim.astroZ,
        8.0,
        delta
      );

      astronautRef.current.scale.setScalar(
        THREE.MathUtils.damp(astronautRef.current.scale.x, anim.astroScale, 8.0, delta)
      );

      astronautRef.current.rotation.x = THREE.MathUtils.damp(
        astronautRef.current.rotation.x,
        anim.astroRotX + idleTiltZ,
        8.0,
        delta
      );
      astronautRef.current.rotation.y = THREE.MathUtils.damp(
        astronautRef.current.rotation.y,
        anim.astroRotY + mouseX * 0.6,
        8.0,
        delta
      );
      astronautRef.current.rotation.z = THREE.MathUtils.damp(
        astronautRef.current.rotation.z,
        anim.astroRotZ,
        8.0,
        delta
      );
    }

    // 3. Earth Rotation
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * 0.02;
    }

    // 4. Corridor Kinematics
    if (cyberCorridorGroupRef.current) {
      const speed = 0.3 + scrollProgress * 2.5;
      cyberCorridorGroupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 * speed;
    }

    // 5. Crystal Kaleidoscope Rotation
    if (crystalTunnelGroupRef.current) {
      const warpSpin = 0.6 + scrollProgress * 3.0;
      crystalTunnelGroupRef.current.rotation.z += delta * warpSpin * 0.45;
    }

    // 6. Supernova Bloom
    if (supernovaRef.current) {
      supernovaRef.current.scale.set(anim.supernovaScale, anim.supernovaScale, 1);
      (supernovaRef.current.material as THREE.MeshBasicMaterial).opacity = anim.supernovaOpacity;
    }

    // 7. Dynamic Point Light Intensities
    if (greenLightRef.current) {
      greenLightRef.current.intensity = (1 - anim.corridorColorMix) * anim.corridorOpacity * 9.0;
    }
    if (amberLightRef.current) {
      amberLightRef.current.intensity = anim.corridorColorMix * anim.corridorOpacity * 8.0;
    }
    if (magentaLightRef.current) {
      magentaLightRef.current.intensity = anim.crystalOpacity * 10.0;
    }
  });

  return (
    <group>
      {/* -------------------------------------------------------------
          1. LIGHTING SUITE
          ------------------------------------------------------------- */}
      <ambientLight intensity={0.65} color="#0f172a" />

      {/* Main sun keylight highlighting suit fabric */}
      <directionalLight position={[6, 9, 6]} intensity={4.5} color="#ffffff" />

      {/* Earth blue Rayleigh bounce light */}
      <directionalLight position={[-5, -6, 2]} intensity={2.8} color="#38bdf8" />

      {/* Warm sun rim backlight */}
      <pointLight position={[0, 4, -3]} intensity={4.0} color="#f59e0b" distance={15} />

      {/* Volumetric Emerald Green Fill (Frames 028 & 045) */}
      <pointLight
        ref={greenLightRef}
        position={[0, 0, -18]}
        intensity={0}
        color="#22c55e"
        distance={28}
      />

      {/* Volumetric Fiery Amber Fill (Frame 034) */}
      <pointLight
        ref={amberLightRef}
        position={[0, 0, -28]}
        intensity={0}
        color="#f97316"
        distance={30}
      />

      {/* Volumetric Neon Magenta Warp Fill (Frame 032) */}
      <pointLight
        ref={magentaLightRef}
        position={[0, 0, -42]}
        intensity={0}
        color="#ec4899"
        distance={35}
      />

      {/* -------------------------------------------------------------
          2. THE 3D GSAP-CHOREOGRAPHED ASTRONAUT
          ------------------------------------------------------------- */}
      <group ref={astronautRef} position={[0, -0.32, 0]} scale={1.35}>
        <primitive object={astronautScene} />
      </group>

      {/* -------------------------------------------------------------
          3. CURVED EARTH HORIZON
          ------------------------------------------------------------- */}
      <group
        ref={earthGroupRef}
        position={[0, -12.0, -6.5]}
        rotation={[0.22, 0, 0]}
        visible={scrollProgress < 0.88}
      >
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
          ------------------------------------------------------------- */}
      {scrollProgress > 0.40 && (
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
                  opacity={animState.current.corridorOpacity}
                />
              </mesh>
              <mesh position={[0, -2.3, 0]}>
                <boxGeometry args={[5.2, 0.28, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={animState.current.corridorOpacity}
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
                  opacity={animState.current.corridorOpacity}
                />
              </mesh>
              <mesh position={[2.6, 0, 0]}>
                <boxGeometry args={[0.28, 4.6, 0.45]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.94}
                  roughness={0.18}
                  transparent
                  opacity={animState.current.corridorOpacity}
                />
              </mesh>

              {/* Glowing Neon LED Conduit Strips */}
              <mesh position={[0, 2.18, 0.24]}>
                <boxGeometry args={[5.0, 0.05, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={animState.current.corridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[0, -2.18, 0.24]}>
                <boxGeometry args={[5.0, 0.05, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={animState.current.corridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[-2.48, 0, 0.24]}>
                <boxGeometry args={[0.05, 4.4, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={animState.current.corridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh position={[2.48, 0, 0.24]}>
                <boxGeometry args={[0.05, 4.4, 0.05]} />
                <meshBasicMaterial
                  color={frame.themeColor}
                  transparent
                  opacity={animState.current.corridorOpacity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Corner Specular Chrome Nodes */}
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
                    opacity={animState.current.corridorOpacity}
                  />
                </mesh>
              ))}
            </group>
          ))}

          {/* Floating Plasma Embers (Frame 026 & 034) */}
          {corridorEmbers.map((ember, eIdx) => (
            <mesh key={eIdx} position={[ember.x, ember.y, ember.z]}>
              <sphereGeometry args={[ember.size, 16, 16]} />
              <meshBasicMaterial
                color={ember.color}
                transparent
                opacity={animState.current.corridorOpacity * 0.9}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* -------------------------------------------------------------
          5. CRYSTALLINE KALEIDOSCOPE FRACTAL TUNNEL (Frame 032)
          ------------------------------------------------------------- */}
      {scrollProgress > 0.68 && (
        <group ref={crystalTunnelGroupRef} position={[0, 0, 0]}>
          {crystalSegments.map((seg) => (
            <group
              key={seg.index}
              position={[0, 0, seg.z]}
              rotation={[0, 0, seg.rotZ]}
            >
              <mesh>
                <ringGeometry args={[3.0 * seg.scale, 3.2 * seg.scale, 6]} />
                <meshBasicMaterial
                  color={seg.color}
                  transparent
                  opacity={animState.current.crystalOpacity * 0.9}
                  blending={THREE.AdditiveBlending}
                  wireframe
                />
              </mesh>

              <mesh rotation={[0, 0, Math.PI / 6]}>
                <ringGeometry args={[2.2 * seg.scale, 2.35 * seg.scale, 6]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={animState.current.crystalOpacity * 0.85}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

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
                      opacity={animState.current.crystalOpacity}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}

          {/* Floating Crystal Shards */}
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
                opacity={animState.current.crystalOpacity}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* -------------------------------------------------------------
          6. SUPERNOVA PORTAL BLOOM (Frame 036)
          ------------------------------------------------------------- */}
      <mesh ref={supernovaRef} position={[0, 0, -75]} scale={[8, 8, 1]}>
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

      {scrollProgress > 0.35 && (
        <Sparkles
          count={650}
          scale={[18, 18, 85]}
          size={5.5}
          speed={7.0}
          color={scrollProgress > 0.70 ? '#ec4899' : '#38bdf8'}
          opacity={animState.current.sparklesOpacity * 0.95}
        />
      )}
    </group>
  );
};
