'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface LogoProps {
    position?: [number, number, number];
    visible?: boolean;
}

export default function Logo({ position = [0, 0, 0], visible = true }: LogoProps) {
    const groupRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;

        // Subtle breathing effect
        groupRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);

        // Rotate the ring
        if (ringRef.current) {
            ringRef.current.rotation.z = time * 0.2;
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef} position={position}>
            <Float
                speed={2}
                rotationIntensity={0.2}
                floatIntensity={0.5}
                floatingRange={[-0.1, 0.1]}
            >
                {/* Main Logo Text - Using basic mesh since we don't have fonts loaded */}
                <Center>
                    {/* MT GAMEHUB text as glowing boxes */}
                    <group>
                        {/* M */}
                        <mesh position={[-4, 0, 0]}>
                            <boxGeometry args={[0.8, 2, 0.3]} />
                            <meshStandardMaterial
                                color="#ff00ff"
                                emissive="#ff00ff"
                                emissiveIntensity={2}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>

                        {/* T */}
                        <mesh position={[-2.5, 0, 0]}>
                            <boxGeometry args={[1.2, 0.4, 0.3]} />
                            <meshStandardMaterial
                                color="#ff00ff"
                                emissive="#ff00ff"
                                emissiveIntensity={2}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>
                        <mesh position={[-2.5, -0.5, 0]}>
                            <boxGeometry args={[0.4, 1.5, 0.3]} />
                            <meshStandardMaterial
                                color="#ff00ff"
                                emissive="#ff00ff"
                                emissiveIntensity={2}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>

                        {/* GAMEHUB - Represented as a stylized bar */}
                        <mesh position={[0, -1.8, 0]}>
                            <boxGeometry args={[8, 0.6, 0.2]} />
                            <meshStandardMaterial
                                color="#00d4ff"
                                emissive="#00d4ff"
                                emissiveIntensity={1.5}
                                metalness={0.9}
                                roughness={0.1}
                            />
                        </mesh>
                    </group>
                </Center>

                {/* Orbiting ring */}
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[5, 0.05, 16, 100]} />
                    <meshStandardMaterial
                        color="#ff00ff"
                        emissive="#ff00ff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>

                {/* Inner ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[4, 0.02, 16, 100]} />
                    <meshStandardMaterial
                        color="#00d4ff"
                        emissive="#00d4ff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.4}
                    />
                </mesh>

                {/* Glow sphere behind */}
                <mesh position={[0, 0, -1]}>
                    <sphereGeometry args={[3, 32, 32]} />
                    <meshBasicMaterial
                        color="#ff00ff"
                        transparent
                        opacity={0.1}
                    />
                </mesh>
            </Float>
        </group>
    );
}
