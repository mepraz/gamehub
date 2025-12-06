'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HolographicTextProps {
    position?: [number, number, number];
    visible?: boolean;
}

export default function HolographicText({ position = [0, 0, 0], visible = true }: HolographicTextProps) {
    const groupRef = useRef<THREE.Group>(null);
    const gridRef = useRef<THREE.Mesh>(null);
    const scanLineRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;

        // Subtle color shift
        if (groupRef.current.children[0]) {
            const material = (groupRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (material.emissive) {
                const hue = (Math.sin(time * 0.5) + 1) / 2;
                material.emissive.setHSL(hue * 0.1 + 0.8, 1, 0.5);
            }
        }

        // Animate grid
        if (gridRef.current) {
            gridRef.current.position.y = Math.sin(time * 0.5) * 0.1 - 5;
        }

        // Scan line animation
        if (scanLineRef.current) {
            scanLineRef.current.position.y = ((time * 2) % 8) - 4;
        }
    });

    if (!visible) return null;

    return (
        <group position={position}>
            <Float
                speed={1}
                rotationIntensity={0.05}
                floatIntensity={0.3}
            >
                <group ref={groupRef}>
                    {/* Main Price Text */}
                    <Text
                        font="/fonts/Orbitron-Bold.woff"
                        fontSize={2}
                        position={[0, 1, 0]}
                        color="#00d4ff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="#ff00ff"
                    >
                        Rs. 200
                        <meshStandardMaterial
                            color="#00d4ff"
                            emissive="#00d4ff"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.9}
                        />
                    </Text>

                    {/* Per Hour Text */}
                    <Text
                        font="/fonts/Orbitron-Regular.woff"
                        fontSize={0.8}
                        position={[0, -0.8, 0]}
                        color="#ff00ff"
                        anchorX="center"
                        anchorY="middle"
                    >
                        / hour
                        <meshStandardMaterial
                            color="#ff00ff"
                            emissive="#ff00ff"
                            emissiveIntensity={1.5}
                            transparent
                            opacity={0.8}
                        />
                    </Text>

                    {/* Holographic scanline */}
                    <mesh ref={scanLineRef} position={[0, 0, 0.1]}>
                        <planeGeometry args={[10, 0.05]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.3}
                        />
                    </mesh>

                    {/* Decorative frame */}
                    <group>
                        {/* Top line */}
                        <mesh position={[0, 2.5, 0]}>
                            <boxGeometry args={[8, 0.05, 0.02]} />
                            <meshStandardMaterial
                                color="#ff00ff"
                                emissive="#ff00ff"
                                emissiveIntensity={1}
                            />
                        </mesh>

                        {/* Bottom line */}
                        <mesh position={[0, -1.8, 0]}>
                            <boxGeometry args={[8, 0.05, 0.02]} />
                            <meshStandardMaterial
                                color="#00d4ff"
                                emissive="#00d4ff"
                                emissiveIntensity={1}
                            />
                        </mesh>

                        {/* Corner accents */}
                        {[[-4, 2.5], [4, 2.5], [-4, -1.8], [4, -1.8]].map(([x, y], i) => (
                            <mesh key={i} position={[x, y, 0]}>
                                <boxGeometry args={[0.3, 0.3, 0.02]} />
                                <meshStandardMaterial
                                    color={i < 2 ? '#ff00ff' : '#00d4ff'}
                                    emissive={i < 2 ? '#ff00ff' : '#00d4ff'}
                                    emissiveIntensity={1.5}
                                />
                            </mesh>
                        ))}
                    </group>
                </group>
            </Float>

            {/* Energy Grid Floor */}
            <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                <planeGeometry args={[30, 30, 30, 30]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    wireframe
                    transparent
                    opacity={0.2}
                    emissive="#00d4ff"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Energy wave rings */}
            {[0, 1, 2].map((i) => (
                <mesh
                    key={i}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -4.9, 0]}
                >
                    <ringGeometry args={[3 + i * 2, 3.1 + i * 2, 64]} />
                    <meshStandardMaterial
                        color="#ff00ff"
                        emissive="#ff00ff"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.3 - i * 0.08}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}
