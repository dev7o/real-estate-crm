"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { updateLeadStatus } from "@/lib/actions/leads";
import { LEAD_STATUS_LABELS } from "@/lib/constants";
import type { LeadStatus } from "@prisma/client";

export function LeadStatusControl({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-48">
      <Select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) => {
          const value = e.target.value as LeadStatus;
          startTransition(async () => {
            await updateLeadStatus(leadId, value);
            router.refresh();
          });
        }}
      >
        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
