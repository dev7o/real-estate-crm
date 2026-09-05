import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/actions/projects";
import { Plus, Building2 } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Topbar title="المشاريع والوحدات العقارية" subtitle={`${projects.length} مشروع مسجّل في المخزون`} />

      <div className="space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-end">
          <Link href="/projects/new">
            <Button style={{ backgroundColor: "#A85327" }} className="text-white hover:opacity-90">
              <Plus className="h-4 w-4" />
              إضافة مشروع جديد
            </Button>
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="لا توجد مشاريع مضافة بعد"
            description="أضف أول مشروع عقاري لبدء إدارة وحداته ومتابعة مبيعاته"
            action={
              <Link href="/projects/new">
                <Button size="sm" style={{ backgroundColor: "#A85327" }} className="text-white hover:opacity-90">
                  <Plus className="h-4 w-4" />
                  إضافة مشروع
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}

