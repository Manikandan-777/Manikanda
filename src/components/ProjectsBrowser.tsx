"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/ProjectCard";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/schema";

type Sort = "featured" | "order";

export function ProjectsBrowser({ items }: { items: Project[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const filtered = tag === "All" ? items : items.filter((p) => p.tags.includes(tag));
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "featured" && a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.order - b.order;
    });
    return sorted;
  }, [items, tag, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentedTabs
          items={tags}
          value={tag}
          onValueChange={setTag}
          ariaLabel="Filter projects by tag"
        />

        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-fg"
          >
            <option value="featured">Featured first</option>
            <option value="order">Custom order</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-muted">No projects tagged “{tag}”.</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li
              key={p.slug}
              className={cn(p.featured && sort === "featured" && "sm:col-span-2 lg:col-span-2")}
            >
              <ProjectCard project={p} featured={p.featured && sort === "featured"} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
