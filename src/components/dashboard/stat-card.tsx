import type { LucideIcon } from "lucide-react";

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
    <div
      className="relative overflow-hidden rounded-2xl p-6 border border-white/50 dark:border-navy-700/60 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-2 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-muted dark:text-navy-200 mb-1">{label}</p>
          <p className="figure text-3xl font-bold text-ink dark:text-navy-50">{value}</p>
          {trend && (
            <p className="mt-2 text-xs font-medium text-ink-faint dark:text-navy-300">
              {trend}
            </p>
          )}
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: `${accent}1a`, border: `1px solid ${accent}40` }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

