import React, { useMemo } from 'react';
import * as THREE from 'three';

export const PlanetaryMartianEnvironment: React.FC = () => {
  // Generate procedurally displaced terrain vertices for authentic Martian surface
  const { terrainGeometry, rocks } = useMemo(() => {
    const size = 60;
    const segments = 48;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geom.attributes.position;

    // Displace vertices to create dunes, ripples, and shallow craters
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Combine multiple harmonic frequencies for natural topography
      const z =
        Math.sin(vx * 0.12) * Math.cos(vy * 0.12) * 0.9 +
        Math.sin(vx * 0.28 + 1.2) * 0.35 +
        Math.cos(vy * 0.35) * 0.25 -
        // Shallow crater dip in center-left
        Math.exp(-((vx + 6) ** 2 + (vy - 4) ** 2) / 60) * 1.2;
      pos.setZ(i, z);
    }
    geom.computeVertexNormals();

    // Generate random boulders and rocks scattered on surface
    const rockList: { x: number; y: number; z: number; scale: [number, number, number]; rot: [number, number, number] }[] = [];
    const rockCount = 45;
    for (let r = 0; r < rockCount; r++) {
      const rx = (Math.random() - 0.5) * 45;
      const rz = (Math.random() - 0.5) * 45;
      // Skip placing rocks directly where sentinels sit
      if (Math.abs(rx) < 3 && Math.abs(rz) < 3) continue;
      const s = 0.2 + Math.random() * 0.6;
      rockList.push({
        x: rx,
        y: 0.1,
        z: rz,
        scale: [s * (0.8 + Math.random() * 0.4), s * (0.6 + Math.random() * 0.4), s * (0.8 + Math.random() * 0.4)],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      });
    }

    return { terrainGeometry: geom, rocks: rockList };
  }, []);

  return (
    <group position={[0, -0.6, 0]}>
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

      {/* Low-angle Dramatic Martian Sun */}
      <directionalLight
        position={[25, 12, -20]}
        intensity={2.8}
        color="#fed7aa"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Atmospheric Ambient Fill */}
      <ambientLight intensity={0.65} color="#7c2d12" />

      {/* Distant atmospheric rim light */}
      <directionalLight
        position={[-20, 8, 20]}
        intensity={0.6}
        color="#fdba74"
      />
    </group>
  );
};
