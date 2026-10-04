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

    const x = state.pointer.x;
    const y = state.pointer.y;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.012,
      0.025,
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y * 0.008,
      0.025,
    );

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x * 0.05, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y * 0.03, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <MemoryFrame
        image="/memory/radman-main.JPG"
        position={[0, 0.15, 0]}
        rotation={[0, 0, 0]}
        width={3.15}
        label="Radman"
        index="01"
      />
      <MemoryFrame
        image="/memory/radman-second.JPG"
        position={[-4.15, -0.45, -2.8]}
        rotation={[0, 0.05, -0.012]}
        width={1.75}
        label="Memory"
        index="02"
      />
      <MemoryFrame
        image="/memory/radman-main.JPG"
        position={[4.15, 0.15, -3.4]}
        rotation={[0, -0.05, 0.012]}
        width={1.6}
        label="Forever"
        index="03"
      />
      <MemoryFrame
        image="/memory/radman-second.JPG"
        position={[0, -2.65, -5.5]}
        rotation={[0, 0, 0]}
        width={1.25}
        label="14:15"
        index="04"
      />
    </group>
  );
}
