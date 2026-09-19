import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-display-2 text-fg">This page wandered off.</h1>
      <p className="mt-4 max-w-prose text-muted">
        The link may be broken, or the page may have moved.
      </p>
      <ShimmerButton href="/" className="mt-8">
        Back home
      </ShimmerButton>
    </div>
  );
}
