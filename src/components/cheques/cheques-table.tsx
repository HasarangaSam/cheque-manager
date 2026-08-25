"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/ui/status-badge";
import QuickStatusSelector from "@/components/cheques/quick-status-selector";
import { deleteCheque } from "@/app/actions/cheque-actions";
import type { ChequeStatus, ChequeAttentionStatus } from "@/lib/cheque-status";

export type SerializedCheque = {
  id: number;
  chequeNumber: string;
  bank: string;
  amount: number;
  chequeDate: string; // ISO string
  dueDate: string; // ISO string
  status: ChequeStatus;
  notes: string | null;
  attentionStatus: ChequeAttentionStatus;
  urgencyText: string;
  daysDifference: number;
  customer: {
    id: number;
    name: string;
    phone?: string;
  };
};

type ChequesTableProps = {
  cheques: SerializedCheque[];
  showCustomerColumn?: boolean;
};

export default function ChequesTable({
  cheques,
  showCustomerColumn = true,
}: ChequesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const counts = useMemo(() => {
    return {
      ALL: cheques.length,
      OVERDUE: cheques.filter((c) => c.attentionStatus === "OVERDUE").length,
      DUE_SOON: cheques.filter((c) => c.attentionStatus === "DUE_SOON").length,
      UPCOMING: cheques.filter((c) => c.attentionStatus === "UPCOMING").length,
      CLEARED: cheques.filter((c) => c.status === "CLEARED").length,
      BOUNCED: cheques.filter((c) => c.status === "BOUNCED").length,
    };
  }, [cheques]);

  const filteredCheques = useMemo(() => {
    return cheques.filter((cheque) => {
      // Status filter
      if (statusFilter === "OVERDUE" && cheque.attentionStatus !== "OVERDUE") return false;
      if (statusFilter === "DUE_SOON" && cheque.attentionStatus !== "DUE_SOON") return false;
      if (statusFilter === "UPCOMING" && cheque.attentionStatus !== "UPCOMING") return false;
      if (statusFilter === "CLEARED" && cheque.status !== "CLEARED") return false;
      if (statusFilter === "BOUNCED" && cheque.status !== "BOUNCED") return false;
      if (statusFilter === "PENDING" && cheque.status !== "PENDING") return false;

      // Search term filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        cheque.chequeNumber.toLowerCase().includes(term) ||
        cheque.bank.toLowerCase().includes(term) ||
        cheque.customer.name.toLowerCase().includes(term) ||
        (cheque.notes && cheque.notes.toLowerCase().includes(term))
      );
    });
  }, [cheques, statusFilter, searchTerm]);

  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleDelete(id: number, chequeNumber: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete Cheque "${chequeNumber}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteCheque(id);
      if (res.success) {
        toast.success(res.message || `Cheque "${chequeNumber}" deleted`);
      } else {
        toast.error(res.error || "Failed to delete cheque");
      }
      setDeletingId(null);
    });
  }

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Status Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cheque #, customer, bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {[
            { id: "ALL", label: "All", count: counts.ALL, alert: false },
            { id: "OVERDUE", label: "Overdue", count: counts.OVERDUE, alert: counts.OVERDUE > 0, badgeBg: "bg-red-600 text-white" },
            { id: "DUE_SOON", label: "Due Soon", count: counts.DUE_SOON, alert: counts.DUE_SOON > 0, badgeBg: "bg-amber-600 text-white" },
            { id: "UPCOMING", label: "Upcoming", count: counts.UPCOMING, alert: false },
            { id: "CLEARED", label: "Cleared", count: counts.CLEARED, alert: false },
            { id: "BOUNCED", label: "Bounced", count: counts.BOUNCED, alert: false },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    tab.alert
                      ? tab.badgeBg
                      : isActive
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cheques Data Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {filteredCheques.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Filter className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">No cheques found</p>
            <p className="mt-1 text-xs text-slate-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No cheques matching the selected filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Cheque #
                  </th>
                  {showCustomerColumn && (
                    <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Customer
                    </th>
                  )}
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Due Date & Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Quick Update
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCheques.map((cheque) => {
                  const isOverdue = cheque.attentionStatus === "OVERDUE";
                  const isDueSoon = cheque.attentionStatus === "DUE_SOON";

                  return (
                    <tr
                      key={cheque.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOverdue
                          ? "bg-red-50/30"
                          : isDueSoon
                          ? "bg-amber-50/20"
                          : ""
                      }`}
                    >
                      {/* Cheque # */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/cheques/${cheque.id}`}
                          className="font-mono text-xs font-bold text-slate-900 hover:text-indigo-600 hover:underline"
                        >
                          {cheque.chequeNumber}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          Issued: {new Date(cheque.chequeDate).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Customer */}
                      {showCustomerColumn && (
                        <td className="px-4 py-3">
                          <Link
                            href={`/customers/${cheque.customer.id}`}
                            className="font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                          >
                            {cheque.customer.name}
                          </Link>
                          {cheque.customer.phone && (
                            <p className="text-[11px] text-slate-500">
                              {cheque.customer.phone}
                            </p>
                          )}
                        </td>
                      )}

                      {/* Bank */}
                      <td className="px-4 py-3 text-slate-700 font-medium text-xs">
                        {cheque.bank}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                        {fmt(cheque.amount)}
                      </td>

                      {/* Due Date & Urgency Status */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-900">
                            {new Date(cheque.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <StatusBadge
                            status={cheque.attentionStatus}
                            urgencyText={cheque.urgencyText}
                          />
                        </div>
                      </td>

                      {/* Quick Status Updater */}
                      <td className="px-4 py-3">
                        <QuickStatusSelector
                          chequeId={cheque.id}
                          currentStatus={cheque.status}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <Link
                            href={`/cheques/${cheque.id}`}
                            title="View Cheque Details"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/cheques/${cheque.id}/edit`}
                            title="Edit Cheque"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={deletingId === cheque.id}
                            onClick={() => handleDelete(cheque.id, cheque.chequeNumber)}
                            title="Delete Cheque"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                          >
                            {deletingId === cheque.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
