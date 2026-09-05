"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { createReservation } from "@/lib/actions/reservations";
import { FileSignature } from "lucide-react";
import type { Deal, Lead, Unit, Project, User } from "@prisma/client";

type DealOption = Deal & { lead: Lead; unit: (Unit & { project: Project }) | null };

export function NewReservationButton({
  deals,
  units,
  users,
}: {
  deals: DealOption[];
  units: (Unit & { project: Project })[];
  users: User[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function defaultExpiry() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createReservation({
          dealId: String(formData.get("dealId") || ""),
          unitId: String(formData.get("unitId") || ""),
          repId: String(formData.get("repId") || "") || undefined,
          downPayment: Number(formData.get("downPayment") || 0),
          expiresAt: String(formData.get("expiresAt") || ""),
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "تعذّر إنشاء الحجز — قد تكون الوحدة قد حُجزت للتو"
        );
      }
    });
  }

  return (
    <>
      <Button style={{ backgroundColor: "#7A3B69" }} className="text-white hover:opacity-90" onClick={() => setOpen(true)}>
        <FileSignature className="h-4 w-4" />
        حجز مبدئي جديد
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء حجز مبدئي">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dealId">الصفقة</Label>
            <Select id="dealId" name="dealId" required defaultValue="">
              <option value="" disabled>
                اختر صفقة
              </option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} — {d.lead.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="unitId">الوحدة</Label>
            <Select id="unitId" name="unitId" required defaultValue="">
              <option value="" disabled>
                اختر وحدة متاحة
              </option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.project.name} — {u.code}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="repId">المندوب</Label>
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
            <Label htmlFor="downPayment">مبلغ العربون (ريال)</Label>
            <Input id="downPayment" name="downPayment" type="number" required className="figure" placeholder="50000" />
          </div>
          <div>
            <Label htmlFor="expiresAt">تاريخ انتهاء صلاحية الحجز</Label>
            <Input id="expiresAt" name="expiresAt" type="date" required defaultValue={defaultExpiry()} />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" style={{ backgroundColor: "#7A3B69" }} className="w-full text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "جارٍ الحجز..." : "تأكيد الحجز"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
