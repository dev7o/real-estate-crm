import { Badge } from "@/components/ui/badge";
import { UNIT_TYPE_LABELS, UNIT_STATUS_LABELS, UNIT_STATUS_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Unit } from "@prisma/client";

export function UnitTable({ units }: { units: Unit[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-navy-100 bg-surface-raised">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-module-projects-bg text-xs text-ink-muted">
            <th className="px-4 py-3 text-start font-medium">رقم الوحدة</th>
            <th className="px-4 py-3 text-start font-medium">النوع</th>
            <th className="px-4 py-3 text-start font-medium">الدور</th>
            <th className="px-4 py-3 text-start font-medium">المساحة</th>
            <th className="px-4 py-3 text-start font-medium">الغرف</th>
            <th className="px-4 py-3 text-start font-medium">السعر</th>
            <th className="px-4 py-3 text-start font-medium">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-b border-navy-50 last:border-0 hover:bg-module-projects-bg/40">
              <td className="figure px-4 py-3 font-medium text-ink">{unit.code}</td>
              <td className="px-4 py-3 text-ink-muted">{UNIT_TYPE_LABELS[unit.type]}</td>
              <td className="figure px-4 py-3 text-ink-muted">{unit.floor ?? "—"}</td>
              <td className="figure px-4 py-3 text-ink-muted">{unit.areaSqm} م²</td>
              <td className="figure px-4 py-3 text-ink-muted">{unit.bedrooms ?? "—"}</td>
              <td className="figure px-4 py-3 text-ink">{formatCurrency(unit.price)}</td>
              <td className="px-4 py-3">
                <Badge color={UNIT_STATUS_COLORS[unit.status]}>{UNIT_STATUS_LABELS[unit.status]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
