"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MemoryAtmosphere() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = Array.from(
    { length: 38 },
    (_, index) => {
      const angle =
        (index / 38) * Math.PI * 2;

      const radius =
        4.8 + (index % 6) * 0.25;

      return {
        x: Math.cos(angle) * radius,
        y:
          Math.sin(angle * 1.7) * 2.1 +
          ((index % 5) - 2) * 0.25,
        z:
          Math.sin(angle) * radius - 2,
        size:
          0.015 + (index % 3) * 0.009,
      };
    },
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y +=
      delta * 0.008;

    groupRef.current.position.x =
      THREE.MathUtils.lerp(
        groupRef.current.position.x,
        state.pointer.x * 0.12,
        0.025,
      );

    groupRef.current.position.y =
      THREE.MathUtils.lerp(
        groupRef.current.position.y,
        state.pointer.y * 0.06,
        0.025,
      );
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[
            particle.x,
            particle.y,
            particle.z,
          ]}
          scale={particle.size}
        >
          <sphereGeometry
            args={[1, 6, 6]}
          />

          <meshBasicMaterial
            color="#d8b77a"
            transparent
            opacity={
              0.14 + (index % 4) * 0.035
            }
          />
        </mesh>
      ))}
    </group>
  );
}