import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getProjectPerformance, getRepPerformance } from "@/lib/actions/reports";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Users, KanbanSquare, Wallet, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, projectPerf, repPerf] = await Promise.all([
    getDashboardStats(),
    getProjectPerformance(),
    getRepPerformance(),
  ]);

  const chartData = projectPerf.map((p) => ({
    name: p.name,
    sold: p.sold,
    reserved: p.reserved,
    available: p.available,
  }));

  return (
    <>
      <Topbar title="لوحة التحكم" subtitle="نظرة عامة على أداء المبيعات اليوم" />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="عملاء جدد (٣٠ يومًا)"
            value={formatNumber(stats.newLeadsLast30Days)}
            icon={Users}
            accent="#2E6F9E"
          />
          <StatCard
            label="صفقات مفتوحة"
            value={formatNumber(stats.openDealsCount)}
            icon={KanbanSquare}
            accent="#2F7D6E"
          />
          <StatCard
            label="إيرادات محققة"
            value={formatCurrency(stats.closedRevenue)}
            icon={TrendingUp}
            accent="#B8934A"
            trend={`${formatNumber(stats.closedDealsCount)} عقد مغلق`}
          />
          <StatCard
            label="نسبة إشغال الوحدات"
            value={`${stats.occupancyRate}%`}
            icon={Building2}
            accent="#A85327"
            trend={`${formatNumber(stats.soldUnits)} من ${formatNumber(stats.totalUnits)} وحدة`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>نسبة الإشغال حسب المشروع</CardTitle>
              <Link href="/reports" className="text-xs font-medium text-gold hover:underline">
                عرض التقرير الكامل
              </Link>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <OccupancyChart data={chartData} />
              ) : (
                <p className="py-16 text-center text-sm text-ink-muted">
                  لا توجد مشاريع مضافة بعد
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تنبيهات تحتاج متابعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-DEFAULT bg-module-payments-bg p-3">
                <div>
                  <p className="text-sm font-medium text-ink">أقساط متأخرة</p>
                  <p className="text-xs text-ink-muted">تحتاج متابعة فورية من قسم التحصيل</p>
                </div>
                <Badge color="#B0402E">{formatNumber(stats.overdueInstallments)}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-DEFAULT bg-module-visits-bg p-3">
                <div>
                  <p className="text-sm font-medium text-ink">معاينات قادمة</p>
                  <p className="text-xs text-ink-muted">مواعيد لم تُسجَّل نتيجتها بعد</p>
                </div>
                <Badge color="#6552A6">{formatNumber(stats.upcomingVisits)}</Badge>
              </div>
              <Link
                href="/pipeline"
                className="block rounded-DEFAULT border border-dashed border-navy-100 p-3 text-center text-xs font-medium text-ink-muted hover:border-gold hover:text-gold"
              >
                عرض خط أنابيب المبيعات الكامل ←
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>أداء فريق المبيعات هذا الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            {repPerf.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-xs text-ink-muted">
                      <th className="pb-2 text-start font-medium">المندوب</th>
                      <th className="pb-2 text-start font-medium">المعاينات</th>
                      <th className="pb-2 text-start font-medium">الصفقات المغلقة</th>
                      <th className="pb-2 text-start font-medium">نسبة الإغلاق</th>
                      <th className="pb-2 text-start font-medium">الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repPerf.map((r) => (
                      <tr key={r.id} className="border-b border-navy-50 last:border-0">
                        <td className="py-3 font-medium text-ink">{r.name}</td>
                        <td className="py-3 text-ink-muted">{formatNumber(r.visits)}</td>
                        <td className="py-3 text-ink-muted">{formatNumber(r.dealsWon)}</td>
                        <td className="py-3">
                          <Badge color={r.closeRate >= 50 ? "#2F7D4F" : "#B8802E"}>{r.closeRate}%</Badge>
                        </td>
                        <td className="figure py-3 text-ink">{formatCurrency(r.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-ink-muted">لا يوجد مندوبو مبيعات مضافون بعد</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
