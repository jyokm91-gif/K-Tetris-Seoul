'use client'; // For MVP simplicity, we can make page client or dynamic import GameBoard. 
// Tech Lead suggested dynamic import.

import dynamic from 'next/dynamic';
import { useGameStore } from "@/store/useGameStore";
import { GameUI } from "@/components/ui/GameUI";

// Dynamically import GameBoard to avoid SSR issues with Canvas/Window
const GameBoard = dynamic(
  () => import('@/components/game/GameBoard').then((mod) => mod.GameBoard),
  {
    ssr: false,
    loading: () => <div className="w-[300px] h-[600px] flex items-center justify-center text-white">Loading Engine...</div>
  }
);

export default function Home() {
  const { score, level, lines } = useGameStore();

  return (
    <main>
      <GameUI score={score} level={level} lines={lines}>
        <GameBoard />
      </GameUI>
    </main>
  );
}
