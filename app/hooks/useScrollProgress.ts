'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollProgress {
    progress: number;
    direction: 'up' | 'down' | null;
}

export function useScrollProgress(): ScrollProgress {
    const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
        progress: 0,
        direction: null,
    });

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        setScrollProgress(prev => ({
            progress,
            direction: progress > prev.progress ? 'down' : progress < prev.progress ? 'up' : null,
        }));
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return scrollProgress;
}
