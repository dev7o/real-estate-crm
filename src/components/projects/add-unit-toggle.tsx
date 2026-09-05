"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnitForm } from "@/components/projects/unit-form";
import { Plus, X } from "lucide-react";

export function AddUnitToggle({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant={open ? "outline" : "gold"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? "إغلاق" : "إضافة وحدة"}
        </Button>
      </div>
      {open && <UnitForm projectId={projectId} onDone={() => setOpen(false)} />}
    </div>
  );
}
