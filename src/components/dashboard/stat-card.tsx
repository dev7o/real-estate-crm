"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
  trend?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl glass-card p-6 border border-white/40 dark:border-navy-700/60 group"
    >
      {/* Glow effect */}
      <div 
        className="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-full"
        style={{ backgroundImage: `linear-gradient(to right, ${accent}, transparent)` }}
      />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-muted dark:text-navy-200 mb-1">{label}</p>
          <p className="figure text-3xl font-bold text-ink dark:text-navy-50 drop-shadow-sm">{value}</p>
          {trend && (
            <p className="mt-2 text-xs font-medium text-ink-faint dark:text-navy-300">
              {trend}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 15 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner backdrop-blur-sm"
          style={{ backgroundColor: `${accent}1a`, border: `1px solid ${accent}40` }}
        >
          <Icon className="h-6 w-6 drop-shadow-md" style={{ color: accent }} strokeWidth={2} />
        </motion.div>
      </div>
    </motion.div>
  );
}
