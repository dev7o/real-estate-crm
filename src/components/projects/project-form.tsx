"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/actions/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";

export function ProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const project = await createProject({
          name: String(formData.get("name") || ""),
          developer: String(formData.get("developer") || ""),
          city: String(formData.get("city") || ""),
          district: String(formData.get("district") || ""),
          description: String(formData.get("description") || ""),
          status: formData.get("status") as any,
          deliveryDate: String(formData.get("deliveryDate") || ""),
        });
        router.push(`/projects/${project.id}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الحفظ");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات المشروع العقاري</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">اسم المشروع</Label>
              <Input id="name" name="name" required placeholder="مثال: أبراج الواحة" />
            </div>
            <div>
              <Label htmlFor="developer">المطور العقاري</Label>
              <Input id="developer" name="developer" required placeholder="مثال: شركة الإعمار" />
            </div>
            <div>
              <Label htmlFor="city">المدينة</Label>
              <Input id="city" name="city" required placeholder="الرياض" />
            </div>
            <div>
              <Label htmlFor="district">الحي</Label>
              <Input id="district" name="district" placeholder="حي الملقا" />
            </div>
            <div>
              <Label htmlFor="status">حالة المشروع</Label>
              <Select id="status" name="status" defaultValue="UNDER_CONSTRUCTION">
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="deliveryDate">تاريخ التسليم المتوقع</Label>
              <Input id="deliveryDate" name="deliveryDate" type="date" />
            </div>
          </div>
          <div>
            <Label htmlFor="description">وصف المشروع</Label>
            <Textarea id="description" name="description" rows={3} placeholder="نبذة عن المشروع ومميزاته..." />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-3 border-t border-navy-100 pt-4">
            <Button type="submit" variant="gold" disabled={isPending}>
              {isPending ? "جارٍ الحفظ..." : "حفظ المشروع"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/projects")}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
