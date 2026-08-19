"use client";

import { CoronaSun } from "@/components/atmosphere/CoronaSun";
import { MagicalText, inkDuration } from "@/components/book/MagicalInk";
import type { BackCoverPage, CoverPage } from "@/lib/story";

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M6 6 H34 M6 6 V34"
        fill="none"
        stroke="#e8c547"
        strokeWidth="1.3"
      />
      <path
        d="M10 10 Q24 10 24 24 Q10 24 10 10 Z"
        fill="none"
        stroke="#e8c547"
        strokeWidth="0.8"
        opacity="0.8"
      />
      <circle cx="10" cy="10" r="1.4" fill="#ffe9a3" />
    </svg>
  );
}

type CoverArtProps = {
  page: CoverPage;
};

export function CoverArt({ page }: CoverArtProps) {
  return (
    <div className="leather relative flex h-full flex-col overflow-hidden rounded-[2px]">
      <div className="leather-spine pointer-events-none absolute inset-y-0 left-0 z-20 w-3.5 shadow-[2px_0_8px_rgba(0,0,0,0.35)]">
        <span className="absolute top-[18%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[38%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[62%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[82%] right-1 left-1 h-px bg-gold/50" />
      </div>

      <div className="pointer-events-none absolute inset-[10px] border border-gold/55" />
      <div className="pointer-events-none absolute inset-[16px] border border-gold/25" />

      <CornerOrnament className="absolute top-3 left-5 h-10 w-10" />
      <CornerOrnament className="absolute top-3 right-3 h-10 w-10 rotate-90" />
      <CornerOrnament className="absolute bottom-3 left-5 h-10 w-10 -rotate-90" />
      <CornerOrnament className="absolute right-3 bottom-3 h-10 w-10 rotate-180" />

      <div className="relative flex h-full flex-col items-center justify-center px-7 pt-6 pb-6 pl-10">
        <CoronaSun className="h-14 w-14 sm:h-16 sm:w-16" />
        <div className="mt-2.5 text-center">
          <p className="font-script text-5xl leading-none text-gold-bright sm:text-6xl">
            {page.title}
          </p>
          <p className="mt-2.5 font-display text-[0.65rem] tracking-[0.38em] text-gold/90 uppercase">
            {page.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

type BackCoverArtProps = {
  page: BackCoverPage;
  active?: boolean;
  writeDelay?: number;
};

export function BackCoverArt({
  page,
  active = false,
  writeDelay = 0,
}: BackCoverArtProps) {
  const bodyDelay = writeDelay + inkDuration(page.kicker, 16);
  const promiseDelay = bodyDelay + inkDuration(page.body, 14);
  const signDelay = promiseDelay + inkDuration(page.promise, 14);

  return (
    <div className="leather relative flex h-full flex-col overflow-hidden rounded-[2px]">
      <div className="leather-spine pointer-events-none absolute inset-y-0 right-0 w-3.5 scale-x-[-1] shadow-[-2px_0_8px_rgba(0,0,0,0.35)]">
        <span className="absolute top-[18%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[38%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[62%] right-1 left-1 h-px bg-gold/50" />
        <span className="absolute top-[82%] right-1 left-1 h-px bg-gold/50" />
      </div>

      <div className="pointer-events-none absolute inset-[10px] border border-gold/55" />
      <div className="pointer-events-none absolute inset-[16px] border border-gold/25" />

      <CornerOrnament className="absolute top-3 left-3 h-10 w-10" />
      <CornerOrnament className="absolute top-3 right-5 h-10 w-10 rotate-90" />
      <CornerOrnament className="absolute bottom-3 left-3 h-10 w-10 -rotate-90" />
      <CornerOrnament className="absolute right-5 bottom-3 h-10 w-10 rotate-180" />

      <div className="relative flex h-full flex-col items-center justify-center px-7 py-8 pr-10 text-center">
        <CoronaSun className="h-12 w-12" />
        <MagicalText
          text={page.kicker}
          active={active}
          delay={writeDelay}
          speed={16}
          sparkle={false}
          className="mt-4 font-display text-[0.65rem] tracking-[0.38em] text-gold/90 uppercase"
        />
        <MagicalText
          text={page.body}
          active={active}
          delay={bodyDelay}
          speed={14}
          sparkle={false}
          accent="princesa Lili"
          accentClassName="text-[#e4c8ff]"
          className="mt-4 max-w-[16.5rem] text-[0.95rem] leading-6 text-gold-bright/90 sm:text-base sm:leading-7"
        />
        <MagicalText
          text={page.promise}
          active={active}
          delay={promiseDelay}
          speed={14}
          sparkle={false}
          className="mt-4 max-w-[16.5rem] text-sm leading-6 text-gold/85 sm:text-[0.95rem]"
        />
        <MagicalText
          text={page.signature}
          active={active}
          delay={signDelay}
          speed={16}
          sparkle={false}
          className="mt-6 font-script text-3xl leading-none text-gold-bright sm:text-4xl"
        />
      </div>
    </div>
  );
}
