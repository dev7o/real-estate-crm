import { Topbar } from "@/components/layout/topbar";
import { NewReservationButton } from "@/components/reservations/new-reservation-button";
import { ReservationList } from "@/components/reservations/reservation-list";
import { EmptyState } from "@/components/ui/empty-state";
import { getReservations, releaseExpiredReservations } from "@/lib/actions/reservations";
import { getDealsEligibleForReservation } from "@/lib/actions/deals";
import { getAvailableUnits } from "@/lib/actions/projects";
import { getUsers } from "@/lib/actions/leads";
import { FileSignature } from "lucide-react";

export default async function ReservationsPage() {
  // إعادة الوحدات المتاحة تلقائيًا عند انتهاء صلاحية الحجز دون تعاقد — FR-5.4
  await releaseExpiredReservations();

  const [reservations, deals, units, users] = await Promise.all([
    getReservations(),
    getDealsEligibleForReservation(),
    getAvailableUnits(),
    getUsers(),
  ]);

  return (
    <>
      <Topbar title="الحجوزات والعقود" subtitle={`${reservations.length} حجز مسجّل`} />

      <div className="space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-end">
          <NewReservationButton deals={deals} units={units} users={users} />
        </div>

        {reservations.length > 0 ? (
          <ReservationList reservations={reservations} />
        ) : (
          <EmptyState icon={FileSignature} title="لا توجد حجوزات مسجّلة بعد" />
        )}
      </div>
    </>
  );
}

