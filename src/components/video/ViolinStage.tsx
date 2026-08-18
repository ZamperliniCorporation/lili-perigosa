import { CoronaSun } from "@/components/atmosphere/CoronaSun";
import { Pascal } from "@/components/atmosphere/Pascal";
import type { VideoPage } from "@/lib/story";

type ViolinStageProps = {
  page: VideoPage;
  onBack: () => void;
  onNext: () => void;
};

export function ViolinStage({ page, onBack, onNext }: ViolinStageProps) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <CoronaSun className="h-12 w-12 drop-shadow-[0_0_16px_rgba(232,197,71,0.7)]" />
      <h2 className="mt-4 w-full px-2 text-center font-display text-2xl leading-tight text-gold-bright sm:text-4xl">
        {page.title}
      </h2>
      <div className="relative mt-8 w-full max-w-3xl">
        <div className="flex aspect-video w-full items-center justify-center rounded-sm border-2 border-gold/70 bg-black/45 shadow-[0_0_50px_rgba(232,197,71,0.18)]">
          <div className="px-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 text-gold">
              ▶
            </div>
            <p className="max-w-md text-lg text-parchment/80">{page.note}</p>
          </div>
        </div>
        <Pascal
          spot="bottom-right"
          pose="stand"
          className="!-right-3 !-bottom-2 origin-bottom scale-125 sm:!-right-7 sm:!-bottom-3"
        />
      </div>
      <div className="mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-5 px-2 sm:gap-8">
        <button
          type="button"
          onClick={onBack}
          className="font-display text-xs tracking-[0.28em] text-gold/80 uppercase transition hover:text-gold-bright"
        >
          Voltar às lanternas
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-gold/50 bg-gold px-7 py-3 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_24px_rgba(232,197,71,0.4)] transition hover:bg-gold-bright"
        >
          Dedicatórias
        </button>
      </div>
    </div>
  );
}
