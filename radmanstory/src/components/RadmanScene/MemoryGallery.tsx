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

    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseX * 0.12,
      0.035,
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseY * 0.05,
      0.035,
    );

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouseX * 0.18,
      0.025,
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouseY * 0.12,
      0.025,
    );

    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>

      {/* MEMORY 01 — MAIN */}

      <MemoryFrame
        image="/memory/radman-main.jpg"
        position={[0, 0.35, 0]}
        rotation={[0, 0, 0]}
        width={2.7}
        label="Radman"
        index="01"
      />

      {/* MEMORY 02 — LEFT */}

      <MemoryFrame
        image="/memory/radman-second.jpg"
        position={[-3.6, 0.25, -1.5]}
        rotation={[0, 0.28, -0.035]}
        width={2.25}
        label="Memory"
        index="02"
      />

      {/* MEMORY 03 — RIGHT */}

      <MemoryFrame
        image="/memory/radman-main.jpg"
        position={[3.6, 0.1, -2]}
        rotation={[0, -0.3, 0.035]}
        width={2.15}
        label="Forever"
        index="03"
      />

      {/* DISTANT FRAME */}

      <MemoryFrame
        image="/memory/radman-second.jpg"
        position={[0, -2.1, -3.8]}
        rotation={[0.08, 0, 0]}
        width={1.75}
        label="14:15"
        index="04"
      />

      {/* PARTICLES */}

      {Array.from({ length: 60 }).map((_, index) => {
        const angle = (index / 60) * Math.PI * 2;
        const radius = 4.5 + (index % 5) * 0.25;

        const x = Math.cos(angle) * radius;
        const y =
          Math.sin(angle * 2.3) * 1.8 +
          ((index % 4) - 2) * 0.15;

        const z =
          Math.sin(angle) * radius - 2;

        return (
          <mesh
            key={index}
            position={[x, y, z]}
            scale={0.018 + (index % 3) * 0.009}
          >
            <sphereGeometry args={[1, 8, 8]} />

            <meshBasicMaterial
              color="#d8b77a"
              transparent
              opacity={0.25 + (index % 4) * 0.04}
            />
          </mesh>
        );
      })}

      {/* CENTRAL MEMORY LIGHT */}

      <pointLight
        position={[0, 0, 1]}
        intensity={2.5}
        color="#d8b77a"
        distance={6}
      />
    </group>
  );
}