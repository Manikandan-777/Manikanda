"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SegmentedTab = {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
};

/**
 * Segmented pill tab group — one rounded container, the active tab sits on a
 * raised accent pill. Used for the Projects / Certificates filters.
 * Wraps to multiple rows when the option list is long.
 */
export function SegmentedTabs({
  items,
  value,
  onValueChange,
  ariaLabel,
  className,
}: {
  items: Array<string | SegmentedTab>;
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const tabs: SegmentedTab[] = items.map((it) =>
    typeof it === "string" ? { value: it, label: it } : it,
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-surface-2 p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-[color:var(--accent-contrast)] shadow-sm"
                : "text-muted hover:text-fg",
            )}
          >
            {tab.icon}
            {tab.label ?? tab.value}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedTabs;
