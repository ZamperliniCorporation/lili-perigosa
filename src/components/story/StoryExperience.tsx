"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FilmOpening, OpeningGate } from "@/components/atmosphere/FilmOpening";
import { NightSky } from "@/components/atmosphere/NightSky";
import { StoryBook } from "@/components/book/StoryBook";
import { AmbientLanterns } from "@/components/lanterns/AmbientLanterns";
import { DedicationLanterns } from "@/components/lanterns/DedicationLanterns";
import { LanternFestival } from "@/components/lanterns/LanternFestival";
import { MemorySky } from "@/components/memories/MemorySky";
import { StoryNav } from "@/components/story/StoryNav";
import { CallStage } from "@/components/story/CallStage";
import { ViolinStage } from "@/components/video/ViolinStage";
import { playOpenSpell, playPageTurn, unlockMagicAudio } from "@/lib/magicAudio";
import { story } from "@/lib/story";
import type { BackCoverPage, ChapterPage, CoverPage } from "@/lib/story";

const PROGRESS_KEY = "lili-perigosa-progress";

function readProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { index?: number };
    if (typeof parsed.index !== "number" || parsed.index < 0) {
      return null;
    }
    return parsed.index;
  } catch {
    return null;
  }
}

const pageMotion = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const coverPage = story.find((page) => page.kind === "cover") as CoverPage;
const backPage = story.find((page) => page.kind === "back") as BackCoverPage;
const chapters = story.filter(
  (page): page is ChapterPage => page.kind === "chapter",
);

export function StoryExperience() {
  const [booting, setBooting] = useState(true);
  const [overture, setOverture] = useState<"gate" | "playing" | "done">("gate");
  const [index, setIndex] = useState(0);
  const [navVisible, setNavVisible] = useState(false);
  const [bookBusy, setBookBusy] = useState(false);
  const [compact, setCompact] = useState(false);
  const previousIndex = useRef(0);
  const page = story[index] ?? story[0];
  const lastIndex = story.length - 1;
  const isBookStage =
    page.kind === "cover" || page.kind === "chapter" || page.kind === "back";
  const storyReady = overture === "done";
  const chapterIndex =
    page.kind === "chapter"
      ? Math.max(
          0,
          chapters.findIndex((chapter) => chapter.id === page.id),
        )
      : page.kind === "back"
        ? Math.max(0, chapters.length - 1)
        : 0;

  function startOpening() {
    void unlockMagicAudio();
    setOverture("playing");
  }

  useEffect(() => {
    const saved = readProgress();
    if (saved !== null && saved > 0) {
      setIndex(Math.min(saved, lastIndex));
      setOverture("done");
    }
    setBooting(false);

    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(media.matches);
    sync();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, [lastIndex]);

  useEffect(() => {
    if (overture !== "done") {
      return;
    }
    try {
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ index }));
    } catch {
      return;
    }
  }, [index, overture]);

  function goTo(nextIndex: number, force = false) {
    if (!storyReady || (bookBusy && !force)) {
      return;
    }

    const clamped = Math.min(Math.max(nextIndex, 0), lastIndex);
    if (clamped === index) {
      return;
    }

    const nextPage = story[clamped];
    if (page.kind === "cover" && nextPage.kind === "chapter") {
      void playOpenSpell();
    }

    const turningPages =
      (page.kind === "chapter" && nextPage.kind === "chapter") ||
      (page.kind === "chapter" && nextPage.kind === "back") ||
      (page.kind === "back" && nextPage.kind === "chapter");
    if (turningPages) {
      void playPageTurn(clamped > index ? 1 : -1);
    }

    const stayingInBook =
      (page.kind === "chapter" || page.kind === "back") &&
      (nextPage.kind === "chapter" || nextPage.kind === "back");
    if (stayingInBook) {
      setBookBusy(true);
    }
    if (page.kind === "cover" && nextPage.kind === "chapter") {
      setBookBusy(true);
    }

    setIndex(clamped);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (overture === "gate" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        startOpening();
        return;
      }

      if (!storyReady) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "Enter") {
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookBusy, index, overture, storyReady]);

  useEffect(() => {
    const openedFromCover = previousIndex.current === 0 && index > 0;
    previousIndex.current = index;

    if (!storyReady || (page.kind !== "chapter" && page.kind !== "back")) {
      setNavVisible(false);
      return;
    }

    const timeout = window.setTimeout(
      () => setNavVisible(true),
      openedFromCover || page.kind === "back" ? 450 : 180,
    );

    return () => window.clearTimeout(timeout);
  }, [index, page.kind, storyReady]);

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <NightSky />
      {!booting &&
      overture !== "gate" &&
      page.kind !== "lanterns" &&
      page.kind !== "video" &&
      page.kind !== "memories" &&
      !(compact && isBookStage) ? (
        <AmbientLanterns sides={page.kind === "dedications"} />
      ) : null}
      {storyReady && page.kind !== "cover" && page.kind !== "chapter" ? (
        <button
          type="button"
          aria-label="Voltar ao livro"
          onClick={() => goTo(0, true)}
          className="absolute top-4 right-4 z-50 flex h-10 items-center gap-2 rounded-full border border-gold/40 bg-night/50 px-3 text-gold-bright/90 backdrop-blur-sm transition hover:border-gold hover:text-gold-bright"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              d="M5 5.5 C5 4.7 5.7 4 6.5 4 H12 V20 H6.5 C5.7 20 5 19.3 5 18.5 Z"
              strokeLinejoin="round"
            />
            <path
              d="M19 5.5 C19 4.7 18.3 4 17.5 4 H12 V20 H17.5 C18.3 20 19 19.3 19 18.5 Z"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden font-display text-[0.65rem] tracking-[0.18em] uppercase sm:inline">
            Livro
          </span>
        </button>
      ) : null}

      {booting ? null : (
      <>
      <AnimatePresence>
        {overture === "gate" ? (
          <OpeningGate key="gate" onStart={startOpening} />
        ) : null}
        {overture === "playing" ? (
          <FilmOpening key="opening" onComplete={() => setOverture("done")} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {storyReady && isBookStage ? (
          <motion.div
            key="book"
            {...pageMotion}
            transition={{ duration: 0.9 }}
            className="relative flex h-full flex-col items-center justify-center"
          >
            <StoryBook
              cover={coverPage}
              back={backPage}
              chapters={chapters}
              chapterIndex={chapterIndex}
              isOpen={page.kind === "chapter"}
              showBack={page.kind === "back"}
              onOpen={() => goTo(1)}
              onBusyChange={setBookBusy}
              footer={
                navVisible && page.kind === "back" ? (
                  <button
                    type="button"
                    disabled={bookBusy}
                    onClick={() => goTo(index + 1, true)}
                    className="rounded-full border border-gold/50 bg-gold px-8 py-3 font-display text-xs tracking-[0.28em] text-royal-deep uppercase shadow-[0_0_24px_rgba(232,197,71,0.4)] disabled:opacity-40 [@media(hover:hover)]:hover:bg-gold-bright"
                  >
                    Continuar
                  </button>
                ) : navVisible ? (
                  <StoryNav
                    index={chapterIndex}
                    total={chapters.length}
                    disabled={bookBusy}
                    onPrev={() => goTo(index - 1)}
                    onNext={() => goTo(index + 1)}
                  />
                ) : null
              }
            />
          </motion.div>
        ) : null}
        {storyReady && page.kind === "lanterns" ? (
          <motion.div
            key="lanterns"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: 0 } }}
            transition={{ duration: 0.5 }}
            className="relative flex h-full flex-col items-center justify-center"
          >
            <LanternFestival page={page} onRelease={() => goTo(index + 1)} />
          </motion.div>
        ) : null}
        {storyReady && page.kind === "video" ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="relative flex h-full flex-col items-center justify-center bg-black"
          >
            <ViolinStage
              page={page}
              onBack={() => goTo(index - 1)}
              onNext={() => goTo(index + 1)}
            />
          </motion.div>
        ) : null}
        {storyReady && page.kind === "dedications" ? (
          <motion.div
            key="dedications"
            {...pageMotion}
            transition={{ duration: 0.7 }}
            className="relative flex h-full flex-col items-center justify-center"
          >
            <DedicationLanterns
              page={page}
              onComplete={() => goTo(index + 1, true)}
              onBack={() => goTo(index - 1)}
              onBusyChange={setBookBusy}
            />
          </motion.div>
        ) : null}
        {storyReady && page.kind === "memories" ? (
          <motion.div
            key="memories"
            {...pageMotion}
            transition={{ duration: 0.7 }}
            className="relative h-full w-full"
          >
            <MemorySky
              page={page}
              onBack={() => goTo(index - 1)}
              onNext={() => goTo(index + 1)}
              onBusyChange={setBookBusy}
            />
          </motion.div>
        ) : null}
        {storyReady && page.kind === "call" ? (
          <motion.div
            key="call"
            {...pageMotion}
            transition={{ duration: 0.7 }}
            className="relative flex h-full flex-col items-center justify-center"
          >
            <CallStage page={page} onBack={() => goTo(index - 1)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      </>
      )}
    </main>
  );
}
