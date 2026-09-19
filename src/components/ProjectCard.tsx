import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { hasProjectDetail, projectHref } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/schema";

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { href, external } = projectHref(project);
  const linksToGithub = external;
  const cta = linksToGithub ? "View on GitHub" : "View project";

  const className = cn(
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent-line hover:-translate-y-1",
  );

  const body = (
    <>
      {project.image ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full items-end bg-gradient-to-br from-surface-2 to-surface p-5">
          <span className="font-display text-2xl text-faint">
            {project.tags[0] ?? project.role ?? "Project"}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-faint">
          {project.featured && <span className="text-accent-ink">Featured</span>}
          {project.featured && project.role && <span aria-hidden>·</span>}
          {project.role && <span>{project.role}</span>}
        </div>

        <h3
          className={cn(
            "mt-2 font-display leading-snug text-fg",
            featured ? "text-2xl" : "text-xl",
          )}
        >
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-muted">{project.summary}</p>

        {project.techStack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <li
                key={t}
                className="rounded border border-border px-2 py-0.5 text-xs text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent-ink">
          {cta}
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </>
  );

  if (linksToGithub) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className} prefetch={hasProjectDetail(project)}>
      {body}
    </Link>
  );
}
