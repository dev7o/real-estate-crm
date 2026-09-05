"use server";

import { db } from "@/lib/db";
import { siteVisitSchema, visitOutcomeSchema, type SiteVisitInput } from "@/lib/validations/site-visit";
import { revalidatePath } from "next/cache";
import type { VisitOutcome } from "@prisma/client";

export async function getSiteVisits() {
  return db.siteVisit.findMany({
    include: { lead: true, unit: { include: { project: true } }, rep: true },
    orderBy: { scheduledAt: "asc" },
  });
}

/** جدولة معاينة ميدانية — FR-4.1، مع تذكير ضمني عبر تاريخ الاستحقاق FR-4.2 */
export async function scheduleSiteVisit(input: SiteVisitInput) {
  const data = siteVisitSchema.parse(input);
  const visit = await db.siteVisit.create({
    data: {
      leadId: data.leadId,
      unitId: data.unitId || null,
      repId: data.repId || null,
      scheduledAt: new Date(data.scheduledAt),
      notes: data.notes,
    },
  });

  await db.activity.create({
    data: { leadId: data.leadId, type: "NOTE", content: "تم جدولة معاينة ميدانية" },
  });

  revalidatePath("/site-visits");
  return visit;
}

/** تسجيل نتيجة المعاينة بعد حدوثها — FR-4.3 */
export async function recordVisitOutcome(visitId: string, outcome: VisitOutcome, notes?: string) {
  const parsed = visitOutcomeSchema.parse({ visitId, outcome, notes });
  const visit = await db.siteVisit.update({
    where: { id: parsed.visitId },
    data: { outcome: parsed.outcome, notes: parsed.notes },
  });
  revalidatePath("/site-visits");
  return visit;
}
