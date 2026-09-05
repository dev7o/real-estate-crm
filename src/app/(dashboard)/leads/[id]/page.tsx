import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusControl } from "@/components/leads/lead-status-control";
import { LeadNoteForm } from "@/components/leads/lead-note-form";
import { getLead } from "@/lib/actions/leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_PURPOSE_LABELS,
  dealStageLabel,
  dealStageColor,
  VISIT_OUTCOME_LABELS,
  VISIT_OUTCOME_COLORS,
} from "@/lib/constants";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { Phone, Mail, Wallet, MapPin, Home } from "lucide-react";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <>
      <Topbar title={lead.name} subtitle={`عميل محتمل منذ ${formatDate(lead.createdAt)}`} />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>بيانات التواصل</CardTitle>
              <LeadStatusControl leadId={lead.id} status={lead.status} />
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-ink-muted">
                <Phone className="h-4 w-4 text-module-leads" />
                <span className="figure">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <Mail className="h-4 w-4 text-module-leads" />
                  <span>{lead.email}</span>
                </div>
              )}
              {(lead.budgetMin || lead.budgetMax) && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <Wallet className="h-4 w-4 text-module-leads" />
                  <span className="figure">
                    {lead.budgetMin ? formatCurrency(lead.budgetMin) : "—"} إلى{" "}
                    {lead.budgetMax ? formatCurrency(lead.budgetMax) : "—"}
                  </span>
                </div>
              )}
              {lead.preferredCity && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <MapPin className="h-4 w-4 text-module-leads" />
                  <span>{lead.preferredCity}</span>
                </div>
              )}
              {lead.preferredRooms && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <Home className="h-4 w-4 text-module-leads" />
                  <span>{lead.preferredRooms} غرف</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t border-navy-100 pt-3">
                <Badge color="#2E6F9E">{LEAD_SOURCE_LABELS[lead.source]}</Badge>
                <Badge color="#B8934A">{LEAD_PURPOSE_LABELS[lead.purpose]}</Badge>
                {lead.assignedTo && <Badge color="#2F7D6E">{lead.assignedTo.name}</Badge>}
              </div>

              {lead.notes && (
                <p className="border-t border-navy-100 pt-3 text-ink-muted">{lead.notes}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المعاينات الميدانية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.siteVisits.length > 0 ? (
                lead.siteVisits.map((v) => (
                  <div key={v.id} className="rounded-DEFAULT border border-navy-100 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">
                        {v.unit ? `${v.unit.project ? v.unit.project.name + " — " : ""}وحدة ${v.unit.code}` : "معاينة عامة"}
                      </span>
                      <Badge color={VISIT_OUTCOME_COLORS[v.outcome]}>{VISIT_OUTCOME_LABELS[v.outcome]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">{formatDateTime(v.scheduledAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">لا توجد معاينات مجدولة</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>الصفقات المرتبطة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.deals.length > 0 ? (
                lead.deals.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-DEFAULT border border-navy-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{d.title}</p>
                      {d.unit && (
                        <p className="text-xs text-ink-faint">
                          {d.unit.project.name} — وحدة {d.unit.code}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="figure text-sm text-ink-muted">{formatCurrency(d.value)}</span>
                      <Badge color={dealStageColor(d.stage)}>{dealStageLabel(d.stage)}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">لا توجد صفقات بعد لهذا العميل</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجل النشاطات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LeadNoteForm leadId={lead.id} />
              <div className="space-y-3 border-t border-navy-100 pt-4">
                {lead.activities.map((a) => (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-module-leads" />
                    <div>
                      <p className="text-ink">{a.content}</p>
                      <p className="text-xs text-ink-faint">
                        {formatDateTime(a.createdAt)} {a.user ? `— ${a.user.name}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
