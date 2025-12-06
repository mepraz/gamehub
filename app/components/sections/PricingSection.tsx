'use client';

import GlassPanel from '../ui/GlassPanel';

interface PricingSectionProps {
    visible: boolean;
}

export default function PricingSection({ visible }: PricingSectionProps) {
    return (
        <section className="section">
            <div
                className={`section-content text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <h2 className="heading-lg text-gradient mb-4">
                    Simple Pricing
                </h2>

                <p className="text-body max-w-xl mx-auto mb-12">
                    No hidden fees. No subscriptions. Just pure gaming.
                </p>

                <GlassPanel className="max-w-lg mx-auto" glowColor="both">
                    <div className="text-center">
                        <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-6xl font-black text-neon-blue">Rs. 200</span>
                            <span className="text-2xl text-gray-400">/ hour</span>
                        </div>

                        <div className="hud-line my-6" />

                        <ul className="space-y-3 text-left mb-6">
                            {[
                                'Full access to all games',
                                'Premium gaming setup',
                                'Air-conditioned environment',
                                'High-speed internet',
                                'Multiplayer setups available',
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-body">
                                    <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="btn-neon w-full">
                            Book Now
                        </button>
                    </div>
                </GlassPanel>
            </div>
        </section>
    );
}
