import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { CreatePaymentPlanButton } from "@/components/payments/create-payment-plan-button";
import { PaymentPlanCard } from "@/components/payments/payment-plan-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getPaymentPlans,
  getContractsAwaitingPlan,
  refreshOverdueInstallments,
} from "@/lib/actions/payments";
import { formatCurrency } from "@/lib/utils";
import { Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function PaymentsPage() {
  // تحديث الأقساط المتأخرة تلقائيًا — FR-6.4/6.5
  await refreshOverdueInstallments();

  const [plans, awaitingContracts] = await Promise.all([getPaymentPlans(), getContractsAwaitingPlan()]);

  const allInstallments = plans.flatMap((p) => p.installments);
  const overdue = allInstallments.filter((i) => i.status === "OVERDUE");
  const paidTotal = allInstallments.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const overdueTotal = overdue.reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <Topbar title="التحصيل وخطط السداد" subtitle={`${plans.length} خطة سداد نشطة`} />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="إجمالي المحصّل" value={formatCurrency(paidTotal)} icon={CheckCircle2} accent="#2F7D4F" />
          <StatCard
            label="أقساط متأخرة"
            value={formatCurrency(overdueTotal)}
            icon={AlertTriangle}
            accent="#B0402E"
            trend={`${overdue.length} قسط متأخر`}
          />
          <StatCard label="خطط سداد نشطة" value={String(plans.length)} icon={Wallet} accent="#8A6D1E" />
        </div>

        <div className="flex items-center justify-end">
          <CreatePaymentPlanButton contracts={awaitingContracts} />
        </div>

        {plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <PaymentPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wallet}
            title="لا توجد خطط سداد بعد"
            description="أنشئ خطة سداد لعقد موقّع لبدء متابعة التحصيل"
          />
        )}
      </div>
    </>
  );
}
