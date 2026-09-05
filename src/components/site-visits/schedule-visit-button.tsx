"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { scheduleSiteVisit } from "@/lib/actions/site-visits";
import { CalendarPlus } from "lucide-react";
import type { Lead, Unit, Project, User } from "@prisma/client";

export function ScheduleVisitButton({
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
        await scheduleSiteVisit({
          leadId: String(formData.get("leadId") || ""),
          unitId: String(formData.get("unitId") || "") || undefined,
          repId: String(formData.get("repId") || "") || undefined,
          scheduledAt: String(formData.get("scheduledAt") || ""),
          notes: String(formData.get("notes") || ""),
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الجدولة");
      }
    });
  }

  return (
    <>
      <Button style={{ backgroundColor: "#6552A6" }} className="text-white hover:opacity-90" onClick={() => setOpen(true)}>
        <CalendarPlus className="h-4 w-4" />
        جدولة معاينة
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="جدولة معاينة ميدانية">
        <form action={handleSubmit} className="space-y-4">
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
            <Label htmlFor="repId">المندوب المرافق</Label>
            <Select id="repId" name="repId" defaultValue="">
              <option value="">— بدون تعيين —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledAt">موعد المعاينة</Label>
            <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
          </div>
          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea id="notes" name="notes" rows={2} />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" style={{ backgroundColor: "#6552A6" }} className="w-full text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "جارٍ الجدولة..." : "تأكيد الجدولة"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
