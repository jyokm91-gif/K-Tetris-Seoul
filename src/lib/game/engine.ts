import { GameBoard, Tetromino, Position, TetrominoType } from './types';
import { TETROMINO_SHAPES, WALL_KICK_I, WALL_KICK_JLSTZ } from './tetrominoes';
import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';

/**
 * 충돌 감지: 특정 위치에 테트로미노가 배치 가능한지 확인
 */
export function canPlace(
    board: GameBoard,
    type: TetrominoType,
    position: Position,
    rotation: number
): boolean {
    const shape = TETROMINO_SHAPES[type][rotation];
    const rows = shape.length;
    // Safety check
    if (!rows || !shape[0]) return false;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (shape[row][col] === 1) {
                const boardX = position.x + col;
                const boardY = position.y + row;

                // 경계 검사
                if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
                    return false;
                }

                // 상단 버퍼 영역(y < 0)은 허용? No, board array is 0-indexed from 0 to 23.
                // boardY should be within index.
                if (boardY < 0) {
                    // If checking above board (unlikely with valid logic but possible), treat as safe unless OOB X
                    if (boardX < 0 || boardX >= BOARD_WIDTH) return false;
                    continue;
                }

                if (board[boardY][boardX] !== 0) {
                    return false;
                }
            }
        }
    }

    return true;
}

/**
 * SRS 회전 시도: Wall Kick 테스트 포함
 */
export function tryRotate(
    board: GameBoard,
    piece: Tetromino,
    direction: 1 | -1  // 1 = CW, -1 = CCW
): Tetromino | null {
    const newRotation = ((piece.rotation + direction + 4) % 4) as 0 | 1 | 2 | 3;
    const kickKey = `${piece.rotation}->${newRotation}`;

    const kickData = piece.type === 'I'
        ? WALL_KICK_I[kickKey]
        : piece.type === 'O'
            ? [{ x: 0, y: 0 }]  // O는 Wall Kick 불필요
            : WALL_KICK_JLSTZ[kickKey];

    if (!kickData) {
        // Should not happen with complete SRS data
        return null;
    }

    for (const kick of kickData) {
        const newPos = {
            x: piece.position.x + kick.x,
            y: piece.position.y - kick.y  // SRS는 y축이 반전 (Up is positive Y in data? Standard SRS data usually has Y up-positive, but array is Y down-positive. Checking source...)
            // The provided Tech Lead Review says: `y: piece.position.y - kick.y`.
            // This implies kick.y is positive UP.
        };

        if (canPlace(board, piece.type, newPos, newRotation)) {
            return {
                type: piece.type,
                position: newPos,
                rotation: newRotation,
            };
        }
    }

    return null;  // 모든 Wall Kick 실패
}

/**
 * 줄 클리어 처리
 */
export function clearLines(board: GameBoard): { newBoard: GameBoard; linesCleared: number } {
    const newBoard = board.filter(row => !row.every(cell => cell !== 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;

    // 상단에 빈 줄 추가
    while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
    }

    return { newBoard, linesCleared };
}
