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
      className={`paper absolute inset-0 overflow-hidden rounded-[2px] text-ink shadow-[inset_18px_0_24px_-16px_rgba(90,40,10,0.2)] ${className}`}
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
      <div className="h-full px-5 py-4 sm:px-8 sm:py-5">
        <ChapterContent page={page} active={active} writeDelay={writeDelay} />
      </div>
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
