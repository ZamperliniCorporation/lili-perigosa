import { ChapterContent } from "@/components/book/Chapter";
import type { ChapterPage } from "@/lib/story";

type BookPageSheetProps = {
  page: ChapterPage;
  className?: string;
  active?: boolean;
  writeDelay?: number;
};

export function BookPageSheet({
  page,
  className = "",
  active = false,
  writeDelay = 0,
}: BookPageSheetProps) {
  return (
    <div
      className={`paper absolute inset-0 rounded-[2px] text-ink shadow-[inset_18px_0_24px_-16px_rgba(90,40,10,0.2)] ${
        page.polaroidSpot === "bottom" ? "overflow-visible" : "overflow-hidden"
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-2 border border-gold/25" />
      <div className="pointer-events-none absolute top-3 left-4 text-gold/70">❧</div>
      <div className="pointer-events-none absolute top-3 right-4 text-gold/70">❧</div>
      <div className="pointer-events-none absolute bottom-3 left-4 rotate-180 text-gold/70">
        ❧
      </div>
      <div className="pointer-events-none absolute right-4 bottom-3 rotate-180 text-gold/70">
        ❧
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-[linear-gradient(to_left,rgba(58,39,24,0.12),transparent)]" />
      {active && page.polaroid ? (
        <div
          className={`pointer-events-none absolute z-10 bg-[#f6f0e2] p-[0.22rem] shadow-[2px_3px_10px_rgba(40,18,8,0.28)] ${
            page.polaroidSpot === "bottom"
              ? "-bottom-5 right-2 w-[4.4rem] rotate-[3deg] pb-3 sm:-bottom-6 sm:right-3 sm:w-[5.4rem] sm:pb-3.5"
              : "top-1.5 right-3 w-[4.1rem] rotate-[3deg] pb-3 sm:top-2 sm:right-4 sm:w-[5.2rem] sm:pb-3.5"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.polaroid}
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
      ) : null}
      {active ? (
        <div className="h-full px-5 py-4 sm:px-8 sm:py-5">
          <ChapterContent page={page} active writeDelay={writeDelay} />
        </div>
      ) : null}
    </div>
  );
}

export function PageBack() {
  return (
    <div className="paper absolute inset-0 overflow-hidden rounded-[2px] shadow-[inset_-18px_0_24px_-16px_rgba(90,40,10,0.18)]">
      <div className="pointer-events-none absolute inset-2 border border-gold/20" />
      <div className="pointer-events-none absolute top-3 left-4 text-gold/50">❧</div>
      <div className="pointer-events-none absolute top-3 right-4 text-gold/50">❧</div>
      <div className="pointer-events-none absolute bottom-3 left-4 rotate-180 text-gold/50">
        ❧
      </div>
      <div className="pointer-events-none absolute right-4 bottom-3 rotate-180 text-gold/50">
        ❧
      </div>
      <div className="flex h-full items-center justify-center opacity-30">
        <span className="font-display text-6xl text-royal-mid">❧</span>
      </div>
    </div>
  );
}
