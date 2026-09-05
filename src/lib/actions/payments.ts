"use server";

import { db } from "@/lib/db";
import { paymentPlanSchema, type PaymentPlanInput } from "@/lib/validations/reservation";
import { revalidatePath } from "next/cache";

export async function getContractsAwaitingPlan() {
  return db.contract.findMany({
    where: { paymentPlan: null },
    include: { reservation: { include: { unit: { include: { project: true } }, deal: { include: { lead: true } } } } },
    orderBy: { signedAt: "desc" },
  });
}

export async function getPaymentPlans() {
  return db.paymentPlan.findMany({
    include: {
      installments: { orderBy: { dueDate: "asc" } },
      contract: {
        include: {
          reservation: {
            include: { unit: { include: { project: true } }, deal: { include: { lead: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** إنشاء خطة سداد لعقد — FR-6.1 (دفعة أولى + أقساط دورية + دفعة التسليم) */
export async function createPaymentPlan(input: PaymentPlanInput) {
  const data = paymentPlanSchema.parse(input);

  const plan = await db.paymentPlan.create({
    data: {
      contractId: data.contractId,
      installments: {
        create: data.installments.map((i) => ({
          label: i.label,
          amount: i.amount,
          dueDate: new Date(i.dueDate),
        })),
      },
    },
    include: { installments: true },
  });

  revalidatePath("/payments");
  return plan;
}

/** تسجيل دفعة مستلمة — FR-6.3 */
export async function markInstallmentPaid(installmentId: string) {
  const installment = await db.installment.update({
    where: { id: installmentId },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/payments");
  return installment;
}

/** تحديث الأقساط المتأخرة تلقائيًا (تُستدعى عند تحميل الصفحة) — FR-6.4/6.5 */
export async function refreshOverdueInstallments() {
  const result = await db.installment.updateMany({
    where: { status: "PENDING", dueDate: { lt: new Date() } },
    data: { status: "OVERDUE" },
  });
  if (result.count > 0) revalidatePath("/payments");
  return result.count;
}
