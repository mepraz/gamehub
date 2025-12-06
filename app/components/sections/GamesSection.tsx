'use client';

import { GAMES } from '../../utils/constants';

interface GamesSectionProps {
    visible: boolean;
}

export default function GamesSection({ visible }: GamesSectionProps) {
    return (
        <section className="section">
            <div
                className={`section-content transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="text-center mb-12">
                    <h2 className="heading-lg text-gradient mb-4">
                        Our Games
                    </h2>
                    <p className="text-body max-w-2xl mx-auto">
                        Choose from our collection of the latest and greatest titles.
                        Every game optimized for the ultimate console experience.
                    </p>
                </div>

                {/* Hidden game list for screen readers and fallback */}
                <div className="sr-only">
                    {GAMES.map(game => (
                        <div key={game.id}>{game.name}</div>
                    ))}
                </div>

                {/* Decorative line */}
                <div className="hud-line w-full max-w-md mx-auto mt-8" />

                {/* Game tags */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {GAMES.map(game => (
                        <span
                            key={game.id}
                            className="glass-light px-4 py-2 text-sm font-medium"
                            style={{
                                borderColor: game.color,
                                boxShadow: `0 0 10px ${game.color}40`
                            }}
                        >
                            {game.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
