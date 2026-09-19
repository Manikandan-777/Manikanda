import { Section } from "@/components/Section";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { projects, settings } from "@/lib/content";
import { projectCover } from "@/lib/project-cover";

// One coverflow slide per visible project — fully derived from projects.json.
const slides: CoverflowSlide[] = projects.map((p) => ({
  src: projectCover(p, settings.theme.accent),
  alt: `${p.title} — ${p.role || "project"}`,
  title: p.title,
  subtitle: p.role || p.tags[0] || "Project",
  meta: [
    ...(p.tags[0] ? [{ label: "Focus", value: p.tags[0] }] : []),
    ...(p.techStack.length
      ? [{ label: "Stack", value: p.techStack.slice(0, 2).join(", ") }]
      : []),
    ...(p.featured ? [{ label: "Featured", value: "Yes" }] : []),
  ],
}));

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      index="03"
      headerAside={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
      dividerTop
    >
      {slides.length > 0 && (
        <CoverflowCarousel
          slides={slides}
          showCaption
          showNavigation
          showPagination
          cardWidth="clamp(170px, 46vw, 340px)"
          label="Projects"
          cardClassName="ring-1 ring-white/10"
        />
      )}
    </Section>
  );
}
