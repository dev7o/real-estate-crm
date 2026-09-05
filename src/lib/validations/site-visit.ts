import { z } from "zod";

export const siteVisitSchema = z.object({
  leadId: z.string().min(1, "العميل مطلوب"),
  unitId: z.string().optional(),
  repId: z.string().optional(),
  scheduledAt: z.string().min(1, "موعد المعاينة مطلوب"),
  notes: z.string().optional(),
});

export const visitOutcomeSchema = z.object({
  visitId: z.string().min(1),
  outcome: z.enum(["PENDING", "INTERESTED", "NOT_INTERESTED", "NEEDS_DECISION", "REQUESTED_ANOTHER"]),
  notes: z.string().optional(),
});

export type SiteVisitInput = z.infer<typeof siteVisitSchema>;
