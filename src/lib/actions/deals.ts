"use server";

import { db } from "@/lib/db";
import { dealSchema, stageChangeSchema, type DealInput } from "@/lib/validations/deal";
import { revalidatePath } from "next/cache";
import type { DealStage, LossReason } from "@prisma/client";
import { dealStageLabel } from "@/lib/constants";

export async function getDeals() {
  return db.deal.findMany({
    include: {
      lead: true,
      unit: { include: { project: true } },
      owner: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

/** إنشاء صفقة جديدة مرتبطة بعميل محتمل — نقطة دخول خط الأنابيب */
export async function createDeal(input: DealInput) {
  const data = dealSchema.parse(input);
  const deal = await db.deal.create({
    data: {
      title: data.title,
      leadId: data.leadId,
      unitId: data.unitId || null,
      ownerId: data.ownerId || null,
      value: data.value,
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : null,
    },
  });
  revalidatePath("/pipeline");
  return deal;
}

export async function getDealsEligibleForReservation() {
  return db.deal.findMany({
    where: { reservation: null, stage: { not: "CLOSED_LOST" } },
    include: { lead: true, unit: { include: { project: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * تغيير مرحلة الصفقة في خط الأنابيب (سحب وإفلات) — FR-3.1
 * عند الإغلاق الخاسر، يُسجَّل سبب الخسارة إلزاميًا — FR-3.3
 */
export async function changeDealStage(dealId: string, stage: DealStage, lossReason?: LossReason) {
  const parsed = stageChangeSchema.parse({ dealId, stage, lossReason });

  const deal = await db.deal.update({
    where: { id: parsed.dealId },
    data: {
      stage: parsed.stage,
      lossReason: parsed.stage === "CLOSED_LOST" ? parsed.lossReason ?? "OTHER" : null,
    },
  });

  await db.activity.create({
    data: {
      dealId: deal.id,
      leadId: deal.leadId,
      type: "STAGE_CHANGE",
      content: `انتقلت الصفقة إلى مرحلة: ${dealStageLabel(parsed.stage)}`,
    },
  });

  revalidatePath("/pipeline");
  return deal;
}
