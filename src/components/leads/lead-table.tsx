"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Lead, User } from "@prisma/client";
import { motion } from "framer-motion";

type LeadRow = Lead & { assignedTo: User | null; _count: { deals: number; siteVisits: number } };

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl glass border border-white/40 dark:border-navy-700/60 shadow-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100/50 dark:border-navy-700/50 bg-navy-50/50 dark:bg-navy-900/50 text-xs text-ink-muted dark:text-navy-300">
            <th className="px-5 py-4 text-start font-semibold">العميل</th>
            <th className="px-5 py-4 text-start font-semibold">الهاتف</th>
            <th className="px-5 py-4 text-start font-semibold">المصدر</th>
            <th className="px-5 py-4 text-start font-semibold">الحالة</th>
            <th className="px-5 py-4 text-start font-semibold">المندوب المسؤول</th>
            <th className="px-5 py-4 text-start font-semibold">تاريخ الإضافة</th>
          </tr>
        </thead>
        <motion.tbody
          variants={container}
          initial="hidden"
          animate="show"
        >
          {leads.map((lead) => (
            <motion.tr 
              key={lead.id} 
              variants={item}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="border-b border-navy-50/50 dark:border-navy-800/50 transition-colors last:border-0 hover:bg-module-leads-bg/20 dark:hover:bg-module-leads-bg/10 relative z-10"
            >
              <td className="px-5 py-4">
                <Link href={`/leads/${lead.id}`} className="font-bold text-ink dark:text-navy-50 hover:text-module-leads transition-colors">
                  {lead.name}
                </Link>
              </td>
              <td className="figure px-5 py-4 text-ink-muted dark:text-navy-300">{lead.phone}</td>
              <td className="px-5 py-4 text-ink-muted dark:text-navy-300">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-navy-50 dark:bg-navy-800 text-xs font-medium">
                  {LEAD_SOURCE_LABELS[lead.source]}
                </span>
              </td>
              <td className="px-5 py-4">
                <Badge color={LEAD_STATUS_COLORS[lead.status]} className="shadow-sm">{LEAD_STATUS_LABELS[lead.status]}</Badge>
              </td>
              <td className="px-5 py-4 text-ink-muted dark:text-navy-300 font-medium">{lead.assignedTo?.name ?? "— غير معيّن —"}</td>
              <td className="px-5 py-4 text-ink-faint dark:text-navy-400">{formatDate(lead.createdAt)}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
