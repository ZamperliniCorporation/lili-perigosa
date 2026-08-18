"use client";

import { CoronaSun } from "@/components/atmosphere/CoronaSun";
import { MagicalText } from "@/components/book/MagicalInk";
import type { ChapterBeat, ChapterPage } from "@/lib/story";

type ChapterContentProps = {
  page: ChapterPage;
  active?: boolean;
  writeDelay?: number;
};

function beatsOf(page: ChapterPage): ChapterBeat[] {
  return page.beats ?? [{ kind: "narration", text: page.body }];
}

export function ChapterContent({
  page,
  active = false,
  writeDelay = 0,
}: ChapterContentProps) {
  const titleDelay = writeDelay + page.chapter.length * 36 + 180;
  const bodyDelay = titleDelay + page.title.length * 38 + 220;
  const beats = beatsOf(page);
  const compact = beats.some((beat) => beat.kind === "speech") || beats.length > 2;
  const writingSpeed = 32;
  let nextDelay = bodyDelay;

  return (
    <div
      className={`relative flex h-full flex-col items-center px-2 text-center ${
        compact ? "justify-start pt-1" : "justify-center"
      }`}
    >
      <div
        className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
      >
        <CoronaSun
          className={compact ? "h-6 w-6 sm:h-8 sm:w-8" : "h-10 w-10 sm:h-12 sm:w-12"}
        />
      </div>
      <MagicalText
        text={page.chapter}
        active={active}
        delay={writeDelay}
        speed={34}
        className={`${compact ? "mt-1.5" : "mt-3"} font-display text-[0.7rem] tracking-[0.32em] text-royal-mid uppercase`}
      />
      <MagicalText
        as="h2"
        text={page.title}
        active={active}
        delay={titleDelay}
        speed={36}
        className={`mt-1.5 font-display font-semibold text-ink ${
          compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
        }`}
      />
      <div className={`${compact ? "mt-2.5" : "mt-4"} flex w-full flex-col items-center`}>
        {beats.map((beat, index) => {
          const delay = nextDelay;
          const previous = beats[index - 1];
          nextDelay +=
            beat.text.length * writingSpeed +
            (beat.kind === "speech" ? 420 : beat.kind === "closing" ? 720 : 260);
          const spacing =
            index === 0
              ? ""
              : beat.kind === "speech" && previous?.kind === "speech"
                ? "mt-1.5"
                : beat.kind === "closing"
                  ? "mt-3"
                  : "mt-2.5";

          if (beat.kind === "speech") {
            return (
              <MagicalText
                key={`${page.id}-${beat.text}`}
                text={beat.text}
                active={active}
                delay={delay}
                speed={writingSpeed}
                className={`${spacing} whitespace-nowrap font-body italic text-[clamp(0.78rem,2.15vw,1.02rem)] leading-none text-ink`}
              />
            );
          }

          if (beat.kind === "closing") {
            return (
              <MagicalText
                key={`${page.id}-${beat.text}`}
                text={beat.text}
                active={active}
                delay={delay}
                speed={writingSpeed}
                accent={beat.accent}
                className={`${spacing} max-w-sm font-body italic text-[0.95rem] leading-6 text-ink sm:max-w-md sm:text-base sm:leading-7`}
              />
            );
          }

          return (
            <MagicalText
              key={`${page.id}-${beat.text}`}
              text={beat.text}
              active={active}
              delay={delay}
              speed={writingSpeed}
              className={`${spacing} max-w-sm text-ink-soft sm:max-w-md ${
                compact
                  ? "text-sm leading-6 sm:text-base sm:leading-7"
                  : "text-base leading-7 sm:text-lg sm:leading-8"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
