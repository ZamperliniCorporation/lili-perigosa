import { CoronaSun } from "@/components/atmosphere/CoronaSun";
import { Pascal } from "@/components/atmosphere/Pascal";
import type { CallPage } from "@/lib/story";

type CallStageProps = {
  page: CallPage;
  onBack: () => void;
};

export function CallStage({ page, onBack }: CallStageProps) {
  const href = `https://wa.me/${page.phone}?text=${encodeURIComponent(page.message)}`;

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <CoronaSun className="h-14 w-14 drop-shadow-[0_0_18px_rgba(232,197,71,0.75)]" />
      <h2 className="mt-6 font-script text-5xl leading-none text-gold-bright sm:text-6xl">
        {page.title}
      </h2>
      <p className="mt-5 max-w-sm font-body text-lg text-parchment/80 sm:text-xl">
        {page.subtitle}
      </p>

      <div className="relative mt-12 mb-4">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 inline-flex items-center rounded-full border border-gold/50 bg-gold px-8 py-4 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_28px_rgba(232,197,71,0.45)] transition [@media(hover:hover)]:hover:bg-gold-bright"
        >
          {page.cta}
        </a>
        <Pascal
          spot="bottom-right"
          pose="stand"
          className="pointer-events-auto !-right-14 !-bottom-3 origin-bottom scale-125 sm:!-right-[4.5rem] sm:!-bottom-2 sm:scale-150"
        />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-16 font-display text-xs tracking-[0.28em] text-gold/80 uppercase transition hover:text-gold-bright"
      >
        Voltar às memórias
      </button>
    </div>
  );
}
