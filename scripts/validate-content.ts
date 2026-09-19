/**
 * Standalone content validator — `npm run validate`.
 * Also runs implicitly at build time via src/lib/content.ts, but this gives a
 * fast, friendly check without a full Next build.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ZodTypeAny } from "zod";

import {
  achievementsSchema,
  certificatesSchema,
  experienceSchema,
  profileSchema,
  projectsSchema,
  settingsSchema,
  skillsSchema,
  socialsSchema,
} from "../src/lib/schema";

const contentDir = join(process.cwd(), "content");

const checks: Array<[file: string, schema: ZodTypeAny]> = [
  ["profile.json", profileSchema],
  ["skills.json", skillsSchema],
  ["projects.json", projectsSchema],
  ["experience.json", experienceSchema],
  ["certificates.json", certificatesSchema],
  ["achievements.json", achievementsSchema],
  ["social.json", socialsSchema],
  ["settings.json", settingsSchema],
];

let failed = false;

for (const [file, schema] of checks) {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(join(contentDir, file), "utf8"));
  } catch (err) {
    failed = true;
    console.error(`✖ content/${file}: not valid JSON — ${(err as Error).message}`);
    continue;
  }

  const result = schema.safeParse(data);
  if (result.success) {
    console.log(`✓ content/${file}`);
    continue;
  }

  failed = true;
  console.error(`✖ content/${file}`);
  for (const issue of result.error.issues) {
    const path = issue.path.length ? issue.path.join(" › ") : "(root)";
    console.error(`    ${path}: ${issue.message}`);
  }
}

if (failed) {
  console.error("\nContent validation FAILED. See messages above and content/README.md.");
  process.exit(1);
}
console.log("\nAll content files are valid.");
