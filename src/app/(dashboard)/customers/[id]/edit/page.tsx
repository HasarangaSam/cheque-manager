import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/app/actions/customer-actions";

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    notFound();
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
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
              Edit {customer.name}
            </h1>
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
              Update customer profile and contact information
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
              <UserCheck className="h-5 w-5" style={{ color: "#6366f1" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Update Customer Info
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Modify the customer profile below
              </p>
            </div>
          </div>

          <form action={updateCustomer} className="space-y-6">
            <input type="hidden" name="id" value={customer.id} />

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
                  required
                  defaultValue={customer.name}
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
                  required
                  defaultValue={customer.phone}
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
                  defaultValue={customer.email ?? ""}
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
                  defaultValue={customer.address ?? ""}
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
                  defaultValue={customer.notes ?? ""}
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
                href={`/customers/${customer.id}`}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
