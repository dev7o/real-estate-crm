"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [newLeads, openDeals, wonDeals, units, overdueInstallments, upcomingVisits] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } }),
    db.deal.count({ where: { stage: { notIn: ["CONTRACTED", "CLOSED_LOST"] } } }),
    db.deal.findMany({ where: { stage: "CONTRACTED" }, select: { value: true } }),
    db.unit.groupBy({ by: ["status"], _count: true }),
    db.installment.count({ where: { status: "OVERDUE" } }),
    db.siteVisit.count({ where: { scheduledAt: { gte: new Date() }, outcome: "PENDING" } }),
  ]);

  const totalUnits = units.reduce((sum, u) => sum + u._count, 0);
  const soldUnits = units.find((u) => u.status === "SOLD")?._count ?? 0;
  const closedRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  return {
    newLeadsLast30Days: newLeads,
    openDealsCount: openDeals,
    closedRevenue,
    closedDealsCount: wonDeals.length,
    totalUnits,
    soldUnits,
    occupancyRate: totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 100) : 0,
    overdueInstallments,
    upcomingVisits,
  };
}

/** أداء كل مندوب مبيعات — FR-7.2 */
export async function getRepPerformance() {
  const reps = await db.user.findMany({
    where: { role: "SALES_REP" },
    include: {
      deals: { select: { stage: true, value: true } },
      siteVisits: { select: { id: true } },
    },
  });

  return reps.map((rep) => {
    const won = rep.deals.filter((d) => d.stage === "CONTRACTED");
    const closed = rep.deals.filter((d) => d.stage === "CONTRACTED" || d.stage === "CLOSED_LOST");
    return {
      id: rep.id,
      name: rep.name,
      visits: rep.siteVisits.length,
      dealsWon: won.length,
      revenue: won.reduce((s, d) => s + d.value, 0),
      closeRate: closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0,
    };
  });
}

/** أداء كل مشروع عقاري — نسبة الإشغال FR-7.3 */
export async function getProjectPerformance() {
  const projects = await db.project.findMany({ include: { units: true } });
  return projects.map((p) => {
    const total = p.units.length;
    const sold = p.units.filter((u) => u.status === "SOLD").length;
    const reserved = p.units.filter((u) => u.status === "RESERVED").length;
    return {
      id: p.id,
      name: p.name,
      total,
      sold,
      reserved,
      available: total - sold - reserved,
      occupancy: total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0,
    };
  });
}

/** تحليل مصادر العملاء الأكثر تحويلًا — FR-7.4 */
export async function getSourcePerformance() {
  const leads = await db.lead.findMany({ select: { source: true, status: true } });
  const bySource = new Map<string, { total: number; qualified: number }>();
  for (const l of leads) {
    const entry = bySource.get(l.source) ?? { total: 0, qualified: 0 };
    entry.total += 1;
    if (l.status === "QUALIFIED") entry.qualified += 1;
    bySource.set(l.source, entry);
  }
  return Array.from(bySource.entries()).map(([source, v]) => ({
    source,
    total: v.total,
    qualified: v.qualified,
    conversionRate: v.total > 0 ? Math.round((v.qualified / v.total) * 100) : 0,
  }));
}
