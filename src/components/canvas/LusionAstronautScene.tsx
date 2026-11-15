import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  LUSION_IN_ANIMATION,
  LUSION_OUT_ANIMATION,
} from '../../data/lusionAstronautTrajectory';

interface LusionAstronautSceneProps {
  scrollProgress: number; // 0.0 (idle hero landing) to 1.0 (hyperspace complete)
  pointerPos?: { x: number; y: number };
  isExpanded?: boolean;
}

export const LusionAstronautScene: React.FC<LusionAstronautSceneProps> = ({
  scrollProgress,
  pointerPos = { x: 0, y: 0 },
  isExpanded = false,
}) => {
  const astronautRef = useRef<THREE.Group>(null);
  const cloneRefs = useRef<(THREE.Group | null)[]>([]);
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cyberCorridorGroupRef = useRef<THREE.Group>(null);
  const crystalTunnelGroupRef = useRef<THREE.Group>(null);
  const supernovaRef = useRef<THREE.Mesh>(null);

  // Dynamic Point Lights
  const greenLightRef = useRef<THREE.PointLight>(null);
  const amberLightRef = useRef<THREE.PointLight>(null);
  const magentaLightRef = useRef<THREE.PointLight>(null);

  // Load authentic Lusion astronaut 3D model (decompressed from lusion.co .buf files)
  const { scene: astronautModel } = useGLTF('/models/lusion_astronaut.glb');

  // Load photorealistic Earth texture
  const earthTexture = useTexture('/textures/earth.jpg');

  // Configure PBR materials for helmet, visor glass, gloves, boots, and wearpack
  const astronautScene = useMemo(() => {
    const clone = astronautModel.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.name === 'helmet_glass') {
          // Deep gold / chrome reflective space visor
          mesh.material = new THREE.MeshStandardMaterial({
            color: '#06101e',
            roughness: 0.03,
            metalness: 0.98,
            envMapIntensity: 3.5,
          });
        } else if (mesh.name === 'glove_shoes') {
          // Reinforced graphite grip pads & boots
          mesh.material = new THREE.MeshStandardMaterial({
            color: '#1e293b',
            roughness: 0.42,
            metalness: 0.25,
            envMapIntensity: 1.8,
          });
        } else {
          // Ceramic titanium & Kevlar spacesuit fabric
          mesh.material = new THREE.MeshStandardMaterial({
            color: '#f8fafc',
            roughness: 0.26,
            metalness: 0.38,
            envMapIntensity: 2.6,
          });
        }
      }
    });
    return clone;
  }, [astronautModel]);

  // Authentic trailing ghost clones (the visual signature from lucio.webm & Lusion GoalTunnelAstronauts)
  const cloneScenes = useMemo(() => {
    const colors = ['#00b5a6', '#22c55e', '#f59e0b'];
    return colors.map((color, i) => {
      const clone = astronautModel.clone();
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.32 / (i + 1),
            wireframe: i === 2,
            blending: THREE.AdditiveBlending,
          });
        }
      });
      return clone;
    });
  }, [astronautModel]);

  // Interpolation working vectors
  const _p0 = useMemo(() => new THREE.Vector3(), []);
  const _p1 = useMemo(() => new THREE.Vector3(), []);
  const _q0 = useMemo(() => new THREE.Quaternion(), []);
  const _q1 = useMemo(() => new THREE.Quaternion(), []);

  // ---------------------------------------------------------------------------
  // GSAP MASTER LIGHTING & VOLUMETRIC TUNNEL TIMELINE
  // ---------------------------------------------------------------------------
  const animState = useRef({
    corridorOpacity: 0.0,
    corridorColorMix: 0.0, // 0 = Emerald Green / Cyan, 1 = Fiery Amber / Crimson
    crystalOpacity: 0.0,
    sparklesOpacity: 0.0,
    supernovaScale: 12.0,
    supernovaOpacity: 0.0,
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    // Stage 1: Card expansion & Earth approach (0.00 -> 0.35)
    tl.to(
      animState.current,
      {
        duration: 0.35,
        ease: 'none',
      },
      0
    );

    // Stage 2: Cyber corridor neon activation (0.45 -> 0.76)
    tl.to(
      animState.current,
      {
        corridorOpacity: 1.0,
        sparklesOpacity: 1.0,
        duration: 0.10,
        ease: 'power1.in',
      },
      0.45
    );

    // Color shift in corridor: Emerald/Cyan -> Fiery Amber/Crimson (Frame 034)
    tl.to(
      animState.current,
      {
        corridorColorMix: 1.0,
        duration: 0.14,
        ease: 'sine.inOut',
      },
      0.60
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

    // Stage 3: Crystalline Kaleidoscope Fractal Warp (0.76 -> 0.90)
    tl.to(
      animState.current,
      {
        crystalOpacity: 1.0,
        duration: 0.06,
        ease: 'power1.in',
      },
      0.76
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

    // Stage 4: Supernova Portal Bloom (0.88 -> 1.00)
    tl.to(
      animState.current,
      {
        supernovaScale: 120.0,
        supernovaOpacity: 1.0,
        duration: 0.12,
        ease: 'expo.in',
      },
      0.88
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.progress(Math.max(0, Math.min(1.0, scrollProgress)));
    }
  }, [scrollProgress]);

  // ---------------------------------------------------------------------------
  // PROCEDURAL SCENE GEOMETRIES (Corridor & Crystal Fractal)
  // Aligned to Lusion native world coordinates (Z = 16 to Z = -50)
  // ---------------------------------------------------------------------------
  const corridorFrames = useMemo(() => {
    const count = 24;
    return Array.from({ length: count }, (_, i) => {
      const z = 16 - i * 2.8; // spans Z = 16 down to Z = -48.4
      const rotZ = i * 0.08;
      let themeColor = '#00b5a6'; // emerald teal (COLOR_1[0])
      let beaconColor = '#22c55e';
      if (i > 8 && i <= 16) {
        themeColor = '#ba0000'; // fiery red / amber (COLOR_1[1])
        beaconColor = '#f97316';
      } else if (i > 16) {
        themeColor = '#0099ff'; // cyber cyan (COLOR_1[3])
        beaconColor = '#38bdf8';
      }
      return { z, rotZ, themeColor, beaconColor, index: i };
    });
  }, []);

  const corridorEmbers = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, (_, i) => {
      const z = 14 - (i % 20) * 3.2;
      const angle = i * 0.85;
      const r = 1.3 + (i % 4) * 0.35;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const size = 0.05 + (i % 3) * 0.04;
      const color = i % 2 === 0 ? '#00b5a6' : i % 3 === 0 ? '#f97316' : '#38bdf8';
      return { x, y, z, size, color };
    });
  }, []);

  const crystalSegments = useMemo(() => {
    const count = 26;
    return Array.from({ length: count }, (_, i) => {
      const z = 8 - i * 2.5; // spans Z = 8 down to Z = -54.5
      const rotZ = i * 0.24;
      const scale = 1.0 + Math.sin(i * 0.6) * 0.22;
      const color = i % 2 === 0 ? '#ec4899' : '#00b5a6';
      return { z, rotZ, scale, color, index: i };
    });
  }, []);

  const crystalShards = useMemo(() => {
    const count = 36;
    return Array.from({ length: count }, (_, i) => {
      const z = 7 - i * 2.1;
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
  // Directly evaluates the exact unpacked 100-frame trajectories!
  // ---------------------------------------------------------------------------
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const anim = animState.current;

    // Organic zero-g idle floating harmonics & mouse parallax
    const hoverFactor = Math.max(0, 1.0 - scrollProgress * 2.5);
    const idleFloatX = Math.sin(time * 1.2) * 0.02 * hoverFactor;
    const idleFloatY = Math.cos(time * 0.9) * 0.025 * hoverFactor;
    const mouseParallaxX = pointerPos.x * 0.08 * hoverFactor;
    const mouseParallaxY = pointerPos.y * 0.05 * hoverFactor;

    // -------------------------------------------------------------
    // 1. TRAJECTORY SAMPLING (Exact Lusion updateTransforms formula)
    // -------------------------------------------------------------
    const isOut = scrollProgress >= 0.80;
    const track = isOut ? LUSION_OUT_ANIMATION : LUSION_IN_ANIMATION;
    let frameProgress: number;

    if (!isOut) {
      // In-animation: card idle -> space turnaround -> wingsuit dive into cyber corridor
      if (scrollProgress < 0.20) {
        // Card idle hovering (Frames 0 to 4)
        frameProgress = (scrollProgress / 0.20) * 4.0;
      } else {
        // Deep space dive: cubic acceleration plunging into the corridor
        const diveT = Math.min(1.0, Math.max(0, (scrollProgress - 0.20) / (0.80 - 0.20)));
        frameProgress = 4.0 + 95.0 * Math.pow(diveT, 2.6); // cubicIn acceleration
      }
    } else {
      // Out-animation: crystalline hyperspace breakout returning to resting position
      const outT = Math.min(1.0, Math.max(0, (scrollProgress - 0.80) / 0.20));
      frameProgress = outT * 99.0;
    }

    const frameA = Math.min(Math.floor(frameProgress), 99);
    const frameB = Math.min(Math.ceil(frameProgress), 99);
    const blend = frameProgress - frameA;

    // Interpolate exact position
    _p0.fromArray(track.position[frameA]);
    _p1.fromArray(track.position[frameB]);
    _p0.lerp(_p1, blend);

    // Slerp exact orientation quaternion
    _q0.fromArray(track.orient[frameA]);
    _q1.fromArray(track.orient[frameB]);
    _q0.slerp(_q1, blend);

    // Authentic corridor acrobatic tumbling between 0.52 and 0.80
    if (scrollProgress >= 0.52 && scrollProgress <= 0.80) {
      const tunnelT = (scrollProgress - 0.52) / 0.28;
      const tumbleIntensity = Math.sin(tunnelT * Math.PI);
      const tumbleRoll = Math.sin(time * 2.4 + scrollProgress * 14.0) * 0.40 * tumbleIntensity;
      const tumblePitch = Math.cos(time * 1.9 + scrollProgress * 10.0) * 0.28 * tumbleIntensity;
      const tumbleYaw = Math.sin(time * 1.5 + scrollProgress * 8.0) * 0.22 * tumbleIntensity;

      const tumbleEuler = new THREE.Euler(tumblePitch, tumbleYaw, tumbleRoll);
      const tumbleQuat = new THREE.Quaternion().setFromEuler(tumbleEuler);
      _q0.multiply(tumbleQuat);
    }

    // Apply idle float & mouse tracking
    _p0.x += idleFloatX + mouseParallaxX;
    _p0.y += idleFloatY - mouseParallaxY;

    // Smoothly bind to primary astronaut mesh
    if (astronautRef.current) {
      astronautRef.current.position.copy(_p0);
      astronautRef.current.quaternion.copy(_q0);
    }

    // -------------------------------------------------------------
    // 2. TRAILING GHOST CLONES (lucio.webm corridor signature)
    // -------------------------------------------------------------
    if (scrollProgress >= 0.40 && scrollProgress <= 0.85) {
      cloneRefs.current.forEach((cloneGroup, idx) => {
        if (cloneGroup) {
          const lagFrames = (idx + 1) * 3.5;
          const lagProgress = Math.max(0, frameProgress - lagFrames);
          const cA = Math.min(Math.floor(lagProgress), 99);
          const cB = Math.min(Math.ceil(lagProgress), 99);
          const cBlend = lagProgress - cA;

          const cloneP = new THREE.Vector3()
            .fromArray(track.position[cA])
            .lerp(new THREE.Vector3().fromArray(track.position[cB]), cBlend);
          const cloneQ = new THREE.Quaternion()
            .fromArray(track.orient[cA])
            .slerp(new THREE.Quaternion().fromArray(track.orient[cB]), cBlend);

          cloneGroup.position.copy(cloneP);
          cloneGroup.quaternion.copy(cloneQ);
          cloneGroup.visible = true;
        }
      });
    } else {
      cloneRefs.current.forEach((cloneGroup) => {
        if (cloneGroup) cloneGroup.visible = false;
      });
    }

    // -------------------------------------------------------------
    // 3. CAMERA KINEMATICS & DOLLY ZOOM HARMONICS
    // -------------------------------------------------------------
    const dollyFovOffset =
      Math.sin(scrollProgress * 10.0 + time * 1.5) *
      6.5 *
      THREE.MathUtils.smoothstep(scrollProgress, 0.35, 0.78);

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      mouseParallaxX * 0.25,
      8.0,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      mouseParallaxY * 0.18,
      8.0,
      delta
    );
    state.camera.position.z = 25.0;
    state.camera.lookAt(0, 0, 24.0);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = 45.0 + dollyFovOffset;
      state.camera.updateProjectionMatrix();
    }

    // -------------------------------------------------------------
    // 4. EARTH ROTATION & KINEMATICS
    // -------------------------------------------------------------
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * 0.02;
    }

    // -------------------------------------------------------------
    // 5. CORRIDOR & CRYSTAL ROTATION
    // -------------------------------------------------------------
    if (cyberCorridorGroupRef.current) {
      const speed = 0.3 + scrollProgress * 2.5;
      cyberCorridorGroupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 * speed;
    }

    if (crystalTunnelGroupRef.current) {
      const warpSpin = 0.6 + scrollProgress * 3.0;
      crystalTunnelGroupRef.current.rotation.z += delta * warpSpin * 0.45;
    }

    // -------------------------------------------------------------
    // 6. SUPERNOVA BLOOM
    // -------------------------------------------------------------
    if (supernovaRef.current) {
      supernovaRef.current.scale.set(anim.supernovaScale, anim.supernovaScale, 1);
      (supernovaRef.current.material as THREE.MeshBasicMaterial).opacity = anim.supernovaOpacity;
    }

    // -------------------------------------------------------------
    // 7. DYNAMIC LIGHT INTENSITIES
    // -------------------------------------------------------------
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
      <ambientLight intensity={0.7} color="#0b1329" />

      {/* Main sun keylight highlighting suit fabric */}
      <directionalLight position={[15, 22, 28]} intensity={4.5} color="#ffffff" />

      {/* Earth blue Rayleigh bounce light */}
      <directionalLight position={[-10, -15, 18]} intensity={3.0} color="#38bdf8" />

      {/* Warm sun rim backlight */}
      <pointLight position={[0, 4, 21]} intensity={3.5} color="#f59e0b" distance={12} />

      {/* Volumetric Emerald Green Fill */}
      <pointLight
        ref={greenLightRef}
        position={[0, 0, 10]}
        intensity={0}
        color="#00b5a6"
        distance={25}
      />

      {/* Volumetric Fiery Amber Fill */}
      <pointLight
        ref={amberLightRef}
        position={[0, 0, 0]}
        intensity={0}
        color="#f97316"
        distance={30}
      />

      {/* Volumetric Neon Magenta Warp Fill */}
      <pointLight
        ref={magentaLightRef}
        position={[0, 0, -15]}
        intensity={0}
        color="#ec4899"
        distance={35}
      />

      {/* -------------------------------------------------------------
          2. THE AUTHENTIC LUSION 3D ASTRONAUT
          Driven directly by the unpacked 100-frame trajectories!
          ------------------------------------------------------------- */}
      <group ref={astronautRef} position={[0, -0.7, 23.0]}>
        <primitive object={astronautScene} />
      </group>

      {/* Trailing Ghost Clones (lucio.webm signature) */}
      {cloneScenes.map((cloneScene, idx) => (
        <group
          key={idx}
          ref={(el) => {
            cloneRefs.current[idx] = el;
          }}
          visible={false}
        >
          <primitive object={cloneScene} />
        </group>
      ))}

      {/* -------------------------------------------------------------
          3. CURVED EARTH HORIZON (Lusion native world coordinates)
          ------------------------------------------------------------- */}
      <group
        ref={earthGroupRef}
        position={[0, -22.0, 0]}
        rotation={[0.18, 0, 0]}
        visible={scrollProgress < 0.88}
      >
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[18, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>

        {/* Outer Atmospheric Rayleigh Scattering Rim (Cyan #38bdf8) */}
        <mesh scale={1.022}>
          <sphereGeometry args={[18, 64, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.45}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Deep Stratosphere Rim (Blue #0ea5e9) */}
        <mesh scale={1.045}>
          <sphereGeometry args={[18, 64, 64]} />
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
          4. 3D SCI-FI CYBER ARCHITECTURAL CORRIDOR
          ------------------------------------------------------------- */}
      {scrollProgress > 0.38 && (
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
          5. CRYSTALLINE KALEIDOSCOPE FRACTAL TUNNEL
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
          6. SUPERNOVA PORTAL BLOOM
          ------------------------------------------------------------- */}
      <mesh ref={supernovaRef} position={[0, 0, -60]} scale={[12, 12, 1]}>
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
          7. STARFIELD & SPEED STREAKS
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

useGLTF.preload('/models/lusion_astronaut.glb');
useTexture.preload('/textures/earth.jpg');
