"use client";

import { useId } from "react";

type LanternProps = {
  special?: boolean;
  dim?: boolean;
  out?: boolean;
  quiet?: boolean;
  className?: string;
};

function BorderBand({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`} fill="none" stroke="#d4a5c8" strokeWidth="0.85">
      <rect x="14" y="0" width="52" height="11" rx="1" fill="#f3d6e6" stroke="#d4a5c8" />
      <path d="M18 6 C21 2 24 10 27 6 C29 3 31 3 33 6" />
      <path d="M62 6 C59 2 56 10 53 6 C51 3 49 3 47 6" />
      <path
        d="M36 8 L38 2.5 L40 6 L42 2.5 L44 8"
        stroke="#c989b8"
        strokeLinejoin="round"
        fill="#e8b7d4"
      />
    </g>
  );
}

export function Lantern({
  special = false,
  dim = false,
  out = false,
  quiet = false,
  className = "",
}: LanternProps) {
  const id = useId().replace(/:/g, "");
  const paper = `${id}-paper`;
  const shine = `${id}-shine`;
  const sun = `${id}-sun`;
  const rays = Array.from({ length: 16 }, (_, index) => index);
  const lit = !out && !dim;

  return (
    <div className={`relative ${className}`}>
      {quiet ? null : (
        <>
          <div
            className={`absolute bottom-[-6%] left-1/2 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-700 ${
              out
                ? "h-[40%] w-[90%] bg-[#2a1a10]/0 opacity-0"
                : special
                  ? "h-[75%] w-[150%] bg-[#ffd27a]/90"
                  : dim
                    ? "h-[58%] w-[120%] bg-[#ffd27a]/60"
                    : "h-[68%] w-[140%] bg-[#ffd27a]/80"
            }`}
          />
          <div
            className={`absolute bottom-[2%] left-1/2 -translate-x-1/2 rounded-full blur-xl transition-opacity duration-700 ${
              out
                ? "opacity-0"
                : special
                  ? "h-[42%] w-[85%] bg-[#fff1b0]/85"
                  : dim
                    ? "h-[36%] w-[72%] bg-[#ffe08a]/55"
                    : "h-[40%] w-[80%] bg-[#ffe08a]/75"
            }`}
          />
          <div
            className={`absolute top-[18%] left-1/2 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-700 ${
              out
                ? "opacity-0"
                : special
                  ? "h-[62%] w-[95%] bg-[#ffd27a]/50"
                  : dim
                    ? "h-[50%] w-[78%] bg-[#ffd27a]/28"
                    : "h-[58%] w-[88%] bg-[#ffd27a]/42"
            }`}
          />
        </>
      )}
      <svg
        viewBox="0 0 80 128"
        className={`relative h-full w-full transition-[filter] duration-700 ${
          out || quiet
            ? "drop-shadow-none"
            : "drop-shadow-[0_0_22px_rgba(255,210,122,0.9)]"
        } ${special && lit && !quiet ? "animate-glow-pulse" : ""}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={paper} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={out ? "#3a2a22" : "#d8c3a0"} />
            <stop offset="18%" stopColor={out ? "#4a382c" : "#f6ead6"} />
            <stop offset="50%" stopColor={out ? "#5a4636" : "#fffdf7"} />
            <stop offset="82%" stopColor={out ? "#4a382c" : "#f6ead6"} />
            <stop offset="100%" stopColor={out ? "#2e2218" : "#cbb48d"} />
          </linearGradient>
          <radialGradient id={shine} cx="50%" cy="78%" r="72%">
            <stop offset="0%" stopColor="#fff6d2" stopOpacity={out ? "0" : "1"} />
            <stop offset="28%" stopColor="#ffd27a" stopOpacity={out ? "0" : "0.88"} />
            <stop offset="62%" stopColor="#ffb347" stopOpacity={out ? "0" : "0.42"} />
            <stop offset="100%" stopColor="#f6ead6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-base`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={out ? "#2a1c12" : "#fffdf2"} />
            <stop offset="35%" stopColor={out ? "#1a120c" : "#ffe08a"} />
            <stop offset="70%" stopColor={out ? "#120c08" : "#ffb347"} />
            <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sun} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={out ? "#3a2a18" : "#fff6d2"} />
            <stop offset="55%" stopColor={out ? "#2a1c10" : "#f0c94a"} />
            <stop offset="100%" stopColor={out ? "#1a1208" : "#c49212"} />
          </radialGradient>
        </defs>

        <ellipse cx="40" cy="18" rx="26" ry="7" fill="#f3e6cc" />
        <ellipse cx="40" cy="18" rx="18" ry="4.5" fill="#1a1038" opacity="0.18" />

        <rect x="14" y="18" width="52" height="92" fill={`url(#${paper})`} />
        <ellipse cx="40" cy="110" rx="26" ry="7" fill={`url(#${paper})`} />
        <rect x="14" y="18" width="52" height="92" fill={`url(#${shine})`} />
        <ellipse cx="40" cy="110" rx="20" ry="7" fill={`url(#${id}-base)`} />
        <ellipse cx="40" cy="107" rx="7" ry="9" fill="#fff6d2" opacity={out ? 0.08 : 0.95} />
        <path
          d="M14 18 V110"
          fill="none"
          stroke="#cbb48d"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <path
          d="M66 18 V110"
          fill="none"
          stroke="#cbb48d"
          strokeWidth="1.2"
          opacity="0.45"
        />

        <BorderBand y={24} />
        <BorderBand y={93} />

        <g transform="translate(40 64)">
          {rays.map((ray) => {
            const long = ray % 2 === 0;
            return (
              <path
                key={ray}
                d={
                  long
                    ? "M0 -26 C3.2 -16 3.2 -9 0 -4 C-3.2 -9 -3.2 -16 0 -26 Z"
                    : "M0 -18 C2.1 -12 2.1 -8 0 -5 C-2.1 -8 -2.1 -12 0 -18 Z"
                }
                fill={out ? "#3a2e1c" : "#ffd76a"}
                transform={`rotate(${ray * 22.5})`}
              />
            );
          })}
          <circle r="8" fill={`url(#${sun})`} />
          <circle r="4.2" fill="#fff6d2" opacity={out ? 0.08 : 0.7} />
        </g>
      </svg>
    </div>
  );
}
