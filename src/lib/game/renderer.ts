import { CellValue, Position, Tetromino, TetrominoType } from "./types";
import { BOARD_HEIGHT, BOARD_WIDTH, VISIBLE_HEIGHT, TETROMINO_COLORS } from "./constants";
import { TETROMINO_SHAPES } from "./tetrominoes";

interface BlockRenderOptions {
    x: number;
    y: number;
    size: number;
    color: { fill: string; glow: string };
    intensity?: number;  // 0-1, 줄 클리어 애니메이션용
}

/**
 * 네온 글로우 효과가 적용된 블록 렌더링
 */
export function drawGlowingBlock(
    ctx: CanvasRenderingContext2D,
    { x, y, size, color, intensity = 1 }: BlockRenderOptions
): void {
    const padding = 2; // Gap between blocks
    const innerSize = size - padding * 2;
    const drawX = x + padding;
    const drawY = y + padding;

    if (innerSize <= 0) return;

    ctx.save();

    // 외부 글로우 (다중 레이어) - Performance Warning: ShadowBlur is expensive.
    // We opt for a simpler glow for MVP performance or specific dirty rects?
    // For MVP let's keep it but maybe reduce layers if slow.

    const glowLayers = [
        { blur: 15, alpha: 0.4 * intensity },
        //{ blur: 5, alpha: 0.6 * intensity }, // Reduced layers for performance
    ];

    for (const layer of glowLayers) {
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = layer.blur;
        ctx.globalAlpha = layer.alpha;
        ctx.fillStyle = color.glow;
        ctx.fillRect(drawX, drawY, innerSize, innerSize);
    }

    // 메인 블록
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // 그라디언트로 입체감 추가
    const gradient = ctx.createLinearGradient(drawX, drawY, drawX, drawY + innerSize);
    gradient.addColorStop(0, lightenColor(color.fill, 20));
    gradient.addColorStop(0.5, color.fill);
    gradient.addColorStop(1, darkenColor(color.fill, 20));

    ctx.fillStyle = gradient;
    ctx.fillRect(drawX, drawY, innerSize, innerSize);

    // 내부 하이라이트 (Bevel)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(drawX, drawY, innerSize, 2); // Top
    ctx.fillRect(drawX, drawY, 2, innerSize); // Left

    ctx.restore();
}

// 색상 조절 유틸리티
function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - percent);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
    const b = Math.max(0, (num & 0x0000FF) - percent);
    return `rgb(${r}, ${g}, ${b})`;
}

export function drawBoard(
    ctx: CanvasRenderingContext2D,
    board: CellValue[][],
    cellSize: number,
    offsetY: number = 0 // For smooth scrolling if implemented later, or just aligning
) {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Grid lines (Optional, maybe too messy against background?)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Draw Board Blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        // Skip hidden buffer rows?
        const visualY = y - (BOARD_HEIGHT - VISIBLE_HEIGHT); // 24-20=4. So y=4 is visualY=0. 
        if (visualY < 0) continue;

        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = board[y][x];
            const px = x * cellSize;
            const py = visualY * cellSize;

            // Draw Grid
            // ctx.strokeRect(px, py, cellSize, cellSize);

            if (cell !== 0 && cell !== 8) { // 8 is ghost
                // Map cell ID to Tetromino Type? 
                // Currently CellValue is 0-8. 
                // 1-7 map to I, O, T, S, Z, J, L order?
                // Need a map.
                const typeMap: TetrominoType[] = ['I', 'I', 'O', 'T', 'S', 'Z', 'J', 'L']; // 0 is empty, so index 1=I? 
                // Let's assume standard mapping:
                // 1=I, 2=O, 3=T, 4=S, 5=Z, 6=J, 7=L
                const type = typeMap[cell] || 'I';
                drawGlowingBlock(ctx, {
                    x: px,
                    y: py,
                    size: cellSize,
                    color: TETROMINO_COLORS[type]
                });
            }
        }
    }
}

export function drawActivePiece(
    ctx: CanvasRenderingContext2D,
    piece: Tetromino,
    cellSize: number
) {
    const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
    const visualYStart = piece.position.y - (BOARD_HEIGHT - VISIBLE_HEIGHT);

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col]) {
                const visualY = visualYStart + row;
                if (visualY < 0) continue; // Don't draw in buffer zone if hidden

                drawGlowingBlock(ctx, {
                    x: (piece.position.x + col) * cellSize,
                    y: visualY * cellSize,
                    size: cellSize,
                    color: TETROMINO_COLORS[piece.type]
                });
            }
        }
    }
}

export function drawGhostPiece(
    ctx: CanvasRenderingContext2D,
    piece: Tetromino,
    ghostY: number,
    cellSize: number
) {
    const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
    const visualYStart = ghostY - (BOARD_HEIGHT - VISIBLE_HEIGHT);
    const color = TETROMINO_COLORS[piece.type];

    ctx.save();
    ctx.globalAlpha = 0.3;

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col]) {
                const visualY = visualYStart + row;
                if (visualY < 0) continue;

                const px = (piece.position.x + col) * cellSize;
                const py = visualY * cellSize;

                ctx.strokeStyle = color.glow;
                ctx.lineWidth = 2;
                ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
            }
        }
    }
    ctx.restore();
}
