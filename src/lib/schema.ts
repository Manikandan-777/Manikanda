import { z } from "zod";

/**
 * Zod schemas for every file in /content.
 * These run at build time (via src/lib/content.ts and scripts/validate-content.ts).
 * A mistyped field name fails the build with a message naming the file, the path,
 * and the problem — never a blank page in production.
 */

/** Every item in a content array carries these two fields. */
const orderVisible = {
  order: z.number({ invalid_type_error: "order must be a number" }),
  visible: z.boolean({ invalid_type_error: "visible must be true or false" }),
};

/** Empty string, a root-relative path (/foo), or an absolute http(s) URL. */
const optionalUrl = z
  .string()
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
    "must be empty, a root-relative path (/file.pdf), or an absolute http(s) URL",
  );

const hexColour = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex colour such as #b64826");

/* ---------------------------------- profile --------------------------------- */

export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  photo: optionalUrl,
  location: z.string().default(""),
  email: z.string().email(),
  phone: z.string().default(""),
  resumeUrl: optionalUrl,
  availability: z.string().default(""),
});

/* ---------------------------------- skills ---------------------------------- */

export const skillItemSchema = z.object({
  name: z.string().min(1),
  level: z.enum(["core", "working", "learning"]).optional(),
});

export const skillGroupSchema = z.object({
  name: z.string().min(1),
  items: z.array(skillItemSchema).min(1, "a skill group needs at least one item"),
  ...orderVisible,
});

export const skillsIntroSchema = z
  .object({
    eyebrow: z.string().default("Toolkit"),
    title: z.string().default("What I work with"),
    blurb: z.string().default(""),
  })
  .default({});

export const skillsSchema = z.object({
  intro: skillsIntroSchema,
  groups: z.array(skillGroupSchema),
});

/* --------------------------------- projects -------------------------------- */

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case, e.g. my-project"),
  summary: z.string().min(1),
  description: z.string().default(""),
  tags: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  role: z.string().default(""),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  image: optionalUrl,
  featured: z.boolean().default(false),
  ...orderVisible,
});

export const projectsSchema = z.object({ projects: z.array(projectSchema) });

/* -------------------------------- experience ------------------------------- */

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  detail: z.string().default(""),
  notes: z.array(z.string()).default([]),
  ...orderVisible,
});

export const roleSchema = z.object({
  title: z.string().min(1),
  organisation: z.string().min(1),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  detail: z.string().default(""),
  notes: z.array(z.string()).default([]),
  ...orderVisible,
});

export const experienceSchema = z.object({
  education: z.array(educationSchema),
  roles: z.array(roleSchema).default([]),
});

/* ------------------------------- certificates ------------------------------ */

export const certificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().default(""),
  credentialUrl: optionalUrl,
  category: z.string().min(1),
  /** Optional issuer logo — a file in /public (e.g. /images/logos/nptel.svg) or an https URL. */
  logo: optionalUrl.default(""),
  ...orderVisible,
});

export const certificatesSchema = z.object({ certificates: z.array(certificateSchema) });

/* ------------------------------- achievements ----------------------------- */

export const achievementSchema = z.object({
  title: z.string().min(1),
  org: z.string().default(""),
  date: z.string().default(""),
  detail: z.string().default(""),
  /** Optional proof — a file in /public (e.g. /certificates/x.pdf) or an https URL. */
  certificateUrl: optionalUrl.default(""),
  ...orderVisible,
});

export const achievementsSchema = z.object({ achievements: z.array(achievementSchema) });

/* ---------------------------------- social -------------------------------- */

export const socialSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  icon: z.string().default("link"),
  ...orderVisible,
});

export const socialsSchema = z.object({ social: z.array(socialSchema) });

/* --------------------------------- settings ------------------------------- */

export const SECTION_IDS = [
  "about",
  "skills",
  "projects",
  "certificates",
  "achievements",
  "contact",
] as const;

export const sectionSchema = z.object({
  id: z.enum(SECTION_IDS),
  label: z.string().min(1),
  ...orderVisible,
});

export const settingsSchema = z.object({
  siteUrl: z.string().url(),
  theme: z.object({
    accent: hexColour,
    accentContrast: hexColour,
  }),
  defaultMode: z.enum(["light", "dark", "system"]).default("system"),
  contact: z.object({
    provider: z.enum(["web3forms", "formspree"]),
    accessKey: z.string().min(1),
  }),
  sections: z.array(sectionSchema),
});

/* ---------------------------------- types --------------------------------- */

export type Profile = z.infer<typeof profileSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type SectionConfig = z.infer<typeof sectionSchema>;
export type SectionId = (typeof SECTION_IDS)[number];
