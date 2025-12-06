'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CursorPosition {
    x: number; // -1 to 1 normalized
    y: number; // -1 to 1 normalized
    rawX: number; // Actual pixel position
    rawY: number;
    velocityX: number;
    velocityY: number;
    isMoving: boolean;
}

export function useCursorPosition(): CursorPosition {
    const [cursor, setCursor] = useState<CursorPosition>({
        x: 0,
        y: 0,
        rawX: 0,
        rawY: 0,
        velocityX: 0,
        velocityY: 0,
        isMoving: false,
    });

    const lastPosition = useRef({ x: 0, y: 0, time: Date.now() });
    const moveTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const now = Date.now();
        const dt = (now - lastPosition.current.time) / 1000;

        const rawX = e.clientX;
        const rawY = e.clientY;

        // Normalize to -1 to 1
        const x = (rawX / window.innerWidth) * 2 - 1;
        const y = -((rawY / window.innerHeight) * 2 - 1); // Invert Y for Three.js coords

        // Calculate velocity
        const velocityX = dt > 0 ? (rawX - lastPosition.current.x) / dt : 0;
        const velocityY = dt > 0 ? (rawY - lastPosition.current.y) / dt : 0;

        lastPosition.current = { x: rawX, y: rawY, time: now };

        setCursor({
            x,
            y,
            rawX,
            rawY,
            velocityX,
            velocityY,
            isMoving: true,
        });

        // Clear existing timeout
        if (moveTimeout.current) {
            clearTimeout(moveTimeout.current);
        }

        // Set cursor as not moving after delay
        moveTimeout.current = setTimeout(() => {
            setCursor(prev => ({ ...prev, isMoving: false, velocityX: 0, velocityY: 0 }));
        }, 100);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (moveTimeout.current) {
                clearTimeout(moveTimeout.current);
            }
        };
    }, [handleMouseMove]);

    return cursor;
}
