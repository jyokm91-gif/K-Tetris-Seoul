'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { GameEngineState, Tetromino, TetrominoType, CellValue } from '@/lib/game/types';
import { BOARD_HEIGHT, BOARD_WIDTH, DROP_SPEED, VISIBLE_HEIGHT } from '@/lib/game/constants';
import { TETROMINO_SHAPES } from '@/lib/game/tetrominoes';
import { canPlace, clearLines, tryRotate } from '@/lib/game/engine';
import { drawActivePiece, drawBoard, drawGhostPiece } from '@/lib/game/renderer';

// Cell value mapping: TetrominoType -> CellValue (1-7)
const TYPE_TO_CELL: Record<TetrominoType, CellValue> = {
    'I': 1, 'O': 2, 'T': 3, 'S': 4, 'Z': 5, 'J': 6, 'L': 7
};

// 7-bag randomizer
function createBag(): TetrominoType[] {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    // Fisher-Yates shuffle
    for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
    }
    return types;
}

function getNextPiece(state: GameEngineState): TetrominoType {
    if (state.bag.length === 0) {
        state.bag = createBag();
    }
    return state.bag.pop()!;
}

function createPiece(type: TetrominoType): Tetromino {
    // Standard spawn: x=3 for most pieces, y in buffer zone
    return {
        type,
        rotation: 0,
        position: { x: 3, y: 0 }
    };
}

export function GameBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationIdRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Zustand State (for UI sync)
    const { actions, status } = useGameStore();

    // Mutable Game State (Ref) - "The Source of Truth"
    const gameState = useRef<GameEngineState>({
        board: Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0) as CellValue[]),
        activePiece: null,
        ghostPosition: null,
        holdPiece: null,
        canHold: true,
        nextQueue: [],
        bag: [],
        dropTimer: 0,
        lockTimer: 0,
        level: 1,
        score: 0,
        lines: 0,
        isLocking: false,
        isGameOver: false,
    });

    const spawnPiece = useCallback(() => {
        const state = gameState.current;

        // Fill next queue if needed
        while (state.nextQueue.length < 5) {
            state.nextQueue.push(getNextPiece(state));
        }

        const nextType = state.nextQueue.shift()!;
        state.nextQueue.push(getNextPiece(state));

        const newPiece = createPiece(nextType);

        // Collision check at spawn = Game Over
        if (!canPlace(state.board, newPiece.type, newPiece.position, newPiece.rotation)) {
            state.isGameOver = true;
            actions.setStatus('GAME_OVER');
            return;
        }

        state.activePiece = newPiece;
        state.canHold = true;
        actions.setNextPieces([...state.nextQueue]);
    }, [actions]);

    const lockPiece = useCallback(() => {
        const state = gameState.current;
        const piece = state.activePiece;
        if (!piece) return;

        const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
        const cellValue = TYPE_TO_CELL[piece.type];

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[0].length; c++) {
                if (shape[r][c]) {
                    const by = piece.position.y + r;
                    const bx = piece.position.x + c;
                    if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                        state.board[by][bx] = cellValue;
                    }
                }
            }
        }

        // Clear Lines
        const { newBoard, linesCleared } = clearLines(state.board);
        state.board = newBoard;

        if (linesCleared > 0) {
            state.lines += linesCleared;
            actions.addScore(linesCleared, state.level);
            actions.setLines(state.lines);

            // Level up every 10 lines
            const newLevel = Math.floor(state.lines / 10) + 1;
            if (newLevel > state.level) {
                state.level = newLevel;
                actions.setLevel(newLevel);
            }
        }

        state.activePiece = null;
        spawnPiece();
    }, [actions, spawnPiece]);

    // Game Loop
    const gameLoop = useCallback((currentTime: DOMHighResTimeStamp) => {
        const state = gameState.current;
        const ctx = canvasRef.current?.getContext('2d');

        if (!ctx || state.isGameOver) {
            if (state.isGameOver) return; // Stop loop on game over
            animationIdRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        // Calculate delta time
        if (!lastTimeRef.current) lastTimeRef.current = currentTime;
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Skip update if paused or idle
        const currentStatus = useGameStore.getState().status;
        if (currentStatus === 'PLAYING' && state.activePiece) {
            // Gravity
            state.dropTimer += deltaTime;
            const speed = Math.max(DROP_SPEED.MIN, DROP_SPEED.INITIAL - (state.level - 1) * 50);

            if (state.dropTimer >= speed) {
                state.dropTimer = 0;
                const p = state.activePiece;
                const nextPos = { x: p.position.x, y: p.position.y + 1 };

                if (canPlace(state.board, p.type, nextPos, p.rotation)) {
                    p.position = nextPos;
                } else {
                    lockPiece();
                }
            }

            // Update Ghost Position
            if (state.activePiece) {
                let ghostY = state.activePiece.position.y;
                while (canPlace(state.board, state.activePiece.type,
                    { x: state.activePiece.position.x, y: ghostY + 1 },
                    state.activePiece.rotation)) {
                    ghostY++;
                }
                state.ghostPosition = { x: state.activePiece.position.x, y: ghostY };
            }
        }

        // Render
        drawBoard(ctx, state.board, 30);

        if (state.activePiece) {
            if (state.ghostPosition) {
                drawGhostPiece(ctx, state.activePiece, state.ghostPosition.y, 30);
            }
            drawActivePiece(ctx, state.activePiece, 30);
        }

        animationIdRef.current = requestAnimationFrame(gameLoop);
    }, [lockPiece]);

    // Initialize game
    useEffect(() => {
        const state = gameState.current;

        // Initialize bag and next queue
        state.bag = createBag();
        while (state.nextQueue.length < 5) {
            state.nextQueue.push(getNextPiece(state));
        }

        spawnPiece();
        actions.setStatus('PLAYING');

        // Start game loop
        animationIdRef.current = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationIdRef.current);
        };
    }, [spawnPiece, actions, gameLoop]);

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const state = gameState.current;
            if (state.isGameOver || !state.activePiece) return;

            // Prevent scrolling for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            const p = state.activePiece;
            const currentScore = useGameStore.getState().score;

            switch (e.key) {
                case 'ArrowLeft': {
                    const newPos = { x: p.position.x - 1, y: p.position.y };
                    if (canPlace(state.board, p.type, newPos, p.rotation)) {
                        p.position = newPos;
                    }
                    break;
                }
                case 'ArrowRight': {
                    const newPos = { x: p.position.x + 1, y: p.position.y };
                    if (canPlace(state.board, p.type, newPos, p.rotation)) {
                        p.position = newPos;
                    }
                    break;
                }
                case 'ArrowDown': {
                    // Soft Drop
                    const newPos = { x: p.position.x, y: p.position.y + 1 };
                    if (canPlace(state.board, p.type, newPos, p.rotation)) {
                        p.position = newPos;
                        state.dropTimer = 0;
                        actions.setScore(currentScore + 1);
                    }
                    break;
                }
                case 'ArrowUp': {
                    // Rotate CW
                    const rotated = tryRotate(state.board, p, 1);
                    if (rotated) {
                        state.activePiece = rotated;
                    }
                    break;
                }
                case ' ': {
                    // Hard Drop
                    let dist = 0;
                    while (canPlace(state.board, p.type, { x: p.position.x, y: p.position.y + 1 }, p.rotation)) {
                        p.position.y += 1;
                        dist++;
                    }
                    actions.setScore(currentScore + (dist * 2));
                    lockPiece();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [actions, lockPiece]);

    return (
        <canvas
            ref={canvasRef}
            width={300}  // 10 cols * 30px
            height={600} // 20 rows * 30px
            className="block bg-black"
        />
    );
}
