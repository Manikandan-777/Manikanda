"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SkillOrbit } from "@/components/ui/skill-orbit";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/lib/schema";

const LEVEL_LABEL: Record<string, string> = {
  core: "Core",
  working: "Working knowledge",
  learning: "Learning",
};

export function SkillsShowcase({
  intro,
  groups,
  orbit,
}: {
  intro: { eyebrow: string; title: string; blurb: string };
  groups: SkillGroup[];
  orbit: string[];
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setTimeout(() => {
        document
          .getElementById("skills-list")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  };

  return (
    <div className="shell">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-[#0b1210] p-5 ring-1 ring-white/10 sm:p-10 md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)",
            }}
          />
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3ddc84]">
                <span className="mr-2 text-white/40" aria-hidden>
                  02
                </span>
                {intro.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.6vw,3.15rem)] leading-[1.05] text-white">
                {intro.title}
              </h2>
              {intro.blurb && <p className="mt-4 max-w-sm text-white/65">{intro.blurb}</p>}

              <ShimmerButton
                onClick={toggle}
                aria-expanded={open}
                aria-controls="skills-list"
                className="mt-7"
              >
                {open ? "Hide skills" : "Explore my skills"}
                <ArrowRight
                  size={16}
                  className={cn("transition-transform", open ? "-rotate-90" : "rotate-90")}
                />
              </ShimmerButton>
            </div>

            <SkillOrbit items={orbit} />
          </div>
        </div>
      </Reveal>

      {/* Full grouped list — hidden until "Explore my skills" is clicked. */}
      {open && (
        <motion.div
          id="skills-list"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid scroll-mt-28 gap-x-12 gap-y-10 sm:grid-cols-2"
        >
          {groups.map((group) => (
            <div key={group.name}>
              <h3 className="font-display text-lg text-fg">{group.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
                    title={item.level ? LEVEL_LABEL[item.level] : undefined}
                  >
                    {item.level === "core" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
