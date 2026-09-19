import {
  Code2,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

/** Minimal classnames joiner — no dependency needed. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Code2,
  code: Code2,
  globe: Globe,
  website: Globe,
  portfolio: Globe,
  mail: Mail,
  email: Mail,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  link: LinkIcon,
};

/** Look up a lucide icon by the `icon` string in social.json (falls back to a link glyph). */
export function socialIcon(name: string): LucideIcon {
  return ICONS[name.toLowerCase()] ?? LinkIcon;
}

/** Prepend Next.js basePath when deployed under a repository subpath (e.g., GitHub Pages). */
export function assetUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanBase = basePath.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
