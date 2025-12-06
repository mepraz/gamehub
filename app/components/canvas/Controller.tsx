'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useCursorPosition } from '../../hooks/useCursorPosition';

interface ControllerProps {
    position?: [number, number, number];
    visible?: boolean;
}

export default function Controller({ position = [0, 0, 0], visible = true }: ControllerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const cursor = useCursorPosition();

    useFrame((state, delta) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;

        // Base rotation
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;
        groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

        // Magnetic effect toward cursor
        const targetX = cursor.x * 0.5;
        const targetY = cursor.y * 0.3;

        groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y * 0.5) * delta * 2;
        groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x * 0.5) * delta * 2;

        // Scale on hover
        const targetScale = hovered ? 1.1 : 1;
        groupRef.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            delta * 5
        );
    });

    if (!visible) return null;

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.4}
        >
            <group
                ref={groupRef}
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Controller Body */}
                <mesh>
                    <capsuleGeometry args={[0.8, 2, 8, 16]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        metalness={0.9}
                        roughness={0.3}
                    />
                </mesh>

                {/* Left Grip */}
                <mesh position={[-1.3, -0.3, 0.2]} rotation={[0, 0, 0.3]}>
                    <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        metalness={0.9}
                        roughness={0.3}
                    />
                </mesh>

                {/* Right Grip */}
                <mesh position={[1.3, -0.3, 0.2]} rotation={[0, 0, -0.3]}>
                    <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        metalness={0.9}
                        roughness={0.3}
                    />
                </mesh>

                {/* Touchpad */}
                <mesh position={[0, 0.1, 0.5]}>
                    <boxGeometry args={[1.2, 0.5, 0.1]} />
                    <meshStandardMaterial
                        color="#2a2a4e"
                        metalness={0.8}
                        roughness={0.4}
                    />
                </mesh>

                {/* Light Bar */}
                <mesh position={[0, 0.4, 0.55]}>
                    <boxGeometry args={[0.8, 0.08, 0.05]} />
                    <meshStandardMaterial
                        color="#00d4ff"
                        emissive="#00d4ff"
                        emissiveIntensity={hovered ? 3 : 1.5}
                    />
                </mesh>

                {/* Left Analog Stick */}
                <mesh position={[-0.5, -0.2, 0.55]}>
                    <cylinderGeometry args={[0.18, 0.2, 0.15, 16]} />
                    <meshStandardMaterial
                        color="#0a0a15"
                        metalness={0.7}
                        roughness={0.5}
                    />
                </mesh>

                {/* Right Analog Stick */}
                <mesh position={[0.5, -0.5, 0.55]}>
                    <cylinderGeometry args={[0.18, 0.2, 0.15, 16]} />
                    <meshStandardMaterial
                        color="#0a0a15"
                        metalness={0.7}
                        roughness={0.5}
                    />
                </mesh>

                {/* D-Pad */}
                <group position={[-0.5, 0.3, 0.5]}>
                    <mesh>
                        <boxGeometry args={[0.35, 0.12, 0.05]} />
                        <meshStandardMaterial color="#0a0a15" />
                    </mesh>
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.35, 0.12, 0.05]} />
                        <meshStandardMaterial color="#0a0a15" />
                    </mesh>
                </group>

                {/* Action Buttons - PlayStation style */}
                <group position={[0.5, 0.2, 0.5]}>
                    {/* Triangle */}
                    <mesh position={[0, 0.18, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.05, 3]} />
                        <meshStandardMaterial
                            color="#00ff88"
                            emissive="#00ff88"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    {/* Circle */}
                    <mesh position={[0.18, 0, 0]}>
                        <torusGeometry args={[0.06, 0.02, 8, 16]} />
                        <meshStandardMaterial
                            color="#ff4444"
                            emissive="#ff4444"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    {/* Cross */}
                    <mesh position={[0, -0.18, 0]}>
                        <boxGeometry args={[0.12, 0.04, 0.04]} />
                        <meshStandardMaterial
                            color="#4488ff"
                            emissive="#4488ff"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    <mesh position={[0, -0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.12, 0.04, 0.04]} />
                        <meshStandardMaterial
                            color="#4488ff"
                            emissive="#4488ff"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    {/* Square */}
                    <mesh position={[-0.18, 0, 0]}>
                        <boxGeometry args={[0.1, 0.1, 0.04]} />
                        <meshStandardMaterial
                            color="#ff44ff"
                            emissive="#ff44ff"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>

                {/* PS Button */}
                <mesh position={[0, -0.35, 0.5]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={hovered ? 1 : 0.3}
                    />
                </mesh>

                {/* Ambient glow when hovered */}
                {hovered && (
                    <pointLight
                        position={[0, 0, 1]}
                        color="#00d4ff"
                        intensity={2}
                        distance={3}
                    />
                )}
            </group>
        </Float>
    );
}
