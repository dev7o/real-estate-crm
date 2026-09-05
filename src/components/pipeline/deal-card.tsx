"use client";

import { formatCurrency } from "@/lib/utils";
import { Home, User } from "lucide-react";
import type { Deal, Lead, Unit, Project, User as UserModel } from "@prisma/client";
import { motion } from "framer-motion";

export type DealCardData = Deal & {
  lead: Lead;
  unit: (Unit & { project: Project }) | null;
  owner: UserModel | null;
};

export function DealCard({ deal, draggable, onDragStart }: {
  deal: DealCardData;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      draggable={draggable}
      onDragStart={onDragStart}
      className="cursor-grab space-y-3 rounded-xl border border-white/40 dark:border-navy-700/60 glass-card p-4 shadow-sm transition-all hover:shadow-lg dark:hover:shadow-navy-900/50 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-module-pipeline/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <p className="text-sm font-bold text-ink dark:text-navy-50 relative z-10">{deal.title}</p>
      
      <div className="space-y-1.5 relative z-10">
        <p className="flex items-center gap-2 text-xs font-medium text-ink-muted dark:text-navy-300">
          <User className="h-4 w-4 text-module-pipeline opacity-70" />
          {deal.lead.name}
        </p>
        {deal.unit && (
          <p className="flex items-center gap-2 text-xs font-medium text-ink-muted dark:text-navy-300">
            <Home className="h-4 w-4 text-module-pipeline opacity-70" />
            {deal.unit.project.name} — {deal.unit.code}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-navy-100/50 dark:border-navy-700/50 relative z-10">
        <span className="figure text-sm font-bold text-module-pipeline drop-shadow-sm">{formatCurrency(deal.value)}</span>
        {deal.owner && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-module-pipeline-bg dark:bg-module-pipeline/20 border border-module-pipeline/10 dark:border-module-pipeline/30 text-[11px] font-bold text-module-pipeline shadow-sm">
            {deal.owner.name.slice(0, 2)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
