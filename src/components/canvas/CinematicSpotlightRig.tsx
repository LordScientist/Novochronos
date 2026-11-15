import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ARTIFACTS } from '../../data/artifacts';
import { IntroScene } from '../../types/journey';

interface CinematicSpotlightRigProps {
  scene: IntroScene;
  activeSentinelIndex: number;
  pedestalRadius?: number;
  timeInScene: number;
  currentTime?: number;
}

interface SentinelLightState {
  keyLight: THREE.SpotLight | null;
  fillLight: THREE.PointLight | null;
  rimLight: THREE.DirectionalLight | null;
  currentKeyIntensity: number;
  currentFillIntensity: number;
  currentRimIntensity: number;
  targetPos: THREE.Object3D;
}

export const CinematicSpotlightRig: React.FC<CinematicSpotlightRigProps> = ({
  scene,
  activeSentinelIndex,
  pedestalRadius = 9.5,
  timeInScene,
  currentTime,
}) => {
  // Pre-calculate positions and targets for each of the 8 sentinels
  const sentinelConfigs = useMemo(() => {
    return ARTIFACTS.map((artifact, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const sentX = Math.cos(angle) * pedestalRadius;
      const sentZ = Math.sin(angle) * pedestalRadius;

      // Primary key spotlight position: positioned in front and above to illuminate the model's face
      const lightX = sentX - Math.cos(angle - 0.25) * 2.2;
      const lightY = 4.8;
      const lightZ = sentZ - Math.sin(angle - 0.25) * 2.2;

      // Soft fill light position: offset opposite side in front to reveal mechanical shadow detail
      const fillX = sentX - Math.cos(angle + 0.35) * 2.5;
      const fillY = 2.0;
      const fillZ = sentZ - Math.sin(angle + 0.35) * 2.5;

      // Rim light position: positioned behind the sentinel pointing inward to create edge separation
      const rimX = sentX + Math.cos(angle) * 1.8;
      const rimY = 2.8;
      const rimZ = sentZ + Math.sin(angle) * 1.8;

      // Target anchor object placed directly at the model center
      const targetObj = new THREE.Object3D();
      targetObj.position.set(sentX, 0.45, sentZ);

      return {
        id: artifact.id,
        accentColor: artifact.accentColor,
        sentPos: [sentX, 0.45, sentZ] as [number, number, number],
        keyPos: [lightX, lightY, lightZ] as [number, number, number],
        fillPos: [fillX, fillY, fillZ] as [number, number, number],
        rimPos: [rimX, rimY, rimZ] as [number, number, number],
        targetObj,
      };
    });
  }, [pedestalRadius]);

  // Track light instances and current lerped intensities
  const lightsState = useRef<SentinelLightState[]>(
    sentinelConfigs.map((cfg) => ({
      keyLight: null,
      fillLight: null,
      rimLight: null,
      currentKeyIntensity: 0,
      currentFillIntensity: 0,
      currentRimIntensity: 0,
      targetPos: cfg.targetObj,
    }))
  );

  // Smooth frame-by-frame intensity transition
  useFrame((_, delta) => {
    // Lerp rate for cinematic cross-fade (~0.7s smooth transition)
    const lerpSpeed = Math.min(delta * 3.2, 1.0);

    sentinelConfigs.forEach((_, idx) => {
      const state = lightsState.current[idx];
      if (!state) return;

      let targetKey = 0.55;  // Base ambient pedestal illumination
      let targetFill = 0.15; // Base fill
      let targetRim = 0.2;   // Base rim

      if (scene === 'awakening') {
        // Lights gradually power on as the hall awakens (0.0 - 11.5s)
        const awakenFactor = Math.min((currentTime ?? timeInScene) / 10.0, 1.0);
        targetKey = 0.55 * awakenFactor;
        targetFill = 0.15 * awakenFactor;
        targetRim = 0.2 * awakenFactor;
      } else if (scene === 'sentinels') {
        if (activeSentinelIndex === idx) {
          // Focused spacecraft receives primary cinematic key, fill, and rim lighting
          targetKey = 5.4;  // Prominent key illumination revealing materials and geometry
          targetFill = 1.1; // Soft side fill to illuminate shadowed mechanics
          targetRim = 1.6;  // Crisp back-edge separation
        } else {
          // Other spacecraft remain visible in the environment at subtle ambient levels
          targetKey = 0.6;
          targetFill = 0.18;
          targetRim = 0.22;
        }
      } else if (scene === 'grand-exhibition') {
        // All eight spacecraft are balanced and illuminated together for the 360° panoramic sweep
        targetKey = 2.6;
        targetFill = 0.65;
        targetRim = 0.85;
      } else {
        // In planetary scenes, circular lights dim out
        targetKey = 0;
        targetFill = 0;
        targetRim = 0;
      }

      // Smoothly interpolate current intensities toward targets
      state.currentKeyIntensity = THREE.MathUtils.lerp(
        state.currentKeyIntensity,
        targetKey,
        lerpSpeed
      );
      state.currentFillIntensity = THREE.MathUtils.lerp(
        state.currentFillIntensity,
        targetFill,
        lerpSpeed
      );
      state.currentRimIntensity = THREE.MathUtils.lerp(
        state.currentRimIntensity,
        targetRim,
        lerpSpeed
      );

      // Apply to actual Three.js light instances
      if (state.keyLight) {
        state.keyLight.intensity = state.currentKeyIntensity;
      }
      if (state.fillLight) {
        state.fillLight.intensity = state.currentFillIntensity;
      }
      if (state.rimLight) {
        state.rimLight.intensity = state.currentRimIntensity;
      }
    });
  });

  return (
    <group>
      {sentinelConfigs.map((cfg, idx) => (
        <group key={cfg.id}>
          {/* Target anchor in scene graph for directional and spot aiming */}
          <primitive object={cfg.targetObj} />

          {/* 1. Primary Focused SpotLight (Key Light from above & offset) */}
          <spotLight
            ref={(el) => {
              if (lightsState.current[idx]) lightsState.current[idx].keyLight = el;
            }}
            position={cfg.keyPos}
            target={cfg.targetObj}
            color="#ffffff"
            intensity={0}
            angle={0.52}
            penumbra={0.65}
            distance={16}
            decay={2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* 2. Soft Fill Light (PointLight to open up deep shadows) */}
          <pointLight
            ref={(el) => {
              if (lightsState.current[idx]) lightsState.current[idx].fillLight = el;
            }}
            position={cfg.fillPos}
            color="#e0f2fe"
            intensity={0}
            distance={10}
            decay={2}
          />

          {/* 3. Rim / Edge Directional Light (Color-coded to spacecraft accent color) */}
          <directionalLight
            ref={(el) => {
              if (lightsState.current[idx]) lightsState.current[idx].rimLight = el;
            }}
            position={cfg.rimPos}
            target={cfg.targetObj}
            color={cfg.accentColor}
            intensity={0}
          />
        </group>
      ))}
    </group>
  );
};
