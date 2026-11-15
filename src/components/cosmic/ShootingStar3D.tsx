// Realistic Periodic Shooting Star & Meteor Streak for Three.js / React Three Fiber
// Spawns natural, periodic diagonal meteors with luminous leading heads and fading trails

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStar3DProps {
  intervalRange?: [number, number];
  bounds?: { xMin: number; xMax: number; yMin: number; yMax: number; z: number };
  speedMultiplier?: number;
}

export const ShootingStar3D: React.FC<ShootingStar3DProps> = ({
  intervalRange = [10, 24],
  bounds = { xMin: -35, xMax: 35, yMin: 15, yMax: 35, z: -50 },
  speedMultiplier = 1.0,
}) => {
  const headRef = useRef<THREE.Mesh>(null);

  const streakState = useRef({
    active: false,
    progress: 0,
    duration: 0.9,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    z: bounds.z,
    timer: 4.0,
  });

  const [opacity, setOpacity] = useState<number>(0);

  const { lineGeo, lineMat, lineObj } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 0, 0, 0]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const obj = new THREE.Line(geo, mat);
    return { lineGeo: geo, lineMat: mat, lineObj: obj };
  }, []);

  useFrame((_, delta) => {
    const s = streakState.current;

    if (!s.active) {
      s.timer -= delta;
      if (s.timer <= 0) {
        s.active = true;
        s.progress = 0;
        s.duration = 0.7 + Math.random() * 0.5;

        const fromLeft = Math.random() > 0.5;
        s.startX = fromLeft
          ? bounds.xMin + Math.random() * 15
          : bounds.xMax - Math.random() * 15;
        s.startY = bounds.yMax - Math.random() * 10;

        const distanceX = (fromLeft ? 1 : -1) * (20 + Math.random() * 18);
        const distanceY = -(14 + Math.random() * 16);

        s.endX = s.startX + distanceX;
        s.endY = s.startY + distanceY;
        s.z = bounds.z + (Math.random() - 0.5) * 10;
      }
      return;
    }

    s.progress += (delta / s.duration) * speedMultiplier;

    if (s.progress >= 1.0) {
      s.active = false;
      setOpacity(0);
      lineMat.opacity = 0;
      s.timer = intervalRange[0] + Math.random() * (intervalRange[1] - intervalRange[0]);
      return;
    }

    const t = s.progress;
    const alpha = Math.sin(t * Math.PI) * 0.95;
    setOpacity(alpha);
    lineMat.opacity = alpha;

    const headX = THREE.MathUtils.lerp(s.startX, s.endX, t);
    const headY = THREE.MathUtils.lerp(s.startY, s.endY, t);

    const tailT = Math.max(0, t - 0.28);
    const tailX = THREE.MathUtils.lerp(s.startX, s.endX, tailT);
    const tailY = THREE.MathUtils.lerp(s.startY, s.endY, tailT);

    const posAttr = lineGeo.attributes.position as THREE.BufferAttribute;
    posAttr.setXYZ(0, headX, headY, s.z);
    posAttr.setXYZ(1, tailX, tailY, s.z);
    posAttr.needsUpdate = true;

    if (headRef.current) {
      headRef.current.position.set(headX, headY, s.z);
    }
  });

  return (
    <group>
      <primitive object={lineObj} />
      <mesh ref={headRef}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 1.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

