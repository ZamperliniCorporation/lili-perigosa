"use client";

import { motion } from "motion/react";
import type { PascalSpot } from "@/lib/story";

export type { PascalSpot };

export type PascalPose = "stand" | "lie";

const SPOT_CLASS: Record<PascalSpot, string> = {
  "bottom-right": "-right-5 -bottom-4",
  "bottom-left": "-left-4 -bottom-4",
  "top-right": "-right-5 -top-4",
  "top-left": "-left-4 -top-3",
  "rim-left": "-right-8 bottom-24",
  "rim-right": "-right-6 bottom-10",
};

const FLIP: Record<PascalSpot, boolean> = {
  "bottom-right": true,
  "bottom-left": false,
  "top-right": true,
  "top-left": false,
  "rim-left": true,
  "rim-right": true,
};

const ENTER: Record<PascalSpot, { x: number; y: number }> = {
  "bottom-right": { x: 0, y: 72 },
  "bottom-left": { x: 0, y: 72 },
  "top-right": { x: 0, y: -72 },
  "top-left": { x: 0, y: -72 },
  "rim-left": { x: 72, y: 0 },
  "rim-right": { x: 72, y: 0 },
};

const POSE = {
  stand: {
    src: "/assets/pascal-de-pe.png",
    className: "h-[4.8rem] w-auto",
  },
  lie: {
    src: "/assets/pascal-deitado.png",
    className: "h-[3.1rem] w-auto",
  },
} as const;

type PascalProps = {
  spot?: PascalSpot;
  pose?: PascalPose;
  className?: string;
  settle?: boolean;
};

export function Pascal({
  spot = "bottom-right",
  pose = "stand",
  className = "",
  settle = false,
}: PascalProps) {
  const flip = FLIP[spot];
  const photo = POSE[pose];
  const enter = ENTER[spot];

  return (
    <motion.button
      type="button"
      aria-label="Pascal está escondido aqui"
      className={`absolute z-40 cursor-pointer ${SPOT_CLASS[spot]} ${className}`}
      initial={settle ? false : { x: enter.x, y: enter.y }}
      animate={{ x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt=""
        className={`pointer-events-none select-none ${photo.className} ${
          flip ? "-scale-x-100" : ""
        }`}
        draggable={false}
      />
    </motion.button>
  );
}
