import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/**
 * The site's primary button — a distilled, palette-bound version of
 * `glassmorphism-cta`: a green (`--accent`) pill with a rotating conic shimmer
 * ring and a green glow. No avatar; text uses `--accent-contrast` for WCAG AA.
 *
 * Renders an <a> when `href` is set, otherwise a <button>. The shimmer stops for
 * `prefers-reduced-motion` users (see globals.css → [data-shimmer]).
 */
type BaseProps = {
  children: ReactNode;
  className?: string;
  /** Shimmer arc width; larger = more of the ring lit at once. */
  spread?: string;
  /** One rotation duration. */
  speed?: string;
};

type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

export type ShimmerButtonProps = AsAnchor | AsButton;

const SHELL =
  "group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium " +
  "text-[color:var(--accent-contrast)] shadow-[0_8px_30px_rgba(18,161,80,0.28)] transition-[transform,box-shadow] duration-300 " +
  "hover:-translate-y-0.5 hover:shadow-[0_0_36px_6px_rgba(18,161,80,0.42)] focus-visible:-translate-y-0.5 " +
  "disabled:pointer-events-none disabled:opacity-60";

function Decoration({ spread, speed }: { spread: string; speed: string }) {
  return (
    <>
      {/* rotating conic shimmer ring */}
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
        <span
          data-shimmer
          className="absolute inset-[-200%] h-[400%] w-[400%] [animation:rotate-gradient_var(--btn-speed)_linear_infinite]"
          style={{ "--btn-speed": speed } as CSSProperties}
        >
          <span
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from calc(270deg - (${spread} * 0.5)), transparent 0, rgba(255,255,255,0.85) ${spread}, transparent ${spread})`,
            }}
          />
        </span>
      </span>
      {/* solid accent fill, inset by 1px so the ring shows as a hairline border */}
      <span
        aria-hidden
        className="absolute rounded-full [background:var(--accent)]"
        style={{ inset: "1px" }}
      />
    </>
  );
}

export function ShimmerButton({
  children,
  className,
  spread = "90deg",
  speed = "4s",
  ...props
}: ShimmerButtonProps) {
  const content = (
    <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={cn(SHELL, className)} {...rest}>
        <Decoration spread={spread} speed={speed} />
        {content}
      </a>
    );
  }

  const { type, ...rest } = props as AsButton;
  return (
    <button type={type ?? "button"} className={cn(SHELL, className)} {...rest}>
      <Decoration spread={spread} speed={speed} />
      {content}
    </button>
  );
}

export default ShimmerButton;
