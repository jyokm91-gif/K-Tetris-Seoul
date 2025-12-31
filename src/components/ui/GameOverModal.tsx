'use client';

import React, { useState, useEffect } from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  level: number;
  lines: number;
  onSubmit: (nickname: string) => void;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, score, level, lines, onSubmit, onRestart }: GameOverModalProps) {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNickname('');
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hanok-frame bg-black/90 p-8 max-w-md w-full text-center">
        {/* Game Over Title */}
        <h2 className="text-4xl font-bold text-obangsaek-jeok mb-6 text-neon">
          게임 오버
        </h2>

        {/* Final Score */}
        <div className="mb-8 space-y-3">
          <div className="bg-black/40 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">최종 점수</p>
            <p className="text-4xl font-bold text-obangsaek-hwang text-neon">
              {score.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">레벨</p>
              <p className="text-2xl font-bold text-obangsaek-cheong">{level}</p>
            </div>
            <div className="bg-black/40 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">줄 수</p>
              <p className="text-2xl font-bold text-obangsaek-baek">{lines}</p>
            </div>
          </div>
        </div>

        {/* Nickname Input */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">
              닉네임을 입력하고 기록을 남기세요
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 12))}
              placeholder="닉네임 (최대 12자)"
              maxLength={12}
              className="w-full px-4 py-3 bg-black/60 border-2 border-obangsaek-cheong/50 rounded-lg text-white text-center text-lg focus:border-obangsaek-cheong focus:outline-none mb-4"
              autoFocus
            />
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="w-full py-3 bg-obangsaek-hwang text-black font-bold rounded-lg hover:bg-obangsaek-hwang/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              기록 저장
            </button>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-obangsaek-cheong/20 border-2 border-obangsaek-cheong rounded-lg">
            <p className="text-obangsaek-baek">
              ✓ 기록이 저장되었습니다!
            </p>
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 bg-obangsaek-cheong text-white font-bold rounded-lg hover:bg-obangsaek-cheong/80 transition-all"
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}
