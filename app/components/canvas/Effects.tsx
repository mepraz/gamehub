'use client';

import { Bloom, EffectComposer, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

interface EffectsProps {
    bloomIntensity?: number;
    enableEffects?: boolean;
}

export default function Effects({ bloomIntensity = 1.5, enableEffects = true }: EffectsProps) {
    if (!enableEffects) return null;

    return (
        <EffectComposer>
            <Bloom
                intensity={bloomIntensity}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
            />
            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new Vector2(0.0005, 0.0005)}
            />
            <Vignette
                offset={0.3}
                darkness={0.5}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
}
