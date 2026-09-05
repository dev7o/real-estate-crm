import { cn } from "@/lib/utils";

export function Progress({ value, className, color = "#B8934A" }: { value: number; className?: string; color?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-50", className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
