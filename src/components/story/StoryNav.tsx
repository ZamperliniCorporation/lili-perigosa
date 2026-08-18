type StoryNavProps = {
  index: number;
  total: number;
  disabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function StoryNav({
  index,
  total,
  disabled = false,
  onPrev,
  onNext,
}: StoryNavProps) {
  return (
    <div
      className={`relative z-30 flex items-center justify-center gap-5 transition-opacity ${
        disabled ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        className="font-display text-xs tracking-[0.24em] text-gold/80 uppercase transition hover:text-gold-bright"
      >
        ← Página anterior
      </button>
      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: total }, (_, dot) => (
          <span
            key={dot}
            className={`h-1.5 w-1.5 rounded-full ${
              dot === index ? "bg-gold" : "bg-gold/30"
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="font-display text-xs tracking-[0.24em] text-gold/80 uppercase transition hover:text-gold-bright"
      >
        Virar página →
      </button>
    </div>
  );
}
