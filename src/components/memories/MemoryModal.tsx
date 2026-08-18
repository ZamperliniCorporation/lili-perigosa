"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Memory } from "@/lib/story";

type MemoryModalProps = {
  memory: Memory;
  onClose: () => void;
  backdrop?: boolean;
  waitForPhoto?: boolean;
};

export function MemoryModal({
  memory,
  onClose,
  backdrop = true,
  waitForPhoto = true,
}: MemoryModalProps) {
  const [missing, setMissing] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const wide = (ratio ?? 0) >= 1.05;
  const compact = Boolean(memory.from);
  const revealed = !waitForPhoto || photoReady || missing;

  function handlePhoto(image: HTMLImageElement) {
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setRatio(image.naturalWidth / image.naturalHeight);
    }
    setPhotoReady(true);
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center px-4 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        type="button"
        aria-label="Fechar"
        className={`absolute inset-0 ${backdrop ? "bg-night-deep/72 backdrop-blur-sm" : ""}`}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.7, ease: [0.22, 0.72, 0.28, 1] }}
        className={`paper relative z-10 flex w-fit min-w-[18rem] max-h-[92dvh] flex-col overflow-hidden rounded-sm border-2 border-gold/70 px-5 pt-4 pb-4 shadow-[0_0_40px_rgba(232,197,71,0.22)] ${
          wide ? "max-w-[min(92vw,52rem)]" : "max-w-[min(92vw,28rem)]"
        }`}
      >
        {memory.from ? (
          <div className="mb-3 shrink-0 text-center">
            <p className="font-display text-[0.65rem] tracking-[0.32em] text-royal-mid uppercase">
              de
            </p>
            <p className="mt-1 font-script text-3xl leading-none text-royal sm:text-5xl">
              {memory.from}
            </p>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-hidden rounded-sm border border-gold/40">
          {missing ? (
            <div className="flex aspect-[4/5] max-h-[38dvh] w-72 items-center justify-center bg-[linear-gradient(160deg,#2a1040,#1a0a28)] px-6 text-center">
              <p className="font-display text-xs tracking-[0.24em] text-gold/70 uppercase">
                A foto entra aqui
              </p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={memory.photo}
              alt=""
              className={`mx-auto h-auto w-auto object-contain ${
                compact
                  ? "max-h-[min(38dvh,20rem)]"
                  : "max-h-[min(56dvh,28rem)]"
              } ${wide ? "max-w-[min(86vw,48rem)]" : "max-w-[min(86vw,24rem)]"}`}
              onLoad={(event) => handlePhoto(event.currentTarget)}
              onError={() => setMissing(true)}
            />
          )}
        </div>
        <p className="mt-3 shrink-0 text-center font-body text-base leading-6 text-ink sm:mt-5 sm:text-xl sm:leading-7">
          {memory.caption}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-3 block shrink-0 font-display text-[0.65rem] tracking-[0.28em] text-royal-mid uppercase transition hover:text-royal sm:mt-5"
        >
          Fechar
        </button>
      </motion.div>
    </motion.div>
  );
}
