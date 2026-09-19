"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { assetUrl, cn } from "@/lib/utils";
import type { SectionConfig } from "@/lib/schema";

export function Nav({
  sections,
  name,
  resumeUrl,
}: {
  sections: Pick<SectionConfig, "id" | "label">[];
  name: string;
  resumeUrl: string;
}) {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-spy: highlight the nav link for whichever section owns the viewport.
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const firstName = name.split(/\s+/)[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
          aria-label={`${name} — back to top`}
        >
          <span className="relative block h-8 w-8 overflow-hidden rounded-full ring-1 ring-border">
            <Image
              src={assetUrl("/images/avatar.jpg")}
              alt={name}
              fill
              sizes="32px"
              className="object-cover object-top"
            />
          </span>
          <span className="text-fg">{firstName}</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "relative py-1 text-sm transition-colors hover:text-fg",
                  active === s.id ? "text-fg" : "text-muted",
                )}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
                {active === s.id && (
                  <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {resumeUrl && (
            <a
              href={assetUrl(resumeUrl)}
              className="hidden rounded-full border border-fg px-4 py-1.5 text-sm transition-colors hover:bg-fg hover:text-bg sm:inline-block"
              download
            >
              Résumé
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-bg md:hidden">
          <ul className="shell flex flex-col gap-1 py-6">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block border-b border-border py-4 font-display text-2xl",
                    active === s.id ? "text-accent-ink" : "text-fg",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li>
                <a
                  href={assetUrl(resumeUrl)}
                  download
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-2xl text-fg"
                >
                  Résumé
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
