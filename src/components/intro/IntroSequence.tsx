"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

/**
 * Cinematic startup overlay: black → a stylised MacBook rises in → screen powers
 * on → a cursive "hello" writes itself on the screen, left to right → the screen
 * zooms to fill the viewport and dissolves, revealing the portfolio.
 *
 * Runs once per session (sessionStorage). `prefers-reduced-motion` gets a quick
 * one-second draw. A subtle "Skip intro" control (or Esc) ends it immediately.
 */
const KEY = "mp-intro@v1";

/** A single continuous cursive stroke spelling "hello", drawn L→R. */
const HELLO_PATH =
  "M40,150 C44,70 52,30 68,34 C80,37 74,110 72,150 C72,118 86,92 106,94 " +
  "C122,96 126,124 124,150 C124,128 136,96 156,100 C172,103 174,124 156,130 " +
  "C142,134 130,122 134,108 C132,140 150,154 172,150 C184,148 192,140 200,132 " +
  "C214,104 226,34 244,36 C256,38 248,116 246,150 C246,122 258,44 278,38 " +
  "C290,35 282,118 282,150 C282,126 300,100 320,106 C338,111 342,138 324,148 " +
  "C308,156 286,150 282,136 C300,152 326,152 348,144";

type Phase = "black" | "macbook" | "power" | "hello" | "zoom" | "done";

function HelloScript({ duration }: { duration: number }) {
  return (
    <svg viewBox="0 0 390 180" className="w-[64%] max-w-[560px] overflow-visible">
      <defs>
        <filter id="hello-neon" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* faint outer glow line */}
      <path
        d={HELLO_PATH}
        fill="none"
        stroke="rgba(169,232,198,0.28)"
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#hello-neon)"
      />
      {/* the drawn stroke */}
      <motion.path
        d={HELLO_PATH}
        fill="none"
        stroke="#bff0d4"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.6 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration, ease: [0.25, 0.6, 0.3, 1] },
          opacity: { duration: 0.25 },
        }}
      />
    </svg>
  );
}

export function IntroSequence() {
  const reduced = useReducedMotion();

  const [run] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return false;
    }
  });

  const [phase, setPhase] = useState<Phase>("black");
  const [exiting, setExiting] = useState(false);

  // Render nothing until after hydration so server (null) and first client
  // render (null) match — the pre-hydration .intro-lock cover bridges the gap.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode — replays next load, fine */
    }
    setExiting(true);
    window.setTimeout(() => {
      const root = document.documentElement;
      root.classList.remove("intro-lock");
      root.classList.add("intro-revealing");
      window.setTimeout(() => root.classList.remove("intro-revealing"), 700);
      setPhase("done");
    }, 420);
  }, []);

  // Drive the sequence. (The sessionStorage flag is set in finish(), not here —
  // writing it on mount makes a StrictMode remount read it back and skip.)
  useEffect(() => {
    if (!run) {
      document.documentElement.classList.remove("intro-lock");
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));

    if (reduced) {
      setPhase("hello");
      at(1100, finish);
    } else {
      at(600, () => setPhase("macbook"));
      at(1650, () => setPhase("power"));
      at(2600, () => setPhase("hello"));
      at(5300, () => setPhase("zoom"));
      at(6900, finish);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [run, reduced, finish]);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (!run || phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [run, phase]);

  // Esc = skip.
  useEffect(() => {
    if (!run || phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, phase, finish]);

  if (!mounted || !run || phase === "done") return null;

  const lit = phase === "power" || phase === "hello" || phase === "zoom";
  const showHello = phase === "hello" || phase === "zoom";
  const zooming = phase === "zoom";
  const visible = phase !== "black";

  /* ------------------------------ reduced motion ----------------------------- */
  if (reduced) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] grid place-items-center bg-black"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <HelloScript duration={0.8} />
      </motion.div>
    );
  }

  /* --------------------------------- full run ------------------------------ */
  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.42 }}
      aria-label="Intro animation"
    >
      {/* black stage — dissolves during the zoom */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: zooming ? 0 : 1 }}
        transition={{ duration: 0.8, delay: zooming ? 0.75 : 0 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 42%, rgba(18,161,80,0.05), transparent 60%)," +
            "radial-gradient(120% 100% at 50% 120%, rgba(0,0,0,0.6), transparent 55%)",
          opacity: zooming ? 0 : 1,
          transition: "opacity .6s ease",
        }}
      />

      {/* ------------------------------- MacBook ------------------------------ */}
      <div className="absolute inset-0 grid place-items-center [perspective:1600px]">
        <motion.div
          className="relative w-[80vw] max-w-[860px] sm:w-[64vw] md:w-[58vw] [transform-style:preserve-3d]"
          style={{ transformOrigin: "50% 34%" }}
          initial={{ opacity: 0, scale: 0.86, y: 26, rotateX: 13 }}
          animate={
            zooming
              ? { scale: 15, opacity: [1, 1, 0], rotateX: 0, y: "-4%" }
              : visible
                ? { opacity: 1, scale: 1, y: 0, rotateX: 6 }
                : { opacity: 0, scale: 0.86, y: 26, rotateX: 13 }
          }
          transition={
            zooming
              ? {
                  duration: 1.6,
                  ease: [0.6, 0, 0.22, 1],
                  opacity: { duration: 1.6, times: [0, 0.5, 0.92] },
                }
              : { duration: 1.05, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {/* lid */}
          <div className="relative aspect-[16/10.6] w-full rounded-[1.5rem] bg-gradient-to-b from-[#43464c] via-[#292b30] to-[#1b1d21] p-[1.6%] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-white/25"
            />
            <div className="relative h-full w-full rounded-[1.05rem] bg-[#050506] p-[1.7%] ring-1 ring-black/60">
              <div
                aria-hidden
                className="absolute left-1/2 top-[1.1%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#101012] ring-1 ring-white/10"
              />
              {/* screen */}
              <motion.div
                className="relative grid h-full w-full place-items-center overflow-hidden rounded-[0.7rem]"
                animate={{ backgroundColor: lit ? "#060809" : "#000000" }}
                transition={{ duration: 0.9 }}
              >
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(60% 55% at 50% 45%, rgba(255,255,255,0.16), transparent 70%)",
                  }}
                  animate={{
                    opacity: phase === "power" ? [0, 0.9, 0.14] : lit ? 0.12 : 0,
                  }}
                  transition={{ duration: 1.0, times: [0, 0.35, 1] }}
                />

                {showHello && <HelloScript duration={2.3} />}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 32%, transparent 100%)",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* hinge + deck edge */}
          <div className="relative mx-auto -mt-px h-[1.6%] w-[104%] -translate-x-[2%] rounded-b-[0.5rem] bg-gradient-to-b from-[#3c3f45] to-[#202226]">
            <div className="absolute left-1/2 top-0 h-full w-[14%] -translate-x-1/2 rounded-b-md bg-[#141518]" />
          </div>
          <div className="mx-auto h-[0.9%] w-[86%] rounded-b-[0.4rem] bg-gradient-to-b from-[#191a1d] to-transparent" />

          {/* reflection */}
          <div
            aria-hidden
            className="mx-auto mt-2 h-[26%] w-[92%] scale-y-[-1] rounded-[1.2rem] bg-gradient-to-b from-[#2a2c31] to-transparent opacity-20 blur-[2px]"
            style={{ maskImage: "linear-gradient(black, transparent 70%)" }}
          />
        </motion.div>
      </div>

      {!exiting && (
        <button
          type="button"
          onClick={finish}
          className="fixed bottom-6 right-6 z-[101] font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 transition-colors hover:text-white/80"
        >
          Skip intro
        </button>
      )}
    </motion.div>
  );
}

export default IntroSequence;
