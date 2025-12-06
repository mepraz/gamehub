'use client';

import Link from 'next/link';
import { useState } from 'react';

// Dummy data for the leaderboard
const LEADERBOARD_DATA = [
    { id: 1, game: 'FC 26', winner: 'Prashant', loser: 'Ram', score: '3 - 0', date: '2024-02-28', quote: 'Easy win.' },
    { id: 2, game: 'WWE 2K25', winner: 'Aayush', loser: 'Sujan', score: 'Pinfall', date: '2024-02-28', quote: 'You cant see me!' },
    { id: 3, game: 'Tekken 8', winner: 'Rohan', loser: 'Bibek', score: 'KO', date: '2024-02-27', quote: 'Perfect KO.' },
    { id: 4, game: 'Mortal Kombat 1', winner: 'Sabin', loser: 'Niraj', score: 'Fatality', date: '2024-02-26', quote: 'Flawless Victory.' },
    { id: 5, game: 'FC 26', winner: 'Kiran', loser: 'Amit', score: '5 - 1', date: '2024-02-25', quote: 'Total domination.' },
    { id: 6, game: 'GTA V', winner: 'Team A', loser: 'Team B', score: 'Heist', date: '2024-02-24', quote: 'Money in the bag.' },
    { id: 7, game: 'UFC 5', winner: 'Dipesh', loser: 'Rabin', score: 'Sub', date: '2024-02-23', quote: 'Tap out.' },
    { id: 8, game: 'NBA 2K25', winner: 'Sanjay', loser: 'Bikash', score: '80 - 65', date: '2024-02-22', quote: 'Dunked on.' },
];

export default function LeaderboardPage() {
    const [filter, setFilter] = useState('All');

    const filteredData = filter === 'All'
        ? LEADERBOARD_DATA
        : LEADERBOARD_DATA.filter(item => item.game === filter);

    const uniqueGames = ['All', ...Array.from(new Set(LEADERBOARD_DATA.map(item => item.game)))];

    return (
        <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">

            {/* Navbar Placeholder */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff00ff] to-[#00d4ff] p-0.5 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                            <span className="text-white font-black">MT</span>
                        </div>
                    </div>
                    <span className="font-bold tracking-wider group-hover:text-[#00d4ff] transition-colors">GAMEHUB</span>
                </Link>
                <Link href="/" className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all">
                    Back to Home
                </Link>
            </nav>

            <div className="container mx-auto px-4 pt-32 pb-20">

                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[#ff00ff]/5 blur-[100px] rounded-full -z-10" />
                    <h1 className="text-5xl md:text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-white to-[#00d4ff] animate-pulse">
                        HALL OF SHAME
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        The digital graveyard of defeats. Where winners gloat and losers are immortalized forever.
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-[#ff00ff]/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#ff00ff]/20 flex items-center justify-center text-2xl mb-4">
                            😈
                        </div>
                        <h3 className="text-2xl font-bold mb-2">What is this?</h3>
                        <p className="text-gray-400">
                            A permanent record of your most epic victories. Did you destroy your friend 5-0 in FC 24?
                            Put it on the board so they never forget.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-[#00d4ff]/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-2xl mb-4">
                            📝
                        </div>
                        <h3 className="text-2xl font-bold mb-2">How to Join?</h3>
                        <p className="text-gray-400">
                            Just <span className="text-white font-bold">Rs. 100</span> per entry.
                            Ask the counter staff to add your match result.
                            Includes permanent bragging rights.
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {uniqueGames.map(game => (
                        <button
                            key={game}
                            onClick={() => setFilter(game)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${filter === game
                                    ? 'bg-[#00d4ff] text-black scale-105'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {game}
                        </button>
                    ))}
                </div>

                {/* Leaderboard List */}
                <div className="grid gap-4 max-w-4xl mx-auto">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 overflow-hidden hover:border-[#ff00ff]/50 transition-all hover:transform hover:scale-[1.01]"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/10 via-transparent to-[#00d4ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                                {/* Game & Date */}
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold text-gray-500 group-hover:text-white transition-colors">
                                        {item.id}
                                    </div>
                                    <div>
                                        <span className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest block mb-1">
                                            {item.game}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Matchup */}
                                <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
                                    <div className="text-right">
                                        <p className="text-xl md:text-2xl font-black text-white group-hover:text-[#ff00ff] transition-colors">
                                            {item.winner}
                                        </p>
                                        <p className="text-xs text-green-400 uppercase tracking-wider font-bold">Winner</p>
                                    </div>

                                    <div className="text-2xl font-black text-gray-700 italic">VS</div>

                                    <div className="text-left">
                                        <p className="text-xl md:text-2xl font-bold text-gray-400 line-through decoration-red-500/50 decoration-2">
                                            {item.loser}
                                        </p>
                                        <p className="text-xs text-red-500 uppercase tracking-wider font-bold">Loser</p>
                                    </div>
                                </div>

                                {/* Score & Quote */}
                                <div className="text-center md:text-right w-full md:w-auto">
                                    <p className="text-3xl font-black text-white italic mb-1">
                                        {item.score}
                                    </p>
                                    <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-20">
                    <p className="text-gray-500 mb-4">Want to immortalize your victory?</p>
                    <button className="px-8 py-4 bg-gradient-to-r from-[#ff00ff] to-[#00d4ff] rounded-xl font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,0,255,0.3)]">
                        Visit Counter • Rs. 100
                    </button>
                </div>

            </div>
        </div>
    );
}
