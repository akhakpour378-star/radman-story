"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type TreeProps = { position: [number, number, number]; scale: number; phase: number };

function Tree({ position, scale, phase }: TreeProps) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.35 + phase) * 0.012;
    group.current.rotation.x = Math.cos(clock.elapsedTime * 0.27 + phase) * 0.006;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.18, 0.34, 5.6, 8]} />
        <meshStandardMaterial color="#171d17" roughness={1} />
      </mesh>
      {[0, 1.7, 3.2].map((y, i) => (
        <mesh key={y} position={[i % 2 ? 0.18 : -0.1, 5.1 + y, i * 0.05]} rotation={[0, i * 0.35, 0]}>
          <coneGeometry args={[2.4 - i * 0.25, 4.5 - i * 0.35, 9]} />
          <meshStandardMaterial color={i === 1 ? "#102117" : "#0b1710"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function ForestScene() {
  const trees = useMemo(() => {
    const result: TreeProps[] = [];
    let seed = 13;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 58; i += 1) {
      const z = -2 - rand() * 34;
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (3.5 + rand() * 10.5);
      const scale = 0.65 + rand() * 1.55;
      result.push({ position: [x, 0, z], scale, phase: rand() * 6.28 });
    }
    return result;
  }, []);

  return (
    <>
      <color attach="background" args={["#07100b"]} />
      <fog attach="fog" args={["#07100b", 6, 38]} />
      <ambientLight intensity={0.22} color="#b9c9ba" />
      <hemisphereLight intensity={0.35} color="#b9c7ba" groundColor="#020503" />
      <directionalLight position={[-9, 15, -14]} intensity={3.2} color="#e4c98c" castShadow />
      <directionalLight position={[12, 8, -2]} intensity={0.6} color="#7c9b83" />
      <mesh position={[0, -0.25, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#07100b" roughness={1} />
      </mesh>
      {trees.map((tree, index) => <Tree key={index} {...tree} />)}
      <group>
        {Array.from({ length: 90 }, (_, index) => {
          const a = (index / 90) * Math.PI * 2;
          const r = 3 + (index % 9) * 0.8;
          return (
            <mesh key={index} position={[Math.cos(a) * r, 0.12 + (index % 5) * 0.03, -4 - (index % 8) * 3]}>
              <sphereGeometry args={[0.015 + (index % 3) * 0.008, 5, 5]} />
              <meshBasicMaterial color="#a8b58b" transparent opacity={0.55} />
            </mesh>
          );
        })}
      </group>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.65} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
      </EffectComposer>
      <PerspectiveCamera position={[0, 3.2, 6.5]} fov={42} makeDefault />
    </>
  );
}

export default function ForestWorld() {
  return (
    <div className="forest-world" aria-hidden="true">
      <Canvas dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <ForestScene />
      </Canvas>
    </div>
  );
}
