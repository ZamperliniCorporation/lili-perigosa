type BookShellProps = {
  children: React.ReactNode;
};

export function BookShell({ children }: BookShellProps) {
  return (
    <article className="paper relative w-[min(92vw,38rem)] min-h-[min(72vh,34rem)] overflow-hidden rounded-sm border border-gold/50 px-8 py-10 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_22px_0_28px_-18px_rgba(90,40,10,0.22)] sm:px-12 sm:py-12">
      <div className="pointer-events-none absolute inset-2 rounded-sm border border-gold/25" />
      <div className="pointer-events-none absolute top-3 left-4 text-gold/70">❧</div>
      <div className="pointer-events-none absolute top-3 right-4 text-gold/70">❧</div>
      <div className="pointer-events-none absolute bottom-3 left-4 rotate-180 text-gold/70">❧</div>
      <div className="pointer-events-none absolute right-4 bottom-3 rotate-180 text-gold/70">❧</div>
      {children}
    </article>
  );
}
