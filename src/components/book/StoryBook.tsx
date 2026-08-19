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
  const backRef = useRef(showBack);
  const [inkDelay, setInkDelay] = useState(220);
  const [mountLeaves, setMountLeaves] = useState(isOpen);
  const [lastFolded, setLastFolded] = useState(false);
  const [pascalIndex, setPascalIndex] = useState(chapterIndex);
  const [pascalVisible, setPascalVisible] = useState(false);
  const closed = !isOpen;
  const pascalPage = chapters[pascalIndex];
  const mobileSpread = isOpen && !wide && !showBack;
  const openX = isOpen && !showBack ? (wide ? 180 : "50%") : 0;
  const openScale = mobileSpread ? 0.48 : 1;
  const bookBoxClass =
    "h-[min(74vh,40rem)] max-h-[74dvh] w-[min(86vw,26rem)]";
  const bookMove = {
    duration: showBack && !lastFolded ? TURN_MS / 1000 : isOpen ? 1.35 : 0.8,
    ease: coverEase,
  };

  useEffect(() => {
    if (isOpen) {
      setMountLeaves(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showBack) {
      setLastFolded(false);
      return;
    }
    setLastFolded(false);
    const timeout = window.setTimeout(() => setLastFolded(true), TURN_MS);
    return () => window.clearTimeout(timeout);
  }, [showBack]);

  useEffect(() => {
    if (!isOpen) {
      setPascalVisible(false);
      setPascalIndex(chapterIndex);
      return;
    }
    setPascalVisible(false);
    const timeout = window.setTimeout(() => {
      setPascalIndex(chapterIndex);
      setPascalVisible(true);
    }, TURN_MS + 520);
    return () => window.clearTimeout(timeout);
  }, [chapterIndex, isOpen]);

  useEffect(() => {
    const justOpened = !openRef.current && isOpen;
    const justClosed = openRef.current && !isOpen;
    const chapterChanged = chapterRef.current !== chapterIndex;
    const fromBack = backRef.current;
    openRef.current = isOpen;
    chapterRef.current = chapterIndex;
    backRef.current = showBack;

    if (justClosed) {
      if (showBack) {
        setInkDelay(420);
        onBusyChange?.(true);
        const timeout = window.setTimeout(() => {
          onBusyChange?.(false);
        }, 1400);
        return () => window.clearTimeout(timeout);
      }
      onBusyChange?.(false);
      return;
    }

    if (justOpened) {
      if (fromBack) {
        setInkDelay(120);
        onBusyChange?.(true);
        const timeout = window.setTimeout(() => {
          onBusyChange?.(false);
        }, TURN_MS + 40);
        return () => window.clearTimeout(timeout);
      }
      setInkDelay(220);
      onBusyChange?.(true);
      const timeout = window.setTimeout(() => {
        onBusyChange?.(false);
      }, 1100);
      return () => window.clearTimeout(timeout);
    }

    if (!isOpen || !chapterChanged) {
      return;
    }

    setInkDelay(120);
    onBusyChange?.(true);
    const timeout = window.setTimeout(() => {
      onBusyChange?.(false);
    }, TURN_MS + 40);
    return () => window.clearTimeout(timeout);
  }, [chapterIndex, isOpen, onBusyChange, showBack]);

  return (
    <div className="relative z-10 flex flex-col items-center px-3 sm:px-6">
      <div className="book-scene relative">
        <motion.div
          className={`relative ${bookBoxClass} overflow-visible`}
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: mobileSpread ? "left center" : "center center",
          }}
          initial={{ opacity: 0, y: 28, rotateY: -18, rotateX: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateY: isOpen ? 0 : showBack && lastFolded ? 18 : showBack ? 0 : -18,
            rotateX: isOpen || (showBack && !lastFolded) ? 0 : 8,
            x: openX,
            scale: openScale,
          }}
          whileHover={
            wide && !isOpen && (!showBack || lastFolded)
              ? { y: -8, rotateY: showBack ? 12 : -12 }
              : undefined
          }
          transition={bookMove}
        >
          <div
            className={`pointer-events-none absolute -bottom-8 h-8 rounded-[100%] bg-black/40 ${showBack ? "right-[8%] left-[4%]" : "left-[8%] right-[4%]"}`}
          />

          <div
            className="absolute inset-0 origin-left rounded-[2px] shadow-[0_28px_50px_rgba(0,0,0,0.45)]"
            style={{
              transform: "translateZ(-18px)",
              background:
                isOpen || showBack
                  ? "linear-gradient(160deg, #f4ead4 0%, #e8d9b8 100%)"
                  : "linear-gradient(160deg, #2a1040 0%, #1a0a28 100%)",
            }}
          />

          <motion.div
            className={`page-edge absolute top-[7px] bottom-[7px] ${showBack ? "rounded-l-[3px]" : "rounded-r-[3px]"}`}
            style={showBack ? { right: "100%" } : { left: "100%" }}
            initial={false}
            animate={{ opacity: closed && (!showBack || lastFolded) ? 1 : 0, width: closed && (!showBack || lastFolded) ? 16 : 0 }}
            transition={{ duration: 0.45 }}
          />

          <motion.div
            className="book-ribbon absolute top-[-6px] z-30 h-28 w-3 rounded-b-sm"
            style={showBack ? { left: "18%" } : { right: "18%" }}
            initial={false}
            animate={{ opacity: closed && (!showBack || lastFolded) ? 1 : 0, y: closed && (!showBack || lastFolded) ? 0 : -12 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            className={`absolute top-1/2 z-30 h-10 w-4 -translate-y-1/2 border border-gold-bright/80 bg-[linear-gradient(90deg,#c49212,#ffe9a3,#c49212)] shadow-[0_0_10px_rgba(232,197,71,0.45)] ${showBack ? "rounded-l-sm" : "rounded-r-sm"}`}
            style={showBack ? { right: "100%" } : { left: "100%" }}
            initial={false}
            animate={{
              opacity: closed && (!showBack || lastFolded) ? 1 : 0,
              x: closed && (!showBack || lastFolded) ? 0 : showBack ? -8 : 8,
            }}
            transition={{ duration: 0.3 }}
          />

          {mountLeaves
            ? chapters.map((page, index) => {
            if (Math.abs(index - chapterIndex) > 1) {
              return null;
            }
            const turned = isOpen && index < chapterIndex;
            const current = isOpen && index === chapterIndex;
            const hideLeaf = showBack && (index < chapterIndex || lastFolded);

            return (
              <motion.div
                key={page.id}
                className={`absolute inset-0 ${current ? "" : "pointer-events-none"}`}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  visibility: hideLeaf ? "hidden" : "visible",
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
            ? (wide ? [0, 1] : [0]).map((leaf) => (
            <motion.div
              key={`flyleaf-${leaf}`}
              className="pointer-events-none absolute inset-0"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                visibility: showBack ? "hidden" : "visible",
                zIndex: isOpen ? 45 + leaf : 34 - leaf,
              }}
              initial={false}
              animate={{ rotateY: isOpen || showBack ? -180 : 0 }}
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
              visibility: isOpen || showBack ? "hidden" : "visible",
              zIndex: isOpen || showBack ? 8 : 40,
            }}
            initial={false}
            animate={{ rotateY: isOpen || showBack ? -180 : 0 }}
            transition={{
              duration: 1.5,
              ease: coverEase,
              delay: isOpen ? 0 : showBack ? 0 : 0.16,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[2px] border-2 border-gold/80 shadow-[0_0_28px_rgba(232,197,71,0.16)]"
              style={{ backfaceVisibility: "hidden", transformStyle: "flat" }}
            >
              <CoverArt page={cover} />
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

          {showBack ? (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[2px]"
            style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              zIndex: 55,
            }}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: TURN_MS / 1000, ease: coverEase }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[2px] border-2 border-gold/80 shadow-[0_0_28px_rgba(232,197,71,0.16)]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "flat",
              }}
            >
              <BackCoverArt
                page={back}
                active={showBack && lastFolded}
                writeDelay={80}
              />
            </div>
            <div
              className="absolute inset-0 overflow-hidden rounded-[2px]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "flat",
              }}
            >
              <PageBack />
            </div>
          </motion.div>
          ) : null}
        </motion.div>
        <motion.div
          className={`pointer-events-none absolute top-0 left-0 z-[80] ${bookBoxClass} overflow-visible`}
          initial={false}
          animate={{ x: openX, scale: openScale }}
          style={{
            transformOrigin: mobileSpread ? "left center" : "center center",
          }}
          transition={bookMove}
        >
          {closed && (!showBack || lastFolded) ? (
            <Pascal
              spot={showBack ? "bottom-left" : "bottom-right"}
              pose="stand"
              settle
              className="pointer-events-auto"
            />
          ) : null}
          {isOpen && pascalVisible && pascalPage?.pascal ? (
            <Pascal
              key={pascalPage.id}
              spot={pascalPage.pascal}
              pose={pascalPage.pascalPose}
              className="pointer-events-auto"
            />
          ) : null}
        </motion.div>
      </div>

      <div className="relative mt-6 flex min-h-12 w-full max-w-[min(92vw,36rem)] items-center justify-center">
        {isOpen || showBack ? (
          footer
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full border border-gold/50 bg-gold px-8 py-3 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_24px_rgba(232,197,71,0.4)] [@media(hover:hover)]:hover:bg-gold-bright"
          >
            {cover.cta}
          </button>
        )}
      </div>
    </div>
  );
}
