'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useCursorPosition } from '../../hooks/useCursorPosition';

interface GameCardProps {
    position: [number, number, number];
    name: string;
    color: string;
    index: number;
    visible?: boolean;
}

export default function GameCard({ position, name, color, index, visible = true }: GameCardProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const cursor = useCursorPosition();

    useFrame((state, delta) => {
        if (!meshRef.current || !groupRef.current || !visible) return;

        // Magnetic effect toward cursor when hovered
        if (hovered) {
            const targetZ = position[2] + 1.5;
            meshRef.current.position.z = THREE.MathUtils.lerp(
                meshRef.current.position.z,
                targetZ,
                delta * 5
            );
        } else {
            meshRef.current.position.z = THREE.MathUtils.lerp(
                meshRef.current.position.z,
                0,
                delta * 3
            );
        }

        // Slight rotation toward cursor
        const rotationX = cursor.y * 0.1;
        const rotationY = cursor.x * 0.1;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            hovered ? rotationX : 0,
            delta * 3
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            hovered ? rotationY : 0,
            delta * 3
        );
    });

    if (!visible) return null;

    return (
        <Float
            speed={1.5 + index * 0.2}
            rotationIntensity={0.1}
            floatIntensity={0.3}
        >
            <group ref={groupRef} position={position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <RoundedBox args={[2.5, 3.5, 0.2]} radius={0.1} smoothness={4}>
                        <meshStandardMaterial
                            color={hovered ? color : '#1a1a2e'}
                            metalness={0.6}
                            roughness={0.3}
                            emissive={color}
                            emissiveIntensity={hovered ? 0.5 : 0.1}
                        />
                    </RoundedBox>

                    {/* Game art placeholder - colored rectangle */}
                    <mesh position={[0, 0.3, 0.11]}>
                        <planeGeometry args={[2.2, 2.5]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.3}
                        />
                    </mesh>

                    {/* Game title bar */}
                    <mesh position={[0, -1.3, 0.11]}>
                        <planeGeometry args={[2.2, 0.5]} />
                        <meshStandardMaterial
                            color="#0a0a15"
                            metalness={0.9}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Neon border glow */}
                    <mesh position={[0, 0, -0.05]}>
                        <RoundedBox args={[2.7, 3.7, 0.1]} radius={0.12} smoothness={4}>
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={hovered ? 0.4 : 0.1}
                            />
                        </RoundedBox>
                    </mesh>
                </mesh>

                {/* Hover glow light */}
                {hovered && (
                    <pointLight
                        position={[0, 0, 2]}
                        color={color}
                        intensity={3}
                        distance={5}
                    />
                )}
            </group>
        </Float>
    );
}
