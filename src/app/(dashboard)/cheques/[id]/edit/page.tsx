import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateCheque } from "@/app/actions/cheque-actions";

type EditChequePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditChequePage({ params }: EditChequePageProps) {
  const { id } = await params;
  const chequeId = Number(id);

  if (!Number.isInteger(chequeId) || chequeId <= 0) {
    notFound();
  }

  const cheque = await prisma.cheque.findUnique({
    where: {
      id: chequeId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!cheque) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center gap-4">
          <Link
            href={`/cheques/${cheque.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Edit Cheque {cheque.chequeNumber}
            </h1>
            <p className="text-xs text-slate-500">
              Customer: <span className="font-semibold text-slate-800">{cheque.customer.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <form action={updateCheque} className="space-y-6">
            <input type="hidden" name="id" value={cheque.id} />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="chequeNumber"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Cheque Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="chequeNumber"
                  name="chequeNumber"
                  required
                  defaultValue={cheque.chequeNumber}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="bank"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank"
                  name="bank"
                  required
                  defaultValue={cheque.bank}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Amount (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={cheque.amount.toString()}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={cheque.status}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CLEARED">CLEARED</option>
                  <option value="BOUNCED">BOUNCED</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="chequeDate"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Cheque Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="chequeDate"
                  name="chequeDate"
                  type="date"
                  required
                  defaultValue={formatDateForInput(cheque.chequeDate)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Due / Realization Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  required
                  defaultValue={formatDateForInput(cheque.dueDate)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Notes & Details
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  defaultValue={cheque.notes ?? ""}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
              <Link
                href={`/cheques/${cheque.id}`}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
