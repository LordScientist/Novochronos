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
}) => {
  // Pre-calculate positions and targets for each of the 8 sentinels
  const sentinelConfigs = useMemo(() => {
    return ARTIFACTS.map((artifact, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const sentX = Math.cos(angle) * pedestalRadius;
      const sentZ = Math.sin(angle) * pedestalRadius;

      // Primary key spotlight position: positioned above and slightly offset to cast depth shadows
      const lightX = sentX + Math.cos(angle + 0.25) * 1.4;
      const lightY = 5.2;
      const lightZ = sentZ + Math.sin(angle + 0.25) * 1.4;

      // Soft fill light position: lower and offset opposite to reveal mechanical shadow detail
      const fillX = sentX - Math.cos(angle) * 1.8;
      const fillY = 1.8;
      const fillZ = sentZ - Math.sin(angle) * 1.8;

      // Rim light position: behind the sentinel pointing inward to create edge separation
      const rimX = sentX + Math.cos(angle) * 2.2;
      const rimY = 2.5;
      const rimZ = sentZ + Math.sin(angle) * 2.2;

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

      let targetKey = 1.4;  // Base ambient pedestal illumination
      let targetFill = 0.5; // Base fill
      let targetRim = 0.6;   // Base rim

      if (scene === 'awakening') {
        // Lights gradually power on as the hall awakens
        const awakenFactor = Math.max(0.4, Math.min(timeInScene / 4.0, 1.0));
        targetKey = 1.6 * awakenFactor;
        targetFill = 0.6 * awakenFactor;
        targetRim = 0.7 * awakenFactor;
      } else if (scene === 'sentinels') {
        if (activeSentinelIndex === idx) {
          // Focused spacecraft receives primary cinematic key, fill, and rim lighting
          targetKey = 8.5;  // Highly prominent key illumination revealing materials and geometry
          targetFill = 2.8; // Bright side fill to illuminate mechanical details
          targetRim = 3.2;  // Crisp back-edge separation
        } else {
          // Other spacecraft remain visible in the environment at clear ambient levels
          targetKey = 1.2;
          targetFill = 0.45;
          targetRim = 0.55;
        }
      } else if (scene === 'grand-exhibition') {
        // All eight spacecraft are balanced and illuminated together for the 360° panoramic sweep
        targetKey = 4.2;
        targetFill = 1.4;
        targetRim = 1.8;
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
    <group name="CinematicSpotlightRig">
      {sentinelConfigs.map((cfg, idx) => (
        <group key={cfg.id}>
          {/* Target object anchor added to the scene */}
          <primitive object={cfg.targetObj} />

          {/* 1. Primary Directional Key Spotlight */}
          <spotLight
            ref={(light) => {
              if (lightsState.current[idx]) {
                lightsState.current[idx].keyLight = light;
                if (light) {
                  light.target = cfg.targetObj;
                }
              }
            }}
            position={cfg.keyPos}
            angle={0.46}
            penumbra={0.85}
            decay={2}
            distance={14}
            color="#fffbeb"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* 2. Subtle Fill Light (reveals mechanical wheel & chassis shadows) */}
          <pointLight
            ref={(light) => {
              if (lightsState.current[idx]) {
                lightsState.current[idx].fillLight = light;
              }
            }}
            position={cfg.fillPos}
            color="#e2e8f0"
            distance={7}
            decay={2}
          />

          {/* 3. Restrained Rim Light (separates spacecraft from dark background) */}
          <directionalLight
            ref={(light) => {
              if (lightsState.current[idx]) {
                lightsState.current[idx].rimLight = light;
                if (light) {
                  light.target = cfg.targetObj;
                }
              }
            }}
            position={cfg.rimPos}
            color="#38bdf8"
          />
        </group>
      ))}
    </group>
  );
};
