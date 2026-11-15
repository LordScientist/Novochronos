// Unified 3D Cosmic Environment System for ECHOES OF EXPLORATION
// Provides physically grounded presets for Deep Space, Earth Orbit, Lunar, and Martian realms

import React from 'react';
import { CosmicStarfield3D } from './CosmicStarfield3D';
import { CosmicNebula3D } from './CosmicNebula3D';
import { CelestialBody3D } from './CelestialBody3D';
import { ShootingStar3D } from './ShootingStar3D';

export type CosmicEnvironmentPreset = 'deep-space' | 'earth-orbit' | 'lunar' | 'martian';

interface CosmicEnvironment3DProps {
  preset: CosmicEnvironmentPreset;
  includeMeteors?: boolean;
  starCount?: number;
  nebulaDensity?: 'subtle' | 'moderate' | 'prominent';
}

export const CosmicEnvironment3D: React.FC<CosmicEnvironment3DProps> = ({
  preset,
  includeMeteors = true,
  starCount = 4500,
  nebulaDensity = 'subtle',
}) => {
  switch (preset) {
    case 'earth-orbit': {
      return (
        <group>
          {/* Dense High-Fidelity Orbital Starfield */}
          <CosmicStarfield3D count={starCount} radius={115} depth={55} speed={0.04} />

          {/* Deep Space Indigo Nebula Haze */}
          <CosmicNebula3D palette="deep-space" density="subtle" position={[0, 10, -50]} />

          {/* Earth Visible Curving in the Distance with Rayleigh Scattering Limb */}
          <CelestialBody3D
            type="earth"
            position={[18, -32, -22]}
            radius={28}
            rotation={[-0.4, 0.2, -0.2]}
            spinSpeed={0.03}
          />

          {/* Occasional Meteor Streak across upper void */}
          {includeMeteors && <ShootingStar3D intervalRange={[14, 28]} />}
        </group>
      );
    }

    case 'lunar': {
      return (
        <group>
          {/* Crisp Airless Vacuum Starfield (Pin-sharp, high contrast) */}
          <CosmicStarfield3D count={starCount + 500} radius={110} depth={50} speed={0.02} twinkleFactor={0.05} />

          {/* Distant Earth Blue Marble hanging quietly above the cratered horizon */}
          <CelestialBody3D
            type="earth"
            position={[16, 12, -45]}
            radius={4.8}
            rotation={[0.2, 0.5, -0.1]}
            spinSpeed={0.04}
          />

          {/* Subtle Milky Way Galactic Core Background Cloud */}
          <CosmicNebula3D palette="cygnus" density="subtle" position={[-15, 8, -60]} />
        </group>
      );
    }

    case 'martian': {
      return (
        <group>
          {/* Stars visible through the thin Martian atmosphere */}
          <CosmicStarfield3D count={starCount - 1000} radius={105} depth={50} speed={0.03} twinkleFactor={0.12} />

          {/* Distant Martian Moon Phobos in the upper sky */}
          <CelestialBody3D
            type="moon"
            position={[-18, 16, -38]}
            radius={1.4}
            rotation={[0.3, 0.8, 0]}
            spinSpeed={0.08}
          />

          {/* Atmospheric Horizon Warm Dust Haze */}
          <CosmicNebula3D palette="carina" density="subtle" position={[0, 4, -42]} />
        </group>
      );
    }

    case 'deep-space':
    default: {
      return (
        <group>
          {/* Deep Infinite Starfield */}
          <CosmicStarfield3D count={starCount} radius={120} depth={65} speed={0.05} />

          {/* Multi-layered Interstellar Gas Clouds */}
          <CosmicNebula3D palette="carina" density={nebulaDensity} position={[0, 0, -45]} />

          {/* Distant Gas Giant Jupiter on the Far Horizon */}
          <CelestialBody3D
            type="jupiter"
            position={[-26, 14, -55]}
            radius={6.5}
            rotation={[0.1, 0.4, 0]}
            spinSpeed={0.06}
          />

          {/* Periodic Luminous Meteor Streak */}
          {includeMeteors && <ShootingStar3D intervalRange={[10, 22]} />}
        </group>
      );
    }
  }
};

