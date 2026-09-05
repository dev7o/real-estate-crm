import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Lead, User } from "@prisma/client";

type LeadRow = Lead & { assignedTo: User | null; _count: { deals: number; siteVisits: number } };

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-navy-100 bg-surface-raised">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-module-leads-bg text-xs text-ink-muted">
            <th className="px-4 py-3 text-start font-medium">العميل</th>
            <th className="px-4 py-3 text-start font-medium">الهاتف</th>
            <th className="px-4 py-3 text-start font-medium">المصدر</th>
            <th className="px-4 py-3 text-start font-medium">الحالة</th>
            <th className="px-4 py-3 text-start font-medium">المندوب المسؤول</th>
            <th className="px-4 py-3 text-start font-medium">تاريخ الإضافة</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-navy-50 transition-colors last:border-0 hover:bg-module-leads-bg/40">
              <td className="px-4 py-3">
                <Link href={`/leads/${lead.id}`} className="font-medium text-ink hover:text-module-leads">
                  {lead.name}
                </Link>
              </td>
              <td className="figure px-4 py-3 text-ink-muted">{lead.phone}</td>
              <td className="px-4 py-3 text-ink-muted">{LEAD_SOURCE_LABELS[lead.source]}</td>
              <td className="px-4 py-3">
                <Badge color={LEAD_STATUS_COLORS[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-ink-muted">{lead.assignedTo?.name ?? "— غير معيّن —"}</td>
              <td className="px-4 py-3 text-ink-faint">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
