'use client';

import { useEffect, useState } from 'react';

export function KoreanPalaceBackground() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/gyeongbokgung.jpg';
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <>
      {/* Fallback gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-900 via-indigo-900 to-purple-900 opacity-80" />

      {/* Palace image background */}
      {imageLoaded && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60 transition-opacity duration-1000"
          style={{
            backgroundImage: 'url(/images/gyeongbokgung.jpg)',
            backgroundPosition: 'center 30%',
          }}
        />
      )}

      {/* Traditional Korean pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="korean-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* 단청 문양 (Dancheong pattern) */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#F9A825" strokeWidth="2" opacity="0.5"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#C62828" strokeWidth="2" opacity="0.5"/>
              <circle cx="50" cy="50" r="10" fill="none" stroke="#1E3A5F" strokeWidth="2" opacity="0.5"/>
              {/* 연꽃 문양 (Lotus pattern) */}
              <path d="M 50 30 Q 40 40 50 50 Q 60 40 50 30" fill="#2E7D32" opacity="0.3"/>
              <path d="M 50 70 Q 40 60 50 50 Q 60 60 50 70" fill="#2E7D32" opacity="0.3"/>
              <path d="M 30 50 Q 40 40 50 50 Q 40 60 30 50" fill="#2E7D32" opacity="0.3"/>
              <path d="M 70 50 Q 60 40 50 50 Q 60 60 70 50" fill="#2E7D32" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#korean-pattern)" />
        </svg>
      </div>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Atmospheric lighting effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
    </>
  );
}
