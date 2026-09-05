import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفان على الأقل)"),
  phone: z.string().min(9, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  source: z.enum(["ADVERTISEMENT", "REFERRAL", "EXHIBITION", "WEBSITE", "INBOUND_CALL", "OTHER"]),
  purpose: z.enum(["RESIDENTIAL", "INVESTMENT"]),
  budgetMin: z.coerce.number().nonnegative().optional(),
  budgetMax: z.coerce.number().nonnegative().optional(),
  preferredCity: z.string().optional(),
  preferredRooms: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
