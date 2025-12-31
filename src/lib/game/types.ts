/** 테트로미노 종류 (7-bag system) */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** 회전 상태 (SRS 기준: 0=spawn, R=CW 1회, 2=180°, L=CCW 1회) */
export type RotationState = 0 | 1 | 2 | 3;

/** 좌표 타입 */
export interface Position {
    x: number;
    y: number;
}

/** 테트로미노 인스턴스 */
export interface Tetromino {
    type: TetrominoType;
    position: Position;
    rotation: RotationState;
}

/** 
 * 셀 상태
 * 0: 빈 칸
 * 1-7: 고정된 블록 (TetrominoType에 매핑)
 * 8: 고스트 피스 (렌더링용)
 */
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** 게임 보드 (20행 x 10열, 상단 버퍼 4행 포함 시 24행) */
export type GameBoard = CellValue[][];

/** 게임 엔진 내부 상태 (Mutable, 60FPS 렌더링용) */
export interface GameEngineState {
    board: GameBoard;
    activePiece: Tetromino | null;
    ghostPosition: Position | null;
    holdPiece: TetrominoType | null;
    canHold: boolean;
    nextQueue: TetrominoType[];  // 최소 5개 유지 (7-bag에서 추출)
    bag: TetrominoType[];        // 현재 bag 잔여 피스
    dropTimer: number;
    lockTimer: number;
    level: number;
    score: number;
    lines: number;
    isLocking: boolean;
    isGameOver: boolean;
}

/** 액션 결과 (UI 동기화용) */
export interface GameEvent {
    type: 'PIECE_PLACED' | 'LINE_CLEAR' | 'LEVEL_UP' | 'HOLD' | 'GAME_OVER' | 'SCORE_UPDATE';
    payload?: {
        linesCleared?: number;
        isTetris?: boolean;
        isTSpin?: boolean;
        newLevel?: number;
        score?: number;
        lines?: number;
    };
}
