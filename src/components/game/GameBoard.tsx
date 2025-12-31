'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/useGameStore';
import { GameEngineState, Tetromino, TetrominoType } from '@/lib/game/types';
import { BOARD_HEIGHT, BOARD_WIDTH, DROP_SPEED, TETROMINO_COLORS, VISIBLE_HEIGHT } from '@/lib/game/constants';
import { TetrominoType as TType } from '@/lib/game/types'; // Alias
import { canPlace, clearLines, tryRotate } from '@/lib/game/engine';
import { drawActivePiece, drawBoard, drawGhostPiece } from '@/lib/game/renderer';

// Helper to get random piece
function randomPieceType(): TType {
    const types: TType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * types.length)];
}

function createPiece(type: TType): Tetromino {
    // Spawn positions: usually center top.
    // I spawns at x=3, y=-1 or similar. 
    // Standard I: x=3, y=-1. Others x=3 or 4.
    // Let's use x=3, y=0 (hidden buffer).
    return {
        type,
        rotation: 0,
        position: { x: 3, y: 0 }
    };
}

export function GameBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [blockSize, setBlockSize] = React.useState(30);
    const [canvasWidth, setCanvasWidth] = React.useState(300);
    const [canvasHeight, setCanvasHeight] = React.useState(600);

    // Zustand State (Read Only for syncing)
    const { actions, status, level } = useGameStore();

    // Mutable Game State (Ref) - "The Source of Truth"
    const gameState = useRef<GameEngineState>({
        board: Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)),
        activePiece: null,
        ghostPosition: null, // Calc on update
        holdPiece: null,
        canHold: true,
        nextQueue: [randomPieceType(), randomPieceType(), randomPieceType()],
        bag: [], // TODO: Implement 7-bag
        dropTimer: 0,
        lockTimer: 0,
        level: 1,
        score: 0,
        lines: 0,
        isLocking: false,
        isGameOver: false,
    });

    // Calculate responsive canvas size
    useEffect(() => {
        const updateCanvasSize = () => {
            const isMobile = window.innerWidth < 768;
            const availableWidth = isMobile ? window.innerWidth - 32 : 300; // 32px for padding
            const maxBlockSize = isMobile ? Math.floor(availableWidth / BOARD_WIDTH) : 30;
            const finalBlockSize = Math.min(maxBlockSize, 30);

            setBlockSize(finalBlockSize);
            setCanvasWidth(BOARD_WIDTH * finalBlockSize);
            setCanvasHeight(BOARD_HEIGHT * finalBlockSize);
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Init Game
    useEffect(() => {
        if (gameState.current.activePiece === null) {
            spawnPiece();
            actions.setStatus('PLAYING');
        }
    }, []);

    const spawnPiece = useCallback(() => {
        const state = gameState.current;
        const nextType = state.nextQueue.shift() || randomPieceType();
        state.nextQueue.push(randomPieceType());

        const newPiece = createPiece(nextType);

        // Collision check at spawn = Game Over
        if (!canPlace(state.board, newPiece.type, newPiece.position, newPiece.rotation)) {
            state.isGameOver = true;
            actions.setStatus('GAME_OVER');
            return; // Dead
        }

        state.activePiece = newPiece;
        state.canHold = true;
        actions.setNextPieces([...state.nextQueue]); // Sync UI
    }, [actions]);

    const lockPiece = useCallback(() => {
        const state = gameState.current;
        const piece = state.activePiece;
        if (!piece) return;

        // Burn into board
        const shape = import('@/lib/game/tetrominoes').then(m => m.TETROMINO_SHAPES[piece.type][piece.rotation]);
        // Wait, can't import inside sync. Need static import.
        // Already imported TETROMINO_SHAPES.

        // Importing locally inside components might be weird with 'use client' but imports are top level.
        // Accessing helpers:
        // We need to loop shape and set board.
        // Hardcode shape access:
        const shapes = require('@/lib/game/tetrominoes').TETROMINO_SHAPES; // dynamic require or just use top import
        // Using top import TETROMINO_SHAPES
        // Note: `import { TETROMINO_SHAPES }` at top.

        // Re-importing shapes logic manually here is cleaner than async import
        // Actually we have it imported.

        // Re-implement locking logic:
        const blockShape = require('@/lib/game/tetrominoes').TETROMINO_SHAPES[piece.type][piece.rotation];

        for (let r = 0; r < blockShape.length; r++) {
            for (let c = 0; c < blockShape[0].length; c++) {
                if (blockShape[r][c]) {
                    const by = piece.position.y + r;
                    const bx = piece.position.x + c;
                    if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                        // Map type to int?
                        // Simple map: 'I'->1, etc
                        const map = ['', 'I', 'O', 'T', 'S', 'Z', 'J', 'L'];
                        state.board[by][bx] = map.indexOf(piece.type) as any || 1;
                    }
                }
            }
        }

        // Clear Lines
        const { newBoard, linesCleared } = clearLines(state.board);
        state.board = newBoard;

        if (linesCleared > 0) {
            actions.addScore(linesCleared, state.level);
        }

        // Next Piece
        spawnPiece();

    }, [actions, spawnPiece]);

    // Game Loop Logic
    const update = useCallback((deltaTime: number) => {
        const state = gameState.current;
        if (state.isGameOver || status === 'PAUSED' || status === 'IDLE') return;

        // Gravity
        state.dropTimer += deltaTime;
        const speed = Math.max(DROP_SPEED.MIN, DROP_SPEED.INITIAL - (state.level - 1) * 50); // Simple speed curve

        if (state.dropTimer > speed) {
            state.dropTimer = 0;
            if (state.activePiece) {
                const nextPos = { ...state.activePiece.position, y: state.activePiece.position.y + 1 };
                if (canPlace(state.board, state.activePiece.type, nextPos, state.activePiece.rotation)) {
                    state.activePiece.position = nextPos;
                } else {
                    // Lock Delay (Simplified: Lock immediately on touch floor for MVP)
                    lockPiece();
                }
            }
        }

        // Ghost Piece Calc
        if (state.activePiece) {
            // Project down
            let ghostY = state.activePiece.position.y;
            while (canPlace(state.board, state.activePiece.type, { x: state.activePiece.position.x, y: ghostY + 1 }, state.activePiece.rotation)) {
                ghostY++;
            }
            state.ghostPosition = { x: state.activePiece.position.x, y: ghostY };
        }

    }, [status, lockPiece]);

    const render = useCallback((ctx: CanvasRenderingContext2D) => {
        const state = gameState.current;

        drawBoard(ctx, state.board, blockSize);

        if (state.activePiece) {
            // Draw Ghost
            if (state.ghostPosition) {
                drawGhostPiece(ctx, state.activePiece, state.ghostPosition.y, blockSize);
            }
            // Draw Active
            drawActivePiece(ctx, state.activePiece, blockSize);
        }

    }, [blockSize]);

    const { startLoop, stopLoop } = useGameLoop({ onUpdate: update, onRender: render });

    // Start game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cleanup = startLoop(ctx);
        return cleanup;
    }, [startLoop]);

    // Inputs
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const state = gameState.current;
            if (state.isGameOver || !state.activePiece) return;

            // Prevent scrolling for game keys
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) > -1) {
                e.preventDefault();
            }

            const p = state.activePiece;

            switch (e.key) {
                case 'ArrowLeft':
                    if (canPlace(state.board, p.type, { x: p.position.x - 1, y: p.position.y }, p.rotation)) {
                        p.position.x -= 1;
                    }
                    break;
                case 'ArrowRight':
                    if (canPlace(state.board, p.type, { x: p.position.x + 1, y: p.position.y }, p.rotation)) {
                        p.position.x += 1;
                    }
                    break;
                case 'ArrowDown':
                    // Soft Drop
                    if (canPlace(state.board, p.type, { x: p.position.x, y: p.position.y + 1 }, p.rotation)) {
                        p.position.y += 1;
                        // Reset drop timer?
                        state.dropTimer = 0;
                        actions.setScore(useGameStore.getState().score + 1); // Mutating store directly? use store.setState equivalent
                    }
                    break;
                case 'ArrowUp':
                    // Rotate CW
                    const rotated = tryRotate(state.board, p, 1);
                    if (rotated) {
                        state.activePiece = rotated;
                    }
                    break;
                case ' ': // Space = Hard Drop
                    let dist = 0;
                    while (canPlace(state.board, p.type, { x: p.position.x, y: p.position.y + 1 }, p.rotation)) {
                        p.position.y += 1;
                        dist++;
                    }
                    lockPiece();
                    actions.setScore(useGameStore.getState().score + (dist * 2));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [actions, lockPiece]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="block bg-black max-w-full"
            style={{ touchAction: 'none' }}
        />
    );
}
