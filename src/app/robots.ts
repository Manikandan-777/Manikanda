import type { MetadataRoute } from "next";

import { settings } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const base = settings.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
