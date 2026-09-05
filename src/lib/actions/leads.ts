"use server";

import { db } from "@/lib/db";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";

export async function getLeads() {
  return db.lead.findMany({
    include: { assignedTo: true, _count: { select: { deals: true, siteVisits: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLead(id: string) {
  return db.lead.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      deals: { include: { unit: { include: { project: true } } } },
      siteVisits: { include: { unit: { include: { project: true } } }, orderBy: { scheduledAt: "desc" } },
      activities: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getUsers() {
  return db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

/** إضافة عميل محتمل جديد — FR-1.1 إلى FR-1.4 */
export async function createLead(input: LeadInput) {
  const data = leadSchema.parse(input);

  const lead = await db.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      source: data.source,
      purpose: data.purpose,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      preferredCity: data.preferredCity,
      preferredRooms: data.preferredRooms,
      notes: data.notes,
      assignedToId: data.assignedToId || null,
    },
  });

  await db.activity.create({
    data: {
      leadId: lead.id,
      type: "NOTE",
      content: "تم إنشاء العميل المحتمل",
    },
  });

  revalidatePath("/leads");
  return lead;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const lead = await db.lead.update({ where: { id: leadId }, data: { status } });

  await db.activity.create({
    data: { leadId, type: "STATUS_CHANGE", content: `تم تغيير حالة العميل` },
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  return lead;
}

export async function addLeadNote(leadId: string, content: string) {
  await db.activity.create({ data: { leadId, type: "NOTE", content } });
  revalidatePath(`/leads/${leadId}`);
}
