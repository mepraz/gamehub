'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setVisible(false);
                        setTimeout(onComplete, 500);
                    }, 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    if (!visible) {
        return (
            <div className="loading-screen opacity-0 transition-opacity duration-500 pointer-events-none" />
        );
    }

    return (
        <div className="loading-screen">
            {/* Animated background grid */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255, 0, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                        animation: 'grid-scroll 20s linear infinite',
                    }}
                />
            </div>

            {/* Logo */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative">
                    <h1 className="heading-xl text-gradient">MT</h1>
                    <p className="heading-md text-white text-center mt-2">GAMEHUB</p>

                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-[#ff00ff] to-[#00d4ff]" />
                </div>

                {/* Loading bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#ff00ff] to-[#00d4ff] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {/* Loading text */}
                <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest">
                    {progress < 100 ? 'Entering the lobby...' : 'Welcome'}
                </p>

                {/* Percentage */}
                <p className="mt-2 text-2xl font-bold text-neon-blue">
                    {Math.min(Math.round(progress), 100)}%
                </p>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#ff00ff]" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#ff00ff]" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#00d4ff]" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#00d4ff]" />

            <style jsx>{`
        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
        </div>
    );
}
