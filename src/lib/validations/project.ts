import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "اسم المشروع مطلوب"),
  developer: z.string().min(2, "اسم المطور مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  district: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PLANNING", "UNDER_CONSTRUCTION", "READY", "DELIVERED"]),
  deliveryDate: z.string().optional(),
});

export const unitSchema = z.object({
  code: z.string().min(1, "رقم الوحدة مطلوب"),
  projectId: z.string().min(1, "المشروع مطلوب"),
  type: z.enum(["APARTMENT", "VILLA", "TOWNHOUSE", "LAND", "OFFICE", "SHOP"]),
  floor: z.coerce.number().int().optional(),
  areaSqm: z.coerce.number().positive("المساحة يجب أن تكون رقمًا موجبًا"),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  price: z.coerce.number().positive("السعر يجب أن يكون رقمًا موجبًا"),
  notes: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type UnitInput = z.infer<typeof unitSchema>;
