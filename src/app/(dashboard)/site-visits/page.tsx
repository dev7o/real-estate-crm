import { Topbar } from "@/components/layout/topbar";
import { ScheduleVisitButton } from "@/components/site-visits/schedule-visit-button";
import { VisitList } from "@/components/site-visits/visit-list";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteVisits } from "@/lib/actions/site-visits";
import { getLeads, getUsers } from "@/lib/actions/leads";
import { getAvailableUnits } from "@/lib/actions/projects";
import { CalendarCheck } from "lucide-react";

export default async function SiteVisitsPage() {
  const [visits, leads, units, users] = await Promise.all([
    getSiteVisits(),
    getLeads(),
    getAvailableUnits(),
    getUsers(),
  ]);

  return (
    <>
      <Topbar title="المعاينات الميدانية" subtitle={`${visits.length} معاينة مجدولة`} />

      <div className="space-y-4 p-8">
        <div className="flex items-center justify-end">
          <ScheduleVisitButton leads={leads} units={units} users={users} />
        </div>

        {visits.length > 0 ? (
          <VisitList visits={visits} />
        ) : (
          <EmptyState icon={CalendarCheck} title="لا توجد معاينات مجدولة بعد" />
        )}
      </div>
    </>
  );
}
