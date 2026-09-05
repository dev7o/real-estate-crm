import { Badge } from "@/components/ui/badge";
import { ConvertToContractButton } from "@/components/reservations/convert-to-contract-button";
import { RESERVATION_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { Home, User, Calendar } from "lucide-react";
import type { Reservation, Unit, Project, Deal, Lead, User as UserModel, Contract } from "@prisma/client";

type ReservationRow = Reservation & {
  unit: Unit & { project: Project };
  deal: Deal & { lead: Lead };
  rep: UserModel | null;
  contract: Contract | null;
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#7A3B69",
  CONVERTED: "#2F7D4F",
  EXPIRED: "#8B93A0",
  CANCELLED: "#B0402E",
};

export function ReservationList({ reservations }: { reservations: ReservationRow[] }) {
  return (
    <div className="space-y-3">
      {reservations.map((r) => {
        const remaining = daysUntil(r.expiresAt);
        const expiringSoon = r.status === "ACTIVE" && remaining <= 3;

        return (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-lg border border-navy-100 bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <User className="h-4 w-4 text-module-reservations" />
                <span className="text-sm font-medium text-ink">{r.deal.lead.name}</span>
                <Badge color={STATUS_COLORS[r.status]}>{RESERVATION_STATUS_LABELS[r.status as keyof typeof RESERVATION_STATUS_LABELS]}</Badge>
                {expiringSoon && (
                  <Badge color="#B0402E">
                    {remaining < 0 ? "منتهي الصلاحية" : remaining === 0 ? "ينتهي اليوم" : `ينتهي خلال ${remaining} أيام`}
                  </Badge>
                )}
              </div>
              <p className="flex items-center gap-2 text-xs text-ink-muted">
                <Home className="h-3.5 w-3.5" />
                {r.unit.project.name} — وحدة {r.unit.code}
              </p>
              <p className="flex items-center gap-2 text-xs text-ink-faint">
                <Calendar className="h-3.5 w-3.5" />
                ينتهي في {formatDate(r.expiresAt)} · عربون {formatCurrency(r.downPayment)}
                {r.rep ? ` · المندوب: ${r.rep.name}` : ""}
              </p>
            </div>
            <div>
              {r.status === "ACTIVE" && !r.contract && (
                <ConvertToContractButton reservationId={r.id} suggestedValue={r.deal.value} />
              )}
              {r.contract && <Badge color="#2F7D4F">عقد رقم {r.contract.contractNumber}</Badge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
