"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function ParticleLayer({
  count,
  spread,
  size,
  opacity,
  speed,
}: {
  count: number;
  spread: number;
  size: number;
  opacity: number;
  speed: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * spread;
      array[i * 3 + 1] = (Math.random() - 0.5) * spread;
      array[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }

    return array;
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * speed * 0.25;
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
        color="#d8b77a"
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Core() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x += delta * 0.06;

    groupRef.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.08;

    groupRef.current.position.y =
      Math.cos(state.clock.elapsedTime * 0.28) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.4}
        rotationIntensity={0.2}
        floatIntensity={0.45}
      >
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.15, 5]} />

          <meshStandardMaterial
            color="#d8b77a"
            metalness={0.9}
            roughness={0.18}
            transparent
            opacity={0.78}
          />
        </mesh>
      </Float>

      <mesh scale={1.35}>
        <icosahedronGeometry args={[1.15, 3]} />

        <meshBasicMaterial
          color="#d8b77a"
          transparent
          opacity={0.035}
          wireframe
        />
      </mesh>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to(camera.position, {
        z: 3.2,
        y: 0.5,
        x: -0.35,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-immersive-scene]",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(camera.rotation, {
        y: -0.035,
        x: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-immersive-scene]",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => context.revert();
  }, [camera]);

  return null;
}

function ParallaxController() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const context = gsap.context(() => {
      gsap.to(groupRef.current!.position, {
        x: 0.7,
        y: 0.45,
        z: -0.35,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-immersive-scene]",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(groupRef.current!.rotation, {
        y: 0.35,
        x: -0.15,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-immersive-scene]",
          start: "top top",
          end: "bottom top",
          scrub: 2.5,
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <group ref={groupRef}>
      <Core />
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.22} />

      <pointLight
        position={[2, 2, 3]}
        intensity={6}
        color="#d8b77a"
      />

      <pointLight
        position={[-3, -1, -2]}
        intensity={2.5}
        color="#ffffff"
      />

      {/* Deep background */}
      <Stars
        radius={55}
        depth={35}
        count={2200}
        factor={1.2}
        saturation={0}
        fade
        speed={0.15}
      />

      {/* Middle depth */}
      <ParticleLayer
        count={350}
        spread={14}
        size={0.025}
        opacity={0.3}
        speed={0.018}
      />

      {/* Foreground */}
      <ParticleLayer
        count={140}
        spread={9}
        size={0.055}
        opacity={0.65}
        speed={0.055}
      />

      <CameraController />

      <ParallaxController />
    </>
  );
}

export default function RadmanScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}