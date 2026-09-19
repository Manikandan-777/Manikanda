"use client";

import { useEffect, useRef } from "react";

/**
 * A faint fixed grid of "0 / 1" glyphs (stable row/column positions) covering the
 * viewport. Where the pointer moves or drags, the nearby glyphs light up in the
 * site's accent green and fade back out — a spotlight reveal of the binary field.
 *
 * - fixed, pointer-events-none — never blocks interaction
 * - the rAF loop only runs while glyphs are lit (idle cost is zero)
 * - `prefers-reduced-motion` → just the static faint grid, no reveal
 */
const CELL = 26; // px between glyphs
const REVEAL_RADIUS = 105; // px halo around the pointer
const DECAY = 0.9; // per-frame energy falloff
const BASE_ALPHA = 0.05; // resting visibility of the grid

/** Deterministic 0/1 for a cell, so the field is stable across renders/resizes. */
function glyphAt(col: number, row: number): string {
  const n = (col * 73856093) ^ (row * 19349663);
  return (n & 1) === 0 ? "0" : "1";
}

export function CursorBinary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // No cursor to trail on touch devices — keep the static grid, skip the reveal.
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#12a150";

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let base: HTMLCanvasElement | null = null;

    /** Pre-render the resting grid once to an offscreen canvas. */
    const buildBase = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      if (w < 1 || h < 1) {
        base = null;
        return;
      }
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      base = document.createElement("canvas");
      base.width = w * dpr;
      base.height = h * dpr;
      const b = base.getContext("2d")!;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.font = `${Math.round(CELL * 0.62)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      b.textAlign = "center";
      b.textBaseline = "middle";
      b.fillStyle = accent;
      b.globalAlpha = BASE_ALPHA;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          b.fillText(glyphAt(c, r), c * CELL + CELL / 2, r * CELL + CELL / 2);
        }
      }
    };

    /** cellKey -> energy (0..1) */
    const lit = new Map<number, number>();
    let raf = 0;

    const excite = (px: number, py: number) => {
      const c0 = Math.max(0, Math.floor((px - REVEAL_RADIUS) / CELL));
      const c1 = Math.min(cols - 1, Math.ceil((px + REVEAL_RADIUS) / CELL));
      const r0 = Math.max(0, Math.floor((py - REVEAL_RADIUS) / CELL));
      const r1 = Math.min(rows - 1, Math.ceil((py + REVEAL_RADIUS) / CELL));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = c * CELL + CELL / 2 - px;
          const dy = r * CELL + CELL / 2 - py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > REVEAL_RADIUS) continue;
          const t = 1 - d / REVEAL_RADIUS;
          const energy = t * t; // smooth falloff
          const key = r * cols + c;
          if (energy > (lit.get(key) ?? 0)) lit.set(key, energy);
        }
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    let prev: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      // window may have had zero size at mount (hidden tab / SSR hydration) —
      // build the grid on first real interaction.
      if (!base) {
        buildBase();
        redrawStatic();
        if (!base) return;
      }
      const x = e.clientX;
      const y = e.clientY;
      if (prev) {
        // sample along fast drags so the trail has no gaps
        const dx = x - prev.x;
        const dy = y - prev.y;
        const steps = Math.min(12, Math.floor(Math.hypot(dx, dy) / CELL));
        for (let i = 1; i < steps; i++) {
          excite(prev.x + (dx * i) / steps, prev.y + (dy * i) / steps);
        }
      }
      excite(x, y);
      prev = { x, y };
    };

    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      if (base && base.width > 0 && base.height > 0) ctx.drawImage(base, 0, 0, w, h);

      ctx.font = `${Math.round(CELL * 0.62)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = accent;

      for (const [key, energy] of lit) {
        const next = energy * DECAY;
        if (next < 0.03) {
          lit.delete(key);
          continue;
        }
        lit.set(key, next);
        const c = key % cols;
        const r = (key - c) / cols;
        // brief flicker while bright, then a clean fade
        const flicker = next > 0.55 ? 0.7 + Math.random() * 0.3 : 1;
        ctx.globalAlpha = Math.min(1, BASE_ALPHA + next * 0.95) * flicker;
        ctx.fillText(glyphAt(c, r), c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
      ctx.globalAlpha = 1;

      if (lit.size > 0) raf = requestAnimationFrame(frame);
    };

    const redrawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      if (base && base.width > 0 && base.height > 0) ctx.drawImage(base, 0, 0, w, h);
    };

    const onResize = () => {
      buildBase();
      redrawStatic();
    };

    buildBase();
    redrawStatic();

    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}

export default CursorBinary;
