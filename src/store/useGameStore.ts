import { create } from 'zustand';
import { Tetromino, TetrominoType } from '@/lib/game/types';

interface GameState {
    status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
    score: number;
    level: number;
    lines: number;
    holdPiece: TetrominoType | null;
    nextPieces: TetrominoType[];
    actions: {
        setStatus: (status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER') => void;
        setScore: (score: number) => void;
        setLevel: (level: number) => void;
        setLines: (lines: number) => void;
        setHoldPiece: (piece: TetrominoType | null) => void;
        setNextPieces: (pieces: TetrominoType[]) => void;
        resetGame: () => void;
        addScore: (linesCleared: number, level: number) => void;
    }
}

export const useGameStore = create<GameState>((set) => ({
    status: 'IDLE',
    score: 0,
    level: 1,
    lines: 0,
    holdPiece: null,
    nextPieces: [],
    actions: {
        setStatus: (status) => set({ status }),
        setScore: (score) => set({ score }),
        setLevel: (level) => set({ level }),
        setLines: (lines) => set({ lines }),
        setHoldPiece: (piece) => set({ holdPiece: piece }),
        setNextPieces: (pieces) => set({ nextPieces: pieces }),
        resetGame: () => set({
            status: 'IDLE',
            score: 0,
            level: 1,
            lines: 0,
            holdPiece: null,
            nextPieces: []
        }),
        addScore: (linesCleared, level) => set((state) => {
            // Basic Tetris scoring system (Original Nintendo)
            // 1 line: 40 * (level + 1)
            // 2 lines: 100 * (level + 1)
            // 3 lines: 300 * (level + 1)
            // 4 lines: 1200 * (level + 1)
            const points = [0, 40, 100, 300, 1200];
            const gained = (points[linesCleared] || 0) * (level);
            return { score: state.score + gained, lines: state.lines + linesCleared };
        })
    }
}));
