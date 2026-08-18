"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pascal } from "@/components/atmosphere/Pascal";
import { Lantern } from "@/components/lanterns/Lantern";
import { MemoryModal } from "@/components/memories/MemoryModal";
import type { DedicationsPage } from "@/lib/story";

type DedicationLanternsProps = {
  page: DedicationsPage;
  onComplete: () => void;
  onBack: () => void;
  onBusyChange?: (busy: boolean) => void;
};

export function DedicationLanterns({
  page,
  onComplete,
  onBack,
  onBusyChange,
}: DedicationLanternsProps) {
  const items = page.items ?? [];
  const [step, setStep] = useState(0);
  const [rising, setRising] = useState(false);
  const [open, setOpen] = useState(false);
  const safeStep = Math.min(Math.max(step, 0), Math.max(items.length - 1, 0));
  const item = items[safeStep];

  useEffect(() => {
    for (const memory of items) {
      const image = new window.Image();
      image.src = memory.photo;
    }
  }, [items]);

  useEffect(() => {
    return () => onBusyChange?.(false);
  }, [onBusyChange]);

  useEffect(() => {
    if (!rising || !item) {
      return;
    }

    const timeout = window.setTimeout(() => setOpen(true), 1600);
    return () => window.clearTimeout(timeout);
  }, [item, rising, step]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        closeModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  function release() {
    if (!item || rising || open) {
      return;
    }
    setRising(true);
  }

  function closeModal() {
    setOpen(false);
    setRising(false);

    if (safeStep >= items.length - 1) {
      onComplete();
      return;
    }

    setStep((current) => current + 1);
  }

  if (!item) {
    return null;
  }

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          className="relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.button
            type="button"
            aria-label={`${page.cta} ${step + 1} de ${page.items.length}`}
            disabled={rising || open}
            onClick={release}
            initial={{ y: 120, opacity: 0, scale: 0.86 }}
            animate={
              rising
                ? { y: "-118dvh", opacity: 1, scale: 1.08 }
                : { y: 0, opacity: 1, scale: 1 }
            }
            transition={
              rising
                ? { duration: 2.4, ease: [0.22, 0.8, 0.36, 1] }
                : { duration: 1.2, ease: "easeOut" }
            }
            className="h-44 w-28 cursor-pointer sm:h-52 sm:w-32"
          >
            <div className={rising ? "" : "h-full w-full animate-float-lantern"}>
              <Lantern special className="h-full w-full" />
            </div>
          </motion.button>
          <motion.div
            animate={{ opacity: rising ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Pascal
              spot="bottom-right"
              pose="stand"
              className="pointer-events-auto !-right-14 !bottom-1 origin-bottom scale-125 sm:!-right-16"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: rising || open ? 0 : 1, y: rising || open ? 8 : 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-20 mt-10 text-center"
      >
        <h2 className="font-display text-3xl text-gold-bright sm:text-4xl">
          {page.title}
        </h2>
        <p className="mt-3 font-body text-lg text-parchment/80">{page.hint}</p>
        <p className="mt-2 font-display text-[0.65rem] tracking-[0.32em] text-gold/70 uppercase">
          {step + 1} de {page.items.length}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 font-display text-xs tracking-[0.28em] text-gold/80 uppercase transition hover:text-gold-bright"
        >
          Voltar à música
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <MemoryModal
            key={item.id}
            memory={item}
            onClose={closeModal}
            backdrop={false}
            waitForPhoto
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
