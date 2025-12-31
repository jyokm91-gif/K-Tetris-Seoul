'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

export function BackgroundMusic({ autoPlay = false }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music/korean-traditional.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    if (autoPlay) {
      // Autoplay might be blocked by browser, so we handle it
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        console.log('Playback prevented by browser');
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-lg p-2 border-2 border-obangsaek-hwang/30 shadow-lg">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-obangsaek-cheong to-blue-800 hover:from-obangsaek-cheong hover:to-blue-700 rounded-md text-white text-xs font-bold transition-all shadow-md active:scale-95"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <span className="text-sm">{isPlaying ? '⏸' : '▶'}</span>
        <span className="hidden sm:inline">국악</span>
      </button>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="p-2 hover:bg-white/10 rounded-md transition-all active:scale-95"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX size={18} className="text-gray-400" />
        ) : (
          <Volume2 size={18} className="text-obangsaek-hwang" />
        )}
      </button>

      {/* Volume Slider - Hidden on mobile */}
      <input
        type="range"
        min="0"
        max="100"
        value={isMuted ? 0 : volume * 100}
        onChange={(e) => {
          const newVolume = Number(e.target.value) / 100;
          setVolume(newVolume);
          if (newVolume > 0 && isMuted) {
            setIsMuted(false);
          }
        }}
        className="hidden sm:block w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #F9A825 0%, #F9A825 ${(isMuted ? 0 : volume) * 100}%, #4B5563 ${(isMuted ? 0 : volume) * 100}%, #4B5563 100%)`
        }}
      />
    </div>
  );
}
