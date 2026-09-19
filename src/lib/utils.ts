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
