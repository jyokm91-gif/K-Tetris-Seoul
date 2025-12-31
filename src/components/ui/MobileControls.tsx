'use client';

import { RotateCw, MoveDown, MoveLeft, MoveRight, ChevronsDown } from 'lucide-react';

interface MobileControlsProps {
  onMove: (direction: 'left' | 'right' | 'down') => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

export function MobileControls({ onMove, onRotate, onHardDrop }: MobileControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-md border-t-2 border-obangsaek-cheong/50">
      <div className="flex items-end justify-between max-w-2xl mx-auto gap-6 p-3 px-4 pb-4">
        {/* Left Side - Movement Controls */}
        <div className="flex flex-col gap-3">
          <div className="text-center text-xs text-gray-400 mb-1 font-bold">이동</div>
          <div className="grid grid-cols-3 gap-2">
            {/* Top row - empty, up (soft drop), empty */}
            <div />
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onMove('down');
              }}
              className="w-14 h-14 bg-obangsaek-jeok/80 rounded-xl active:bg-obangsaek-jeok active:scale-95 flex flex-col items-center justify-center text-white shadow-lg touch-none transition-all border-2 border-obangsaek-jeok"
            >
              <MoveDown size={22} />
              <span className="text-[9px] mt-0.5">아래</span>
            </button>
            <div />

            {/* Bottom row - Left and Right */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onMove('left');
              }}
              className="w-14 h-14 bg-obangsaek-cheong/80 rounded-xl active:bg-obangsaek-cheong active:scale-95 flex flex-col items-center justify-center text-white shadow-lg touch-none transition-all border-2 border-obangsaek-cheong"
            >
              <MoveLeft size={22} />
              <span className="text-[9px] mt-0.5">왼쪽</span>
            </button>

            <div /> {/* Empty space */}

            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onMove('right');
              }}
              className="w-14 h-14 bg-obangsaek-cheong/80 rounded-xl active:bg-obangsaek-cheong active:scale-95 flex flex-col items-center justify-center text-white shadow-lg touch-none transition-all border-2 border-obangsaek-cheong"
            >
              <MoveRight size={22} />
              <span className="text-[9px] mt-0.5">오른쪽</span>
            </button>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex flex-col gap-3">
          <div className="text-center text-xs text-gray-400 mb-1 font-bold">동작</div>
          <div className="flex gap-2">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onRotate();
              }}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl active:scale-95 flex flex-col items-center justify-center text-white font-bold shadow-lg touch-none transition-all border-2 border-purple-400"
            >
              <RotateCw size={22} />
              <span className="text-[9px] mt-0.5">회전</span>
            </button>

            <button
              onTouchStart={(e) => {
                e.preventDefault();
                onHardDrop();
              }}
              className="w-14 h-14 bg-gradient-to-br from-obangsaek-hwang to-orange-600 rounded-xl active:scale-95 flex flex-col items-center justify-center text-black font-bold shadow-lg touch-none transition-all border-2 border-yellow-300"
            >
              <ChevronsDown size={22} strokeWidth={3} />
              <span className="text-[9px] mt-0.5">드롭</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
