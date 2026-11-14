import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { IntroScene } from '../../types/journey';

interface IntroCameraControllerProps {
  scene: IntroScene;
  activeSentinelIndex: number;
  pedestalRadius?: number;
  timeInScene: number; // seconds spent in current scene
}

export const IntroCameraController: React.FC<IntroCameraControllerProps> = ({
  scene,
  activeSentinelIndex,
  pedestalRadius = 9.5,
  timeInScene,
}) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    const lerpSpeed = 2.5 * delta;
    const targetPos = new THREE.Vector3();

    switch (scene) {
      case 'awakening': {
        // Scene 1: Start far back and high in the dark, slowly push in and lower
        const progress = Math.min(timeInScene / 7.0, 1.0);
        targetPos.set(
          Math.sin(progress * 0.4) * 4,
          14 - progress * 9, // from 14 down to 5
          26 - progress * 10 // from 26 down to 16
        );
        targetLookAt.current.set(0, 1.2, 0);
        break;
      }

      case 'sentinels': {
        // Scene 2: Close-up mechanical showcase of active sentinel
        const sentinelAngle = (activeSentinelIndex / 8) * Math.PI * 2;
        const sentX = Math.cos(sentinelAngle) * pedestalRadius;
        const sentZ = Math.sin(sentinelAngle) * pedestalRadius;

        // Position camera slightly offset from the sentinel to capture mechanical angles
        const camDistance = 3.8;
        const camElevation = 1.4;
        const offsetAngle = sentinelAngle + 0.35;

        targetPos.set(
          sentX + Math.cos(offsetAngle) * camDistance,
          camElevation,
          sentZ + Math.sin(offsetAngle) * camDistance
        );

        targetLookAt.current.set(sentX, 0.6, sentZ);
        break;
      }

      case 'grand-exhibition': {
        // Scene 3: Wide panoramic orbital sweep around the entire circular hall
        const orbitAngle = timeInScene * 0.22;
        const orbitRadius = 17.5;
        targetPos.set(
          Math.cos(orbitAngle) * orbitRadius,
          5.8 + Math.sin(timeInScene * 0.3) * 0.8,
          Math.sin(orbitAngle) * orbitRadius
        );
        targetLookAt.current.set(0, 1.0, 0);
        break;
      }

      case 'planetary-reveal': {
        // Scene 4: Wide Martian landscape camera, sweeping low over red dunes
        const revealProgress = Math.min(timeInScene / 8.0, 1.0);
        targetPos.set(
          Math.sin(revealProgress * 0.5) * 6,
          2.4 + revealProgress * 2.2,
          13 - revealProgress * 3.5
        );
        targetLookAt.current.set(0, 0.4, -2);
        break;
      }

      case 'title-reveal': {
        // Scene 5: Monumental hero shot framing the machines and title
        const drift = Math.sin(timeInScene * 0.2) * 0.5;
        targetPos.set(drift, 3.2, 11.5 - timeInScene * 0.08);
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
