"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pascal } from "@/components/atmosphere/Pascal";
import { Lantern } from "@/components/lanterns/Lantern";
import { MemoryModal } from "@/components/memories/MemoryModal";
import type { MemoriesPage, Memory } from "@/lib/story";

const PLACES = [
  { left: 8, top: 24, scale: 0.72, delay: 0.04 },
  { left: 18, top: 56, scale: 0.84, delay: 0.18 },
  { left: 11, top: 70, scale: 0.62, delay: 0.32 },
  { left: 28, top: 36, scale: 0.78, delay: 0.1 },
  { left: 32, top: 64, scale: 0.7, delay: 0.26 },
  { left: 40, top: 22, scale: 0.66, delay: 0.4 },
  { left: 46, top: 46, scale: 0.9, delay: 0.08 },
  { left: 38, top: 72, scale: 0.6, delay: 0.36 },
  { left: 54, top: 30, scale: 0.74, delay: 0.22 },
  { left: 58, top: 60, scale: 0.8, delay: 0.14 },
  { left: 50, top: 72, scale: 0.64, delay: 0.44 },
  { left: 68, top: 20, scale: 0.68, delay: 0.3 },
  { left: 72, top: 42, scale: 0.86, delay: 0.06 },
  { left: 64, top: 70, scale: 0.7, delay: 0.38 },
  { left: 82, top: 26, scale: 0.62, delay: 0.2 },
  { left: 86, top: 52, scale: 0.76, delay: 0.16 },
  { left: 78, top: 68, scale: 0.66, delay: 0.28 },
  { left: 22, top: 18, scale: 0.58, delay: 0.48 },
  { left: 90, top: 64, scale: 0.72, delay: 0.12 },
];

type MemorySkyProps = {
  page: MemoriesPage;
  onBack: () => void;
  onNext: () => void;
  onBusyChange?: (busy: boolean) => void;
};

export function MemorySky({ page, onBack, onNext, onBusyChange }: MemorySkyProps) {
  const [open, setOpen] = useState<Memory | null>(null);
  const [out, setOut] = useState<Set<string>>(new Set());

  useEffect(() => {
    onBusyChange?.(Boolean(open));
    return () => onBusyChange?.(false);
  }, [open, onBusyChange]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative z-10 h-full w-full">
      <div className="pointer-events-none absolute top-8 right-0 left-0 z-20 px-6 text-center">
        <h2 className="font-display text-3xl text-gold-bright sm:text-4xl">
          {page.title}
        </h2>
        <p className="mt-3 font-body text-lg text-parchment/80">{page.hint}</p>
      </div>

      {page.items.map((memory, index) => {
        const place = PLACES[index] ?? PLACES[index % PLACES.length];
        const size = 52 * place.scale;
        const extinguished = out.has(memory.id);

        return (
          <motion.button
            key={memory.id}
            type="button"
            aria-label={`Abrir memória ${memory.id}`}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: extinguished ? 0.72 : 1 }}
            transition={{ delay: extinguished ? 0 : place.delay, duration: 1.1, ease: "easeOut" }}
            onClick={() => {
              setOut((current) => new Set(current).add(memory.id));
              setOpen(memory);
            }}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${place.left}%`,
              top: `${place.top}%`,
              width: size,
              height: size * 1.62,
              marginLeft: -size / 2,
            }}
          >
            <div
              className={`h-full w-full ${extinguished ? "" : "animate-float-lantern"}`}
              style={{ animationDelay: `${index * 0.16}s` }}
            >
              <Lantern
                special={index === 6 && !extinguished}
                out={extinguished}
                className="h-full w-full"
              />
            </div>
          </motion.button>
        );
      })}

      <div className="absolute bottom-6 left-1/2 z-20 flex w-[min(92vw,28rem)] -translate-x-1/2 flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <button
          type="button"
          onClick={onBack}
          className="font-display text-xs tracking-[0.28em] text-gold/80 uppercase transition hover:text-gold-bright"
        >
          Voltar às dedicatórias
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-gold/50 bg-gold px-7 py-3 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_24px_rgba(232,197,71,0.4)] transition [@media(hover:hover)]:hover:bg-gold-bright"
        >
          Se precisar
        </button>
      </div>

      <Pascal
        spot="bottom-left"
        pose="lie"
        className="!left-4 !bottom-8 origin-bottom scale-110"
      />

      <AnimatePresence>
        {open ? (
          <MemoryModal key={open.id} memory={open} onClose={() => setOpen(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
