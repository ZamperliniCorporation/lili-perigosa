"use client";

import { useEffect, useState } from "react";
import { Lantern } from "@/components/lanterns/Lantern";

const AMBIENT = [
  { id: 1, left: 6, size: 50, delay: -3, duration: 22, sway: 14 },
  { id: 2, left: 16, size: 38, delay: -12, duration: 18, sway: -11, dim: true },
  { id: 3, left: 24, size: 44, delay: -7, duration: 24, sway: 9 },
  { id: 4, left: 9, size: 32, delay: -17, duration: 16, sway: -8, dim: true },
  { id: 5, left: 72, size: 46, delay: -5, duration: 21, sway: -13 },
  { id: 6, left: 81, size: 36, delay: -14, duration: 17, sway: 10, dim: true },
  { id: 7, left: 88, size: 52, delay: -9, duration: 25, sway: -9 },
  { id: 8, left: 76, size: 30, delay: -19, duration: 15, sway: 12, dim: true },
  { id: 9, left: 4, size: 28, delay: -1, duration: 19, sway: 7, dim: true },
  { id: 10, left: 91, size: 34, delay: -21, duration: 20, sway: -6, dim: true },
];

const SIDES = [
  { id: 1, left: 3, size: 46, delay: -2, duration: 20, sway: 8 },
  { id: 2, left: 9, size: 34, delay: -11, duration: 17, sway: -7, dim: true },
  { id: 3, left: 14, size: 42, delay: -6, duration: 23, sway: 6 },
  { id: 4, left: 6, size: 28, delay: -16, duration: 15, sway: -5, dim: true },
  { id: 5, left: 11, size: 38, delay: -21, duration: 19, sway: 9, dim: true },
  { id: 6, left: 84, size: 44, delay: -4, duration: 21, sway: -8 },
  { id: 7, left: 90, size: 36, delay: -13, duration: 16, sway: 7, dim: true },
  { id: 8, left: 95, size: 50, delay: -8, duration: 24, sway: -6 },
  { id: 9, left: 86, size: 30, delay: -18, duration: 14, sway: 10, dim: true },
  { id: 10, left: 92, size: 32, delay: -22, duration: 18, sway: -5, dim: true },
];

type AmbientLanternsProps = {
  sides?: boolean;
};

export function AmbientLanterns({ sides = false }: AmbientLanternsProps) {
  const [compact, setCompact] = useState(false);
  const lanterns = sides ? SIDES : AMBIENT;
  const visible = compact ? lanterns.filter((_, index) => index % 2 === 0) : lanterns;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(media.matches);
    sync();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {visible.map((lantern) => (
        <div
          key={lantern.id}
          className="absolute animate-rise-lantern"
          style={
            {
              left: `${lantern.left}%`,
              top: "100%",
              width: lantern.size,
              height: lantern.size * 1.6,
              animationDelay: `${lantern.delay}s`,
              animationDuration: `${lantern.duration}s`,
              "--lantern-sway": `${lantern.sway}px`,
            } as React.CSSProperties
          }
        >
          <Lantern className="h-full w-full" dim={lantern.dim} quiet={compact} />
        </div>
      ))}
    </div>
  );
}
