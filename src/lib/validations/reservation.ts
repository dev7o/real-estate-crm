import { z } from "zod";

export const reservationSchema = z.object({
  dealId: z.string().min(1, "الصفقة مطلوبة"),
  unitId: z.string().min(1, "الوحدة مطلوبة"),
  repId: z.string().optional(),
  downPayment: z.coerce.number().positive("مبلغ العربون مطلوب"),
  expiresAt: z.string().min(1, "تاريخ انتهاء الحجز مطلوب"),
});

export const contractSchema = z.object({
  reservationId: z.string().min(1),
  contractNumber: z.string().min(1, "رقم العقد مطلوب"),
  totalValue: z.coerce.number().positive("قيمة العقد مطلوبة"),
});

export const installmentInputSchema = z.object({
  label: z.string().min(1),
  amount: z.coerce.number().positive(),
  dueDate: z.string().min(1),
});

export const paymentPlanSchema = z.object({
  contractId: z.string().min(1),
  installments: z.array(installmentInputSchema).min(1, "أضف قسطًا واحدًا على الأقل"),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type PaymentPlanInput = z.infer<typeof paymentPlanSchema>;
