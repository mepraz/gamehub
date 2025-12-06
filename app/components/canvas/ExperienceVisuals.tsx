'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceVisualsProps {
    position?: [number, number, number];
    visible?: boolean;
}

export default function ExperienceVisuals({ position = [0, 0, 0], visible = true }: ExperienceVisualsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;

        // Animate sound-reactive particles
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
            for (let i = 0; i < positions.count; i++) {
                const y = positions.getY(i);
                // Simulate sound reactivity with sin waves
                const newY = Math.sin(time * 3 + i * 0.1) * 2 + Math.sin(time * 5 + i * 0.2) * 0.5;
                positions.setY(i, newY);
            }
            positions.needsUpdate = true;
        }
    });

    if (!visible) return null;

    // Create sound bar particles
    const barCount = 30;
    const barPositions = new Float32Array(barCount * 3);
    const barColors = new Float32Array(barCount * 3);

    for (let i = 0; i < barCount; i++) {
        barPositions[i * 3] = (i - barCount / 2) * 0.4;
        barPositions[i * 3 + 1] = 0;
        barPositions[i * 3 + 2] = 0;

        // Gradient color
        const t = i / barCount;
        barColors[i * 3] = 1;
        barColors[i * 3 + 1] = t;
        barColors[i * 3 + 2] = 1 - t;
    }

    return (
        <group ref={groupRef} position={position}>
            {/* Central console Console */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[0, 0, 0]}>
                    {/* Console body */}
                    <mesh>
                        <boxGeometry args={[5, 0.8, 3]} />
                        <meshStandardMaterial
                            color="#0a0a15"
                            metalness={0.9}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* LED strip */}
                    <mesh position={[0, 0.41, 0]}>
                        <boxGeometry args={[4.5, 0.02, 0.5]} />
                        <meshStandardMaterial
                            color="#00d4ff"
                            emissive="#00d4ff"
                            emissiveIntensity={2}
                        />
                    </mesh>

                    {/* Vent lines */}
                    {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                        <mesh key={i} position={[x, 0.41, -1]}>
                            <boxGeometry args={[0.6, 0.02, 0.8]} />
                            <meshStandardMaterial
                                color="#1a1a2e"
                                metalness={0.8}
                                roughness={0.3}
                            />
                        </mesh>
                    ))}

                    {/* Disc slot */}
                    <mesh position={[-1.8, 0.1, 1.51]}>
                        <boxGeometry args={[1.5, 0.05, 0.05]} />
                        <meshStandardMaterial color="#0a0a0a" />
                    </mesh>
                </group>
            </Float>

            {/* Multiple controllers around */}
            {[
                { pos: [-4, 0, 2], rot: 0.3 },
                { pos: [4, 0, 2], rot: -0.3 },
                { pos: [0, 0, 4], rot: 0 },
            ].map((config, i) => (
                <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={0.15}>
                    <group position={config.pos as [number, number, number]} rotation={[0, config.rot, 0]} scale={0.6}>
                        {/* Simplified controller */}
                        <mesh>
                            <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
                            <meshStandardMaterial
                                color="#1a1a2e"
                                metalness={0.9}
                                roughness={0.3}
                            />
                        </mesh>
                        <mesh position={[0, 0.3, 0.35]}>
                            <boxGeometry args={[0.6, 0.1, 0.05]} />
                            <meshStandardMaterial
                                color={['#00d4ff', '#ff00ff', '#00ff88'][i]}
                                emissive={['#00d4ff', '#ff00ff', '#00ff88'][i]}
                                emissiveIntensity={1.5}
                            />
                        </mesh>
                    </group>
                </Float>
            ))}

            {/* Sound-reactive particles (visual equalizer) */}
            <points ref={particlesRef} position={[0, 3, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[barPositions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[barColors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.3}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Ambient light circles */}
            {[0, 1, 2].map((i) => (
                <mesh
                    key={i}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -2, 0]}
                >
                    <ringGeometry args={[4 + i * 2, 4.2 + i * 2, 64]} />
                    <meshStandardMaterial
                        color="#00d4ff"
                        emissive="#00d4ff"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.2 - i * 0.05}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}
