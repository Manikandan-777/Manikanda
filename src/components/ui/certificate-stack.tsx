"use client";

import { ArrowRight } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaMicrosoft } from "react-icons/fa6";
import {
  SiCoursera,
  SiEdx,
  SiGoogle,
  SiGooglecloud,
  SiHcl,
  SiUdemy,
} from "react-icons/si";

import { assetUrl, cn } from "@/lib/utils";
import type { Certificate } from "@/lib/schema";

/* ------------------------------- issuer brand ------------------------------ */

type IconBrand = {
  kind: "icon";
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  name: string;
};
type Brand =
  | { kind: "img"; src: string; name: string }
  | IconBrand
  | { kind: "text"; short: string; name: string };

// Brands that ship as real marks in react-icons. Keyed by a substring to match
// anywhere in the issuer string ("Google Cloud · Coursera" → Google Cloud).
const ICON_BRANDS: Array<{ match: RegExp; brand: IconBrand }> = [
  { match: /google cloud/i, brand: { kind: "icon", Icon: SiGooglecloud, color: "#4285F4", name: "Google Cloud" } },
  { match: /microsoft/i, brand: { kind: "icon", Icon: FaMicrosoft, color: "#00A4EF", name: "Microsoft" } },
  { match: /coursera/i, brand: { kind: "icon", Icon: SiCoursera, color: "#2A5BD7", name: "Coursera" } },
  { match: /\bhcl\b/i, brand: { kind: "icon", Icon: SiHcl, color: "#0F5FDC", name: "HCL" } },
  { match: /udemy/i, brand: { kind: "icon", Icon: SiUdemy, color: "#A435F0", name: "Udemy" } },
  { match: /\bedx\b/i, brand: { kind: "icon", Icon: SiEdx, color: "#02262B", name: "edX" } },
  { match: /\bgoogle\b/i, brand: { kind: "icon", Icon: SiGoogle, color: "#4285F4", name: "Google" } },
];

/**
 * Loads an issuer logo file. Calls `onBroken` on a load failure — including one
 * that already happened before React attached the handler (hydration gap), which
 * a bare `onError` misses.
 */
function BrandLogo({
  src,
  alt,
  className,
  onBroken,
}: {
  src: string;
  alt: string;
  className?: string;
  onBroken: () => void;
}) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) onBroken();
  }, [src, onBroken]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      draggable={false}
      onError={onBroken}
      className={className}
    />
  );
}

function acronym(name: string): string {
  const words = name.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return (words[0].length <= 5 ? words[0] : words[0].slice(0, 4)).toUpperCase();
  }
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

/**
 * Resolve a logo for a certificate:
 *   1. an explicit `logo` file/URL from certificates.json  (authentic asset)
 *   2. a real brand mark from react-icons, matched anywhere in the issuer
 *   3. a monospace wordmark of the issuer's lead name  (fallback)
 */
function resolveBrand(cert: Certificate, brokenLogos: Set<string>): { brand: Brand; sub: string } {
  const [head, ...tail] = cert.issuer.split("·").map((s) => s.trim());
  const sub = tail.join(" · ");

  // 1. an official logo asset from certificates.json (skipped if it failed to load)
  if (cert.logo && !brokenLogos.has(cert.logo)) {
    return { brand: { kind: "img", src: assetUrl(cert.logo), name: head }, sub };
  }
  // 2. a real brand mark bundled in react-icons / Simple Icons
  const hit = ICON_BRANDS.find((b) => b.match.test(cert.issuer));
  if (hit) return { brand: hit.brand, sub };
  // 3. wordmark fallback
  return { brand: { kind: "text", short: acronym(head), name: head }, sub };
}

/* --------------------------- category card tint --------------------------- */

const TINT: Record<string, string> = {
  "AI/ML": "#0b1a15",
  Design: "#0b1526",
  Business: "#1b1207",
  Web: "#0b1a11",
  Marketing: "#160f1e",
};

/* --------------------------------- layout -------------------------------- */

type Slot = "front" | "mid" | "back" | "exit" | "hidden";

const SLOT: Record<Slot, { x: number; z: number; ry: number; s: number; o: number; zi: number }> = {
  front: { x: 0, z: 0, ry: -9, s: 1, o: 1, zi: 50 },
  mid: { x: 44, z: -120, ry: -16, s: 0.87, o: 0.96, zi: 49 },
  back: { x: 80, z: -240, ry: -20, s: 0.75, o: 0.8, zi: 48 },
  exit: { x: -58, z: -150, ry: 22, s: 0.82, o: 0, zi: 40 },
  hidden: { x: 116, z: -340, ry: -22, s: 0.68, o: 0, zi: 1 },
};

function slotFor(rel: number, n: number): Slot {
  if (rel === 0) return "front";
  if (rel === 1) return "mid";
  if (rel === 2) return "back";
  if (rel === n - 1) return "exit";
  return "hidden";
}

/* -------------------------------- component ------------------------------ */

export function CertificateStack({ items }: { items: Certificate[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [brokenLogos, setBrokenLogos] = useState<Set<string>>(() => new Set());
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const advance = useCallback(
    (by: number) => setActive((a) => ((a + by) % n + n) % n),
    [n],
  );

  if (n === 0) return null;

  return (
    <div
      className="relative h-[clamp(340px,46vw,440px)] w-full select-none [perspective:1400px] [perspective-origin:62%_50%]"
      role="group"
      aria-roledescription="3D certificate stack"
      aria-label={`Certificate ${active + 1} of ${n}: ${items[active].title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          advance(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          advance(-1);
        }
      }}
      onPointerDown={(e) => {
        // Let clicks on the credential link / buttons through — capturing the
        // pointer here would swallow their click.
        if ((e.target as HTMLElement).closest("a, button")) return;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, moved: false };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        if (Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (dx <= -48) advance(1);
        else if (dx >= 48) advance(-1);
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      {items.map((cert, i) => {
        const rel = ((i - active) % n + n) % n;
        const slot = slotFor(rel, n);
        const l = SLOT[slot];
        const isFront = slot === "front";
        const { brand, sub } = resolveBrand(cert, brokenLogos);

        const surface = isFront ? "#f3f2ed" : (TINT[cert.category] ?? "#0d1512");
        const ink = isFront ? "#15140f" : "#ffffff";
        const dim = isFront ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
        const faint = isFront ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.38)";
        const hair = isFront ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.16)";

        const style: CSSProperties = {
          background: surface,
          color: ink,
          zIndex: l.zi,
          opacity: l.o,
          pointerEvents: slot === "hidden" || slot === "exit" ? "none" : undefined,
          transform: `translateY(-50%) translateX(${l.x}%) translateZ(${l.z}px) rotateY(${l.ry}deg) scale(${l.s})`,
          boxShadow: isFront
            ? "0 30px 70px -22px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.55), 0 0 40px rgba(24,200,140,0.26)"
            : "0 22px 50px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
        };

        return (
          <article
            key={cert.title + cert.issuer}
            aria-hidden={!isFront}
            onClick={() => {
              if (!drag.current?.moved && !isFront && slot !== "hidden") advance(rel);
            }}
            className={cn(
              "absolute left-[3%] top-1/2 flex h-[88%] w-[70%] flex-col overflow-hidden rounded-2xl p-4 backdrop-blur-md transition-[transform,opacity] duration-[600ms] ease-out will-change-transform sm:w-[54%] sm:p-6 motion-reduce:!transition-none",
              !isFront && "cursor-pointer",
            )}
            style={style}
          >
            {/* logo row */}
            <div className="flex items-center gap-2">
              {brand.kind === "img" ? (
                <BrandLogo
                  src={brand.src}
                  alt={`${brand.name} logo`}
                  onBroken={() =>
                    setBrokenLogos((prev) => {
                      if (prev.has(brand.src)) return prev;
                      const next = new Set(prev);
                      next.add(brand.src);
                      return next;
                    })
                  }
                  className={cn(
                    "h-6 w-auto max-w-[130px] object-contain",
                    !isFront && "opacity-90 [filter:brightness(0)_invert(1)]",
                  )}
                />
              ) : brand.kind === "icon" ? (
                <>
                  <brand.Icon size={22} color={isFront ? brand.color : "#ffffff"} />
                  <span className="text-sm font-medium" style={{ color: dim }}>
                    {brand.name}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="grid h-6 min-w-6 place-items-center rounded-md px-1.5 font-mono text-[11px] font-bold"
                    style={{
                      border: `1px solid ${hair}`,
                      color: ink,
                    }}
                  >
                    {brand.short}
                  </span>
                  <span className="text-sm font-medium" style={{ color: dim }}>
                    {brand.name}
                  </span>
                </>
              )}
            </div>

            {/* title + platform */}
            <div className="flex flex-1 flex-col justify-center">
              <h3
                className={cn(
                  "font-display leading-snug",
                  isFront ? "text-[1.05rem] sm:text-[1.35rem]" : "text-[0.95rem] sm:text-[1.15rem]",
                )}
              >
                {cert.title}
              </h3>
              {sub && (
                <p className="mt-1.5 text-sm" style={{ color: dim }}>
                  {sub}
                </p>
              )}
            </div>

            {/* footer */}
            <div className="flex items-end justify-between">
              <span className="text-sm" style={{ color: faint }}>
                {cert.date}
              </span>
              {cert.credentialUrl ? (
                <a
                  href={assetUrl(cert.credentialUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open credential for ${cert.title}`}
                  tabIndex={isFront ? undefined : -1}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/10"
                  style={{ border: `1px solid ${hair}` }}
                >
                  <ArrowRight size={16} style={{ color: ink }} />
                </a>
              ) : (
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{ border: `1px solid ${hair}` }}
                >
                  <ArrowRight size={16} style={{ color: faint }} />
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default CertificateStack;
