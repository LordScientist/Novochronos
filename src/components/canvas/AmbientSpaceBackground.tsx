import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedural GLSL Simplex 3D Noise Shader for the Milky Way Galactic Core & Cosmic Dust
const COSMIC_VERTEX_SHADER = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const COSMIC_FRAGMENT_SHADER = `
uniform float uTime;
varying vec3 vWorldPosition;
varying vec2 vUv;

// Simplex 3D noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// 4-octave Fractional Brownian Motion for cosmic dust filaments
float fbm(vec3 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p *= 2.02;
  f += 0.2500 * snoise(p); p *= 2.03;
  f += 0.1250 * snoise(p); p *= 2.01;
  f += 0.0625 * snoise(p);
  return f;
}

// Simple 3D rotation around X axis
vec3 rotateX(vec3 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

void main() {
  vec3 dir = normalize(vWorldPosition);

  // Incline galactic equator by ~38 degrees relative to orbital plane
  vec3 galDir = rotateX(dir, 0.66);
  float distFromGalPlane = abs(galDir.y);

  // Galactic dust band thickness falloff
  float galBand = exp(-distFromGalPlane * 4.2);

  // Multi-octave turbulence for cosmic dust filaments and molecular clouds
  vec3 dustCoord = galDir * 3.2 + vec3(uTime * 0.003, uTime * 0.0015, 0.0);
  float dust = fbm(dustCoord);
  float dustDetail = fbm(dustCoord * 2.8);
  float combinedDust = clamp(dust * 0.7 + dustDetail * 0.3, 0.0, 1.0);

  // Dark absorption rift down the center of the Milky Way (The Great Rift)
  float riftCoord = fbm(galDir * 4.5 + vec3(1.2, 0.5, 0.8));
  float rift = smoothstep(0.18, 0.55, riftCoord) * exp(-distFromGalPlane * 9.0);

  // Base cosmic obsidian palette (Active Theory & STS token: pure void contrast)
  vec3 spaceBlack = vec3(0.001, 0.003, 0.007);
  vec3 deepNavy = vec3(0.012, 0.045, 0.095);
  vec3 cyanFilament = vec3(0.02, 0.15, 0.26);
  vec3 galacticCore = vec3(0.24, 0.16, 0.09);
  vec3 hydrogenAlpha = vec3(0.16, 0.04, 0.18);

  // Blend colors across the galactic dust structure
  vec3 nebulaColor = mix(deepNavy, cyanFilament, smoothstep(0.2, 0.6, combinedDust));
  nebulaColor = mix(nebulaColor, hydrogenAlpha, smoothstep(0.4, 0.8, dustDetail) * 0.6);
  nebulaColor = mix(nebulaColor, galacticCore, smoothstep(0.55, 0.95, combinedDust) * 0.7);

  // Apply galactic band masking and subtract the dark absorption rift
  float intensity = galBand * combinedDust * (1.0 - rift * 0.85);

  // Final calibrated luminance: soft, atmospheric, non-intrusive (max ~0.26 brightness)
  vec3 finalColor = spaceBlack + nebulaColor * intensity * 0.42;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const AmbientSpaceBackground: React.FC = () => {
  const skydomeMeshRef = useRef<THREE.Mesh>(null);
  const earthLimbRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const marsRef = useRef<THREE.Mesh>(null);

  // Custom ShaderMaterial for the astronomical celestial skydome
  const cosmicMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: COSMIC_VERTEX_SHADER,
      fragmentShader: COSMIC_FRAGMENT_SHADER,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false, // Immune to scene fog, preserving deep cosmic vista
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update shader uniform time
    if (cosmicMaterial) {
      cosmicMaterial.uniforms.uTime.value = time;
    }

    // Slowly rotate the entire celestial sphere (1 full rotation ~ 12 minutes)
    if (skydomeMeshRef.current) {
      skydomeMeshRef.current.rotation.y = time * 0.0006;
      skydomeMeshRef.current.rotation.x = Math.sin(time * 0.0002) * 0.04;
    }

    // Gentle atmospheric shimmer on Earth's limb
    if (earthLimbRef.current) {
      earthLimbRef.current.rotation.z = Math.sin(time * 0.05) * 0.005;
    }

    // Subtle axial rotation for the distant Moon & Mars
    if (moonRef.current) {
      moonRef.current.rotation.y = time * 0.01;
    }
    if (marsRef.current) {
      marsRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group renderOrder={-1000}>
      {/* 
        LAYER 1: The Infinite Milky Way & Deep-Space Cosmic Skydome
        Procedural GPU shader rendering galactic dust lanes, hydrogen-alpha nebulae,
        and deep-space voids without downloading heavy external textures.
      */}
      <mesh
        ref={skydomeMeshRef}
        material={cosmicMaterial}
        raycast={() => null} // Disables raycasting so cards and UI are always clickable
      >
        <sphereGeometry args={[130, 48, 32]} />
      </mesh>

      {/* 
        LAYER 2: Multi-Tier High-Density Starfield
        Drei Stars rendered on top of the cosmic skydome for pin-sharp stellar points
      */}
      <Stars
        radius={115}
        depth={55}
        count={5000}
        factor={3.2}
        saturation={0.3}
        fade
        speed={0.4}
      />

      {/* 
        LAYER 3: Curving Low-Earth Orbit Horizon (Visible below the Space Shuttle engines)
        Grounds the 3D helical descent from space down towards the rocket launch/orbital plane!
      */}
      <group
        ref={earthLimbRef}
        position={[0, -22, -16]}
        rotation={[-Math.PI / 2.18, 0, 0]}
        raycast={() => null}
      >
        {/* Deep blue curvature of the Earth's nightside ocean */}
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[18, 28, 96]} />
          <meshBasicMaterial
            color="#04132b"
            transparent
            opacity={0.45}
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Primary Rayleigh Atmospheric Scattering Glow (Cyan-Blue) */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[27.6, 28.6, 96]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.48}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Faint Mesospheric Ozone Halo (Electric Indigo/Cyan) */}
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[28.5, 29.8, 96]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 
        LAYER 4: Distant Celestial Moon (Positioned high in the upper-right quadrant)
        Adds scale and an authentic NASA lunar exploration reference
      */}
      <group position={[38, 26, -55]} raycast={() => null}>
        {/* Moon Spherical Body */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.92}
            metalness={0.08}
            fog={false}
          />
        </mesh>

        {/* Delicate Lunar Atmospheric/Albedo Halo */}
        <mesh>
          <sphereGeometry args={[2.38, 24, 24]} />
          <meshBasicMaterial
            color="#94a3b8"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>

      {/* 
        LAYER 5: Distant Celestial Mars (Positioned in the upper-left quadrant)
        Subtle red planet reference honoring Opportunity, Ingenuity, InSight, and Sojourner
      */}
      <group position={[-42, 18, -65]} raycast={() => null}>
        {/* Mars Spherical Body */}
        <mesh ref={marsRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#c2410c"
            roughness={0.88}
            metalness={0.12}
            fog={false}
          />
        </mesh>

        {/* Faint Warm Martian Atmospheric Tint */}
        <mesh>
          <sphereGeometry args={[1.64, 24, 24]} />
          <meshBasicMaterial
            color="#ea580c"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>
    </group>
  );
};
