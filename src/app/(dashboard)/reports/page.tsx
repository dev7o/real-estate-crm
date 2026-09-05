import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SourceChart } from "@/components/reports/source-chart";
import { getRepPerformance, getProjectPerformance, getSourcePerformance } from "@/lib/actions/reports";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { LeadSource } from "@prisma/client";

export default async function ReportsPage() {
  const [reps, projects, sources] = await Promise.all([
    getRepPerformance(),
    getProjectPerformance(),
    getSourcePerformance(),
  ]);

  return (
    <>
      <Topbar title="التقارير والتحليلات" subtitle="أداء الفريق، المشاريع، ومصادر العملاء" />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>أداء المندوبين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-xs text-ink-muted">
                      <th className="pb-2 text-start font-medium">المندوب</th>
                      <th className="pb-2 text-start font-medium">المعاينات</th>
                      <th className="pb-2 text-start font-medium">صفقات مغلقة</th>
                      <th className="pb-2 text-start font-medium">نسبة الإغلاق</th>
                      <th className="pb-2 text-start font-medium">الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reps.map((r) => (
                      <tr key={r.id} className="border-b border-navy-50 last:border-0">
                        <td className="py-2.5 font-medium text-ink">{r.name}</td>
                        <td className="py-2.5 text-ink-muted">{formatNumber(r.visits)}</td>
                        <td className="py-2.5 text-ink-muted">{formatNumber(r.dealsWon)}</td>
                        <td className="py-2.5">{r.closeRate}%</td>
                        <td className="figure py-2.5 text-ink">{formatCurrency(r.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تحليل مصادر العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              {sources.length > 0 ? (
                <SourceChart data={sources} />
              ) : (
                <p className="py-16 text-center text-sm text-ink-muted">لا توجد بيانات كافية بعد</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>أداء المشاريع — نسبة الإشغال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="figure text-ink-muted">
                    {p.sold} مباعة · {p.reserved} محجوزة · {p.available} متاحة
                  </span>
                </div>
                <Progress value={p.occupancy} color="#A85327" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جدول تفصيلي لمصادر العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-xs text-ink-muted">
                    <th className="pb-2 text-start font-medium">المصدر</th>
                    <th className="pb-2 text-start font-medium">إجمالي العملاء</th>
                    <th className="pb-2 text-start font-medium">مؤهلون</th>
                    <th className="pb-2 text-start font-medium">نسبة التحويل</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s.source} className="border-b border-navy-50 last:border-0">
                      <td className="py-2.5 font-medium text-ink">
                        {LEAD_SOURCE_LABELS[s.source as LeadSource] ?? s.source}
                      </td>
                      <td className="py-2.5 text-ink-muted">{formatNumber(s.total)}</td>
                      <td className="py-2.5 text-ink-muted">{formatNumber(s.qualified)}</td>
                      <td className="py-2.5">
                        <Badge color={s.conversionRate >= 30 ? "#2F7D4F" : "#B8802E"}>
                          {s.conversionRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
