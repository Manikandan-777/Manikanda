import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/Section";
import { achievements } from "@/lib/content";

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Awards & competitions"
      index="05"
      dividerTop
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a) => (
          <li
            key={a.title}
            className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-line"
          >
            {a.date && (
              <p className="text-xs uppercase tracking-wider text-faint">{a.date}</p>
            )}
            <p className="mt-1 font-display text-lg leading-snug text-fg">{a.title}</p>
            {a.org && <p className="mt-1 text-sm text-muted">{a.org}</p>}
            {a.detail && <p className="mt-2 text-sm text-muted">{a.detail}</p>}

            {a.certificateUrl && (
              <a
                href={a.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-accent-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
              >
                View certificate
                <ArrowUpRight size={13} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
