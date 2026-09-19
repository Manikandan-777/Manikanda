"use client";

import { Code2 } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { FaJava, FaRProject } from "react-icons/fa6";
import {
  SiC,
  SiCplusplus,
  SiGit,
  SiGithub,
  SiGooglecolab,
  SiJupyter,
  SiKeras,
  SiMysql,
  SiNumpy,
  SiPandas,
  SiPlotly,
  SiPython,
  SiScikitlearn,
  SiScipy,
  SiTensorflow,
} from "react-icons/si";

/**
 * A glowing "</>" node orbited by tech tiles — one per name in `items`
 * (data-driven from skills.json). Known technologies render their brand logo in
 * brand colour; anything else falls back to a short code tile, so any skill list
 * works. The orbit rotates slowly; tiles counter-rotate to stay upright. Both
 * stop for `prefers-reduced-motion`.
 */
type Brand = { Icon: ComponentType<{ size?: number; color?: string; className?: string }>; color: string };

const TECH: Record<string, Brand> = {
  python: { Icon: SiPython, color: "#3776AB" },
  c: { Icon: SiC, color: "#A8B9CC" },
  "c++": { Icon: SiCplusplus, color: "#00599C" },
  cpp: { Icon: SiCplusplus, color: "#00599C" },
  r: { Icon: FaRProject, color: "#276DC3" },
  java: { Icon: FaJava, color: "#E76F00" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#FFFFFF" },
  numpy: { Icon: SiNumpy, color: "#4DABCF" },
  pandas: { Icon: SiPandas, color: "#E70488" },
  "scikit-learn": { Icon: SiScikitlearn, color: "#F7931E" },
  "scikit learn": { Icon: SiScikitlearn, color: "#F7931E" },
  sklearn: { Icon: SiScikitlearn, color: "#F7931E" },
  "jupyter notebook": { Icon: SiJupyter, color: "#F37626" },
  jupyter: { Icon: SiJupyter, color: "#F37626" },
  "google colab": { Icon: SiGooglecolab, color: "#F9AB00" },
  colab: { Icon: SiGooglecolab, color: "#F9AB00" },
  tensorflow: { Icon: SiTensorflow, color: "#FF6F00" },
  keras: { Icon: SiKeras, color: "#D00000" },
  plotly: { Icon: SiPlotly, color: "#7A88C4" },
  scipy: { Icon: SiScipy, color: "#8CAAE6" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  sql: { Icon: SiMysql, color: "#4479A1" },
};

const ALIASES: Record<string, string> = {
  "power bi": "BI",
  tableau: "Tab",
  matplotlib: "plt",
  seaborn: "sns",
  "ms office": "MS",
  "exploratory data analysis": "EDA",
  "machine learning fundamentals": "ML",
  "data cleaning": "Data",
};

function brandFor(name: string): Brand | null {
  return TECH[name.trim().toLowerCase()] ?? null;
}

function labelFor(name: string): string {
  const key = name.trim().toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return words
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }
  return name.length <= 4 ? name : name.slice(0, 2);
}

const SPIN = "[animation:rotate-gradient_46s_linear_infinite] motion-reduce:!animate-none";
const SPIN_REVERSE =
  "[animation:rotate-gradient_46s_linear_infinite_reverse] motion-reduce:!animate-none";

export function SkillOrbit({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(120);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const size = el.clientWidth;
      setRadius(size / 2 - Math.min(30, size * 0.1) - 6);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prefer names we have a logo for; keep original order within each group.
  const source = items.length > 0 ? items : ["Code"];
  const list = [...source]
    .map((name, i) => ({ name, i, logo: brandFor(name) ? 0 : 1 }))
    .sort((a, b) => a.logo - b.logo || a.i - b.i)
    .slice(0, 8)
    .map((x) => x.name);
  const n = list.length;

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-[6%] rounded-full border border-white/10" />
      <div aria-hidden className="absolute inset-[24%] rounded-full border border-white/[0.06]" />

      <div className={`absolute inset-0 ${SPIN}`}>
        {list.map((name, i) => {
          const angle = (360 / n) * i;
          const style: CSSProperties = {
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`,
          };
          const brand = brandFor(name);
          return (
            <div key={name} className="absolute left-1/2 top-1/2" style={style}>
              <div className={SPIN_REVERSE}>
                <div
                  className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.06] font-mono text-xs font-semibold text-white backdrop-blur-sm"
                  style={{ boxShadow: "0 0 22px rgba(18,161,80,0.28)" }}
                  title={name}
                >
                  {brand ? (
                    <brand.Icon size={26} color={brand.color} />
                  ) : (
                    labelFor(name)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute left-1/2 top-1/2 grid h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-1 ring-white/25"
        style={{
          background:
            "radial-gradient(circle at 50% 34%, color-mix(in srgb, var(--accent) 92%, white 8%), color-mix(in srgb, var(--accent) 55%, black 45%))",
          boxShadow: "0 0 55px rgba(18,161,80,0.5)",
        }}
      >
        <Code2 className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={2.25} />
      </div>
    </div>
  );
}

export default SkillOrbit;
