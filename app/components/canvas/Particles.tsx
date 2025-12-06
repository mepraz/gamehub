'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorPosition } from '../../hooks/useCursorPosition';

interface ParticlesProps {
    count?: number;
    scrollProgress?: number;
}

export default function Particles({ count = 3000, scrollProgress = 0 }: ParticlesProps) {
    const points = useRef<THREE.Points>(null);
    const cursor = useCursorPosition();

    // Generate particle positions
    const { positions, colors, sizes, originalPositions } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const originalPositions = new Float32Array(count * 3);

        const colorPink = new THREE.Color('#ff00ff');
        const colorBlue = new THREE.Color('#00d4ff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spread particles across all sections (Z: 0 to -120)
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 30;
            const z = Math.random() * -120;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;

            // Gradient color based on position
            const t = Math.random();
            const color = colorPink.clone().lerp(colorBlue, t);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 3 + 0.5;
        }

        return { positions, colors, sizes, originalPositions };
    }, [count]);

    useFrame((state, delta) => {
        if (!points.current) return;

        const time = state.clock.elapsedTime;
        const geometry = points.current.geometry;
        const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;

        // Cursor influence radius
        const cursorInfluence = 5;
        const cursorStrength = 0.5;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Original position
            let x = originalPositions[i3];
            let y = originalPositions[i3 + 1];
            let z = originalPositions[i3 + 2];

            // Add floating motion
            x += Math.sin(time * 0.3 + i * 0.01) * 0.5;
            y += Math.cos(time * 0.2 + i * 0.02) * 0.5;
            z += Math.sin(time * 0.1 + i * 0.005) * 0.3;

            // Camera Z position based on scroll
            const cameraZ = -scrollProgress * 100;

            // Calculate distance to cursor (in screen space approximation)
            const screenX = cursor.x * 20;
            const screenY = cursor.y * 15;

            const dx = screenX - x;
            const dy = screenY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Magnetic pull toward cursor
            if (dist < cursorInfluence && cursor.isMoving) {
                const force = (1 - dist / cursorInfluence) * cursorStrength;
                x += dx * force * 0.1;
                y += dy * force * 0.1;
            }

            // Update position
            positionAttr.setXYZ(i, x, y, z);
        }

        positionAttr.needsUpdate = true;

        // Slow rotation
        points.current.rotation.y = time * 0.02;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
