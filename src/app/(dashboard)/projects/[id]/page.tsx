import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UnitTable } from "@/components/projects/unit-table";
import { AddUnitToggle } from "@/components/projects/add-unit-toggle";
import { EmptyState } from "@/components/ui/empty-state";
import { getProject } from "@/lib/actions/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Calendar, Home } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const total = project.units.length;
  const sold = project.units.filter((u) => u.status === "SOLD").length;
  const reserved = project.units.filter((u) => u.status === "RESERVED").length;
  const available = total - sold - reserved;
  const occupancy = total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0;
  const totalValue = project.units.reduce((s, u) => s + u.price, 0);

  return (
    <>
      <Topbar title={project.name} subtitle={`تطوير ${project.developer}`} />

      <div className="space-y-6 p-8">
        <Card className="border-r-4" style={{ borderRightColor: "#A85327" }}>
          <CardContent className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-module-projects" />
              <div>
                <p className="text-xs text-ink-muted">الموقع</p>
                <p className="text-sm font-medium text-ink">
                  {project.city} {project.district ? `— ${project.district}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-module-projects" />
              <div>
                <p className="text-xs text-ink-muted">تاريخ التسليم</p>
                <p className="text-sm font-medium text-ink">
                  {project.deliveryDate ? formatDate(project.deliveryDate) : "غير محدد"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-module-projects" />
              <div>
                <p className="text-xs text-ink-muted">حالة المشروع</p>
                <Badge color="#A85327">{PROJECT_STATUS_LABELS[project.status]}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-muted">القيمة الإجمالية للمخزون</p>
              <p className="figure text-lg font-semibold text-ink">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نسبة الإشغال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-ink-muted">
                {sold} مباعة · {reserved} محجوزة · {available} متاحة
              </span>
              <span className="figure font-semibold text-ink">{occupancy}%</span>
            </div>
            <Progress value={occupancy} color="#A85327" />
          </CardContent>
        </Card>

        {project.description && (
          <Card>
            <CardContent className="p-5 text-sm text-ink-muted">{project.description}</CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">الوحدات العقارية ({total})</h2>
          </div>
          <AddUnitToggle projectId={project.id} />
          {total > 0 ? (
            <UnitTable units={project.units} />
          ) : (
            <EmptyState icon={Home} title="لا توجد وحدات مضافة بعد لهذا المشروع" />
          )}
        </div>
      </div>
    </>
  );
}
