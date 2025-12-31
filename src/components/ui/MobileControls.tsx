'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } from 'lucide-react';

interface MobileControlsProps {
  onMove: (direction: 'left' | 'right' | 'down') => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

export function MobileControls({ onMove, onRotate, onHardDrop }: MobileControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-sm border-t-2 border-obangsaek-cheong/30 p-4">
      <div className="flex items-center justify-between max-w-lg mx-auto gap-4">
        {/* Left Side - Directional Controls */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          {/* Top row - Rotate */}
          <div className="col-start-2">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onRotate();
              }}
              className="w-full aspect-square bg-obangsaek-cheong/80 rounded-lg active:bg-obangsaek-cheong flex items-center justify-center text-white shadow-lg touch-none"
            >
              <ArrowUp size={24} />
            </button>
          </div>

          {/* Middle row - Left and Right */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onMove('left');
            }}
            className="w-full aspect-square bg-obangsaek-cheong/80 rounded-lg active:bg-obangsaek-cheong flex items-center justify-center text-white shadow-lg touch-none"
          >
            <ArrowLeft size={24} />
          </button>

          <div /> {/* Empty space */}

          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onMove('right');
            }}
            className="w-full aspect-square bg-obangsaek-cheong/80 rounded-lg active:bg-obangsaek-cheong flex items-center justify-center text-white shadow-lg touch-none"
          >
            <ArrowRight size={24} />
          </button>

          {/* Bottom row - Down */}
          <div className="col-start-2">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onMove('down');
              }}
              className="w-full aspect-square bg-obangsaek-cheong/80 rounded-lg active:bg-obangsaek-cheong flex items-center justify-center text-white shadow-lg touch-none"
            >
              <ArrowDown size={24} />
            </button>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex flex-col gap-2 flex-1">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onHardDrop();
            }}
            className="w-full py-4 bg-obangsaek-hwang/80 rounded-lg active:bg-obangsaek-hwang flex items-center justify-center text-black font-bold shadow-lg touch-none"
          >
            <div className="flex flex-col items-center">
              <Space size={20} />
              <span className="text-xs mt-1">HARD DROP</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
