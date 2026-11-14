import React, { useMemo } from 'react';

interface CircularExhibitionEnvironmentProps {
  glowIntensity?: number;
  highlightIndex?: number | null;
}

export const CircularExhibitionEnvironment: React.FC<CircularExhibitionEnvironmentProps> = ({
  glowIntensity = 1,
  highlightIndex = null,
}) => {
  // Architectural pillars / ribs surrounding the circular hall
  const ribCount = 32;
  const radius = 16;
  const ribs = useMemo(() => {
    return Array.from({ length: ribCount }, (_, i) => {
      const angle = (i / ribCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return { x, z, angle };
    });
  }, [ribCount, radius]);

  // Eight pedestal plinth markers along an inner circle
  const pedestalCount = 8;
  const pedestalRadius = 9.5;
  const pedestals = useMemo(() => {
    return Array.from({ length: pedestalCount }, (_, i) => {
      const angle = (i / pedestalCount) * Math.PI * 2;
      const x = Math.cos(angle) * pedestalRadius;
      const z = Math.sin(angle) * pedestalRadius;
      return { x, z, angle };
    });
  }, [pedestalCount, pedestalRadius]);

  return (
    <group>
      {/* Central multi-tiered floor */}
      <mesh receiveShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[20, 20, 0.4, 64]} />
        <meshStandardMaterial
          color="#070c1b"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Inner circular podium track */}
      <mesh receiveShadow position={[0, -0.19, 0]}>
        <cylinderGeometry args={[pedestalRadius + 1.8, pedestalRadius + 1.8, 0.05, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Concentric Neon Rings in floor */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[pedestalRadius + 1.7, pedestalRadius + 1.8, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6 * glowIntensity} />
      </mesh>
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[pedestalRadius - 1.8, pedestalRadius - 1.7, 64]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.4 * glowIntensity} />
      </mesh>
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.3, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5 * glowIntensity} />
      </mesh>

      {/* Central elevated observation plinth */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[4.0, 4.2, 0.1, 48]} />
        <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Central holographic compass circle */}
      <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.25 * glowIntensity} />
      </mesh>

      {/* 8 Raised Sentinel Display Platforms */}
      {pedestals.map((p, idx) => {
        const isFocused = highlightIndex === idx;
        return (
          <group key={idx} position={[p.x, 0, p.z]}>
            {/* Round pedestal disc */}
            <mesh receiveShadow position={[0, -0.1, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.2, 32]} />
              <meshStandardMaterial
                color={isFocused ? '#1e293b' : '#0f172a'}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Glowing neon ring on pedestal edge */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.4, 1.48, 32]} />
              <meshBasicMaterial
                color={isFocused ? '#38bdf8' : '#64748b'}
                transparent
                opacity={(isFocused ? 0.9 : 0.4) * glowIntensity}
              />
            </mesh>
          </group>
        );
      })}

      {/* Surrounding Architectural Pillars / Ribs */}
      {ribs.map((rib, idx) => (
        <group key={idx} position={[rib.x, 3.5, rib.z]} rotation={[0, -rib.angle + Math.PI / 2, 0]}>
          {/* Main vertical titanium beam */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.35, 7.5, 0.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Vertical neon strip accent on inner face */}
          <mesh position={[0, 0, -0.42]}>
            <boxGeometry args={[0.08, 7.2, 0.02]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.3 * glowIntensity} />
          </mesh>
        </group>
      ))}

      {/* Monumental Upper Circular Perimeter Ring (Truss Roof Structure) */}
      <mesh position={[0, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.4, 16, 64]} />
        <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius - 0.5, 0.05, 8, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45 * glowIntensity} />
      </mesh>
    </group>
  );
};
