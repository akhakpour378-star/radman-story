"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
    Environment,
    OrbitControls,
    Stars,
    Text,
} from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";

import MemoryGallery from "./MemoryGallery";
// import MemoryAtmosphere from "./MemoryAtmosphere";

function SceneContent() {
    const sceneRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!sceneRef.current) return;

        const targetY = state.pointer.x * 0.035;
        const targetX = state.pointer.y * 0.018;

        sceneRef.current.rotation.y = THREE.MathUtils.lerp(
            sceneRef.current.rotation.y,
            targetY,
            0.025,
        );

        sceneRef.current.rotation.x = THREE.MathUtils.lerp(
            sceneRef.current.rotation.x,
            -targetX,
            0.025,
        );

        sceneRef.current.position.y +=
            Math.sin(state.clock.elapsedTime * 0.45) *
            delta *
            0.015;
    });

    return (
        <>
            <color
                attach="background"
                args={["#010101"]}
            />

            <fog
                attach="fog"
                args={[
                    "#010101",
                    5,
                    14,
                ]}
            />

            <fog
                attach="fog"
                args={["#020202", 4, 15]}
            />

            {/* BASE LIGHT */}

            <ambientLight intensity={0.18} />

            {/* GOLD KEY */}

            <spotLight
                position={[0, 4.5, 4]}
                intensity={7}
                angle={0.48}
                penumbra={0.85}
                distance={12}
                color="#d8b77a"
            />

            {/* LEFT RIM */}

            <pointLight
                position={[-4, 1, 1]}
                intensity={3}
                distance={8}
                color="#fff1d2"
            />

            {/* RIGHT RIM */}

            <pointLight
                position={[4, -1, -2]}
                intensity={2}
                distance={7}
                color="#9b7743"
            />

            {/* BACK LIGHT */}

            <pointLight
                position={[0, -2.5, -4]}
                intensity={2.5}
                distance={8}
                color="#6e5130"
            />

            {/* STARS */}

            <Stars
                radius={20}
                depth={12}
                count={420}
                factor={0.8}
                saturation={0}
                fade
                speed={0.06}
            />

            {/* MEMORY WORLD */}

            <group ref={sceneRef}>
                {/* <MemoryAtmosphere /> */}

                <MemoryGallery />
            </group>

            {/* ENVIRONMENT */}

            <Environment
                preset="night"
                environmentIntensity={0.35}
            />

            {/* CAMERA CONTROL */}

            {/* <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
            /> */}

            {/* DISTANCE MARKER */}

            <Text
                position={[0, -3.05, -1]}
                fontSize={0.08}
                letterSpacing={0.28}
                color="#ffffff"
                fillOpacity={0.22}
                anchorX="center"
                anchorY="middle"
            >
                MEMORY SPACE
            </Text>
        </>
    );
}

export default function RadmanScene() {
    return (
        <div className="absolute inset-0">
            <Canvas
                camera={{
                    position: [0, 0, 7],
                    fov: 38,
                    near: 0.1,
                    far: 30,
                }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                }}
                performance={{
                    min: 0.5,
                    max: 1,
                    debounce: 200,
                }}
            >
                <SceneContent />
            </Canvas>

            {/* CINEMATIC VIGNETTE */}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.48)_100%)]" />

            {/* TOP GRADIENT */}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

            {/* BOTTOM GRADIENT */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
    );
}