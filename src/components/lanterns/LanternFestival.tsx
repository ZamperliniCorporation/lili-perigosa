"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Pascal } from "@/components/atmosphere/Pascal";
import { Lantern } from "@/components/lanterns/Lantern";
import type { LanternsPage } from "@/lib/story";

type LanternFestivalProps = {
  page: LanternsPage;
  onRelease: () => void;
};

export function LanternFestival({ page, onRelease }: LanternFestivalProps) {
  const [released, setReleased] = useState(false);

  function release() {
    if (released) {
      return;
    }
    setReleased(true);
    window.setTimeout(() => onRelease(), 2300);
  }

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <div className="relative z-20">
        <motion.button
          type="button"
          aria-label={page.cta}
          disabled={released}
          onClick={release}
          initial={{ y: 120, opacity: 0, scale: 0.86 }}
          animate={
            released
              ? { y: "-118dvh", opacity: 1, scale: 1.08 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={
            released
              ? { duration: 2.4, ease: [0.22, 0.8, 0.36, 1] }
              : { duration: 1.2, ease: "easeOut" }
          }
          className="h-44 w-28 cursor-pointer sm:h-52 sm:w-32"
        >
          <div className={released ? "" : "h-full w-full animate-float-lantern"}>
            <Lantern special className="h-full w-full" />
          </div>
        </motion.button>
        <motion.div
          animate={{ opacity: released ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <Pascal
            spot="bottom-right"
            pose="stand"
            className="pointer-events-auto !-right-14 !bottom-1 origin-bottom scale-125 sm:!-right-16"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: released ? 0 : 1, y: released ? 8 : 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-20 mt-10 text-center"
      >
        <h2 className="font-display text-3xl text-gold-bright sm:text-4xl">
          {page.title}
        </h2>
        <p className="mt-3 font-body text-lg text-parchment/80">{page.hint}</p>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: released ? 1 : 0 }}
        transition={{ duration: 1.8, delay: released ? 0.35 : 0, ease: "easeInOut" }}
      />
    </div>
  );
}
