import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileCheck2, Home, User } from "lucide-react";
import Link from "next/link";

export default async function ContractsPage() {
  const contracts = await db.contract.findMany({
    include: {
      reservation: {
        include: {
          unit: { include: { project: true } },
          deal: { include: { lead: true } },
        },
      },
      paymentPlan: { include: { installments: true } },
    },
    orderBy: { signedAt: "desc" },
  });

  return (
    <>
      <Topbar title="العقود الموقّعة" subtitle={`${contracts.length} عقد نهائي`} />

      <div className="space-y-4 p-4 md:p-8">
        {contracts.length > 0 ? (
          <div className="space-y-3">
            {contracts.map((c) => {
              const hasPlan = !!c.paymentPlan;
              return (
                <Card key={c.id}>
                  <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-module-reservations" />
                        <span className="figure text-sm font-semibold text-ink">{c.contractNumber}</span>
                      </div>
                      <p className="flex items-center gap-2 text-xs text-ink-muted">
                        <User className="h-3.5 w-3.5" />
                        {c.reservation.deal.lead.name}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-ink-faint">
                        <Home className="h-3.5 w-3.5" />
                        {c.reservation.unit.project.name} — وحدة {c.reservation.unit.code} · وُقّع في{" "}
                        {formatDate(c.signedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="figure text-sm font-semibold text-ink">{formatCurrency(c.totalValue)}</span>
                      {hasPlan ? (
                        <Badge color="#2F7D4F">خطة سداد مُفعّلة</Badge>
                      ) : (
                        <Link href="/payments">
                          <Badge color="#B8802E">بحاجة لخطة سداد</Badge>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={FileCheck2} title="لا توجد عقود موقّعة بعد" description="تُنشأ العقود من خلال تحويل الحجوزات المبدئية" />
        )}
      </div>
    </>
  );
}

