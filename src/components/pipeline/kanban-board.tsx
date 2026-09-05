"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DealCard, type DealCardData } from "@/components/pipeline/deal-card";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { changeDealStage } from "@/lib/actions/deals";
import { DEAL_STAGES, LOSS_REASON_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { DealStage, LossReason } from "@prisma/client";

export function KanbanBoard({ deals }: { deals: DealCardData[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [lossModal, setLossModal] = useState<{ dealId: string; targetStage: DealStage } | null>(null);
  const [lossReason, setLossReason] = useState<LossReason>("PRICE");

  const columns = useMemo(() => {
    return DEAL_STAGES.map((stage) => ({
      ...stage,
      deals: deals.filter((d) => d.stage === stage.value),
    }));
  }, [deals]);

  function handleDrop(targetStage: DealStage) {
    if (!draggingId) return;
    if (targetStage === "CLOSED_LOST") {
      setLossModal({ dealId: draggingId, targetStage });
      setDraggingId(null);
      return;
    }
    startTransition(async () => {
      await changeDealStage(draggingId, targetStage);
      router.refresh();
    });
    setDraggingId(null);
  }

  function confirmLoss() {
    if (!lossModal) return;
    startTransition(async () => {
      await changeDealStage(lossModal.dealId, lossModal.targetStage, lossReason);
      router.refresh();
    });
    setLossModal(null);
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((col) => {
          const columnTotal = col.deals.reduce((s, d) => s + d.value, 0);
          return (
            <div
              key={col.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.value)}
              className="flex w-72 shrink-0 flex-col rounded-lg bg-navy-50/60"
            >
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-sm font-semibold text-ink">{col.label}</h3>
                  <span className="rounded-full bg-navy-100 px-1.5 py-0.5 text-[11px] text-ink-muted">
                    {col.deals.length}
                  </span>
                </div>
              </div>
              <div className="px-3 pb-1 text-xs text-ink-faint">
                {columnTotal > 0 ? formatCurrency(columnTotal) : "—"}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3 pt-1">
                {col.deals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    draggable
                    onDragStart={() => setDraggingId(deal.id)}
                  />
                ))}
                {col.deals.length === 0 && (
                  <div className="rounded-DEFAULT border border-dashed border-navy-100 py-6 text-center text-xs text-ink-faint">
                    اسحب صفقة هنا
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!lossModal} onClose={() => setLossModal(null)} title="سبب إغلاق الصفقة خاسرة">
        <div className="space-y-4">
          <div>
            <Label htmlFor="lossReason">اختر السبب</Label>
            <Select
              id="lossReason"
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value as LossReason)}
            >
              {Object.entries(LOSS_REASON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="danger" onClick={confirmLoss}>
              تأكيد الإغلاق
            </Button>
            <Button variant="ghost" onClick={() => setLossModal(null)}>
              تراجع
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
