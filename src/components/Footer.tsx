import { SocialLinks } from "@/components/SocialLinks";
import { profile, socials } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-fg">{profile.name}</p>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} · Built with Next.js. Content lives in{" "}
            <code className="text-faint">/content</code>.
          </p>
        </div>
        <SocialLinks items={socials} />
      </div>
    </footer>
  );
}
