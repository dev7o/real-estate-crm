import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
  trend?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted">{label}</p>
          <p className="figure mt-2 text-2xl font-semibold text-ink">{value}</p>
          {trend && <p className="mt-1 text-xs text-ink-faint">{trend}</p>}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT"
          style={{ backgroundColor: `${accent}14` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={1.75} />
        </div>
      </div>
    </Card>
  );
}
