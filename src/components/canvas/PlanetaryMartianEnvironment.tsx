import React, { useMemo } from 'react';
import * as THREE from 'three';

// Exact mathematical terrain elevation function across the Martian surface
export function getMartianTerrainHeight(x: number, z: number): number {
  // Gentle, scenic rolling dunes and ripples across the Martian staging ground
  const d1 = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.45;
  const d2 = Math.sin(x * 0.25 + 0.8) * 0.2;
  const d3 = Math.cos(z * 0.2) * 0.15;
  // Natural subtle rim elevation in the far background
  const distantRise = Math.max(0, -z - 5) * 0.08;
  return -0.4 + d1 + d2 + d3 + distantRise;
}

export const PlanetaryMartianEnvironment: React.FC = () => {
  // Generate procedurally displaced terrain vertices for authentic Martian surface
  const { terrainGeometry, rocks } = useMemo(() => {
    const size = 64;
    const segments = 64;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geom.attributes.position;

    // Displace vertices so after rotation [-Math.PI / 2, 0, 0]
    // the world position (x, y, z) satisfies y = getMartianTerrainHeight(x, z)
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const worldZ = -vy; // plane Y maps to world -Z
      const yWorld = getMartianTerrainHeight(vx, worldZ);
      pos.setZ(i, yWorld);
    }
    geom.computeVertexNormals();

    // Generate random boulders and rocks scattered naturally on the terrain
    const rockList: {
      x: number;
      y: number;
      z: number;
      scale: [number, number, number];
      rot: [number, number, number];
    }[] = [];
    const rockCount = 48;

    for (let r = 0; r < rockCount; r++) {
      const rx = (Math.random() - 0.5) * 48;
      const rz = (Math.random() - 0.5) * 48;

      // Keep rock-free clearance corridor around sentinel staging arc
      if (Math.abs(rx) < 10 && rz > -7 && rz < 0) continue;

      const s = 0.2 + Math.random() * 0.55;
      const groundY = getMartianTerrainHeight(rx, rz);

      rockList.push({
        x: rx,
        y: groundY + s * 0.25, // Bottom firmly grounded in sand
        z: rz,
        scale: [
          s * (0.8 + Math.random() * 0.4),
          s * (0.6 + Math.random() * 0.4),
          s * (0.8 + Math.random() * 0.4),
        ],
        rot: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
      });
    }

    return { terrainGeometry: geom, rocks: rockList };
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Martian Terrain Plane */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#8c2f1b"
          roughness={0.92}
          metalness={0.08}
          flatShading
        />
      </mesh>

      {/* Scattered Martian Boulders & Basalt Rocks */}
      {rocks.map((rock, idx) => (
        <mesh
          key={idx}
          position={[rock.x, rock.y, rock.z]}
          rotation={rock.rot}
          scale={rock.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#5a1e12"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Dramatic Martian Sun */}
      <directionalLight
        position={[25, 20, -18]}
        intensity={3.6}
        color="#fff1e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Atmospheric Ambient Fill & Hemisphere Sky Fill */}
      <ambientLight intensity={1.3} color="#fed7aa" />
      <hemisphereLight args={['#fed7aa', '#334155', 1.1]} />

      {/* Front fill light for balanced model visibility */}
      <directionalLight
        position={[-15, 14, 18]}
        intensity={2.0}
        color="#ffffff"
      />

      {/* Distant atmospheric rim light */}
      <directionalLight
        position={[-20, 8, 20]}
        intensity={1.2}
        color="#fdba74"
      />
    </group>
  );
};
