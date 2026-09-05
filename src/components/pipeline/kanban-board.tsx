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
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const columnAnim = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
};

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
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin px-1 pt-1"
      >
        {columns.map((col) => {
          const columnTotal = col.deals.reduce((s, d) => s + d.value, 0);
          return (
            <motion.div
              variants={columnAnim}
              key={col.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.value)}
              className="flex w-72 shrink-0 flex-col rounded-2xl glass border border-white/30 dark:border-navy-700/50 bg-white/40 dark:bg-navy-900/40 shadow-sm transition-colors hover:bg-white/60 dark:hover:bg-navy-900/60"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-navy-100/50 dark:border-navy-700/50">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: col.color }} />
                  <h3 className="text-sm font-bold text-ink dark:text-navy-50">{col.label}</h3>
                  <span className="rounded-full bg-navy-100 dark:bg-navy-800 px-2 py-0.5 text-xs font-semibold text-ink-muted dark:text-navy-300">
                    {col.deals.length}
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 text-xs font-semibold text-ink-faint dark:text-navy-400 bg-navy-50/30 dark:bg-navy-900/30">
                {columnTotal > 0 ? formatCurrency(columnTotal) : "—"}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                {col.deals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    draggable
                    onDragStart={() => setDraggingId(deal.id)}
                  />
                ))}
                {col.deals.length === 0 && (
                  <div className="rounded-xl border border-dashed border-navy-200 dark:border-navy-700 py-8 text-center text-xs font-medium text-ink-faint dark:text-navy-500 bg-white/20 dark:bg-navy-900/20">
                    اسحب صفقة هنا
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

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
