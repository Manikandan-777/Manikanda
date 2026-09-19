import { profile, settings, socials } from "@/lib/content";

/** JSON-LD Person schema for rich results. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    url: settings.siteUrl,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location }
      : undefined,
    sameAs: socials.map((s) => s.url),
  };

  return (
    <script
      type="application/ld+json"
      // Content is build-time constant from our own JSON files.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
