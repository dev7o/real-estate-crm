import { Topbar } from "@/components/layout/topbar";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { NewDealButton } from "@/components/pipeline/new-deal-button";
import { getDeals } from "@/lib/actions/deals";
import { getLeads } from "@/lib/actions/leads";
import { getAvailableUnits } from "@/lib/actions/projects";
import { getUsers } from "@/lib/actions/leads";

export default async function PipelinePage() {
  const [deals, leads, units, users] = await Promise.all([
    getDeals(),
    getLeads(),
    getAvailableUnits(),
    getUsers(),
  ]);

  return (
    <>
      <Topbar title="متابعة المبيعات" subtitle="اسحب الصفقة بين المراحل لتحديث حالتها فورًا" />

      <div className="space-y-4 p-8">
        <div className="flex items-center justify-end">
          <NewDealButton leads={leads} units={units} users={users} />
        </div>
        <KanbanBoard deals={deals} />
      </div>
    </>
  );
}
