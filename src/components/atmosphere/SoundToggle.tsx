"use client";

import { useEffect, useState } from "react";
import { isMagicMuted, setMagicMuted, unlockMagicAudio } from "@/lib/magicAudio";

export function SoundToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    function unlock() {
      void unlockMagicAudio();
    }

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={muted ? "Ativar som" : "Silenciar som"}
      onClick={() => {
        const next = !isMagicMuted();
        setMagicMuted(next);
        setMuted(next);
        if (!next) {
          void unlockMagicAudio();
        }
      }}
      className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-night/50 text-gold-bright/90 backdrop-blur-sm transition hover:border-gold hover:text-gold-bright"
    >
      {muted ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M11 6 L7 9 H4 V15 H7 L11 18 Z" strokeLinejoin="round" />
          <path d="M16 10 L20 14 M20 10 L16 14" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M11 6 L7 9 H4 V15 H7 L11 18 Z" strokeLinejoin="round" />
          <path d="M15 9.5 C16.4 10.6 16.4 13.4 15 14.5" strokeLinecap="round" />
          <path d="M17.5 7.5 C20 9.4 20 14.6 17.5 16.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
