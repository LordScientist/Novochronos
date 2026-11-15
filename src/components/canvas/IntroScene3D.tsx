import React, { useMemo } from 'react';
import { Stars, Sparkles } from '@react-three/drei';
import { ARTIFACTS } from '../../data/artifacts';
import { IntroScene } from '../../types/journey';
import { ArtifactModel } from './ArtifactModel';
import { CircularExhibitionEnvironment } from './CircularExhibitionEnvironment';
import {
  PlanetaryMartianEnvironment,
  getMartianTerrainHeight,
} from './PlanetaryMartianEnvironment';
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
  // Placed at y = 0.015 so bottom of wheels/footpads rests directly on top of the pedestal surface
  const exhibitionSentinels = useMemo(() => {
    return ARTIFACTS.map((artifact, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * pedestalRadius;
      const z = Math.sin(angle) * pedestalRadius;
      // Face inward toward the amphitheater center
      const rotY = -angle - Math.PI / 2;
      return {
        artifact,
        position: [x, 0.015, z] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
      };
    });
  }, [pedestalRadius]);

  // Calculate planetary positions for the 8 sentinels in Scene 4 & 5
  // Staged in an authentic, well-spaced panoramic arc across the Martian terrain
  // Every sentinel's Y coordinate is evaluated via getMartianTerrainHeight(x, z) so they sit 100% flush on the ground
  const planetarySentinels = useMemo(() => {
    // Curated non-overlapping coordinates [x, z, rotY]
    const stagingConfigs = [
      { x: -6.8, z: -4.2, rotY: 0.3 },   // 0: Opportunity Rover
      { x: -4.2, z: -2.4, rotY: 0.15 },  // 1: Ingenuity Mars Helicopter (sleek scout drone, forward)
      { x: -1.8, z: -5.2, rotY: 0.2 },   // 2: Apollo 11 Descent Stage (monumental mid-background)
      { x: 0.0,  z: -3.2, rotY: 0.0 },   // 3: InSight Mars Lander (central anchor)
      { x: 2.4,  z: -4.6, rotY: -0.2 },  // 4: Apollo 15 LRV (Moon buggy)
      { x: 4.6,  z: -2.3, rotY: -0.25 }, // 5: Sojourner Rover (compact historic pioneer, forward)
      { x: 6.8,  z: -5.4, rotY: -0.35 }, // 6: Pioneer 10 Deep Space Probe (dish pointed upward)
      { x: 8.6,  z: -3.6, rotY: -0.4 },  // 7: Surveyor 3 Robot Scout (standing tripod flank)
    ];

    return ARTIFACTS.map((artifact, i) => {
      const config = stagingConfigs[i] || { x: i * 2.2 - 7, z: -4, rotY: 0 };
      const groundY = getMartianTerrainHeight(config.x, config.z);

      return {
        artifact,
        position: [config.x, groundY, config.z] as [number, number, number],
        rotation: [0, config.rotY, 0] as [number, number, number],
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
        factor={scene === 'awakening' ? Math.max(3.0, timeInScene * 0.8) : 4}
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
          {/* Main overhead bright gallery illumination */}
          <ambientLight
            intensity={
              scene === 'awakening'
                ? Math.max(0.75, timeInScene * 0.3)
                : 1.2
            }
            color="#e2e8f0"
          />

          {/* Sky / Ground balance hemisphere light */}
          <hemisphereLight args={['#ffffff', '#1e293b', 1.1]} />

          {/* Primary overhead Sun / Studio key light */}
          <directionalLight
            position={[12, 24, 14]}
            intensity={scene === 'awakening' ? Math.max(1.6, timeInScene * 0.6) : 3.2}
            color="#ffffff"
            castShadow
          />

          {/* Central gallery ceiling spotlight */}
          <spotLight
            position={[0, 20, 0]}
            intensity={
              scene === 'awakening'
                ? Math.max(2.0, timeInScene * 0.65)
                : 4.0
            }
            angle={0.8}
            penumbra={0.6}
            color="#f0f9ff"
            castShadow
          />

          {/* High-visibility fill and rim lights */}
          <directionalLight
            position={[-14, 16, -12]}
            intensity={1.8}
            color="#93c5fd"
          />
          <directionalLight
            position={[14, 10, -10]}
            intensity={1.6}
            color="#38bdf8"
          />
          <directionalLight
            position={[-10, 8, 12]}
            intensity={1.4}
            color="#fbbf24"
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

          {/* 8 Sentinels in Circular Formation: No Spinning in Intro */}
          {exhibitionSentinels.map((item, idx) => (
            <group key={item.artifact.id} position={item.position} rotation={item.rotation}>
              <ArtifactModel
                artifact={item.artifact}
                autoRotate={false}
                isActionActive={false}
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

          {/* 8 Sentinels in Panoramic Martian Staging: Perfectly Flush on Terrain, No Spinning */}
          {planetarySentinels.map((item) => (
            <group key={item.artifact.id} position={item.position} rotation={item.rotation}>
              <ArtifactModel
                artifact={item.artifact}
                autoRotate={false}
                isActionActive={false}
              />
            </group>
          ))}
        </group>
      )}
    </>
  );
};
