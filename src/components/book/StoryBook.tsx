"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BackCoverArt, CoverArt } from "@/components/book/Cover";
import { BookPageSheet, PageBack } from "@/components/book/BookPageSheet";
import { Pascal } from "@/components/atmosphere/Pascal";
import type { BackCoverPage, ChapterPage, CoverPage } from "@/lib/story";

const coverEase = [0.22, 0.72, 0.28, 1] as const;
const TURN_MS = 900;

type StoryBookProps = {
  cover: CoverPage;
  back: BackCoverPage;
  chapters: ChapterPage[];
  chapterIndex: number;
  isOpen: boolean;
  showBack?: boolean;
  onOpen: () => void;
  onBusyChange?: (busy: boolean) => void;
  footer?: React.ReactNode;
};

function subscribeMedia(query: string, onChange: (matches: boolean) => void) {
  const media = window.matchMedia(query);
  const sync = () => onChange(media.matches);
  sync();
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }
  media.addListener(sync);
  return () => media.removeListener(sync);
}

function useWideScreen() {
  const [wide, setWide] = useState(false);

  useEffect(() => subscribeMedia("(min-width: 768px)", setWide), []);

  return wide;
}

function leafZ(index: number, current: number) {
  if (index < current) {
    return 50 + index;
  }
  if (index === current) {
    return 30;
  }
  return 12 - (index - current);
}

export function StoryBook({
  cover,
  back,
  chapters,
  chapterIndex,
  isOpen,
  showBack = false,
  onOpen,
  onBusyChange,
  footer,
}: StoryBookProps) {
  const wide = useWideScreen();
  const openRef = useRef(isOpen);
  const chapterRef = useRef(chapterIndex);
  const [inkDelay, setInkDelay] = useState(800);
  const [pascalReady, setPascalReady] = useState(true);
  const [mountLeaves, setMountLeaves] = useState(isOpen);
  const closed = !isOpen;

  useEffect(() => {
    if (isOpen) {
      setMountLeaves(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const justOpened = !openRef.current && isOpen;
    const justClosed = openRef.current && !isOpen;
    const chapterChanged = chapterRef.current !== chapterIndex;
    openRef.current = isOpen;
    chapterRef.current = chapterIndex;

    if (justClosed) {
      if (showBack) {
        setInkDelay(1100);
        setPascalReady(false);
        onBusyChange?.(true);
        const timeout = window.setTimeout(() => {
          setPascalReady(true);
          onBusyChange?.(false);
        }, 1600);
        return () => window.clearTimeout(timeout);
      }
      setPascalReady(true);
      onBusyChange?.(false);
      return;
    }

    if (justOpened) {
      setInkDelay(800);
      setPascalReady(false);
      onBusyChange?.(true);
      const timeout = window.setTimeout(() => {
        setPascalReady(true);
        onBusyChange?.(false);
      }, 1550);
      return () => window.clearTimeout(timeout);
    }

    if (!isOpen || !chapterChanged) {
      return;
    }

    setInkDelay(120);
    setPascalReady(false);
    onBusyChange?.(true);
    const timeout = window.setTimeout(() => {
      setPascalReady(true);
      onBusyChange?.(false);
    }, TURN_MS + 40);
    return () => window.clearTimeout(timeout);
  }, [chapterIndex, isOpen, onBusyChange, showBack]);

  return (
    <div className="relative z-10 flex flex-col items-center px-6">
      <div className="book-scene">
        <motion.div
          className="relative h-[min(74vh,40rem)] max-h-[74dvh] w-[min(86vw,26rem)] overflow-visible"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 28, rotateY: -18, rotateX: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateY: isOpen ? 0 : showBack ? 18 : -18,
            rotateX: isOpen ? 0 : 8,
            x: isOpen && wide ? 180 : 0,
          }}
          whileHover={
            wide && !isOpen
              ? { y: -8, rotateY: showBack ? 12 : -12 }
              : undefined
          }
          transition={{ duration: isOpen ? 1.35 : 0.8, ease: coverEase }}
        >
          <div
            className={`pointer-events-none absolute -bottom-8 h-8 rounded-[100%] bg-black/40 ${showBack ? "right-[8%] left-[4%]" : "left-[8%] right-[4%]"}`}
          />

          <div
            className="absolute inset-0 origin-left rounded-[2px] shadow-[0_28px_50px_rgba(0,0,0,0.45)]"
            style={{
              transform: "translateZ(-18px)",
              background: "linear-gradient(160deg, #2a1040 0%, #1a0a28 100%)",
            }}
          />

          <motion.div
            className={`page-edge absolute top-[7px] bottom-[7px] ${showBack ? "rounded-l-[3px]" : "rounded-r-[3px]"}`}
            style={showBack ? { right: "100%" } : { left: "100%" }}
            initial={false}
            animate={{ opacity: closed ? 1 : 0, width: closed ? 16 : 0 }}
            transition={{ duration: 0.45 }}
          />

          <motion.div
            className="book-ribbon absolute top-[-6px] z-30 h-28 w-3 rounded-b-sm"
            style={showBack ? { left: "18%" } : { right: "18%" }}
            initial={false}
            animate={{ opacity: closed ? 1 : 0, y: closed ? 0 : -12 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            className={`absolute top-1/2 z-30 h-10 w-4 -translate-y-1/2 border border-gold-bright/80 bg-[linear-gradient(90deg,#c49212,#ffe9a3,#c49212)] shadow-[0_0_10px_rgba(232,197,71,0.45)] ${showBack ? "rounded-l-sm" : "rounded-r-sm"}`}
            style={showBack ? { right: "100%" } : { left: "100%" }}
            initial={false}
            animate={{ opacity: closed ? 1 : 0, x: closed ? 0 : showBack ? -8 : 8 }}
            transition={{ duration: 0.3 }}
          />

          {mountLeaves
            ? chapters.map((page, index) => {
            const turned = isOpen && index < chapterIndex;
            const current = isOpen && index === chapterIndex;

            return (
              <motion.div
                key={page.id}
                className={`absolute inset-0 ${current ? "" : "pointer-events-none"}`}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  zIndex: isOpen ? leafZ(index, chapterIndex) : 10 - index,
                }}
                initial={false}
                animate={{ rotateY: turned ? -180 : 0 }}
                transition={{ duration: TURN_MS / 1000, ease: coverEase }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: "hidden", transformStyle: "flat" }}
                >
                  <BookPageSheet
                    page={page}
                    active={current}
                    writeDelay={inkDelay}
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    transformStyle: "flat",
                  }}
                >
                  <PageBack />
                </div>
              </motion.div>
            );
          })
            : null}

          {mountLeaves
            ? [0, 1].map((leaf) => (
            <motion.div
              key={`flyleaf-${leaf}`}
              className="pointer-events-none absolute inset-0"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex: isOpen ? 45 + leaf : 34 - leaf,
              }}
              initial={false}
              animate={{ rotateY: isOpen ? -180 : 0 }}
              transition={{
                duration: 1.15,
                ease: coverEase,
                delay: isOpen ? 0.1 + leaf * 0.08 : 0.05 * leaf,
              }}
            >
              <div
                className="paper absolute inset-0 rounded-[2px]"
                style={{ backfaceVisibility: "hidden", transformStyle: "flat" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  transformStyle: "flat",
                }}
              >
                <PageBack />
              </div>
            </motion.div>
          ))
            : null}

          <motion.button
            type="button"
            aria-label={cover.cta}
            disabled={isOpen || showBack}
            onClick={onOpen}
            className="absolute inset-0 rounded-[2px] text-left disabled:pointer-events-none"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              zIndex: 40,
            }}
            initial={false}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{
              duration: 1.5,
              ease: coverEase,
              delay: isOpen ? 0 : 0.16,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[2px] border-2 border-gold/80 shadow-[0_0_28px_rgba(232,197,71,0.16)]"
              style={{ backfaceVisibility: "hidden", transformStyle: "flat" }}
            >
              {showBack ? (
                <BackCoverArt page={back} active={showBack} writeDelay={1100} />
              ) : (
                <CoverArt page={cover} />
              )}
            </div>
            <div
              className="absolute inset-0 overflow-hidden rounded-[2px]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "flat",
              }}
            >
              <PageBack />
            </div>
          </motion.button>

          <div
            className="pointer-events-none absolute inset-0 z-[80] overflow-visible"
            style={{ transformStyle: "flat" }}
          >
            {pascalReady && closed ? (
              <Pascal
                spot={showBack ? "bottom-left" : "bottom-right"}
                pose="stand"
                className="pointer-events-auto"
              />
            ) : null}
            {pascalReady && isOpen && chapters[chapterIndex]?.pascal ? (
              <Pascal
                key={chapters[chapterIndex].id}
                spot={chapters[chapterIndex].pascal}
                pose={chapters[chapterIndex].pascalPose}
                className="pointer-events-auto"
              />
            ) : null}
          </div>
        </motion.div>
      </div>

      <div className="relative mt-6 flex min-h-12 w-full max-w-[min(92vw,36rem)] items-center justify-center">
        <motion.button
          type="button"
          onClick={onOpen}
          disabled={isOpen || showBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen || showBack ? 0 : 1 }}
          transition={{ delay: isOpen || showBack ? 0 : 0.45, duration: 0.3 }}
          className="absolute rounded-full border border-gold/50 bg-gold px-8 py-3 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_24px_rgba(232,197,71,0.4)] transition hover:bg-gold-bright disabled:pointer-events-none"
        >
          {cover.cta}
        </motion.button>
        {footer}
      </div>
    </div>
  );
}
