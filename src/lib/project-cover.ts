import type { Project } from "./schema";

/** XML-escape text going into an SVG. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Greedy word wrap into at most `maxLines` lines of ~`maxChars`. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = (current ? current + " " : "") + word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && lines.join(" ").length < text.length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "…");
  }
  return lines;
}

/**
 * The image used for a project's carousel cover.
 * Uses `project.image` when set; otherwise builds a branded title card as an
 * inline SVG data-URI, so a project with no artwork still shows something real.
 */
export function projectCover(project: Project, accent = "#12a150"): string {
  if (project.image) return project.image;

  const titleLines = wrap(project.title, 20, 4);
  const tech = project.techStack.slice(0, 4).join("   ·   ");
  const kicker = (project.role || project.tags[0] || "Project").toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
<defs><radialGradient id="g" cx="28%" cy="20%" r="95%">
<stop offset="0" stop-color="${accent}" stop-opacity="0.30"/>
<stop offset="0.55" stop-color="#0b1210" stop-opacity="0"/>
</radialGradient></defs>
<rect width="600" height="600" fill="#0b1210"/>
<rect width="600" height="600" fill="url(#g)"/>
<rect x="0.75" y="0.75" width="598.5" height="598.5" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
<text x="48" y="86" font-family="ui-monospace,Menlo,monospace" font-size="22" fill="${accent}">&lt;/&gt;</text>
<text x="48" y="120" font-family="ui-monospace,Menlo,monospace" font-size="12" letter-spacing="3" fill="#ffffff" fill-opacity="0.45">${esc(kicker)}</text>
${titleLines
  .map(
    (line, i) =>
      `<text x="48" y="${252 + i * 50}" font-family="Georgia,'Times New Roman',serif" font-size="42" fill="#ffffff">${esc(line)}</text>`,
  )
  .join("")}
<text x="48" y="548" font-family="ui-monospace,Menlo,monospace" font-size="14" fill="#ffffff" fill-opacity="0.55">${esc(tech)}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
