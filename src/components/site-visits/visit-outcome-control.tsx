"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { recordVisitOutcome } from "@/lib/actions/site-visits";
import { VISIT_OUTCOME_LABELS } from "@/lib/constants";
import type { VisitOutcome } from "@prisma/client";

export function VisitOutcomeControl({ visitId, outcome }: { visitId: string; outcome: VisitOutcome }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={outcome}
      disabled={isPending}
      className="h-8 text-xs"
      onChange={(e) => {
        const value = e.target.value as VisitOutcome;
        startTransition(async () => {
          await recordVisitOutcome(visitId, value);
          router.refresh();
        });
      }}
    >
      {Object.entries(VISIT_OUTCOME_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
