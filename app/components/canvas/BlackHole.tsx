'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorPosition } from '../../hooks/useCursorPosition';

interface BlackHoleProps {
    position?: [number, number, number];
    scrollProgress: number;
}

export default function BlackHole({ position = [0, 0, 0], scrollProgress }: BlackHoleProps) {
    const groupRef = useRef<THREE.Group>(null);
    const diskRef = useRef<THREE.Mesh>(null);
    const ringRefs = useRef<THREE.Mesh[]>([]);
    const particlesRef = useRef<THREE.Points>(null);
    const cursor = useCursorPosition();

    // Create spiral particles
    const particleData = useMemo(() => {
        const count = 8000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spiral distribution
            const angle = (i / count) * Math.PI * 20;
            const radius = 2 + (i / count) * 15;
            const height = (Math.random() - 0.5) * 0.5;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;

            // Color gradient from orange to purple
            const t = i / count;
            const colorPink = new THREE.Color('#ff00ff');
            const colorOrange = new THREE.Color('#ff6600');
            const colorBlue = new THREE.Color('#00d4ff');

            let color;
            if (t < 0.33) {
                color = colorOrange.clone().lerp(colorPink, t * 3);
            } else if (t < 0.66) {
                color = colorPink.clone().lerp(colorBlue, (t - 0.33) * 3);
            } else {
                color = colorBlue.clone();
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
            speeds[i] = 0.2 + Math.random() * 0.5;
        }

        return { positions, colors, sizes, speeds, count };
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        // Subtle cursor influence
        groupRef.current.rotation.x = cursor.y * 0.05;
        groupRef.current.rotation.y = cursor.x * 0.05;

        // Rotate accretion disk
        if (diskRef.current) {
            diskRef.current.rotation.z = time * 0.3;
        }

        // Rotate rings at different speeds
        ringRefs.current.forEach((ring, i) => {
            if (ring) {
                ring.rotation.z = time * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
            }
        });

        // Animate particles spiraling inward
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;

            for (let i = 0; i < particleData.count; i++) {
                const i3 = i * 3;
                let x = positions.getX(i);
                let y = positions.getY(i);
                let z = positions.getZ(i);

                // Current radius and angle
                const radius = Math.sqrt(x * x + z * z);
                let angle = Math.atan2(z, x);

                // Spiral inward
                const speed = particleData.speeds[i];
                angle += delta * speed;
                const newRadius = radius - delta * 0.5 * speed;

                // Reset particles that get too close to center
                if (newRadius < 1) {
                    const resetAngle = Math.random() * Math.PI * 2;
                    const resetRadius = 15 + Math.random() * 5;
                    x = Math.cos(resetAngle) * resetRadius;
                    z = Math.sin(resetAngle) * resetRadius;
                } else {
                    x = Math.cos(angle) * newRadius;
                    z = Math.sin(angle) * newRadius;
                }

                // Add some vertical wobble
                y = Math.sin(time * 2 + i * 0.01) * 0.3;

                positions.setXYZ(i, x, y, z);
            }

            positions.needsUpdate = true;
        }

        // Scale based on scroll - black hole gets bigger as you scroll into it
        const scale = 1 + scrollProgress * 2;
        groupRef.current.scale.setScalar(scale);
    });

    return (
        <group ref={groupRef} position={position} rotation={[Math.PI * 0.1, 0, 0]}>
            {/* Black hole core - event horizon */}
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Photon sphere glow */}
            <mesh>
                <sphereGeometry args={[1.8, 64, 64]} />
                <meshBasicMaterial
                    color="#ff6600"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Accretion disk */}
            <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2, 8, 128, 1]} />
                <meshStandardMaterial
                    color="#ff4400"
                    emissive="#ff4400"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Multiple glowing rings */}
            {[2.2, 3, 4, 5.5, 7].map((radius, i) => (
                <mesh
                    key={i}
                    ref={(el) => { if (el) ringRefs.current[i] = el; }}
                    rotation={[Math.PI / 2 + i * 0.05, 0, 0]}
                >
                    <torusGeometry args={[radius, 0.02 + i * 0.01, 16, 100]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? '#ff00ff' : '#00d4ff'}
                        emissive={i % 2 === 0 ? '#ff00ff' : '#00d4ff'}
                        emissiveIntensity={2}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}

            {/* Spiral particles */}
            <points ref={particlesRef} rotation={[Math.PI / 2, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particleData.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[particleData.colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    vertexColors
                    transparent
                    opacity={0.9}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Gravitational lensing effect - distortion rings */}
            <mesh>
                <torusGeometry args={[2, 0.3, 16, 100]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.1}
                />
            </mesh>

            {/* Inner glow */}
            <pointLight
                position={[0, 0, 0]}
                color="#ff6600"
                intensity={5}
                distance={20}
            />

            {/* Outer accent lights */}
            <pointLight position={[5, 2, 0]} color="#ff00ff" intensity={2} distance={15} />
            <pointLight position={[-5, -2, 0]} color="#00d4ff" intensity={2} distance={15} />
        </group>
    );
}
