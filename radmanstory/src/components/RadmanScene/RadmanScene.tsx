"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Stars,
  Text,
} from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";
import MemoryGallery from "./MemoryGallery";

function MemoryOrb() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!orbRef.current) return;

    orbRef.current.rotation.y += delta * 0.18;
    orbRef.current.rotation.x += delta * 0.04;
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.25}
      floatIntensity={0.45}
    >
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[1.35, 4]} />

        <meshPhysicalMaterial
          color="#d8b77a"
          roughness={0.2}
          metalness={0.65}
          transmission={0.15}
          thickness={1}
          transparent
          opacity={0.72}
        />
      </mesh>
    </Float>
  );
}

function InnerCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.y -= delta * 0.35;
    ref.current.rotation.z += delta * 0.12;
  });

  return (
    <mesh ref={ref} scale={0.62}>
      <icosahedronGeometry args={[1, 2]} />

      <meshStandardMaterial
        color="#fff4d6"
        emissive="#d8b77a"
        emissiveIntensity={1.7}
        roughness={0.15}
        metalness={0.2}
      />
    </mesh>
  );
}

function MemoryParticles() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.025;
  });

  const particles = Array.from({ length: 80 }, (_, index) => {
    const angle = (index / 80) * Math.PI * 2;

    const radius = 2.1 + (index % 5) * 0.15;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle * 1.7) * 0.65;
    const z = Math.sin(angle) * radius;

    return {
      x,
      y,
      z,
      scale: 0.015 + (index % 4) * 0.008,
    };
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
          scale={particle.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />

          <meshBasicMaterial
            color="#d8b77a"
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRing({
  radius,
  rotation,
  speed,
}: {
  radius: number;
  rotation: [number, number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh
      ref={ref}
      rotation={rotation}
      scale={radius}
    >
      <torusGeometry args={[1, 0.0035, 8, 160]} />

      <meshBasicMaterial
        color="#d8b77a"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#020202"]} />

      <fog
        attach="fog"
        args={["#020202", 5, 13]}
      />

      <ambientLight intensity={0.35} />

      <pointLight
        position={[0, 2, 3]}
        intensity={12}
        color="#d8b77a"
        distance={8}
      />

      <pointLight
        position={[-4, -2, -3]}
        intensity={5}
        color="#ffffff"
        distance={7}
      />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2}
      />

      <Stars
        radius={18}
        depth={10}
        count={900}
        factor={1.2}
        saturation={0}
        fade
        speed={0.15}
      />

      <MemoryGallery />

      <Text
        position={[0, -2.45, 0]}
        fontSize={0.18}
        letterSpacing={0.18}
        color="#d8b77a"
        anchorX="center"
        anchorY="middle"
      >
        RADMAN
      </Text>

      <Text
        position={[0, -2.8, 0]}
        fontSize={0.09}
        letterSpacing={0.3}
        color="#ffffff"
        fillOpacity={0.3}
        anchorX="center"
        anchorY="middle"
      >
        14 : 15
      </Text>

      <Environment preset="night" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </>
  );
}

export default function RadmanScene() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{
          position: [0, 0.2, 7],
          fov: 42,
        }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}