import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(2, "عنوان الصفقة مطلوب"),
  leadId: z.string().min(1, "العميل مطلوب"),
  unitId: z.string().optional(),
  ownerId: z.string().optional(),
  value: z.coerce.number().nonnegative(),
  expectedCloseDate: z.string().optional(),
});

export const stageChangeSchema = z.object({
  dealId: z.string().min(1),
  stage: z.enum([
    "NEW_INQUIRY",
    "CONTACTED",
    "VISIT_SCHEDULED",
    "VISIT_COMPLETED",
    "NEGOTIATION",
    "RESERVED",
    "CONTRACTED",
    "CLOSED_LOST",
  ]),
  lossReason: z.enum(["PRICE", "LOCATION", "FINANCING", "CUSTOMER_WITHDREW", "OTHER"]).optional(),
});

export type DealInput = z.infer<typeof dealSchema>;
