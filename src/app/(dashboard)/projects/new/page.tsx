import { Topbar } from "@/components/layout/topbar";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <>
      <Topbar title="إضافة مشروع عقاري" subtitle="سجّل بيانات المشروع قبل إضافة وحداته" />
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <ProjectForm />
      </div>
    </>
  );
}

