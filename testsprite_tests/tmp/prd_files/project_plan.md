# K-Tetris: SEOUL - Development Plan

## 1. Project Overview
**Goal**: Create a modern, aesthetic web-based Tetris game fusing "Gwanghwamun" scenery with "Korean Traditional Music".
**Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, HTML5 Canvas, Zustand.

## 2. Directory Structure
We will use a standard Next.js App Router structure with feature-based organization for game logic.

```
k-tetris-seoul/
├── public/
│   ├── assets/
│   │   ├── images/       # Backgrounds (Night/Day), Patterns
│   │   ├── audio/        # BGM, SFX
│   │   └── fonts/        # Custom fonts if needed
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout with fonts/providers
│   │   └── page.tsx      # Main Game Page
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameCanvas.tsx  # Main rendering component (Canvas)
│   │   │   ├── UIOverlay.tsx   # Score, Level, Lines
│   │   │   ├── HoldQueue.tsx   # Hold piece visualization
│   │   │   └── NextQueue.tsx   # Next pieces visualization
│   │   ├── ui/           # Generic UI (Buttons, Modals - Shadcn-like)
│   │   └── layout/       # Frame, Borders (Hanok style)
│   ├── lib/
│   │   ├── hooks/
│   │   │   ├── useGameLoop.ts  # RequestAnimationFrame loop
│   │   │   ├── useControls.ts  # Keyboard event listeners
│   │   │   └── useAudio.ts     # Audio management
│   │   ├── game/
│   │   │   ├── engine.ts       # Pure logic (movement, collision, clearing lines)
│   │   │   ├── tetrominoes.ts  # Shape definitions, colors (Obangsaek)
│   │   │   └── constants.ts    # Config (Board size, timing)
│   │   └── utils/
│   └── store/
│       └── gameStore.ts  # Zustand store for UI state (score, level, status)
```

## 3. State Management Strategy
We will separate **High-Frequency Game State** (60FPS rendering) from **UI State** (Infrequent updates).

### A. Game Engine Ref (Mutable, High Performance)
Managed within a specialized hook (`useGameLoop` or `GameEngine` class).
- **Grid Data**: `number[][]` (10x20 board)
- **Active Piece**: `{ x, y, shape, rotation }`
- **Timers**: `dropTimer`, `animationTimer`
- **Render Source**: Canvas draws directly from this mutable state every frame.

### B. Zustand Store (UI Sync)
Used for React UI components (Scoreboard, Game Over screens).
- **Store config**:
  ```typescript
  interface GameState {
    status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
    score: number;
    level: number;
    lines: number;
    holdPiece: Tetromino | null;
    nextPieces: Tetromino[];
    actions: {
      startGame: () => void;
      pauseGame: () => void;
      addScore: (linesCleared: number) => void;
      // ...
    }
  }
  ```
- **Syncing**: The Game Engine calls Zustand actions only when meaningful events occur (e.g., piece placement, line clear, level up). It does *not* sync X/Y coordinates to Zustand on every frame.

## 4. Component Breakdown

### Core Components
1.  **`GameCanvas`**:
    -   Wraps `<canvas>` element.
    -   Instantiates Game Engine.
    -   Handles rendering loop.
2.  **`GameFrame`** (Layout):
    -   Visual wrapper with "Hanok" eaves styling (CSS/SVG).
    -   Contains the `GameCanvas` and `UIOverlay`.

### Visual Components
-   **`TetrominoRenderer`**: Functions to draw blocks with "Neon Glow" and "Obangsaek" colors.
-   **`BackgroundManager`**: Handles transitions between Day/Night images based on Level.

## 5. Asset List (To be acquired/generated)

### Images
1.  `bg-gwanghwamun-night.jpg`: Modern night view with moon.
2.  `bg-gwanghwamun-day.jpg`: Bright, clear sky view.
3.  `pattern-dancheong.png`: Traditional Korean pattern for borders.
4.  `texture-hanji.png`: Paper texture for UI overlays.

### Audio
1.  `bgm-fusion-fast.mp3`: Gayageum + Trap beat (High tension).
2.  `bgm-fusion-slow.mp3`: Atmospheric intro.
3.  `sfx-rotate-daegeum.wav`: Short woodwind sound.
4.  `sfx-harddrop-janggu.wav`: Percussive drum hit.
5.  `sfx-lineclear-gong.wav`: Resonant gong.

## 6. Implementation Steps
1.  **Setup**: Initialize Next.js project with Tailwind.
2.  **Engine**: Build core Tetris mechanics (move, rotate, collision) in isolation map.
3.  **Render**: Connect Engine to Canvas.
4.  **UI**: Build the Hanok frame and integrates Zustand.
5.  **Polish**: Add Glow effects, Audio, and Background transitions.
