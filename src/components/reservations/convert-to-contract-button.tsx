"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { convertToContract } from "@/lib/actions/reservations";
import { FileCheck2 } from "lucide-react";

export function ConvertToContractButton({
  reservationId,
  suggestedValue,
}: {
  reservationId: string;
  suggestedValue: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await convertToContract({
          reservationId,
          contractNumber: String(formData.get("contractNumber") || ""),
          totalValue: Number(formData.get("totalValue") || 0),
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "تعذّر تحويل الحجز إلى عقد");
      }
    });
  }

  return (
    <>
      <Button size="sm" style={{ backgroundColor: "#7A3B69" }} className="text-white hover:opacity-90" onClick={() => setOpen(true)}>
        <FileCheck2 className="h-3.5 w-3.5" />
        تحويل لعقد
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="تحويل الحجز إلى عقد نهائي">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contractNumber">رقم العقد</Label>
            <Input id="contractNumber" name="contractNumber" required placeholder="CT-2026-001" />
          </div>
          <div>
            <Label htmlFor="totalValue">قيمة العقد الإجمالية (ريال)</Label>
            <Input
              id="totalValue"
              name="totalValue"
              type="number"
              required
              className="figure"
              defaultValue={suggestedValue || undefined}
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" style={{ backgroundColor: "#7A3B69" }} className="w-full text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "جارٍ التحويل..." : "تأكيد التعاقد"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
