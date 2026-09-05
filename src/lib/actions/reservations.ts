"use server";

import { db } from "@/lib/db";
import {
  reservationSchema,
  contractSchema,
  type ReservationInput,
  type ContractInput,
} from "@/lib/validations/reservation";
import { revalidatePath } from "next/cache";

class UnitUnavailableError extends Error {
  constructor() {
    super("هذه الوحدة لم تعد متاحة — ربما تم حجزها للتو من مندوب آخر");
    this.name = "UnitUnavailableError";
  }
}

export async function getReservations() {
  return db.reservation.findMany({
    include: {
      unit: { include: { project: true } },
      deal: { include: { lead: true } },
      rep: true,
      contract: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * إنشاء حجز مبدئي — FR-5.1
 *
 * هذه العملية هي الحماية الأساسية ضد ازدواج الحجز (المخاطرة الأولى في PRD القسم 13):
 * نستخدم معاملة قاعدة بيانات (transaction) تتحقق من أن الوحدة ما زالت "متاحة"
 * وتغيّر حالتها إلى "محجوزة" بشكل ذرّي واحد — فلا يمكن لمندوبَين حجز نفس
 * الوحدة في نفس اللحظة حتى مع الاستخدام المتزامن.
 */
export async function createReservation(input: ReservationInput) {
  const data = reservationSchema.parse(input);

  const reservation = await db.$transaction(async (tx) => {
    const unit = await tx.unit.findUnique({ where: { id: data.unitId } });
    if (!unit || unit.status !== "AVAILABLE") {
      throw new UnitUnavailableError();
    }

    await tx.unit.update({ where: { id: data.unitId }, data: { status: "RESERVED" } });

    const created = await tx.reservation.create({
      data: {
        dealId: data.dealId,
        unitId: data.unitId,
        repId: data.repId || null,
        downPayment: data.downPayment,
        expiresAt: new Date(data.expiresAt),
      },
    });

    await tx.deal.update({ where: { id: data.dealId }, data: { stage: "RESERVED" } });

    return created;
  });

  revalidatePath("/reservations");
  revalidatePath("/projects");
  revalidatePath("/pipeline");
  return reservation;
}

/**
 * تحويل الحجز المبدئي إلى عقد نهائي — FR-5.2
 * تُحدَّث حالة الوحدة إلى "مباعة" ضمن نفس المعاملة.
 */
export async function convertToContract(input: ContractInput) {
  const data = contractSchema.parse(input);

  const contract = await db.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({ where: { id: data.reservationId } });
    if (!reservation || reservation.status !== "ACTIVE") {
      throw new Error("الحجز غير ساري ولا يمكن تحويله لعقد");
    }

    const created = await tx.contract.create({
      data: {
        reservationId: data.reservationId,
        contractNumber: data.contractNumber,
        totalValue: data.totalValue,
      },
    });

    await tx.reservation.update({ where: { id: data.reservationId }, data: { status: "CONVERTED" } });
    await tx.unit.update({ where: { id: reservation.unitId }, data: { status: "SOLD" } });
    await tx.deal.update({ where: { id: reservation.dealId }, data: { stage: "CONTRACTED" } });

    return created;
  });

  revalidatePath("/reservations");
  revalidatePath("/contracts");
  revalidatePath("/projects");
  revalidatePath("/pipeline");
  return contract;
}

/**
 * إعادة الوحدة إلى "متاحة" تلقائيًا عند انتهاء صلاحية الحجز دون تعاقد — FR-5.4
 * تُستدعى دوريًا (Cron) أو عند تحميل صفحة الحجوزات.
 */
export async function releaseExpiredReservations() {
  const expired = await db.reservation.findMany({
    where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
  });

  for (const r of expired) {
    await db.$transaction([
      db.reservation.update({ where: { id: r.id }, data: { status: "EXPIRED" } }),
      db.unit.update({ where: { id: r.unitId }, data: { status: "AVAILABLE" } }),
    ]);
  }

  if (expired.length > 0) {
    revalidatePath("/reservations");
    revalidatePath("/projects");
  }
  return expired.length;
}
