import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createCustomer } from "@/app/actions/customer-actions";

export default function NewCustomerPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Top Header */}
      <div
        className="border-b px-8 py-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/customers"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--muted)", backgroundColor: "#f1f5f9" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Customers
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Add Customer
            </h1>
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
              Create a new customer profile to manage their cheque records
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
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              <UserPlus className="h-5 w-5" style={{ color: "#6366f1" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Customer Details
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Please provide accurate contact information
              </p>
            </div>
          </div>

          <form action={createCustomer} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="e.g. John Silva"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  placeholder="e.g. +94 77 123 4567"
                  required
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#f8fafc",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  placeholder="e.g. 123 Galle Road, Colombo"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
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
                  Notes & Remarks
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Add any additional notes about this customer..."
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
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
                href="/customers"
                className="rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
