import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";

/**
 * Shared section frame: a narrow, sticky header column beside a wide content
 * column. The asymmetry is deliberate — sections are not centred full-width stacks.
 */
export function Section({
  id,
  eyebrow,
  title,
  index,
  children,
  headerAside,
  dividerTop = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  index?: string;
  children: ReactNode;
  headerAside?: ReactNode;
  /** Draw a bold horizontal rule above this section. */
  dividerTop?: boolean;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-20 md:py-28">
      {dividerTop && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] bg-fg"
          style={{
            boxShadow:
              "0 0 14px 1px color-mix(in srgb, var(--accent) 65%, transparent)",
          }}
        />
      )}
      <div className="shell grid gap-10 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          {index && (
            <span className="font-display text-sm text-faint" aria-hidden>
              {index}
            </span>
          )}
          <p className="eyebrow mt-1">{eyebrow}</p>
          <h2 className="mt-2 text-heading text-fg">{title}</h2>
          {headerAside && <div className="mt-4 text-sm text-muted">{headerAside}</div>}
        </div>
        <Reveal className="min-w-0">{children}</Reveal>
      </div>
    </section>
  );
}
