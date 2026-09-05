import { Topbar } from "@/components/layout/topbar";
import { LeadForm } from "@/components/leads/lead-form";
import { getUsers } from "@/lib/actions/leads";

export default async function NewLeadPage() {
  const users = await getUsers();

  return (
    <>
      <Topbar title="إضافة عميل محتمل" subtitle="سجّل بيانات العميل وتفضيلاته العقارية" />
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <LeadForm users={users} />
      </div>
    </>
  );
}

