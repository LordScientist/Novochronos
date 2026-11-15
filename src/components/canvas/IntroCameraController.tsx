import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { IntroScene } from '../../types/journey';

interface IntroCameraControllerProps {
  scene: IntroScene;
  activeSentinelIndex: number;
  pedestalRadius?: number;
  timeInScene: number; // seconds spent in current scene
  currentTime?: number; // exact master audio clock time in seconds
}

export const IntroCameraController: React.FC<IntroCameraControllerProps> = ({
  scene,
  activeSentinelIndex,
  pedestalRadius = 9.5,
  timeInScene,
  currentTime,
}) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state, delta) => {
    const lerpSpeed = 2.8 * delta;
    const targetPos = new THREE.Vector3();
    const isMobile = state.size.width < 768;

    switch (scene) {
      case 'awakening': {
        // Scene 1: Awakening (0.0s - 11.5s)
        const totalDuration = 11.5;
        const progress = Math.min((currentTime ?? timeInScene) / totalDuration, 1.0);
        targetPos.set(
          Math.sin(progress * 0.5) * 3.5,
          (15 - progress * 10.5) * (isMobile ? 1.15 : 1.0),
          (27 - progress * 11.5) * (isMobile ? 1.25 : 1.0)
        );
        targetLookAt.current.set(0, 1.0, 0);
        break;
      }

      case 'sentinels': {
        // Scene 2: Sentinels (11.5s - 55.5s)
        // Focused mechanical showcase of active sentinel from heroic front 3/4 angle
        const sentinelAngle = (activeSentinelIndex / 8) * Math.PI * 2;
        const sentX = Math.cos(sentinelAngle) * pedestalRadius;
        const sentZ = Math.sin(sentinelAngle) * pedestalRadius;

        // Position camera inside amphitheater facing outward toward the model's front deck
        const drift = Math.sin((currentTime ?? timeInScene) * 0.35) * 0.12;
        const camDistance = isMobile ? 5.6 : 4.2;
        const camElevation = isMobile ? 1.55 : 1.35;
        const viewAngle = sentinelAngle - 0.22 + drift;

        targetPos.set(
          sentX - Math.cos(viewAngle) * camDistance,
          camElevation,
          sentZ - Math.sin(viewAngle) * camDistance
        );

        targetLookAt.current.set(sentX, 0.55, sentZ);
        break;
      }

      case 'grand-exhibition': {
        // Scene 3: Grand Exhibition (55.5s - 65.5s)
        const exhibitionTime = currentTime !== undefined ? Math.max(0, currentTime - 55.5) : timeInScene;
        const orbitAngle = exhibitionTime * 0.24;
        const orbitRadius = isMobile ? 22.0 : 17.5;
        targetPos.set(
          Math.cos(orbitAngle) * orbitRadius,
          5.8 + Math.sin(exhibitionTime * 0.35) * 0.8,
          Math.sin(orbitAngle) * orbitRadius
        );
        targetLookAt.current.set(0, 1.0, 0);
        break;
      }

      case 'planetary-reveal': {
        // Scene 4: Planetary Reveal (65.5s - 74.5s)
        const planetaryTime = currentTime !== undefined ? Math.max(0, currentTime - 65.5) : timeInScene;
        const revealProgress = Math.min(planetaryTime / 9.0, 1.0);
        targetPos.set(
          (-4 + revealProgress * 9.0),
          (2.6 + revealProgress * 1.8) * (isMobile ? 1.2 : 1.0),
          (13.5 - revealProgress * 3.8) * (isMobile ? 1.3 : 1.0)
        );
        targetLookAt.current.set(0, 0.4, -2.5);
        break;
      }

      case 'title-reveal': {
        // Scene 5: Title Reveal & Call to Action (74.5s - 83.0s)
        const titleTime = currentTime !== undefined ? Math.max(0, currentTime - 74.5) : timeInScene;
        const drift = Math.sin(titleTime * 0.2) * 0.4;
        targetPos.set(drift, 3.2, (11.5 - titleTime * 0.06) * (isMobile ? 1.28 : 1.0));
        targetLookAt.current.set(0, 1.2, 0);
        break;
      }
    }

    // Smoothly interpolate camera position and look-at point
    camera.position.lerp(targetPos, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed * 1.2);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
