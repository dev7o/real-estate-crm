"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { markInstallmentPaid } from "@/lib/actions/payments";
import { INSTALLMENT_STATUS_LABELS, INSTALLMENT_STATUS_COLORS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, User, Home } from "lucide-react";
import type { PaymentPlan, Installment, Contract, Reservation, Unit, Project, Deal, Lead } from "@prisma/client";

type PlanRow = PaymentPlan & {
  installments: Installment[];
  contract: Contract & {
    reservation: Reservation & {
      unit: Unit & { project: Project };
      deal: Deal & { lead: Lead };
    };
  };
};

export function PaymentPlanCard({ plan }: { plan: PlanRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const total = plan.installments.reduce((s, i) => s + i.amount, 0);
  const paid = plan.installments.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const percent = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{plan.contract.contractNumber}</CardTitle>
          <p className="mt-1 flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {plan.contract.reservation.deal.lead.name}
            </span>
            <span className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              {plan.contract.reservation.unit.project.name} — {plan.contract.reservation.unit.code}
            </span>
          </p>
        </div>
        <div className="text-end">
          <p className="figure text-sm font-semibold text-ink">{formatCurrency(paid)}</p>
          <p className="text-xs text-ink-faint">من أصل {formatCurrency(total)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={percent} color="#8A6D1E" />

        <div className="space-y-2">
          {plan.installments.map((inst) => (
            <div
              key={inst.id}
              className="flex items-center justify-between rounded-DEFAULT border border-navy-100 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-ink">{inst.label}</p>
                <p className="text-xs text-ink-faint">استحقاق: {formatDate(inst.dueDate)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="figure text-sm text-ink">{formatCurrency(inst.amount)}</span>
                <Badge color={INSTALLMENT_STATUS_COLORS[inst.status]}>
                  {INSTALLMENT_STATUS_LABELS[inst.status]}
                </Badge>
                {inst.status !== "PAID" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await markInstallmentPaid(inst.id);
                        router.refresh();
                      })
                    }
                  >
                    <Check className="h-3.5 w-3.5" />
                    تسجيل الدفع
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
