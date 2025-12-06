'use client';

import { useState, useEffect } from 'react';

type PerformanceTier = 'high' | 'medium' | 'low';

interface DevicePerformance {
    tier: PerformanceTier;
    isMobile: boolean;
    supportsWebGL2: boolean;
    gpuInfo: string | null;
}

export function useDevicePerformance(): DevicePerformance {
    const [performance, setPerformance] = useState<DevicePerformance>({
        tier: 'high',
        isMobile: false,
        supportsWebGL2: true,
        gpuInfo: null,
    });

    useEffect(() => {
        const detectPerformance = () => {
            // Check mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            // Check WebGL2 support
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2');
            const supportsWebGL2 = !!gl;

            // Get GPU info
            let gpuInfo: string | null = null;
            let tier: PerformanceTier = 'high';

            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

                    // Simple GPU tier detection
                    const gpuLower = gpuInfo?.toLowerCase() || '';
                    if (
                        gpuLower.includes('intel') ||
                        gpuLower.includes('mali') ||
                        gpuLower.includes('adreno 5') ||
                        gpuLower.includes('adreno 4')
                    ) {
                        tier = 'low';
                    } else if (
                        gpuLower.includes('adreno 6') ||
                        gpuLower.includes('gtx 10') ||
                        gpuLower.includes('gtx 9')
                    ) {
                        tier = 'medium';
                    }
                }
            }

            // Mobile devices generally lower tier
            if (isMobile && tier === 'high') {
                tier = 'medium';
            }

            // Check memory (if available)
            const nav = navigator as Navigator & { deviceMemory?: number };
            if (nav.deviceMemory && nav.deviceMemory < 4) {
                tier = 'low';
            }

            setPerformance({
                tier,
                isMobile,
                supportsWebGL2,
                gpuInfo,
            });
        };

        detectPerformance();
    }, []);

    return performance;
}
