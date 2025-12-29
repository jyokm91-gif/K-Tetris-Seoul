import React from 'react';

interface GameUIProps {
    children: React.ReactNode;
    score: number;
    level: number;
    lines: number;
}

export function GameUI({ children, score, level, lines }: GameUIProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
            {/* Background with overlay - Gwanghwamun Night */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80" style={{ background: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)' }} />
            <div className="absolute inset-0 z-0 bg-black/40" />

            {/* Main Game Container - Hanok Style */}
            <div className="z-10 flex flex-col items-center gap-6 md:flex-row md:items-start">

                {/* Left Column (Hold/Status - Optional for MVP, placeholder) */}
                <div className="hidden flex-col gap-4 md:flex">
                    <div className="hanok-frame h-32 w-32 bg-black/60 p-4">
                        <h3 className="mb-2 text-center font-bold text-obangsaek-baek text-shadow-neon">HOLD</h3>
                        {/* Hold Piece Render Here */}
                    </div>
                </div>

                {/* Center - Game Board */}
                <div className="hanok-frame relative p-1 bg-black/80">
                    {/* Dancheong Pattern Border */}
                    <div className="absolute inset-0 border-4 border-transparent bg-dancheong_pattern opacity-30 pointer-events-none" style={{ backgroundSize: '24px' }} />

                    {/* The Canvas */}
                    <div className="relative border-2 border-obangsaek-cheong/50 bg-black">
                        {children}
                    </div>

                    {/* Decorative Text */}
                    <div className="mt-2 text-center text-xs text-obangsaek-baek/50 font-serif tracking-widest">
                        SEOUL TETRIS
                    </div>
                </div>

                {/* Right Column - Score & Info */}
                <div className="flex flex-col gap-4">
                    <div className="hanok-frame min-w-[200px] bg-black/60 p-6 text-obangsaek-baek">
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

                    {/* Controls Info */}
                    <div className="rounded bg-black/40 p-4 text-xs text-gray-300 backdrop-blur-sm">
                        <p>↑ : Rotate</p>
                        <p>← → : Move</p>
                        <p>↓ : Soft Drop</p>
                        <p>Space : Hard Drop</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
