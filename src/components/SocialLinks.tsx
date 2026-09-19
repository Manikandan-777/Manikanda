import { socialIcon } from "@/lib/utils";
import type { Social } from "@/lib/schema";

export function SocialLinks({
  items,
  size = 18,
  className = "",
}: {
  items: Social[];
  size?: number;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((s) => {
        const Icon = socialIcon(s.icon);
        return (
          <li key={s.label}>
            <a
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent-line hover:text-accent"
            >
              <Icon size={size} strokeWidth={1.75} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
