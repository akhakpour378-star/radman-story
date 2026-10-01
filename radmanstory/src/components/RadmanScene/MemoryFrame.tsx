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
    width = 2.8,
    label = "Memory",
    index = "01",
}: MemoryFrameProps) {
    const groupRef = useRef<THREE.Group>(null);

    const targetRotation = useRef(
        new THREE.Euler(
            rotation[0],
            rotation[1],
            rotation[2],
        ),
    );

    useFrame((state) => {
        if (!groupRef.current) return;

        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation.current.y + mouseX * 0.035,
            0.035,
        );

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetRotation.current.x - mouseY * 0.02,
            0.035,
        );
    });

    const height = width * 1.25;

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            userData={{
                label,
                index,
            }}
        >

            <group
                name={`memory-${index}`}
            >
                {/* OUTER FRAME */}

                <mesh position={[0, 0, -0.06]}>
                    <boxGeometry
                        args={[
                            width + 0.16,
                            height + 0.16,
                            0.08,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#181512"
                        roughness={0.55}
                        metalness={0.5}
                    />
                </mesh>

                {/* GOLD INNER BORDER */}

                <mesh position={[0, 0, -0.01]}>
                    <boxGeometry
                        args={[
                            width + 0.045,
                            height + 0.045,
                            0.045,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#d8b77a"
                        roughness={0.32}
                        metalness={0.7}
                    />
                </mesh>

                {/* PHOTO */}

                <DreiImage
                    url={image}
                    position={[0, 0, 0.035]}
                    scale={[width, height]}
                    transparent
                />

                {/* GLASS */}

                <mesh position={[0, 0, 0.07]}>
                    <planeGeometry args={[width, height]} />

                    <meshPhysicalMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.045}
                        roughness={0.05}
                        metalness={0.1}
                        transmission={0.2}
                    />
                </mesh>

                {/* LIGHT */}

                <pointLight
                    position={[0, 0, 0.8]}
                    intensity={0.25}
                    color="#d8b77a"
                    distance={3}
                />
            </group>

            {/* LABEL */}

            <group position={[-width / 2, -height / 2 - 0.18, 0]}>
                <mesh>
                    <boxGeometry args={[0.02, 0.02, 0.02]} />

                    <meshBasicMaterial color="#d8b77a" />
                </mesh>
            </group>
        </group>
    );
}