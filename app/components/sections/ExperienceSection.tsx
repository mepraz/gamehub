'use client';

import GlassPanel from '../ui/GlassPanel';

interface ExperienceSectionProps {
    visible: boolean;
}

export default function ExperienceSection({ visible }: ExperienceSectionProps) {
    const stats = [
        { number: '4+', label: 'console Consoles' },
        { number: '100+', label: 'Game Titles' },
        { number: '8', label: 'Player Capacity' },
        { number: '24/7', label: 'Support' },
    ];

    return (
        <section className="section">
            <div
                className={`section-content transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="text-center mb-12">
                    <h2 className="heading-lg text-gradient mb-4">
                        The Experience
                    </h2>

                    <p className="text-body max-w-2xl mx-auto">
                        Immerse yourself in a premium gaming environment designed
                        for the ultimate PlayStation experience.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {stats.map((stat, i) => (
                        <GlassPanel
                            key={i}
                            className="text-center py-8"
                            glowColor={i % 2 === 0 ? 'pink' : 'blue'}
                        >
                            <div className="text-4xl font-black text-gradient mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Features */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            title: 'Premium Displays',
                            desc: 'Full HD gaming on quality monitors',
                            icon: '🖥️',
                        },
                        {
                            title: 'Pro Controllers',
                            desc: 'DualShock 4 with perfect response',
                            icon: '🎮',
                        },
                        {
                            title: 'Comfort First',
                            desc: 'Gaming chairs and AC environment',
                            icon: '🪑',
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="glass-light p-6 text-center hover:scale-105 transition-transform duration-300"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
