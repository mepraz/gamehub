'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Stats, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Color presets for the controller - console/Xbox inspired
const COLOR_PRESETS = [
    { name: 'Midnight Black', primary: '#1a1a1a', accent: '#3a3a3a' },
    { name: 'Glacier White', primary: '#f0f0f0', accent: '#d0d0d0' },
    { name: 'Neon Pink', primary: '#ff00ff', accent: '#ff66ff' },
    { name: 'Electric Blue', primary: '#00d4ff', accent: '#0099cc' },
    { name: 'Starlight Blue', primary: '#1e3a5f', accent: '#2a4a6f' },
    { name: 'Cosmic Red', primary: '#c41e3a', accent: '#e63950' },
    { name: 'Nova Pink', primary: '#ff1493', accent: '#ff69b4' },
    { name: 'Galactic Purple', primary: '#6b3fa0', accent: '#8b5fc0' },
    { name: 'Sunset Orange', primary: '#ff6600', accent: '#ff9933' },
    { name: 'Lime Green', primary: '#32cd32', accent: '#90ee90' },
];

function ControllerModel({
    scale,
    modelPath,
    primaryColor,
    accentColor,
    metalness,
    roughness,
}: {
    scale: number;
    modelPath: string;
    primaryColor: string;
    accentColor: string;
    metalness: number;
    roughness: number;
}) {
    const [modelInfo, setModelInfo] = useState<string>('Loading...');
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    const { scene } = useGLTF(modelPath);

    useEffect(() => {
        if (scene && groupRef.current) {
            // Clone the scene
            const clonedScene = scene.clone(true);

            // Reset transforms
            clonedScene.position.set(0, 0, 0);
            clonedScene.rotation.set(0, 0, 0);
            clonedScene.scale.set(1, 1, 1);

            // Calculate bounds
            const box = new THREE.Box3().setFromObject(clonedScene);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            setModelInfo(`${size.x.toFixed(0)} x ${size.y.toFixed(0)} x ${size.z.toFixed(0)}`);

            // Center the model
            clonedScene.position.sub(center);

            // Apply custom materials with the selected colors
            clonedScene.traverse((child: any) => {
                if (child.isMesh) {
                    // Create new material with custom color
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(primaryColor),
                        metalness: metalness,
                        roughness: roughness,
                        side: THREE.DoubleSide,
                        envMapIntensity: 1,
                    });

                    child.material = newMaterial;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Update group
            groupRef.current.clear();
            groupRef.current.add(clonedScene);

            // Adjust camera
            const maxDim = Math.max(size.x, size.y, size.z) * scale;
            if (maxDim > 0) {
                camera.position.set(maxDim * 1.5, maxDim, maxDim * 1.5);
                camera.lookAt(0, 0, 0);
            }
        }
    }, [scene, scale, camera, primaryColor, metalness, roughness]);

    return (
        <>
            <group ref={groupRef} scale={[scale, scale, scale]} />

            <Html position={[0, 2.5, 0]} center>
                <div className="bg-black/80 text-white p-2 rounded text-xs">
                    ✓ Loaded | Size: {modelInfo}
                </div>
            </Html>
        </>
    );
}

function LoadingFallback() {
    return (
        <Html center>
            <div className="bg-blue-500 text-white p-4 rounded-lg animate-pulse">
                Loading...
            </div>
        </Html>
    );
}

export default function Test3D() {
    const [scale, setScale] = useState(0.01);
    const [modelPath, setModelPath] = useState('/model/scene.gltf');
    const [key, setKey] = useState(0);
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [customColor, setCustomColor] = useState('#ff00ff');
    const [useCustom, setUseCustom] = useState(false);
    const [metalness, setMetalness] = useState(0.3);
    const [roughness, setRoughness] = useState(0.4);

    const activeColor = useCustom ? customColor : COLOR_PRESETS[selectedPreset].primary;
    const accentColor = useCustom ? customColor : COLOR_PRESETS[selectedPreset].accent;

    const handleModelChange = (path: string, defaultScale: number) => {
        setModelPath(path);
        setScale(defaultScale);
        setKey(prev => prev + 1);
    };

    return (
        <div className="w-screen h-screen bg-gray-900">
            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 text-white bg-black/90 p-4 rounded-lg w-72 max-h-[90vh] overflow-y-auto">
                <h1 className="text-xl font-bold mb-4">3D Controller Test</h1>

                {/* Model Selection */}
                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-2">Model:</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleModelChange('/model/controller.glb', 1)}
                            className={`flex-1 px-2 py-2 rounded text-xs ${modelPath === '/model/controller.glb' ? 'bg-blue-600' : 'bg-gray-700'}`}
                        >
                            controller.glb
                        </button>
                        <button
                            onClick={() => handleModelChange('/model/scene.gltf', 0.01)}
                            className={`flex-1 px-2 py-2 rounded text-xs ${modelPath === '/model/scene.gltf' ? 'bg-blue-600' : 'bg-gray-700'}`}
                        >
                            scene.gltf
                        </button>
                    </div>
                </div>

                {/* Color Presets */}
                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-2">Color Preset:</label>
                    <div className="grid grid-cols-5 gap-1">
                        {COLOR_PRESETS.map((preset, i) => (
                            <button
                                key={i}
                                onClick={() => { setSelectedPreset(i); setUseCustom(false); setKey(k => k + 1); }}
                                className={`w-full aspect-square rounded-lg border-2 transition-all ${!useCustom && selectedPreset === i ? 'border-white scale-110' : 'border-transparent'
                                    }`}
                                style={{ background: preset.primary }}
                                title={preset.name}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {useCustom ? 'Custom color' : COLOR_PRESETS[selectedPreset].name}
                    </p>
                </div>

                {/* Custom Color */}
                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-2">Custom Color:</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={customColor}
                            onChange={(e) => { setCustomColor(e.target.value); setUseCustom(true); setKey(k => k + 1); }}
                            className="w-12 h-8 rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={customColor}
                            onChange={(e) => { setCustomColor(e.target.value); setUseCustom(true); setKey(k => k + 1); }}
                            className="flex-1 bg-gray-800 px-2 py-1 rounded text-sm"
                        />
                    </div>
                </div>

                {/* Material Properties */}
                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-1">Metalness: {metalness.toFixed(2)}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={metalness}
                        onChange={(e) => { setMetalness(parseFloat(e.target.value)); setKey(k => k + 1); }}
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-1">Roughness: {roughness.toFixed(2)}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={roughness}
                        onChange={(e) => { setRoughness(parseFloat(e.target.value)); setKey(k => k + 1); }}
                        className="w-full"
                    />
                </div>

                {/* Scale */}
                <div className="mb-4">
                    <label className="text-sm text-gray-400 block mb-1">Scale: {scale.toFixed(3)}x</label>
                    <input
                        type="range"
                        min="0.001"
                        max="1"
                        step="0.001"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {[0.005, 0.01, 0.02, 0.05, 0.1, 1].map(s => (
                            <button
                                key={s}
                                onClick={() => { setScale(s); setKey(k => k + 1); }}
                                className={`px-2 py-1 rounded text-xs ${Math.abs(scale - s) < 0.001 ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Canvas
                key={key}
                shadows
                camera={{ position: [3, 2, 3], fov: 50 }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={['#0a0a15']} />

                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={1} color="#ff00ff" />
                <directionalLight position={[5, 5, -5]} intensity={1} color="#00d4ff" />
                <hemisphereLight args={['#ffffff', '#333333', 0.5]} />

                <Suspense fallback={<LoadingFallback />}>
                    <ControllerModel
                        scale={scale}
                        modelPath={modelPath}
                        primaryColor={activeColor}
                        accentColor={accentColor}
                        metalness={metalness}
                        roughness={roughness}
                    />
                </Suspense>

                <Environment preset="city" background={false} />
                <Grid position={[0, -1.5, 0]} args={[20, 20]} cellColor="#333" sectionColor="#555" infiniteGrid />
                <OrbitControls enableDamping target={[0, 0, 0]} />
                <Stats />
            </Canvas>

            <div className="absolute bottom-4 right-4 z-10 text-white bg-black/80 p-3 rounded-lg text-xs">
                <p>🎮 Drag to rotate | Scroll to zoom</p>
            </div>
        </div>
    );
}

useGLTF.preload('/model/controller.glb');
useGLTF.preload('/model/scene.gltf');
