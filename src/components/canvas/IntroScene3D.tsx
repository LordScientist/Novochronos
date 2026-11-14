import React, { useMemo } from 'react';
import { Stars, Sparkles } from '@react-three/drei';
import { ARTIFACTS } from '../../data/artifacts';
import { IntroScene } from '../../types/journey';
import { ArtifactModel } from './ArtifactModel';
import { CircularExhibitionEnvironment } from './CircularExhibitionEnvironment';
import { PlanetaryMartianEnvironment } from './PlanetaryMartianEnvironment';
import { IntroCameraController } from './IntroCameraController';
import { CinematicSpotlightRig } from './CinematicSpotlightRig';

interface IntroScene3DProps {
  scene: IntroScene;
  activeSentinelIndex: number;
  timeInScene: number;
  currentTime?: number;
}

export const IntroScene3D: React.FC<IntroScene3DProps> = ({
  scene,
  activeSentinelIndex,
  timeInScene,
  currentTime,
}) => {
  const isPlanetary = scene === 'planetary-reveal' || scene === 'title-reveal';
  const pedestalRadius = 9.5;

  // Calculate circular positions for the 8 sentinels in the exhibition hall
  const exhibitionSentinels = useMemo(() => {
    return ARTIFACTS.map((artifact, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * pedestalRadius;
      const z = Math.sin(angle) * pedestalRadius;
      // Face inward toward the center
      const rotY = -angle - Math.PI / 2;
      return { artifact, position: [x, 0.1, z] as [number, number, number], rotation: [0, rotY, 0] as [number, number, number] };
    });
  }, [pedestalRadius]);

  // Calculate planetary positions for the 8 sentinels in Scene 4 & 5
  // Staged in a wide, sweeping arc across the Martian terrain
  const planetarySentinels = useMemo(() => {
    const offsets = [
      [-7.5, 0.15, -4.0, 0.4],   // Opportunity
      [-4.5, 0.1, -1.8, -0.2],   // Ingenuity
      [-2.0, 0.25, -5.5, 0.1],   // Apollo 11 Descent Stage
      [0.0, 0.1, -2.5, 0.0],     // InSight
      [2.5, 0.18, -4.5, -0.3],   // Apollo 15 LRV
      [4.8, 0.05, -2.0, 0.5],    // Sojourner
      [7.2, 0.4, -6.0, -0.6],    // Pioneer 10
      [8.5, 0.12, -3.2, 0.2],    // Surveyor 3
    ];

    return ARTIFACTS.map((artifact, i) => {
      const [x, y, z, rotY] = offsets[i] || [i * 2 - 7, 0.1, -4, 0];
      return {
        artifact,
        position: [x, y, z] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <>
      {/* Background Starfield */}
      <Stars
        radius={100}
        depth={60}
        count={3500}
        factor={scene === 'awakening' ? Math.min(timeInScene * 0.8, 4) : 4}
        saturation={0.5}
        fade
        speed={1}
      />

      {/* Floating Ambient Celestial Particles */}
      <Sparkles
        count={150}
        scale={[30, 15, 30]}
        size={2.5}
        speed={0.4}
        opacity={isPlanetary ? 0.35 : 0.6}
        color={isPlanetary ? '#fdba74' : '#7dd3fc'}
      />

      {/* Camera choreography */}
      <IntroCameraController
        scene={scene}
        activeSentinelIndex={activeSentinelIndex}
        pedestalRadius={pedestalRadius}
        timeInScene={timeInScene}
        currentTime={currentTime}
      />

      {/* Exhibition Lighting Rig (Active during Scenes 1, 2, 3) */}
      {!isPlanetary && (
        <group>
          {/* Main overhead gallery illumination */}
          <ambientLight
            intensity={
              scene === 'awakening'
                ? Math.min(timeInScene * 0.12, 0.7)
                : 0.85
            }
            color="#0f172a"
          />

          {/* Central gallery ceiling spotlight */}
          <spotLight
            position={[0, 18, 0]}
            intensity={
              scene === 'awakening'
                ? Math.min(timeInScene * 0.35, 2.5)
                : 3.2
            }
            angle={0.65}
            penumbra={0.7}
            color="#e0f2fe"
            castShadow
          />

          {/* Warm rim light accent */}
          <directionalLight
            position={[10, 8, -10]}
            intensity={1.2}
            color="#38bdf8"
          />
          <directionalLight
            position={[-10, 6, 10]}
            intensity={0.8}
            color="#f59e0b"
          />
        </group>
      )}

      {/* Render the Circular Exhibition Architecture (Scenes 1, 2, 3) */}
      {!isPlanetary && (
        <group>
          {/* Dynamic Cinematic Spotlighting Rig */}
          <CinematicSpotlightRig
            scene={scene}
            activeSentinelIndex={activeSentinelIndex}
            pedestalRadius={pedestalRadius}
            timeInScene={timeInScene}
            currentTime={currentTime}
          />

          <CircularExhibitionEnvironment
            glowIntensity={scene === 'awakening' ? Math.min(timeInScene * 0.25, 1) : 1}
            highlightIndex={scene === 'sentinels' ? activeSentinelIndex : null}
          />

          {/* 8 Sentinels in Circular Formation */}
          {exhibitionSentinels.map((item, idx) => (
            <group key={item.artifact.id} position={item.position} rotation={item.rotation}>
              <ArtifactModel
                artifact={item.artifact}
                autoRotate={scene === 'grand-exhibition'}
                highlightMechanical={scene === 'sentinels' && activeSentinelIndex === idx}
              />
            </group>
          ))}
        </group>
      )}

      {/* Render the Planetary 3D Martian Landscape (Scenes 4, 5) */}
      {isPlanetary && (
        <group>
          <PlanetaryMartianEnvironment />

          {/* 8 Sentinels in Panoramic Martian Staging */}
          {planetarySentinels.map((item) => (
            <group key={item.artifact.id} position={item.position} rotation={item.rotation}>
              <ArtifactModel
                artifact={item.artifact}
                autoRotate={false}
              />
            </group>
          ))}
        </group>
      )}
    </>
  );
};
