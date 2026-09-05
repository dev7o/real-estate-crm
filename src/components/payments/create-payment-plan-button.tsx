"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { createPaymentPlan } from "@/lib/actions/payments";
import { Wallet, Plus, Trash2 } from "lucide-react";

interface ContractOption {
  id: string;
  contractNumber: string;
  totalValue: number;
  reservation: { deal: { lead: { name: string } } };
}

interface InstallmentRow {
  label: string;
  amount: string;
  dueDate: string;
}

export function CreatePaymentPlanButton({ contracts }: { contracts: ContractOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [contractId, setContractId] = useState("");
  const [rows, setRows] = useState<InstallmentRow[]>([{ label: "الدفعة الأولى", amount: "", dueDate: "" }]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addRow() {
    setRows((r) => [...r, { label: `القسط ${r.length}`, amount: "", dueDate: "" }]);
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: keyof InstallmentRow, value: string) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function handleSubmit() {
    setError(null);
    if (!contractId) {
      setError("اختر العقد أولًا");
      return;
    }
    startTransition(async () => {
      try {
        await createPaymentPlan({
          contractId,
          installments: rows.map((r) => ({ label: r.label, amount: Number(r.amount), dueDate: r.dueDate })),
        });
        setOpen(false);
        setRows([{ label: "الدفعة الأولى", amount: "", dueDate: "" }]);
        setContractId("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "تعذّر إنشاء خطة السداد");
      }
    });
  }

  return (
    <>
      <Button style={{ backgroundColor: "#8A6D1E" }} className="text-white hover:opacity-90" onClick={() => setOpen(true)}>
        <Wallet className="h-4 w-4" />
        خطة سداد جديدة
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء خطة سداد">
        <div className="space-y-4">
          <div>
            <Label htmlFor="contractId">العقد</Label>
            <Select id="contractId" value={contractId} onChange={(e) => setContractId(e.target.value)}>
              <option value="" disabled>
                اختر عقدًا
              </option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contractNumber} — {c.reservation.deal.lead.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>الدفعات والأقساط</Label>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-4"
                  placeholder="اسم الدفعة"
                  value={row.label}
                  onChange={(e) => updateRow(i, "label", e.target.value)}
                />
                <Input
                  className="figure col-span-3"
                  type="number"
                  placeholder="المبلغ"
                  value={row.amount}
                  onChange={(e) => updateRow(i, "amount", e.target.value)}
                />
                <Input
                  className="col-span-4"
                  type="date"
                  value={row.dueDate}
                  onChange={(e) => updateRow(i, "dueDate", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="col-span-1 flex items-center justify-center text-ink-faint hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-3.5 w-3.5" />
              إضافة دفعة
            </Button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "#8A6D1E" }} className="w-full text-white hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "جارٍ الحفظ..." : "حفظ خطة السداد"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
