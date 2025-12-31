'use client';

import { useRef, useCallback, useEffect } from 'react';

interface GameLoopOptions {
    targetFPS?: number;
    onUpdate: (deltaTime: number) => void;
    onRender: (ctx: CanvasRenderingContext2D) => void;
}

export function useGameLoop({ targetFPS = 60, onUpdate, onRender }: GameLoopOptions) {
    const frameInterval = 1000 / targetFPS;
    const lastTimeRef = useRef<number>(0);
    const accumulatorRef = useRef<number>(0);
    const animationIdRef = useRef<number>(0);

    const loop = useCallback((ctx: CanvasRenderingContext2D) => {
        const tick = (currentTime: DOMHighResTimeStamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;

            const deltaTime = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;
            accumulatorRef.current += deltaTime;

            // Fixed timestep for physics/logic
            // Prevent spiral of death by capping max updates per frame
            let updates = 0;
            while (accumulatorRef.current >= frameInterval && updates < 5) {
                onUpdate(frameInterval);
                accumulatorRef.current -= frameInterval;
                updates++;
            }

            if (updates >= 5) {
                accumulatorRef.current = 0; // Panic: discard accumulated time
            }

            // Render at display refresh rate
            onRender(ctx);
            animationIdRef.current = requestAnimationFrame(tick);
        };

        animationIdRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationIdRef.current);
    }, [frameInterval, onUpdate, onRender]);

    return { startLoop: loop, stopLoop: () => cancelAnimationFrame(animationIdRef.current) };
}
