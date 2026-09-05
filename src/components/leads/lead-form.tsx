"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createLead } from "@/lib/actions/leads";
import { LEAD_SOURCE_LABELS, LEAD_PURPOSE_LABELS } from "@/lib/constants";
import type { User } from "@prisma/client";

export function LeadForm({ users }: { users: User[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createLead({
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
          email: String(formData.get("email") || ""),
          source: formData.get("source") as any,
          purpose: formData.get("purpose") as any,
          budgetMin: formData.get("budgetMin") ? Number(formData.get("budgetMin")) : undefined,
          budgetMax: formData.get("budgetMax") ? Number(formData.get("budgetMax")) : undefined,
          preferredCity: String(formData.get("preferredCity") || ""),
          preferredRooms: formData.get("preferredRooms") ? Number(formData.get("preferredRooms")) : undefined,
          notes: String(formData.get("notes") || ""),
          assignedToId: String(formData.get("assignedToId") || ""),
        });
        router.push("/leads");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الحفظ");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات العميل المحتمل</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" name="name" required placeholder="مثال: خالد الحربي" />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" name="phone" required placeholder="05xxxxxxxx" />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" />
            </div>
            <div>
              <Label htmlFor="assignedToId">تعيين لمندوب</Label>
              <Select id="assignedToId" name="assignedToId" defaultValue="">
                <option value="">— بدون تعيين —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="source">مصدر العميل</Label>
              <Select id="source" name="source" defaultValue="WEBSITE">
                {Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="purpose">الغرض</Label>
              <Select id="purpose" name="purpose" defaultValue="RESIDENTIAL">
                {Object.entries(LEAD_PURPOSE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="budgetMin">الميزانية من (ريال)</Label>
              <Input id="budgetMin" name="budgetMin" type="number" className="figure" placeholder="500000" />
            </div>
            <div>
              <Label htmlFor="budgetMax">الميزانية إلى (ريال)</Label>
              <Input id="budgetMax" name="budgetMax" type="number" className="figure" placeholder="900000" />
            </div>
            <div>
              <Label htmlFor="preferredCity">المدينة المفضلة</Label>
              <Input id="preferredCity" name="preferredCity" placeholder="الرياض" />
            </div>
            <div>
              <Label htmlFor="preferredRooms">عدد الغرف المطلوب</Label>
              <Input id="preferredRooms" name="preferredRooms" type="number" className="figure" placeholder="3" />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea id="notes" name="notes" rows={3} placeholder="أي تفاصيل إضافية عن رغبات العميل..." />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-3 border-t border-navy-100 pt-4">
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "جارٍ الحفظ..." : "حفظ العميل"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/leads")}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
