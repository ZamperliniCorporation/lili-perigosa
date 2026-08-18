"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Memory } from "@/lib/story";

type MemoryModalProps = {
  memory: Memory;
  onClose: () => void;
  backdrop?: boolean;
};

export function MemoryModal({
  memory,
  onClose,
  backdrop = true,
}: MemoryModalProps) {
  const [missing, setMissing] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const wide = (ratio ?? 0) >= 1.05;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
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
        initial={{ y: 28, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 0.72, 0.28, 1] }}
        className={`paper relative z-10 w-fit min-w-[18rem] overflow-hidden rounded-sm border-2 border-gold/70 px-5 pt-5 pb-6 shadow-[0_0_40px_rgba(232,197,71,0.22)] ${
          wide ? "max-w-[min(92vw,52rem)]" : "max-w-[min(92vw,28rem)]"
        }`}
      >
        {memory.from ? (
          <div className="mb-4 text-center">
            <p className="font-display text-[0.65rem] tracking-[0.32em] text-royal-mid uppercase">
              de
            </p>
            <p className="mt-1 font-script text-4xl leading-none text-royal sm:text-5xl">
              {memory.from}
            </p>
          </div>
        ) : null}
        <div className="overflow-hidden rounded-sm border border-gold/40">
          {missing ? (
            <div className="flex aspect-[4/5] w-72 items-center justify-center bg-[linear-gradient(160deg,#2a1040,#1a0a28)] px-6 text-center">
              <p className="font-display text-xs tracking-[0.24em] text-gold/70 uppercase">
                A foto entra aqui
              </p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={memory.photo}
              alt=""
              className={`mx-auto h-auto w-auto max-h-[62dvh] object-contain ${
                wide ? "max-w-[min(86vw,48rem)]" : "max-w-[min(86vw,24rem)]"
              }`}
              onLoad={(event) => {
                const image = event.currentTarget;
                setRatio(image.naturalWidth / image.naturalHeight);
              }}
              onError={() => setMissing(true)}
            />
          )}
        </div>
        <p className="mt-5 text-center font-body text-lg leading-7 text-ink sm:text-xl">
          {memory.caption}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-5 block font-display text-[0.65rem] tracking-[0.28em] text-royal-mid uppercase transition hover:text-royal"
        >
          Fechar
        </button>
      </motion.div>
    </motion.div>
  );
}
