"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CoronaSun } from "@/components/atmosphere/CoronaSun";
import { Lantern } from "@/components/lanterns/Lantern";

export const OPENING_MS = 27_000;

const LANTERNS = [
  { left: 7, size: 46, delay: 1.2, duration: 24, sway: 18 },
  { left: 16, size: 34, delay: 3.4, duration: 22, sway: -14 },
  { left: 24, size: 40, delay: 5.1, duration: 21, sway: 10 },
  { left: 73, size: 42, delay: 2.0, duration: 23, sway: -16 },
  { left: 82, size: 36, delay: 4.2, duration: 22, sway: 12 },
  { left: 90, size: 50, delay: 6.0, duration: 20, sway: -8 },
];

type FilmOpeningProps = {
  onComplete: () => void;
};

export function FilmOpening({ onComplete }: FilmOpeningProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onCompleteRef.current();
    }, OPENING_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-black"
        initial={{ height: 0 }}
        animate={{ height: ["0vh", "11vh", "11vh", "0vh"] }}
        transition={{
          duration: 27,
          times: [0, 0.09, 0.9, 1],
          ease: [0.22, 0.72, 0.28, 1],
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-black"
        initial={{ height: 0 }}
        animate={{ height: ["0vh", "11vh", "11vh", "0vh"] }}
        transition={{
          duration: 27,
          times: [0, 0.09, 0.9, 1],
          ease: [0.22, 0.72, 0.28, 1],
        }}
      />

      {LANTERNS.map((lantern) => (
        <motion.div
          key={lantern.left}
          className="pointer-events-none absolute"
          initial={{ y: "110vh", x: 0, opacity: 0 }}
          animate={{
            y: "-28vh",
            x: [0, lantern.sway, -lantern.sway * 0.6, lantern.sway * 0.3],
            opacity: [0, 1, 1, 0.85],
          }}
          transition={{
            delay: lantern.delay,
            duration: lantern.duration,
            ease: "linear",
          }}
          style={{
            left: `${lantern.left}%`,
            width: lantern.size,
            height: lantern.size * 1.6,
          }}
        >
          <Lantern className="h-full w-full" />
        </motion.div>
      ))}

      <div className="relative z-30 flex h-full items-center justify-center px-6 text-center">
        <motion.div
          className="absolute top-[18%] sm:top-[20%]"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.86, 1, 1, 1.05] }}
          transition={{ duration: 23.5, times: [0, 0.08, 0.9, 1], ease: "easeOut" }}
        >
          <CoronaSun className="h-16 w-16 drop-shadow-[0_0_22px_rgba(232,197,71,0.8)] sm:h-20 sm:w-20" />
        </motion.div>

        <motion.p
          className="absolute max-w-sm font-body text-lg text-parchment/80 sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8] }}
          transition={{ delay: 3.1, duration: 6.2, times: [0, 0.18, 0.78, 1] }}
        >
          Certa vez, numa noite de lanternas
        </motion.p>

        <div className="absolute flex flex-col items-center">
          <motion.h1
            className="font-script text-5xl leading-none text-gold-bright sm:text-7xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -10] }}
            transition={{ delay: 9.2, duration: 12.4, times: [0, 0.12, 0.86, 1] }}
          >
            Para a princesa Lili
          </motion.h1>
          <motion.p
            className="mt-5 font-display text-[0.7rem] tracking-[0.42em] text-gold/90 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: 12.4, duration: 9.2, times: [0, 0.16, 0.84, 1] }}
          >
            aos dezenove anos
          </motion.p>
        </div>

        <motion.div
          className="absolute mt-28 flex flex-col items-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
          transition={{ delay: 21.4, duration: 4.4, times: [0, 0.22, 0.72, 1] }}
        >
          <p className="font-script text-3xl text-gold-bright sm:text-4xl">de Zamp</p>
          <p className="mt-3 font-body text-base text-parchment/70 sm:text-lg">
            A história começa:
          </p>
        </motion.div>
      </div>
    </div>
  );
}

type OpeningGateProps = {
  onStart: () => void;
};

export function OpeningGate({ onStart }: OpeningGateProps) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
    >
      <CoronaSun className="h-14 w-14 drop-shadow-[0_0_18px_rgba(232,197,71,0.7)]" />
      <p className="mt-8 font-display text-[0.7rem] tracking-[0.38em] text-gold/80 uppercase">
        Toque para começar
      </p>
    </button>
  );
}
