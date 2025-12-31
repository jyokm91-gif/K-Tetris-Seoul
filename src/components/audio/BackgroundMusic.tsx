'use client';

import { useEffect, useRef, useState } from 'react';
import { VolumeX } from 'lucide-react';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music/korean-traditional.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Try to play immediately
    const playAudio = () => {
      audio.play()
        .then(() => {
          console.log('Music started playing automatically');
        })
        .catch((error) => {
          console.log('Autoplay blocked, waiting for user interaction:', error);
          // Try again on first user interaction
          const startOnInteraction = () => {
            audio.play().then(() => {
              console.log('Music started after user interaction');
            });
          };
          document.addEventListener('click', startOnInteraction, { once: true });
          document.addEventListener('touchstart', startOnInteraction, { once: true });
        });
    };

    playAudio();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.3;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-black/70 backdrop-blur-md rounded-lg border-2 border-obangsaek-hwang/30 shadow-lg hover:bg-black/80 transition-all active:scale-95"
      aria-label={isMuted ? '음악 켜기' : '음악 끄기'}
    >
      {isMuted ? (
        <>
          <VolumeX size={20} className="text-gray-400" />
          <span className="text-white text-sm font-bold">음악 OFF</span>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-obangsaek-hwang">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          <span className="text-white text-sm font-bold">국악 ON</span>
        </>
      )}
    </button>
  );
}
