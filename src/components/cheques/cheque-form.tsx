"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createCheque, updateCheque } from "@/app/actions/cheque-actions";
import type { ChequeStatus } from "@/lib/cheque-status";

type ChequeFormData = {
  id?: number;
  chequeNumber?: string;
  bank?: string;
  amount?: number | string;
  status?: ChequeStatus;
  chequeDate?: string | Date;
  dueDate?: string | Date;
  notes?: string | null;
};

type ChequeFormProps = {
  mode: "create" | "edit";
  customerId: number;
  customerName?: string;
  initialData?: ChequeFormData;
};

function formatDate(date?: string | Date) {
  if (!date) return "";
  if (typeof date === "string") {
    return date.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export default function ChequeForm({
  mode,
  customerId,
  initialData,
}: ChequeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      if (mode === "create") {
        const res = await createCheque(formData);
        if (res.success && res.data) {
          toast.success(res.message || "Cheque created successfully!");
          router.push(`/customers/${res.data.customerId}`);
        } else {
          toast.error(res.error || "Failed to create cheque");
        }
      } else {
        const res = await updateCheque(formData);
        if (res.success && res.data) {
          toast.success(res.message || "Cheque updated successfully!");
          router.push(`/cheques/${res.data.id}`);
        } else {
          toast.error(res.error || "Failed to update cheque");
        }
      }
    });
  }

  const cancelHref =
    mode === "edit" && initialData?.id
      ? `/cheques/${initialData.id}`
      : `/customers/${customerId}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "create" ? (
        <input type="hidden" name="customerId" value={customerId} />
      ) : (
        <input type="hidden" name="id" value={initialData?.id} />
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="chequeNumber"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Cheque Number <span className="text-red-500">*</span>
          </label>
          <input
            id="chequeNumber"
            name="chequeNumber"
            placeholder="e.g. CHQ-100234"
            required
            defaultValue={initialData?.chequeNumber || ""}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="bank"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            id="bank"
            name="bank"
            placeholder="e.g. Commercial Bank, Sampath Bank"
            required
            defaultValue={initialData?.bank || ""}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Amount (LKR) <span className="text-red-500">*</span>
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
            defaultValue={
              initialData?.amount !== undefined
                ? initialData.amount.toString()
                : ""
            }
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Cheque Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status || "PENDING"}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          >
            <option value="PENDING">Pending</option>
            <option value="CLEARED">Cleared</option>
            <option value="BOUNCED">Bounced</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="chequeDate"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Cheque Issued Date <span className="text-red-500">*</span>
          </label>
          <input
            id="chequeDate"
            name="chequeDate"
            type="date"
            required
            defaultValue={formatDate(initialData?.chequeDate)}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Due / Realization Date <span className="text-red-500">*</span>
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            defaultValue={formatDate(initialData?.dueDate)}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Notes & Details
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="e.g. Invoice #1024 payment, drawer details..."
            defaultValue={initialData?.notes || ""}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Link
          href={cancelHref}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending
            ? "Saving..."
            : mode === "create"
            ? "Save Cheque"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
