import { TetrominoType } from "./types";

/**
 * 오방색 (五方色) - 한국 전통 5색
 * 각 테트로미노에 매핑하여 한국적 감성 구현
 */
export const OBANGSAEK = {
    // 정색 (正色) - Primary
    CHEONG: '#1E3A5F',    // 청 (靑) - 동쪽, 봄, 나무
    JEOK: '#C62828',      // 적 (赤) - 남쪽, 여름, 불
    HWANG: '#F9A825',     // 황 (黃) - 중앙, 환절기, 흙
    BAEK: '#FAFAFA',      // 백 (白) - 서쪽, 가을, 쇠
    HEUK: '#212121',      // 흑 (黑) - 북쪽, 겨울, 물

    // 간색 (間色) - Secondary (정색 혼합)
    NOKDU: '#2E7D32',     // 녹두 (청+황) - 청록
    BYEOK: '#00838F',     // 벽 (청+백) - 하늘색  
    HONG: '#AD1457',      // 홍 (적+백) - 분홍
    YU_HWANG: '#FF8F00',  // 유황 (황+적) - 주황
    JA: '#6A1B9A',        // 자 (적+흑) - 보라
} as const;

/** 테트로미노별 오방색 매핑 */
export const TETROMINO_COLORS: Record<TetrominoType, { fill: string; glow: string }> = {
    I: { fill: OBANGSAEK.BYEOK, glow: '#4DD0E1' },      // 벽색 (하늘색)
    O: { fill: OBANGSAEK.HWANG, glow: '#FFEE58' },      // 황색
    T: { fill: OBANGSAEK.JA, glow: '#BA68C8' },         // 자색 (보라)
    S: { fill: OBANGSAEK.NOKDU, glow: '#66BB6A' },      // 녹두색
    Z: { fill: OBANGSAEK.JEOK, glow: '#EF5350' },       // 적색
    J: { fill: OBANGSAEK.CHEONG, glow: '#42A5F5' },     // 청색
    L: { fill: OBANGSAEK.YU_HWANG, glow: '#FFA726' },   // 유황색 (주황)
};

/** 배경 전환 레벨 설정 */
export const BACKGROUND_TRANSITIONS = {
    DAY_LEVELS: [1, 2, 3, 4, 5],      // 낮 배경
    DUSK_LEVELS: [6, 7, 8],           // 석양 (전환)
    NIGHT_LEVELS: [9, 10, 11, 12],    // 밤 배경
    MIDNIGHT_LEVELS: [13, 14, 15],    // 심야 (고난이도)
} as const;

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 24; // 20 visible + 4 buffer
export const VISIBLE_HEIGHT = 20;

export const DROP_SPEED = {
    INITIAL: 1000,
    MIN: 100,
};
