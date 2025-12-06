'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor, Environment } from '@react-three/drei';
import * as THREE from 'three';

import Effects from './Effects';
import ControllerModel from './ControllerModel';
import { PERFORMANCE } from '../../utils/constants';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

import ErrorBoundary from '../utility/ErrorBoundary';

interface SceneContentProps {
    scrollProgress: number;
    performanceTier: 'high' | 'medium' | 'low';
}

function SceneContent({ scrollProgress, performanceTier }: SceneContentProps) {
    const enableEffects = performanceTier !== 'low';
    const bloomIntensity = PERFORMANCE.bloomIntensity[performanceTier];

    return (
        <>
            {/* Lighting for the controller */}
            <ambientLight intensity={0.4} />

            {/* Main key light */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.5}
                color="#ffffff"
                castShadow
            />

            {/* Neon accent lights */}
            <pointLight position={[-3, 2, 2]} color="#ff00ff" intensity={2} distance={10} />
            <pointLight position={[3, 2, 2]} color="#00d4ff" intensity={2} distance={10} />
            <pointLight position={[0, -2, 3]} color="#ff00ff" intensity={1} distance={8} />

            {/* Rim light from behind */}
            <directionalLight position={[0, 2, -5]} intensity={0.8} color="#ff66ff" />

            {/* Background Stars */}
            <Stars
                radius={100}
                depth={50}
                count={performanceTier === 'low' ? 1500 : 4000}
                factor={3}
                saturation={0}
                fade
                speed={0.3}
            />

            {/* The main controller with Error Boundary */}
            <ErrorBoundary fallback={
                <mesh scale={[2, 2, 2]}>
                    <boxGeometry />
                    <meshStandardMaterial color="#151515" wireframe />
                </mesh>
            }>
                <ControllerModel scrollProgress={scrollProgress} />
            </ErrorBoundary>

            {/* Environment for reflections */}
            <Environment preset="city" background={false} />

            {/* Post-processing effects */}
            <Effects bloomIntensity={bloomIntensity * 0.8} enableEffects={enableEffects} />
        </>
    );
}

interface SceneProps {
    scrollProgress: number;
}

export default function Scene({ scrollProgress }: SceneProps) {
    const [dpr, setDpr] = useState(1.5);
    const performance = useDevicePerformance();

    return (
        <div className="canvas-container">
            <Canvas
                dpr={dpr}
                shadows
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
                camera={{
                    fov: 50,
                    near: 0.1,
                    far: 100,
                    position: [0, 0.5, 4],
                }}
                style={{ background: 'linear-gradient(180deg, #020202 0%, #000000 100%)' }}
            >
                <Suspense fallback={null}>
                    <PerformanceMonitor
                        onDecline={() => setDpr(1)}
                        onIncline={() => setDpr(1.5)}
                    >
                        <AdaptiveDpr pixelated />
                        <AdaptiveEvents />
                        <SceneContent
                            scrollProgress={scrollProgress}
                            performanceTier={performance.tier}
                        />
                    </PerformanceMonitor>
                </Suspense>
            </Canvas>
        </div>
    );
}
