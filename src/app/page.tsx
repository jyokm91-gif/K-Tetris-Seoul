'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from "@/store/useGameStore";
import { GameUI } from "@/components/ui/GameUI";
import { MobileControls } from "@/components/ui/MobileControls";
import { useRef, useCallback } from 'react';

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

  return (
    <main>
      <GameUI score={score} level={level} lines={lines}>
        <GameBoard />
      </GameUI>
      <MobileControls
        onMove={handleMove}
        onRotate={handleRotate}
        onHardDrop={handleHardDrop}
      />
    </main>
  );
}
