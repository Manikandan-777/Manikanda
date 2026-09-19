import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { SocialLinks } from "@/components/SocialLinks";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { profile, socials } from "@/lib/content";
import { assetUrl } from "@/lib/utils";

export function Hero() {
  const hasPhoto = Boolean(profile.photo);

  return (
    <section
      id="top"
      className="relative scroll-mt-24 overflow-hidden border-b-2 border-fg pb-0 pt-12 md:pt-16"
    >
      <div
        className={
          hasPhoto
            ? "shell grid items-end gap-10 md:grid-cols-[1fr_0.95fr] md:gap-14"
            : "shell"
        }
      >
        {/* Text column */}
        <div className="md:self-center md:pb-16">
          {profile.availability && (
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {profile.availability}
            </p>
          )}

          <h1 className="mt-6 max-w-[16ch] text-display-1 text-fg">{profile.name}</h1>

          <p className="mt-6 max-w-prose text-lg text-muted md:text-xl">
            <span className="text-fg">{profile.title}.</span> {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ShimmerButton href="#projects">
              View projects
              <ArrowDownRight
                size={16}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </ShimmerButton>
            {profile.resumeUrl && (
              <a
                href={assetUrl(profile.resumeUrl)}
                download
                className="inline-flex items-center gap-2 rounded-full border border-fg px-6 py-3 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
              >
                Download résumé
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          <div className="mt-10">
            <SocialLinks items={socials} />
          </div>
        </div>

        {/* Photo column — only renders when profile.photo is set. A transparent
            (background-removed) PNG sits over a soft accent halo so it reads on
            both themes. */}
        {hasPhoto && (
          <div className="relative z-10 mx-auto w-full max-w-xs md:-mb-16 md:-mt-12 md:max-w-none">
            <div
              aria-hidden
              className="absolute inset-x-4 bottom-0 top-8 rounded-[2rem] bg-accent-soft blur-2xl"
            />
            {/* Full 408×612 cut-out, shown whole (no crop), lightly scaled up. */}
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={assetUrl(profile.photo)}
                alt={`${profile.name}, ${profile.title}`}
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 78vw, 36vw"
                className="scale-110 object-contain object-top drop-shadow-xl [filter:contrast(1.07)_saturate(1.06)]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
