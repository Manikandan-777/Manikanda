import { z } from "zod";

import profileRaw from "@content/profile.json";
import skillsRaw from "@content/skills.json";
import projectsRaw from "@content/projects.json";
import experienceRaw from "@content/experience.json";
import certificatesRaw from "@content/certificates.json";
import achievementsRaw from "@content/achievements.json";
import socialRaw from "@content/social.json";
import settingsRaw from "@content/settings.json";

import {
  achievementsSchema,
  certificatesSchema,
  experienceSchema,
  profileSchema,
  projectsSchema,
  settingsSchema,
  skillsSchema,
  socialsSchema,
  type Achievement,
  type Certificate,
  type Education,
  type Project,
  type Role,
  type SectionConfig,
  type SectionId,
  type SkillGroup,
  type Social,
} from "./schema";

/**
 * Parse one content file, or throw a build-stopping error that names the file,
 * the field path, and what is wrong. This is what turns "typo in JSON" into a
 * readable failure instead of a broken production page.
 */
function parse<S extends z.ZodTypeAny>(schema: S, data: unknown, file: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join(" › ") : "(root)";
        return `  • ${path}: ${issue.message}`;
      })
      .join("\n");
    throw new Error(
      `\n\nContent validation failed in content/${file}\n${details}\n\n` +
        `Fix the file above and rebuild. See content/README.md for the field reference.\n`,
    );
  }
  return result.data;
}

/* --------------------------- parse every file ---------------------------- */

export const profile = parse(profileSchema, profileRaw, "profile.json");
export const settings = parse(settingsSchema, settingsRaw, "settings.json");

const skillsDoc = parse(skillsSchema, skillsRaw, "skills.json");
const projectsDoc = parse(projectsSchema, projectsRaw, "projects.json");
const experienceDoc = parse(experienceSchema, experienceRaw, "experience.json");
const certificatesDoc = parse(certificatesSchema, certificatesRaw, "certificates.json");
const achievementsDoc = parse(achievementsSchema, achievementsRaw, "achievements.json");
const socialDoc = parse(socialsSchema, socialRaw, "social.json");

// Each of these files is `{ "<key>": [ ...items ] }` — the wrapper key keeps the
// Decap CMS happy; every list on the site still comes straight from the array.

/* --------------------------- ordering helpers --------------------------- */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Drop hidden items, then sort by the `order` field. Used for every list on the site. */
function resolve<T extends { order: number; visible: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.visible).slice().sort(byOrder);
}

/* ----------------------------- resolved data --------------------------- */

export const skillGroups: SkillGroup[] = resolve(skillsDoc.groups);
export const skillsIntro = skillsDoc.intro;

/**
 * Distinct skill names (in group/order sequence) offered to the Skills orbit.
 * The orbit component picks up to 8, preferring names it has a logo for.
 */
export const skillOrbit: string[] = Array.from(
  new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name))),
).slice(0, 16);
export const projects: Project[] = resolve(projectsDoc.projects);
export const education: Education[] = resolve(experienceDoc.education);
export const roles: Role[] = resolve(experienceDoc.roles);
export const certificates: Certificate[] = resolve(certificatesDoc.certificates);
export const achievements: Achievement[] = resolve(achievementsDoc.achievements);
export const socials: Social[] = resolve(socialDoc.social);

/* ------------------------- integrity: unique slugs -------------------- */

const slugCounts = projects.reduce<Record<string, number>>((acc, p) => {
  acc[p.slug] = (acc[p.slug] ?? 0) + 1;
  return acc;
}, {});
const duplicateSlugs = Object.entries(slugCounts)
  .filter(([, n]) => n > 1)
  .map(([slug]) => slug);
if (duplicateSlugs.length > 0) {
  throw new Error(
    `\n\nContent validation failed in content/projects.json\n` +
      `  • duplicate slug(s): ${duplicateSlugs.join(", ")}\n` +
      `Each project needs a unique slug (it becomes the /projects/<slug> URL).\n`,
  );
}

/* -------------------- certificate category helpers ------------------- */

/** Distinct categories in display order (first appearance wins). */
export const certificateCategories: string[] = certificates.reduce<string[]>((acc, c) => {
  if (!acc.includes(c.category)) acc.push(c.category);
  return acc;
}, []);

/* ------------------------- project detail logic --------------------- */

/**
 * A project has a "real" detail page only when its description is filled in.
 * TODO placeholders don't count — the card links straight to GitHub instead.
 */
export function hasProjectDetail(project: Project): boolean {
  const d = project.description.trim();
  return d.length > 0 && !/^todo\b/i.test(d);
}

/** Where a project card should point. */
export function projectHref(project: Project): { href: string; external: boolean } {
  if (hasProjectDetail(project)) {
    return { href: `/projects/${project.slug}`, external: false };
  }
  if (project.githubUrl) return { href: project.githubUrl, external: true };
  return { href: `/projects/${project.slug}`, external: false };
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ---------------------- section + nav resolution ------------------- */

/**
 * A section renders only when it is set visible in settings.json AND it has
 * content. An empty content array hides both the section and its nav link.
 */
const sectionHasContent: Record<SectionId, boolean> = {
  about: Boolean(profile.bio) || education.length > 0 || roles.length > 0,
  skills: skillGroups.length > 0,
  projects: projects.length > 0,
  certificates: certificates.length > 0,
  achievements: achievements.length > 0,
  contact: Boolean(profile.email) || socials.length > 0,
};

/** The ordered, filtered list of sections — the single source of truth for page + nav. */
export const sections: SectionConfig[] = settings.sections
  .filter((s) => s.visible && sectionHasContent[s.id])
  .slice()
  .sort(byOrder);

export function isSectionActive(id: SectionId): boolean {
  return sections.some((s) => s.id === id);
}
