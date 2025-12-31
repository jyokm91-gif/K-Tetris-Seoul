import React from 'react';
import { Leaderboard, LeaderboardEntry } from './Leaderboard';

interface GameUIProps {
    children: React.ReactNode;
    score: number;
    level: number;
    lines: number;
    leaderboardEntries?: LeaderboardEntry[];
}

export function GameUI({ children, score, level, lines, leaderboardEntries = [] }: GameUIProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-start md:items-center p-2 md:p-4 pt-2 pb-44 md:pb-4 overflow-x-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0 bg-gwanghwamun-night bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 z-0 bg-black/40" />

            {/* Main Game Container - Hanok Style */}
            <div className="z-10 flex flex-col items-center gap-3 md:gap-6 lg:flex-row lg:items-start w-full max-w-screen-xl mt-2 md:mt-0">

                {/* Left Column - Leaderboard (Desktop) */}
                <div className="hidden lg:flex flex-col gap-4 w-80">
                    <Leaderboard entries={leaderboardEntries} currentScore={score} />
                </div>

                {/* Center - Game Board */}
                <div className="hanok-frame relative p-1 bg-black/80 w-full md:w-auto flex flex-col items-center">
                    {/* Dancheong Pattern Border */}
                    <div className="absolute inset-0 border-4 border-transparent bg-dancheong_pattern opacity-30 pointer-events-none" style={{ backgroundSize: '24px' }} />

                    {/* The Canvas */}
                    <div className="relative border-2 border-obangsaek-cheong/50 bg-black mx-auto">
                        {children}
                    </div>

                    {/* Decorative Text */}
                    <div className="mt-2 text-center text-xs text-obangsaek-baek/50 font-serif tracking-widest">
                        SEOUL TETRIS
                    </div>
                </div>

                {/* Right Column - Score & Info */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    {/* Mobile: Horizontal Score Bar */}
                    <div className="md:hidden grid grid-cols-3 gap-2">
                        <div className="hanok-frame bg-black/60 p-3 text-obangsaek-baek text-center">
                            <h2 className="text-xs text-gray-400">SCORE</h2>
                            <p className="font-mono text-lg font-bold text-obangsaek-hwang">{score.toLocaleString()}</p>
                        </div>
                        <div className="hanok-frame bg-black/60 p-3 text-obangsaek-baek text-center">
                            <h2 className="text-xs text-gray-400">LEVEL</h2>
                            <p className="font-mono text-lg font-bold text-obangsaek-cheong">{level}</p>
                        </div>
                        <div className="hanok-frame bg-black/60 p-3 text-obangsaek-baek text-center">
                            <h2 className="text-xs text-gray-400">LINES</h2>
                            <p className="font-mono text-lg font-bold">{lines}</p>
                        </div>
                    </div>

                    {/* Desktop: Vertical Score Panel */}
                    <div className="hidden md:block hanok-frame min-w-[200px] bg-black/60 p-6 text-obangsaek-baek">
                        <div className="mb-6">
                            <h2 className="mb-1 text-sm text-gray-400">SCORE</h2>
                            <p className="font-mono text-3xl font-bold text-neon text-obangsaek-hwang">{score.toLocaleString()}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="mb-1 text-sm text-gray-400">LEVEL</h2>
                            <p className="font-mono text-2xl font-bold text-obangsaek-cheong">{level}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="mb-1 text-sm text-gray-400">LINES</h2>
                            <p className="font-mono text-2xl font-bold">{lines}</p>
                        </div>

                        <div className="mt-8 border-t border-gray-700 pt-4">
                            <p className="text-xs text-gray-500">NEXT</p>
                            <div className="h-24 w-full bg-black/30 mt-2 rounded">
                                {/* Next Pieces Render Here */}
                            </div>
                        </div>
                    </div>

                    {/* Controls Info - Desktop Only */}
                    <div className="hidden md:block rounded bg-black/40 p-4 text-xs text-gray-300 backdrop-blur-sm">
                        <p>↑ : Rotate</p>
                        <p>← → : Move</p>
                        <p>↓ : Soft Drop</p>
                        <p>Space : Hard Drop</p>
                    </div>
                </div>
            </div>

            {/* Mobile Leaderboard - Bottom */}
            <div className="lg:hidden w-full max-w-md mt-6 z-10">
                <Leaderboard entries={leaderboardEntries} currentScore={score} />
            </div>
        </div>
    );
}
