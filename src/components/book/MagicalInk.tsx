"use client";

import { useEffect, useRef, useState } from "react";

type MagicalTextProps = {
  text: string;
  className?: string;
  active: boolean;
  delay?: number;
  speed?: number;
  as?: "p" | "h2";
  accent?: string;
  accentClassName?: string;
  sparkle?: boolean;
};

function charDelay(char: string, speed: number) {
  if (char === " ") {
    return speed * 0.35;
  }
  if (char === "\n") {
    return speed * 1.6;
  }
  if (/[.!?]/.test(char)) {
    return speed * 1.35;
  }
  if (/[,;:]/.test(char)) {
    return speed * 1.15;
  }
  return speed;
}

export function inkDuration(text: string, speed: number) {
  return Math.ceil(Array.from(text).length / 4) * speed + 50;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  tone: number;
};

type TrailPoint = {
  x: number;
  y: number;
  wobble: number;
};

function DustRibbon({
  wrapRef,
  tipRef,
  writing,
}: {
  wrapRef: React.RefObject<HTMLElement | null>;
  tipRef: React.RefObject<HTMLElement | null>;
  writing: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writingRef = useRef(writing);
  writingRef.current = writing;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      return;
    }

    const surface: HTMLCanvasElement = canvas;
    const host: HTMLElement = wrap;
    const maybeContext = surface.getContext("2d");
    if (!maybeContext) {
      return;
    }
    const context: CanvasRenderingContext2D = maybeContext;

    const dpr =
      window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const trail: TrailPoint[] = [];
    let frame = 0;
    let lastW = 0;
    let lastH = 0;
    let wasWriting = false;
    let lastOrigin: { x: number; y: number } | null = null;

    function resize() {
      const box = host.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round((box.width + 80) * dpr));
      const nextHeight = Math.max(1, Math.round((box.height + 80) * dpr));
      if (nextWidth === lastW && nextHeight === lastH) {
        return;
      }
      surface.width = nextWidth;
      surface.height = nextHeight;
      lastW = nextWidth;
      lastH = nextHeight;
    }

    function tipInCanvas() {
      const tip = tipRef.current;
      if (!tip) {
        return null;
      }
      const canvasBox = surface.getBoundingClientRect();
      const tipBox = tip.getBoundingClientRect();
      const scaleX = surface.width / canvasBox.width;
      const scaleY = surface.height / canvasBox.height;
      return {
        x: (tipBox.left - canvasBox.left + tipBox.width / 2) * scaleX,
        y: (tipBox.top - canvasBox.top + tipBox.height * 0.42) * scaleY,
      };
    }

    function spawn(
      origin: { x: number; y: number },
      amount: number,
      along = false,
    ) {
      for (let index = 0; index < amount; index += 1) {
        const spreadX = along ? 10 + Math.random() * 18 : 6 + Math.random() * 14;
        const spreadY = 5 + Math.random() * 11;
        particles.push({
          x: origin.x - Math.random() * spreadX * dpr,
          y: origin.y + (Math.random() - 0.5) * spreadY * dpr,
          vx: (-0.2 - Math.random() * 0.85) * dpr,
          vy: (Math.random() - 0.62) * 0.7 * dpr,
          life: 0,
          max: 34 + Math.random() * 48,
          size: 0.45 + Math.random() * 2.1,
          tone: Math.random(),
        });
      }
      if (particles.length > 640) {
        particles.splice(0, particles.length - 640);
      }
    }

    function burstLastWord() {
      const word = trail.slice(-18);
      if (lastOrigin && word.length === 0) {
        word.push({ x: lastOrigin.x, y: lastOrigin.y, wobble: 0 });
      }
      if (word.length === 0) {
        return;
      }

      const centerX = word.reduce((sum, point) => sum + point.x, 0) / word.length;
      const centerY = word.reduce((sum, point) => sum + point.y, 0) / word.length;

      for (const particle of particles) {
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const dist = Math.hypot(dx, dy) || 1;
        const kick = (0.7 + Math.random() * 1.6) * dpr;
        particle.vx += (dx / dist) * kick;
        particle.vy += (dy / dist) * kick * 0.85 - 0.2 * dpr;
        particle.max = Math.max(particle.max, particle.life + 46 + Math.random() * 28);
      }

      for (const point of word) {
        for (let index = 0; index < 10; index += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (0.45 + Math.random() * 2.1) * dpr;
          particles.push({
            x: point.x + (Math.random() - 0.5) * 8 * dpr,
            y: point.y + (Math.random() - 0.5) * 7 * dpr,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.8 - 0.15 * dpr,
            life: 0,
            max: 52 + Math.random() * 38,
            size: 0.5 + Math.random() * 2.3,
            tone: Math.random(),
          });
        }
      }

      if (particles.length > 640) {
        particles.splice(0, particles.length - 640);
      }
    }

    function strokeRibbon(now: number, width: number, color: string) {
      if (trail.length < 2) {
        return;
      }
      context.beginPath();
      context.moveTo(trail[0].x, trail[0].y);
      for (let index = 1; index < trail.length; index += 1) {
        const previous = trail[index - 1];
        const point = trail[index];
        const wave =
          Math.sin(index * 0.55 + now * 0.006 + previous.wobble) * 2.4 * dpr;
        const midX = (previous.x + point.x) / 2;
        const midY = (previous.y + point.y) / 2 + wave;
        context.quadraticCurveTo(previous.x, previous.y + wave * 0.45, midX, midY);
      }
      context.strokeStyle = color;
      context.lineWidth = width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
    }

    const draw = (now: number) => {
      resize();
      const width = surface.width;
      const height = surface.height;
      context.clearRect(0, 0, width, height);

      const origin = tipInCanvas();
      if (origin) {
        lastOrigin = origin;
      }

      const isWriting = writingRef.current;
      if (origin && isWriting) {
        const last = trail[trail.length - 1];
        if (last && Math.hypot(origin.x - last.x, origin.y - last.y) > 48 * dpr) {
          trail.length = 0;
        }
        trail.push({
          x: origin.x,
          y: origin.y,
          wobble: Math.random() * Math.PI * 2,
        });
        if (trail.length > 34) {
          trail.shift();
        }
        spawn(origin, 18);
        if (trail.length > 4) {
          const dustFrom = trail[Math.floor(trail.length * 0.45)];
          spawn(dustFrom, 6, true);
        }
      } else if (wasWriting && !isWriting) {
        burstLastWord();
      } else if (trail.length > 0) {
        const released = trail.shift();
        if (released) {
          spawn(
            {
              x: released.x + (Math.random() - 0.5) * 6 * dpr,
              y: released.y + (Math.random() - 0.5) * 6 * dpr,
            },
            3,
            true,
          );
        }
      }
      wasWriting = isWriting;

      trail.forEach((point, index) => {
        const strength = (index + 1) / trail.length;
        const radius = (8 + index * 1.15) * dpr;
        const glow = context.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius,
        );
        glow.addColorStop(0, `rgba(255, 216, 110, ${0.2 * strength})`);
        glow.addColorStop(0.4, `rgba(212, 160, 42, ${0.14 * strength})`);
        glow.addColorStop(1, "rgba(196, 146, 18, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });

      strokeRibbon(now, 16 * dpr, "rgba(196, 146, 18, 0.16)");
      strokeRibbon(now, 8 * dpr, "rgba(232, 197, 71, 0.32)");
      strokeRibbon(now, 3.2 * dpr, "rgba(255, 236, 176, 0.55)");

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.x += Math.sin(particle.life * 0.16 + particle.tone * 6) * 0.4 * dpr;
        if (particle.life > particle.max) {
          particles.splice(index, 1);
          continue;
        }
        const fade = 1 - particle.life / particle.max;
        context.globalAlpha = fade * 0.98;
        context.fillStyle =
          particle.tone > 0.72
            ? "#fff6c8"
            : particle.tone > 0.38
              ? "#e8c547"
              : "#b8860b";
        const size = particle.size * dpr;
        context.fillRect(particle.x, particle.y, size, size);
      }
      context.globalAlpha = 1;

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    frame = window.requestAnimationFrame(draw);

    return () => window.cancelAnimationFrame(frame);
  }, [tipRef, wrapRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute -inset-10 z-[1]"
      aria-hidden="true"
    />
  );
}

export function MagicalText({
  text,
  className = "",
  active,
  delay = 0,
  speed = 32,
  as: Tag = "p",
  accent,
  accentClassName = "text-royal-mid",
  sparkle = true,
}: MagicalTextProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [linger, setLinger] = useState(false);
  const [dust, setDust] = useState(false);
  const chars = Array.from(text);
  const writing = active && count > 0 && count < chars.length;
  const accentStart = accent ? text.lastIndexOf(accent) : -1;
  const accentEnd = accentStart >= 0 && accent ? accentStart + accent.length : -1;

  useEffect(() => {
    setDust(sparkle && window.innerWidth >= 768);
  }, [sparkle]);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    const letters = Array.from(text);
    setCount(0);
    let timeoutId = 0;
    let cancelled = false;

    const writeNext = (index: number) => {
      if (cancelled || index > letters.length) {
        return;
      }
      setCount(index);
      if (index >= letters.length) {
        return;
      }
      const step = window.innerWidth < 768 ? 6 : 2;
      timeoutId = window.setTimeout(
        () => writeNext(Math.min(index + step, letters.length)),
        charDelay(letters[index] ?? " ", speed),
      );
    };

    timeoutId = window.setTimeout(() => writeNext(1), delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [active, delay, speed, text]);

  useEffect(() => {
    if (writing) {
      setLinger(true);
      return;
    }
    if (active && count >= chars.length && count > 0) {
      const timeoutId = window.setTimeout(() => setLinger(false), 1400);
      return () => window.clearTimeout(timeoutId);
    }
    setLinger(false);
  }, [active, chars.length, count, writing]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        wrapRef.current = node;
      }}
      aria-label={text}
      className={`relative ${className}`}
    >
      {active && dust && (writing || linger) ? (
        <DustRibbon wrapRef={wrapRef} tipRef={tipRef} writing={writing} />
      ) : null}
      {chars.map((char, index) => {
        const revealed = index < count;
        const isTip =
          active && (writing || linger) && count > 0 && index === count - 1;
        return (
          <span
            key={`${char}-${index}`}
            ref={isTip ? tipRef : undefined}
            aria-hidden="true"
            className={`${revealed ? "" : "invisible"} ${
              accentStart >= 0 && index >= accentStart && index < accentEnd
                ? accentClassName
                : ""
            }`.trim()}
          >
            {char}
          </span>
        );
      })}
    </Tag>
  );
}
