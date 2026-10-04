"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Tree({ x, z, scale=1, lean=0 }: { x:number; z:number; scale?:number; lean?:number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = lean + Math.sin(state.clock.elapsedTime * 0.28 + x) * 0.006;
  });
  return (
    <group ref={ref} position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.16, 0.28, 5.2, 8]} />
        <meshStandardMaterial color="#101812" roughness={1} />
      </mesh>
      <mesh position={[0, 5.4, 0]}>
        <coneGeometry args={[2.2, 4.8, 9]} />
        <meshStandardMaterial color="#0b1710" roughness={1} />
      </mesh>
      <mesh position={[0.25, 7.1, 0.1]} scale={0.7}>
        <coneGeometry args={[2.1, 4.2, 9]} />
        <meshStandardMaterial color="#112116" roughness={1} />
      </mesh>
    </group>
  );
}

function ForestScene() {
  const trees = [
    [-8,-2,1.5,-.04],[-5,-6,1.15,.03],[-2,-10,1.8,-.02],[2,-8,1.35,.02],
    [6,-4,1.8,-.04],[10,-9,1.25,.03],[-12,-13,2,-.03],[-7,-17,1.3,.02],
    [-2,-20,1.9,-.02],[4,-16,1.5,.03],[9,-19,2,-.04],[13,-14,1.4,.02],
    [-15,-24,2.1,-.03],[-9,-27,1.5,.02],[-3,-29,2,-.04],[5,-27,1.6,.03],
    [11,-25,2.2,-.02],
  ] as const;
  return (
    <>
      <color attach="background" args={["#07100b"]} />
      <fog attach="fog" args={["#07100b", 7, 34]} />
      <ambientLight intensity={0.28} color="#b7c7b0" />
      <directionalLight position={[-8, 12, -12]} intensity={2.2} color="#d8c28e" />
      <directionalLight position={[10, 6, -5]} intensity={0.45} color="#9ab39b" />
      {trees.map(([x,z,s,l],i)=><Tree key={i} x={x} z={z} scale={s} lean={l} />)}
      <Float speed={0.35} rotationIntensity={0.03} floatIntensity={0.02}>
        <mesh position={[0, 7, -18]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[30,18]} />
          <meshBasicMaterial color="#d9d2a8" transparent opacity={0.055} />
        </mesh>
      </Float>
      <Sparkles count={420} scale={[22,10,28]} size={1.8} speed={0.18} noise={1.2} color="#d9d7bf" />
      <PerspectiveCamera makeDefault position={[0, 3.1, 5.8]} fov={45} />
    </>
  );
}

export default function ForestWorld() {
  return (
    <div className="forest-world" aria-hidden="true">
      <Canvas dpr={[1,1.6]} gl={{ antialias:true, powerPreference:"high-performance" }}>
        <ForestScene />
      </Canvas>
    </div>
  );
}
