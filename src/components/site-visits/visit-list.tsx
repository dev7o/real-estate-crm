import { Badge } from "@/components/ui/badge";
import { VisitOutcomeControl } from "@/components/site-visits/visit-outcome-control";
import { VISIT_OUTCOME_COLORS, VISIT_OUTCOME_LABELS } from "@/lib/constants";
import { formatDateTime, daysUntil } from "@/lib/utils";
import { User, Home, Clock } from "lucide-react";
import type { SiteVisit, Lead, Unit, Project, User as UserModel } from "@prisma/client";

type VisitRow = SiteVisit & { lead: Lead; unit: (Unit & { project: Project }) | null; rep: UserModel | null };

export function VisitList({ visits }: { visits: VisitRow[] }) {
  return (
    <div className="space-y-3">
      {visits.map((visit) => {
        const days = daysUntil(visit.scheduledAt);
        const isSoon = visit.outcome === "PENDING" && days >= 0 && days <= 2;
        const isOverdue = visit.outcome === "PENDING" && days < 0;

        return (
          <div
            key={visit.id}
            className="flex flex-col gap-3 rounded-lg border border-navy-100 bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderRightWidth: 4, borderRightColor: VISIT_OUTCOME_COLORS[visit.outcome] }}
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  <User className="h-4 w-4 text-module-visits" />
                  {visit.lead.name}
                </p>
                {visit.unit && (
                  <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <Home className="h-3.5 w-3.5" />
                    {visit.unit.project.name} — {visit.unit.code}
                  </p>
                )}
              </div>
              <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Clock className="h-3.5 w-3.5" />
                {formatDateTime(visit.scheduledAt)}
                {visit.rep ? ` — برفقة ${visit.rep.name}` : ""}
                {isOverdue && <span className="font-medium text-danger"> (فات موعدها — يلزم تسجيل نتيجة)</span>}
                {isSoon && <span className="font-medium text-module-visits"> (خلال يومين — تذكير)</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge color={VISIT_OUTCOME_COLORS[visit.outcome]}>{VISIT_OUTCOME_LABELS[visit.outcome]}</Badge>
              <VisitOutcomeControl visitId={visit.id} outcome={visit.outcome} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
