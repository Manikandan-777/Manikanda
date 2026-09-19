import { SocialLinks } from "@/components/SocialLinks";
import { profile, socials } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-fg">{profile.name}</p>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Manikandan P. All rights reserved.
          </p>
        </div>
        <SocialLinks items={socials} />
      </div>
    </footer>
  );
}
