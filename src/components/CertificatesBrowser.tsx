"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { Certificate } from "@/lib/schema";
import { assetUrl } from "@/lib/utils";

const INITIAL_VISIBLE = 6;

export function CertificatesBrowser({
  items,
  categories,
}: {
  items: Certificate[];
  categories: string[];
}) {
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      (category === "All" ? items : items.filter((c) => c.category === category)).slice().sort(
        (a, b) => a.order - b.order,
      ),
    [items, category],
  );

  const shown = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const tabs = ["All", ...categories];

  return (
    <div>
      <SegmentedTabs
        items={tabs}
        value={category}
        onValueChange={(v) => {
          setCategory(v);
          setShowAll(false);
        }}
        ariaLabel="Filter certificates by category"
      />

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {shown.map((c) => (
          <li
            key={`${c.title}-${c.issuer}`}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <p className="font-display text-lg leading-snug text-fg">{c.title}</p>
              <p className="text-sm text-muted">{c.issuer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm text-faint">
              <span className="rounded border border-border px-2 py-0.5 text-xs uppercase tracking-wider">
                {c.category}
              </span>
              {c.date && <span>{c.date}</span>}
              {c.credentialUrl && (
                <a
                  href={assetUrl(c.credentialUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-accent-ink link-underline"
                >
                  Credential
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-5 text-sm font-medium text-accent-ink link-underline"
        >
          {showAll ? "Show fewer" : `Show all ${filtered.length}`}
        </button>
      )}
    </div>
  );
}
