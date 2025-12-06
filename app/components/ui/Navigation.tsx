'use client';

import { SECTIONS } from '../../utils/constants';

interface NavigationProps {
    currentSection: number;
}

export default function Navigation({ currentSection }: NavigationProps) {
    const scrollToProgress = (targetProgress: number) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = targetProgress * docHeight;
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth',
        });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <button
                    onClick={() => scrollToProgress(0)}
                    className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff00ff] to-[#00d4ff] flex items-center justify-center relative overflow-hidden">
                        <span className="text-white font-bold text-lg relative z-10">MT</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff] to-[#00d4ff] animate-pulse opacity-50" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-wider hidden sm:block">
                        GAMEHUB
                    </span>
                </button>

                {/* Navigation Links */}
                <div className="glass px-4 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-6">
                    {SECTIONS.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToProgress(section.progress)}
                            className={`relative text-xs md:text-sm font-medium uppercase tracking-wider md:tracking-widest transition-all duration-300 ${currentSection === index
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <span className="hidden md:inline">{section.name}</span>
                            <span className="md:hidden">{section.name.slice(0, 3)}</span>

                            {/* Active indicator */}
                            {currentSection === index && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff00ff] to-[#00d4ff]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Status indicator */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Online</span>
                    </div>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent opacity-40" />
        </nav>
    );
}
