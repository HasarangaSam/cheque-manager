import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createCheque } from "@/app/actions/cheque-actions";

type NewChequePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewChequePage({ params }: NewChequePageProps) {
  const { id } = await params;
  const customerId = Number(id);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    notFound();
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Top Header */}
      <div
        className="border-b px-8 py-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      >
        <div className="flex items-center gap-4">
          <Link
            href={`/customers/${customer.id}`}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--muted)", backgroundColor: "#f1f5f9" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Add Cheque
            </h1>
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
              Adding cheque for <span className="font-semibold text-indigo-600">{customer.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-8">
        <div
          className="rounded-2xl border p-8"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div className="mb-6 flex items-center gap-3 border-b pb-6" style={{ borderColor: "var(--border)" }}>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(14,165,233,0.1)" }}
            >
              <CreditCard className="h-5 w-5" style={{ color: "#0ea5e9" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Cheque Information
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Enter the cheque details accurately
              </p>
            </div>
          </div>

          <form action={createCheque} className="space-y-6">
            <input type="hidden" name="customerId" value={customer.id} />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="chequeNumber"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Cheque Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="chequeNumber"
                  name="chequeNumber"
                  placeholder="e.g. CHQ-100234"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="bank"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank"
                  name="bank"
                  placeholder="e.g. Commercial Bank, Sampath Bank"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
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
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Cheque Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="PENDING"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CLEARED">Cleared</option>
                  <option value="BOUNCED">Bounced</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="chequeDate"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Cheque Issued Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="chequeDate"
                  name="chequeDate"
                  type="date"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Due / Realization Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Notes & Details
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="e.g. Invoice #1024 payment, drawer details..."
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 border-t pt-6"
              style={{ borderColor: "var(--border)" }}
            >
              <Link
                href={`/customers/${customer.id}`}
                className="rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
              >
                Save Cheque
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
