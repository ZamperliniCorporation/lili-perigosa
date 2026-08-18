import { useId } from "react";

type CoronaSunProps = {
  className?: string;
};

export function CoronaSun({ className = "h-16 w-16" }: CoronaSunProps) {
  const rays = Array.from({ length: 16 }, (_, index) => index);
  const fillId = useId();

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={fillId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d2" />
          <stop offset="55%" stopColor="#e8c547" />
          <stop offset="100%" stopColor="#c49212" />
        </radialGradient>
      </defs>
      {rays.map((ray) => {
        const long = ray % 2 === 0;
        return (
          <path
            key={ray}
            d={
              long
                ? "M50 6 C53 18 53 24 50 32 C47 24 47 18 50 6 Z"
                : "M50 14 C52 22 52 26 50 30 C48 26 48 22 50 14 Z"
            }
            fill="#e8c547"
            transform={`rotate(${ray * 22.5} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="14" fill={`url(#${fillId})`} />
      <circle cx="50" cy="50" r="8" fill="#fff6d2" opacity="0.55" />
    </svg>
  );
}
