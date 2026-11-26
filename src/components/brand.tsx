import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex size-9 items-center justify-center rounded-xl",
          light ? "bg-ball text-court-deep" : "bg-court-deep text-ball"
        )}
        aria-hidden
      >
        <span className="absolute inset-1 rounded-lg border border-current/30" />
        <span className="absolute left-1/2 top-1.5 h-[calc(100%-12px)] w-px -translate-x-1/2 bg-current/40" />
        <span className="absolute top-1/2 left-1.5 h-px w-[calc(100%-12px)] -translate-y-1/2 bg-current/40" />
        <span className="size-2 rounded-full bg-current" />
      </span>
      <span
        className={cn(
          "font-display text-xl font-bold tracking-[0.08em]",
          light ? "text-line" : "text-court-deep"
        )}
      >
        COURTLINK
      </span>
    </div>
  );
}
