"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { createDeal } from "@/lib/actions/deals";
import { Plus } from "lucide-react";
import type { Lead, Unit, Project, User } from "@prisma/client";

export function NewDealButton({
  leads,
  units,
  users,
}: {
  leads: Lead[];
  units: (Unit & { project: Project })[];
  users: User[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createDeal({
          title: String(formData.get("title") || ""),
          leadId: String(formData.get("leadId") || ""),
          unitId: String(formData.get("unitId") || "") || undefined,
          ownerId: String(formData.get("ownerId") || "") || undefined,
          value: Number(formData.get("value") || 0),
          expectedCloseDate: String(formData.get("expectedCloseDate") || "") || undefined,
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الحفظ");
      }
    });
  }

  return (
    <>
      <Button style={{ backgroundColor: "#2F7D6E" }} className="text-white hover:opacity-90" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        صفقة جديدة
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء صفقة جديدة">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان الصفقة</Label>
            <Input id="title" name="title" required placeholder="مثال: اهتمام بشقة 3 غرف بالملقا" />
          </div>
          <div>
            <Label htmlFor="leadId">العميل</Label>
            <Select id="leadId" name="leadId" required defaultValue="">
              <option value="" disabled>
                اختر عميلًا
              </option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="unitId">الوحدة (اختياري)</Label>
            <Select id="unitId" name="unitId" defaultValue="">
              <option value="">— بدون تحديد وحدة —</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.project.name} — {u.code}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="ownerId">المندوب المسؤول</Label>
            <Select id="ownerId" name="ownerId" defaultValue="">
              <option value="">— بدون تعيين —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="value">القيمة المتوقعة (ريال)</Label>
            <Input id="value" name="value" type="number" required className="figure" placeholder="850000" />
          </div>
          <div>
            <Label htmlFor="expectedCloseDate">تاريخ الإغلاق المتوقع</Label>
            <Input id="expectedCloseDate" name="expectedCloseDate" type="date" />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" style={{ backgroundColor: "#2F7D6E" }} className="w-full text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "جارٍ الإنشاء..." : "إنشاء الصفقة"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
