'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from "@/store/useGameStore";
import { GameUI } from "@/components/ui/GameUI";
import { MobileControls } from "@/components/ui/MobileControls";
import { GameOverModal } from "@/components/ui/GameOverModal";
import { LeaderboardEntry } from "@/components/ui/Leaderboard";
import { getLeaderboard, addLeaderboardEntry } from "@/lib/leaderboard";
import { useRef, useCallback, useState, useEffect } from 'react';

// Dynamically import GameBoard to avoid SSR issues with Canvas/Window
const GameBoard = dynamic(
  () => import('@/components/game/GameBoard').then((mod) => mod.GameBoard),
  {
    ssr: false,
    loading: () => <div className="w-[300px] h-[600px] flex items-center justify-center text-white">Loading Engine...</div>
  }
);

export default function Home() {
  const { score, level, lines, status, actions } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const gameResetKeyRef = useRef(0);

  // Load leaderboard on mount
  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  // Show game over modal when status changes to GAME_OVER
  useEffect(() => {
    if (status === 'GAME_OVER') {
      setShowGameOver(true);
    }
  }, [status]);

  // Handle mobile controls by dispatching keyboard events
  const handleMove = useCallback((direction: 'left' | 'right' | 'down') => {
    const keyMap = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      down: 'ArrowDown',
    };

    const event = new KeyboardEvent('keydown', {
      key: keyMap[direction],
      code: keyMap[direction],
      bubbles: true,
    });

    window.dispatchEvent(event);
  }, []);

  const handleRotate = useCallback(() => {
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      code: 'ArrowUp',
      bubbles: true,
    });

    window.dispatchEvent(event);
  }, []);

  const handleHardDrop = useCallback(() => {
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      bubbles: true,
    });

    window.dispatchEvent(event);
  }, []);

  const handleSubmitScore = useCallback((nickname: string) => {
    const newLeaderboard = addLeaderboardEntry({
      nickname,
      score,
      level,
      lines,
    });
    setLeaderboard(newLeaderboard);
  }, [score, level, lines]);

  const handleRestart = useCallback(() => {
    setShowGameOver(false);
    actions.resetGame();
    // Force GameBoard to remount by changing key
    gameResetKeyRef.current += 1;
    window.location.reload(); // Simple restart for now
  }, [actions]);

  return (
    <main>
      <GameUI
        score={score}
        level={level}
        lines={lines}
        leaderboardEntries={leaderboard}
      >
        <GameBoard key={gameResetKeyRef.current} />
      </GameUI>
      <MobileControls
        onMove={handleMove}
        onRotate={handleRotate}
        onHardDrop={handleHardDrop}
      />
      <GameOverModal
        isOpen={showGameOver}
        score={score}
        level={level}
        lines={lines}
        onSubmit={handleSubmitScore}
        onRestart={handleRestart}
      />
    </main>
  );
}
