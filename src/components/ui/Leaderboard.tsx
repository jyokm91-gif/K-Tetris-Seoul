'use client';

import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  level: number;
  lines: number;
  timestamp: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
}

export function Leaderboard({ entries, currentScore }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-obangsaek-hwang" size={20} />;
      case 1:
        return <Medal className="text-gray-400" size={18} />;
      case 2:
        return <Award className="text-obangsaek-jeok" size={18} />;
      default:
        return <span className="text-gray-500 text-sm font-bold">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-obangsaek-hwang/20 border-obangsaek-hwang/50';
      case 1:
        return 'bg-gray-500/20 border-gray-500/50';
      case 2:
        return 'bg-obangsaek-jeok/20 border-obangsaek-jeok/50';
      default:
        return 'bg-black/40 border-gray-700/50';
    }
  };

  return (
    <div className="hanok-frame bg-black/60 p-4 md:p-6 text-obangsaek-baek w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="text-obangsaek-hwang" size={24} />
        <h2 className="text-xl font-bold text-center">명예의 전당</h2>
      </div>

      <div className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>아직 기록이 없습니다</p>
            <p className="text-sm mt-2">첫 번째 기록의 주인공이 되어보세요!</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={`${entry.timestamp}-${index}`}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${getRankColor(
                index
              )} ${
                currentScore === entry.score && entry.timestamp > Date.now() - 5000
                  ? 'animate-pulse ring-2 ring-obangsaek-cheong'
                  : ''
              }`}
            >
              {/* Rank Icon */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              {/* Nickname */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{entry.nickname}</p>
                <p className="text-xs text-gray-400">
                  Lv.{entry.level} · {entry.lines} 줄
                </p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <p className="font-mono font-bold text-obangsaek-hwang">
                  {entry.score.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 168, 37, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 168, 37, 0.7);
        }
      `}</style>
    </div>
  );
}
