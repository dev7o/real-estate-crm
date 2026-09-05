import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadTable } from "@/components/leads/lead-table";
import { getLeads } from "@/lib/actions/leads";
import { Plus, Users } from "lucide-react";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <>
      <Topbar title="العملاء المحتملون" subtitle={`إجمالي ${leads.length} عميل مسجّل`} />

      <div className="space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-end">
          <Link href="/leads/new">
            <Button variant="gold">
              <Plus className="h-4 w-4" />
              إضافة عميل جديد
            </Button>
          </Link>
        </div>

        {leads.length > 0 ? (
          <LeadTable leads={leads} />
        ) : (
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء محتملون بعد"
            description="ابدأ بإضافة أول عميل محتمل لمتابعته عبر خط أنابيب المبيعات"
            action={
              <Link href="/leads/new">
                <Button variant="gold" size="sm">
                  <Plus className="h-4 w-4" />
                  إضافة عميل
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}

