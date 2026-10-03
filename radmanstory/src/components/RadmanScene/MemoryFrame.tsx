"use client";

import { Image as DreiImage } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type MemoryFrameProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  image: string;
  width?: number;
  label?: string;
  index?: string;
};

export default function MemoryFrame({
  position,
  rotation = [0, 0, 0],
  image,
  width = 3,
  label = "Memory",
  index = "01",
}: MemoryFrameProps) {
  const groupRef = useRef<THREE.Group>(null);

  const height = width * 1.25;

  useFrame((state) => {
    if (!groupRef.current) return;

    const mx = state.pointer.x;
    const my = state.pointer.y;

    groupRef.current.position.x =
      THREE.MathUtils.lerp(
        groupRef.current.position.x,
        position[0] + mx * 0.025,
        0.025,
      );

    groupRef.current.position.y =
      THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1] + my * 0.015,
        0.025,
      );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
    >

      {/* BACK SHADOW */}

      <mesh position={[0, -0.02, -0.12]}>
        <planeGeometry
          args={[
            width + 0.24,
            height + 0.24,
          ]}
        />

        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* DARK FRAME */}

      <mesh position={[0, 0, -0.08]}>
        <boxGeometry
          args={[
            width + 0.14,
            height + 0.14,
            0.12,
          ]}
        />

        <meshBasicMaterial
          color="#11100e"
        />
      </mesh>

      {/* GOLD HAIRLINE */}

      <mesh position={[0, 0, 0]}>
        <boxGeometry
          args={[
            width + 0.035,
            height + 0.035,
            0.035,
          ]}
        />

        <meshBasicMaterial
          color="#b89a63"
        />
      </mesh>

      {/* PHOTO */}

      <DreiImage
        url={image}
        position={[0, 0, 0.045]}
        scale={[width, height]}
        toneMapped={false}
      />

      {/* SUBTLE TOP REFLECTION */}

      <mesh
        position={[
          0,
          height * 0.46,
          0.075,
        ]}
      >
        <planeGeometry
          args={[
            width * 0.88,
            0.008,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* LABEL */}

      <group
        position={[
          -width / 2,
          -height / 2 - 0.22,
          0,
        ]}
      >

        <mesh
          position={[-0.04, 0.02, 0]}
        >
          <sphereGeometry
            args={[0.025, 8, 8]}
          />

          <meshBasicMaterial
            color="#c7a66d"
          />
        </mesh>

      </group>

    </group>
  );
}