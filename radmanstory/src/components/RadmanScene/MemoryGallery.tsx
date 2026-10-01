"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import MemoryFrame from "./MemoryFrame";

export default function MemoryGallery() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = state.pointer.x * 0.18;
    const targetY = state.pointer.y * 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX,
      0.025,
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY,
      0.025,
    );

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.pointer.x * 0.12,
      0.025,
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.pointer.y * 0.08,
      0.025,
    );

    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>

      {/* MAIN MEMORY */}

      <MemoryFrame
        image="/memory/radman-main.jpg"
        position={[0, 0.25, 0]}
        rotation={[0, 0, 0]}
        width={2.65}
        label="Radman"
        index="01"
      />

      {/* SECOND MEMORY */}

      <MemoryFrame
        image="/memory/radman-second.jpg"
        position={[-3.35, 0.4, -1.2]}
        rotation={[0, 0.32, -0.035]}
        width={2.25}
        label="Memory"
        index="02"
      />

      {/* THIRD PLACEHOLDER */}

      <group
        position={[3.35, 0.25, -1.7]}
        rotation={[0, -0.35, 0.04]}
      >
        <mesh>
          <boxGeometry args={[2.35, 2.95, 0.08]} />

          <meshStandardMaterial
            color="#11100e"
            roughness={0.65}
            metalness={0.35}
          />
        </mesh>

        <mesh
          position={[0, 0, 0.06]}
        >
          <planeGeometry args={[2.1, 2.7]} />

          <meshBasicMaterial
            color="#d8b77a"
            transparent
            opacity={0.035}
          />
        </mesh>
      </group>

      {/* FLOATING MEMORY DOTS */}

      {Array.from({ length: 22 }).map((_, index) => {
        const angle =
          (index / 22) * Math.PI * 2;

        const radius = 4 + (index % 3) * 0.35;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 1.7) * 1.7,
              Math.sin(angle) * radius - 1,
            ]}
            scale={0.025 + (index % 3) * 0.01}
          >
            <sphereGeometry args={[1, 8, 8]} />

            <meshBasicMaterial
              color="#d8b77a"
              transparent
              opacity={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}