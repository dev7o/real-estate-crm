import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/constants";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#B8934A",
  SALES_MANAGER: "#2F7D6E",
  SALES_REP: "#2E6F9E",
  FINANCE: "#8A6D1E",
};

export default async function SettingsPage() {
  const users = await db.user.findMany({ orderBy: { role: "asc" } });

  return (
    <>
      <Topbar title="الإعدادات" subtitle="المستخدمون والصلاحيات" />

      <div className="space-y-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>المستخدمون والأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-xs text-ink-muted">
                    <th className="pb-2 text-start font-medium">الاسم</th>
                    <th className="pb-2 text-start font-medium">البريد الإلكتروني</th>
                    <th className="pb-2 text-start font-medium">الدور</th>
                    <th className="pb-2 text-start font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-navy-50 last:border-0">
                      <td className="py-2.5 font-medium text-ink">{u.name}</td>
                      <td className="py-2.5 text-ink-muted">{u.email}</td>
                      <td className="py-2.5">
                        <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                      </td>
                      <td className="py-2.5">
                        <Badge color={u.active ? "#2F7D4F" : "#8B93A0"}>{u.active ? "نشط" : "معطّل"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ملخص صلاحيات الأدوار</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-DEFAULT border border-navy-100 p-4">
              <Badge color="#B8934A">مدير عام</Badge>
              <p className="mt-2 text-ink-muted">صلاحية كاملة على جميع المشاريع والعملاء والتقارير</p>
            </div>
            <div className="rounded-DEFAULT border border-navy-100 p-4">
              <Badge color="#2F7D6E">مدير مبيعات</Badge>
              <p className="mt-2 text-ink-muted">يرى بيانات فريقه ومشاريعه المخصصة فقط</p>
            </div>
            <div className="rounded-DEFAULT border border-navy-100 p-4">
              <Badge color="#2E6F9E">مندوب مبيعات</Badge>
              <p className="mt-2 text-ink-muted">يرى عملاءه وصفقاته فقط</p>
            </div>
            <div className="rounded-DEFAULT border border-navy-100 p-4">
              <Badge color="#8A6D1E">مالي / تحصيل</Badge>
              <p className="mt-2 text-ink-muted">يرى العقود وخطط السداد فقط دون تفاصيل التسويق</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

