"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createUnit } from "@/lib/actions/projects";
import { UNIT_TYPE_LABELS } from "@/lib/constants";

export function UnitForm({ projectId, onDone }: { projectId: string; onDone?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createUnit({
          code: String(formData.get("code") || ""),
          projectId,
          type: formData.get("type") as any,
          floor: formData.get("floor") ? Number(formData.get("floor")) : undefined,
          areaSqm: Number(formData.get("areaSqm") || 0),
          bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : undefined,
          price: Number(formData.get("price") || 0),
          notes: String(formData.get("notes") || ""),
        });
        router.refresh();
        onDone?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الحفظ");
      }
    });
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-2 gap-3 rounded-DEFAULT border border-dashed border-module-projects/40 bg-module-projects-bg p-4 sm:grid-cols-3 lg:grid-cols-6">
      <div>
        <Label htmlFor="code">رقم الوحدة</Label>
        <Input id="code" name="code" required placeholder="A-101" />
      </div>
      <div>
        <Label htmlFor="type">النوع</Label>
        <Select id="type" name="type" defaultValue="APARTMENT">
          {Object.entries(UNIT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="floor">الدور</Label>
        <Input id="floor" name="floor" type="number" className="figure" placeholder="3" />
      </div>
      <div>
        <Label htmlFor="areaSqm">المساحة (م²)</Label>
        <Input id="areaSqm" name="areaSqm" type="number" required className="figure" placeholder="145" />
      </div>
      <div>
        <Label htmlFor="bedrooms">عدد الغرف</Label>
        <Input id="bedrooms" name="bedrooms" type="number" className="figure" placeholder="3" />
      </div>
      <div>
        <Label htmlFor="price">السعر (ريال)</Label>
        <Input id="price" name="price" type="number" required className="figure" placeholder="850000" />
      </div>
      <div className="col-span-2 sm:col-span-3 lg:col-span-6">
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        <Button type="submit" size="sm" style={{ backgroundColor: "#A85327" }} className="text-white hover:opacity-90" disabled={isPending}>
          {isPending ? "جارٍ الإضافة..." : "إضافة الوحدة"}
        </Button>
      </div>
    </form>
  );
}
