"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addLeadNote } from "@/lib/actions/leads";

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      action={(formData) => {
        const content = String(formData.get("content") || "").trim();
        if (!content) return;
        startTransition(async () => {
          await addLeadNote(leadId, content);
          if (ref.current) ref.current.value = "";
          router.refresh();
        });
      }}
      className="flex items-start gap-2"
    >
      <Textarea ref={ref} name="content" rows={2} placeholder="أضف ملاحظة أو نتيجة مكالمة..." className="flex-1" />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "..." : "إضافة"}
      </Button>
    </form>
  );
}
