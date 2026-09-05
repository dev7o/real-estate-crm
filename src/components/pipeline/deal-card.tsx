import { formatCurrency } from "@/lib/utils";
import { Home, User } from "lucide-react";
import type { Deal, Lead, Unit, Project, User as UserModel } from "@prisma/client";

export type DealCardData = Deal & {
  lead: Lead;
  unit: (Unit & { project: Project }) | null;
  owner: UserModel | null;
};

export function DealCard({ deal, draggable, onDragStart }: {
  deal: DealCardData;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className="cursor-grab space-y-2 rounded-DEFAULT border border-navy-100 bg-surface-raised p-3 shadow-card transition-shadow hover:shadow-raised active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-ink">{deal.title}</p>
      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <User className="h-3.5 w-3.5" />
        {deal.lead.name}
      </p>
      {deal.unit && (
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Home className="h-3.5 w-3.5" />
          {deal.unit.project.name} — {deal.unit.code}
        </p>
      )}
      <div className="flex items-center justify-between pt-1">
        <span className="figure text-sm font-semibold text-module-pipeline">{formatCurrency(deal.value)}</span>
        {deal.owner && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-module-pipeline-bg text-[10px] font-medium text-module-pipeline">
            {deal.owner.name.slice(0, 2)}
          </span>
        )}
      </div>
    </div>
  );
}
