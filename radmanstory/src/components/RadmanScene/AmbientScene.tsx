"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 16;
      positions[i3 + 1] = (Math.random() - 0.5) * 9;
      positions[i3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }

    return { positions };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.008;

    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#c8a76a"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </points>
  );
}

function AmbientLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;

    lightRef.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.12) * 3;

    lightRef.current.position.y =
      Math.cos(state.clock.elapsedTime * 0.09) * 2;

    lightRef.current.intensity =
      0.45 +
      Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 3]}
      color="#c8a76a"
      intensity={0.45}
      distance={12}
    />
  );
}

export default function AmbientScene() {
  return (
    <>
      <color attach="background" args={["#080706"]} />

      <fog
        attach="fog"
        args={["#080706", 4, 18]}
      />

      <ambientLight intensity={0.18} />

      <AmbientLight />

      <Particles />
    </>
  );
}