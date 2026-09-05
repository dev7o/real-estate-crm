import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { MapPin, Building } from "lucide-react";
import type { Project, Unit } from "@prisma/client";

export function ProjectCard({ project }: { project: Project & { units: Unit[] } }) {
  const total = project.units.length;
  const sold = project.units.filter((u) => u.status === "SOLD").length;
  const reserved = project.units.filter((u) => u.status === "RESERVED").length;
  const occupancy = total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block overflow-hidden rounded-lg border border-navy-100 bg-surface-raised shadow-card transition-shadow hover:shadow-raised"
    >
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-module-projects to-[#7A3A1A]">
        <Building className="h-10 w-10 text-white/40" strokeWidth={1} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink group-hover:text-module-projects">{project.name}</h3>
          <Badge color="#A85327">{PROJECT_STATUS_LABELS[project.status]}</Badge>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="h-3.5 w-3.5" />
          {project.city}
          {project.district ? ` — ${project.district}` : ""}
        </p>
        <p className="mt-0.5 text-xs text-ink-faint">تطوير: {project.developer}</p>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-ink-muted">نسبة الإشغال</span>
            <span className="figure font-medium text-ink">{occupancy}%</span>
          </div>
          <Progress value={occupancy} color="#A85327" />
          <p className="mt-2 text-xs text-ink-faint">
            {sold} مباعة · {reserved} محجوزة · {total - sold - reserved} متاحة من أصل {total} وحدة
          </p>
        </div>
      </div>
    </Link>
  );
}
