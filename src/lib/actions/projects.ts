"use server";

import { db } from "@/lib/db";
import { projectSchema, unitSchema, type ProjectInput, type UnitInput } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.project.findMany({
    include: {
      units: true,
      _count: { select: { units: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProject(id: string) {
  return db.project.findUnique({
    where: { id },
    include: { units: { orderBy: { code: "asc" } } },
  });
}

/** إنشاء مشروع عقاري جديد — FR-2.1 */
export async function createProject(input: ProjectInput) {
  const data = projectSchema.parse(input);
  const project = await db.project.create({
    data: {
      name: data.name,
      developer: data.developer,
      city: data.city,
      district: data.district,
      description: data.description,
      status: data.status,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
    },
  });
  revalidatePath("/projects");
  return project;
}

/** إضافة وحدة عقارية ضمن مشروع — FR-2.2 */
export async function createUnit(input: UnitInput) {
  const data = unitSchema.parse(input);
  const unit = await db.unit.create({
    data: {
      code: data.code,
      projectId: data.projectId,
      type: data.type,
      floor: data.floor,
      areaSqm: data.areaSqm,
      bedrooms: data.bedrooms,
      price: data.price,
      notes: data.notes,
    },
  });
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.projectId}`);
  return unit;
}

/** كل الوحدات المتاحة — تُستخدم في نماذج الصفقات/المعاينات/الحجوزات */
export async function getAvailableUnits() {
  return db.unit.findMany({
    where: { status: "AVAILABLE" },
    include: { project: true },
    orderBy: [{ project: { name: "asc" } }, { code: "asc" }],
  });
}

export async function getAllUnits() {
  return db.unit.findMany({
    include: { project: true },
    orderBy: [{ project: { name: "asc" } }, { code: "asc" }],
  });
}
