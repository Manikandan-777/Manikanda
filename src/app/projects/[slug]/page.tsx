import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/Reveal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { getProject, hasProjectDetail, projects } from "@/lib/content";
import { assetUrl } from "@/lib/utils";

type Params = { slug: string };

/** One static route per project in projects.json — no code change to add one. */
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const detailed = hasProjectDetail(project);

  return (
    <article className="shell max-w-3xl py-16 md:py-24">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={15} />
        All projects
      </Link>

      <Reveal>
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-faint">
            {project.featured && <span className="text-accent-ink">Featured</span>}
            {project.role && <span>{project.role}</span>}
          </div>
          <h1 className="mt-3 text-display-2 text-fg [hyphens:auto] [overflow-wrap:anywhere]">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{project.summary}</p>
        </header>

        {project.image && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-2">
            <Image
              src={assetUrl(project.image)}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-fg px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              <Github size={16} />
              Source
            </a>
          )}
          {project.liveUrl && (
            <ShimmerButton
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5"
            >
              Live site
              <ArrowUpRight size={16} />
            </ShimmerButton>
          )}
        </div>

        {detailed ? (
          <div className="mt-12 max-w-prose whitespace-pre-line text-muted">
            {project.description}
          </div>
        ) : (
          <p className="mt-12 max-w-prose text-muted">
            A detailed write-up for this project is on the way. In the meantime, the code
            {project.githubUrl ? " is on GitHub" : " will be linked here soon"}.
          </p>
        )}

        {(project.techStack.length > 0 || project.tags.length > 0) && (
          <dl className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
            {project.techStack.length > 0 && (
              <div>
                <dt className="eyebrow mb-2">Tech stack</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded border border-border px-2 py-0.5 text-sm text-muted">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {project.tags.length > 0 && (
              <div>
                <dt className="eyebrow mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span key={t} className="rounded border border-border px-2 py-0.5 text-sm text-muted">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}
      </Reveal>
    </article>
  );
}
