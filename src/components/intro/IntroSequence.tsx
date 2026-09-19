"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

/**
 * Intro overlay: black screen → a clean cursive "hello" writes itself →
 * dissolves to reveal the portfolio.
 *
 * Runs once per session (sessionStorage). `prefers-reduced-motion` gets a
 * quick one-second draw. A "Skip intro" button (or Esc key) ends it immediately.
 */
const KEY = "mp-intro@v1";

/**
 * Clean, clearly legible cursive "hello" SVG path.
 * Each letter is drawn as a natural pen stroke on a 420×180 canvas.
 *
 *  h  — tall descender stem, arch right into bowl
 *  e  — single loop (like a cursive e)
 *  l  — tall straight ascender with a small loop foot
 *  l  — same as first l
 *  o  — closed oval
 */
const HELLO_PATH =
  // h: tall stem
  "M 28,155 C 28,130 28,90 28,42 " +
  // h: arch from mid-stem down into bowl
  "C 28,42 28,80 38,94 C 48,108 62,108 70,100 C 78,92 78,110 78,155 " +
  // e: lead-in from h, open-top loop
  "C 78,145 90,120 104,120 C 118,120 126,132 120,144 " +
  "C 114,156 98,158 90,148 C 82,138 96,128 112,130 " +
  // l (first): tall ascender + foot
  "C 120,131 130,131 138,132 C 140,110 140,72 140,42 C 140,130 142,148 146,155 " +
  // l (second): tall ascender + foot
  "C 150,131 160,131 168,132 C 170,110 170,72 170,42 C 170,130 172,148 176,155 " +
  // o: oval shape
  "C 182,150 192,148 204,148 C 218,148 230,140 234,128 " +
  "C 238,116 232,104 218,100 C 204,96 192,104 188,118 " +
  "C 184,132 190,148 202,152 C 208,154 216,154 226,150";

type Phase = "black" | "hello" | "zoom" | "done";

function HelloScript({ duration }: { duration: number }) {
  return (
    <svg
      viewBox="0 0 270 200"
      className="w-[72vw] max-w-[480px] overflow-visible"
      aria-label="hello"
    >
      <defs>
        <filter id="hello-neon" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* outer glow */}
      <path
        d={HELLO_PATH}
        fill="none"
        stroke="rgba(180,240,210,0.20)"
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#hello-neon)"
      />

      {/* animated drawn stroke */}
      <motion.path
        d={HELLO_PATH}
        fill="none"
        stroke="#c8f0d8"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration, ease: [0.25, 0.6, 0.3, 1] },
          opacity: { duration: 0.3 },
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

  // Avoid hydration mismatch: only render after mount.
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
      at(350, () => setPhase("hello"));
      at(3400, () => setPhase("zoom"));
      at(4800, finish);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [run, reduced, finish]);

  // Lock scroll while the overlay is active.
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

  const showHello = phase === "hello" || phase === "zoom";
  const zooming = phase === "zoom";

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
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black"
      animate={{
        opacity: exiting ? 0 : 1,
        scale: zooming ? 1.06 : 1,
      }}
      transition={{
        opacity: { duration: 0.45 },
        scale: { duration: 1.4, ease: [0.6, 0, 0.22, 1] },
      }}
      aria-label="Intro animation"
    >
      {/* subtle green ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 50%, rgba(18,161,80,0.07), transparent 70%)",
          opacity: showHello ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* hello text — fades in cleanly */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: showHello ? 1 : 0,
          y: showHello ? 0 : 8,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {showHello && <HelloScript duration={2.2} />}
      </motion.div>

      {!exiting && (
        <button
          type="button"
          onClick={finish}
          className="fixed bottom-6 right-6 z-[101] font-mono text-[10px] uppercase tracking-[0.28em] text-white/30 transition-colors hover:text-white/70"
        >
          Skip intro
        </button>
      )}
    </motion.div>
  );
}

export default IntroSequence;
