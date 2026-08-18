"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FilmOpening, OpeningGate } from "@/components/atmosphere/FilmOpening";
import { NightSky } from "@/components/atmosphere/NightSky";
import { SoundToggle } from "@/components/atmosphere/SoundToggle";
import { StoryBook } from "@/components/book/StoryBook";
import { AmbientLanterns } from "@/components/lanterns/AmbientLanterns";
import { DedicationLanterns } from "@/components/lanterns/DedicationLanterns";
import { LanternFestival } from "@/components/lanterns/LanternFestival";
import { MemorySky } from "@/components/memories/MemorySky";
import { StoryNav } from "@/components/story/StoryNav";
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
  const page = story[index];
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
      {!booting && overture !== "gate" ? <SoundToggle /> : null}

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
                navVisible ? (
                  <StoryNav
                    index={index}
                    total={story.length}
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
              onBusyChange={setBookBusy}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      </>
      )}
    </main>
  );
}
