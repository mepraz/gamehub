'use client';

import { SECTIONS } from '../../utils/constants';

interface ScrollProgressProps {
    progress: number;
    currentSection: number;
}

export default function ScrollProgress({ progress, currentSection }: ScrollProgressProps) {
    const scrollToProgress = (targetProgress: number) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = targetProgress * docHeight;
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
            {/* Progress bar track */}
            <div className="relative w-1 h-40 md:h-48 bg-white/10 rounded-full overflow-hidden">
                {/* Progress fill */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#ff00ff] to-[#00d4ff] rounded-full transition-all duration-300"
                    style={{ height: `${progress * 100}%` }}
                />

                {/* Section markers on the bar */}
                {SECTIONS.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToProgress(section.progress)}
                        className="absolute left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white/30 hover:bg-white/60 transition-colors"
                        style={{ bottom: `${section.progress * 100}%` }}
                        title={section.name}
                    />
                ))}
            </div>

            {/* Section dots */}
            <div className="flex flex-col gap-2">
                {SECTIONS.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToProgress(section.progress)}
                        className={`relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSection === index
                                ? 'bg-[#ff00ff] shadow-[0_0_10px_#ff00ff] scale-125'
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                        title={section.name}
                    >
                        {/* Tooltip on hover */}
                        <span
                            className={`absolute right-6 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap transition-all duration-300 pointer-events-none ${currentSection === index
                                    ? 'opacity-100 text-white'
                                    : 'opacity-0'
                                }`}
                        >
                            {section.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-4 flex flex-col items-center gap-2">
                <div className="w-0.5 h-6 md:h-8 bg-gradient-to-b from-[#00d4ff] to-transparent animate-pulse" />
            </div>
        </div>
    );
}
