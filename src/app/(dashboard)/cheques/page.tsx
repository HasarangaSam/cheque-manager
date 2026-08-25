import Link from "next/link";
import { CreditCard, Plus, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  getChequeAttentionStatus,
  getDueUrgencyText,
  getChequeDaysDifference,
} from "@/lib/cheque-status";
import ChequesTable, { SerializedCheque } from "@/components/cheques/cheques-table";

export default async function ChequesPage() {
  const cheques = await prisma.cheque.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  const now = new Date();

  const serializedCheques: SerializedCheque[] = cheques.map((c) => {
    const attentionStatus = getChequeAttentionStatus(c.status, c.dueDate, now);
    const urgencyText = getDueUrgencyText(c.status, c.dueDate, now);
    const daysDifference = getChequeDaysDifference(c.dueDate, now);

    return {
      id: c.id,
      chequeNumber: c.chequeNumber,
      bank: c.bank,
      amount: Number(c.amount),
      chequeDate: c.chequeDate.toISOString(),
      dueDate: c.dueDate.toISOString(),
      status: c.status,
      notes: c.notes,
      attentionStatus,
      urgencyText,
      daysDifference,
      customer: {
        id: c.customer.id,
        name: c.customer.name,
        phone: c.customer.phone,
      },
    };
  });

  const overdueCount = serializedCheques.filter((c) => c.attentionStatus === "OVERDUE").length;
  const dueSoonCount = serializedCheques.filter((c) => c.attentionStatus === "DUE_SOON").length;
  const overdueTotal = serializedCheques
    .filter((c) => c.attentionStatus === "OVERDUE")
    .reduce((sum, c) => sum + c.amount, 0);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cheques Register</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track, realize, and update status of all incoming customer cheques
              </p>
            </div>
          </div>
          <Link
            href="/customers"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-indigo-500 shadow-sm shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Cheque</span>
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Urgent Attention Alert Banner if overdue exist */}
        {overdueCount > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-sm font-bold">
                  {overdueCount} {overdueCount === 1 ? "Cheque is" : "Cheques are"} Overdue ({fmt(overdueTotal)})
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  Please contact the respective customers or deposit immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Interactive Table */}
        <ChequesTable cheques={serializedCheques} showCustomerColumn={true} />
      </div>
    </div>
  );
}
