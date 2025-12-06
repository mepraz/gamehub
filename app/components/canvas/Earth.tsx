'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
    position?: [number, number, number];
    scrollProgress: number;
    visible: boolean;
}

export default function Earth({ position = [0, 0, 0], scrollProgress, visible }: EarthProps) {
    const groupRef = useRef<THREE.Group>(null);
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Generate continent-like patches on the sphere
    const landPatches = useMemo(() => {
        const patches: { lat: number; lon: number; size: number }[] = [];

        // Approximate landmass positions
        // Asia (with Nepal highlighted area)
        patches.push({ lat: 28, lon: 84, size: 0.15 }); // Nepal area
        patches.push({ lat: 35, lon: 105, size: 0.4 });  // China
        patches.push({ lat: 20, lon: 78, size: 0.35 });  // India
        patches.push({ lat: 55, lon: 60, size: 0.3 });   // Russia

        // Other continents  
        patches.push({ lat: 40, lon: -100, size: 0.4 }); // North America
        patches.push({ lat: -15, lon: -55, size: 0.35 }); // South America
        patches.push({ lat: 50, lon: 10, size: 0.25 });  // Europe
        patches.push({ lat: 0, lon: 20, size: 0.4 });    // Africa
        patches.push({ lat: -25, lon: 135, size: 0.3 }); // Australia

        return patches;
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;

        // Slow rotation
        if (earthRef.current) {
            earthRef.current.rotation.y = time * 0.05;
        }

        // Clouds rotate slightly faster
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = time * 0.07;
        }

        // Atmosphere glow pulse
        if (atmosphereRef.current) {
            const material = atmosphereRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1;
        }

        // Scale based on scroll progress (0.2-0.4 range shows Earth emerging)
        // Beyond 0.4, start zooming into Earth toward Nepal
        const earthPhase = (scrollProgress - 0.2) / 0.2; // 0-1 during Earth reveal
        const scale = visible ? Math.min(earthPhase * 5, 5) : 0;
        groupRef.current.scale.setScalar(Math.max(0.1, scale));

        // Fade in
        groupRef.current.visible = visible;
    });

    if (!visible) return null;

    return (
        <group ref={groupRef} position={position}>
            {/* Ocean base */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="#0066aa"
                    metalness={0.3}
                    roughness={0.7}
                />
            </mesh>

            {/* Land masses - simplified representation */}
            <mesh rotation={[0, 0, 0]}>
                <sphereGeometry args={[2.01, 64, 64]} />
                <meshStandardMaterial
                    color="#228B22"
                    metalness={0.2}
                    roughness={0.8}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Nepal highlight - glowing marker */}
            <group rotation={[0, -Math.PI * 0.47, 0]}>
                <group rotation={[Math.PI * 0.16, 0, 0]}>
                    <mesh position={[0, 0, 2.1]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#ff00ff"
                            emissive="#ff00ff"
                            emissiveIntensity={3}
                        />
                    </mesh>
                    {/* Pulse ring around Nepal */}
                    <mesh position={[0, 0, 2.05]} rotation={[0, 0, 0]}>
                        <ringGeometry args={[0.1, 0.15, 32]} />
                        <meshStandardMaterial
                            color="#ff00ff"
                            emissive="#ff00ff"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.8}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </group>
            </group>

            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[2.05, 64, 64]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                />
            </mesh>

            {/* Atmosphere glow */}
            <mesh ref={atmosphereRef}>
                <sphereGeometry args={[2.3, 64, 64]} />
                <meshBasicMaterial
                    color="#00aaff"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Outer atmosphere */}
            <mesh>
                <sphereGeometry args={[2.6, 64, 64]} />
                <meshBasicMaterial
                    color="#0088ff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Sunlight */}
            <directionalLight
                position={[10, 5, 10]}
                intensity={2}
                color="#ffffff"
            />
        </group>
    );
}
