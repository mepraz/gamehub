'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CONTROLLER_SETTINGS = {
    color: '#151515', // Midnight Black
    metalness: 0.73,
    roughness: 0.52,
    scale: 2.5,
};

// ✅ Base correction (180deg)
const BASE_Y_ROTATION = Math.PI;

const CAMERA_PHASES = [
    {
        cameraPos: new THREE.Vector3(0, 0.5, 4),
        lookAt: new THREE.Vector3(0, 0, 0),
        controllerRot: new THREE.Euler(0.2, 0, 0),
    },
    {
        cameraPos: new THREE.Vector3(-1.5, 0.3, 2),
        lookAt: new THREE.Vector3(-0.8, 0, 0),
        controllerRot: new THREE.Euler(0.1, 0.4, 0),
    },
    {
        cameraPos: new THREE.Vector3(1.5, 0.3, 2),
        lookAt: new THREE.Vector3(0.8, 0, 0),
        controllerRot: new THREE.Euler(0.1, -0.4, 0),
    },
    {
        cameraPos: new THREE.Vector3(0, -0.5, 2.5),
        lookAt: new THREE.Vector3(0, -0.3, 0),
        controllerRot: new THREE.Euler(-0.2, 0, 0),
    },
    {
        cameraPos: new THREE.Vector3(0, 2, 2),
        lookAt: new THREE.Vector3(0, 0.3, 0),
        controllerRot: new THREE.Euler(0.5, 0, 0),
    },
    // Phase 5: Hall of Shame (Tilted Side View)
    {
        cameraPos: new THREE.Vector3(-2.5, 0.5, 2.5),
        lookAt: new THREE.Vector3(0, 0, 0),
        controllerRot: new THREE.Euler(0.2, 0.8, -0.2),
    },
    // Phase 6: Dramatic final angle
    {
        cameraPos: new THREE.Vector3(2, 1, 3),
        lookAt: new THREE.Vector3(0, 0, 0),
        controllerRot: new THREE.Euler(0.1, -0.3, 0.05),
    },
];

interface ControllerModelProps {
    scrollProgress: number;
}

export default function ControllerModel({ scrollProgress }: ControllerModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const [isLoaded, setIsLoaded] = useState(false);

    const { scene } = useGLTF('/model/controller.glb');

    useEffect(() => {
        if (!scene || !groupRef.current || isLoaded) return;

        const clonedScene = scene.clone(true);

        // Center model
        const box = new THREE.Box3().setFromObject(clonedScene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        clonedScene.position.sub(center);

        clonedScene.traverse((child: any) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: CONTROLLER_SETTINGS.color,
                    metalness: CONTROLLER_SETTINGS.metalness,
                    roughness: CONTROLLER_SETTINGS.roughness,
                    side: THREE.DoubleSide,
                    envMapIntensity: 1.2,
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        groupRef.current.add(clonedScene);
        setIsLoaded(true);
    }, [scene, isLoaded]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        // Intro animation: Spin 360 degrees in the first 1.2 seconds
        const introDuration = 1.2;
        const introProgress = Math.min(time / introDuration, 1);
        const easeIntro = 1 - Math.pow(1 - introProgress, 3); // Cubic out
        const introRotation = (1 - easeIntro) * Math.PI * 2; // Start at 360, end at 0 offset

        const phaseProgress = scrollProgress * (CAMERA_PHASES.length - 1);
        const current = Math.floor(phaseProgress);
        const next = Math.min(current + 1, CAMERA_PHASES.length - 1);
        const t = phaseProgress - current;
        const easeT = t * t * (3 - 2 * t);

        const curr = CAMERA_PHASES[current];
        const nxt = CAMERA_PHASES[next];

        const camPos = new THREE.Vector3().lerpVectors(
            curr.cameraPos,
            nxt.cameraPos,
            easeT
        );
        const lookAt = new THREE.Vector3().lerpVectors(
            curr.lookAt,
            nxt.lookAt,
            easeT
        );

        camera.position.lerp(camPos, delta * 3);
        camera.lookAt(lookAt);

        const floatY = Math.sin(time * 0.5) * 0.02;
        const floatRot = Math.sin(time * 0.3) * 0.02;

        const targetX = THREE.MathUtils.lerp(curr.controllerRot.x, nxt.controllerRot.x, easeT);
        const targetY = THREE.MathUtils.lerp(curr.controllerRot.y, nxt.controllerRot.y, easeT);
        const targetZ = THREE.MathUtils.lerp(curr.controllerRot.z, nxt.controllerRot.z, easeT);

        // Apply rotation with intro spin added to Y
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetX + floatRot,
            delta * 4
        );

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            BASE_Y_ROTATION + targetY + introRotation,
            delta * 4
        );

        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            targetZ,
            delta * 4
        );

        groupRef.current.position.y = floatY;
    });

    return <group ref={groupRef} scale={CONTROLLER_SETTINGS.scale} />;
}

useGLTF.preload('/model/controller.glb');
