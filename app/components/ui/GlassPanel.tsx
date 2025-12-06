'use client';

import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    glowColor?: 'pink' | 'blue' | 'both';
}

export default function GlassPanel({
    children,
    className = '',
    glowColor = 'both'
}: GlassPanelProps) {
    const glowStyles = {
        pink: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]',
        blue: 'shadow-[0_0_30px_rgba(0,212,255,0.3)]',
        both: 'shadow-[0_0_30px_rgba(255,0,255,0.2),0_0_60px_rgba(0,212,255,0.2)]',
    };

    return (
        <div
            className={`
        glass 
        ${glowStyles[glowColor]}
        p-6
        ${className}
      `}
        >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff00ff]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff00ff]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff]" />

            {children}
        </div>
    );
}
