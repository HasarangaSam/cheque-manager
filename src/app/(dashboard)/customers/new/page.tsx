import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import CustomerForm from "@/components/customers/customer-form";

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
          <div
            className="mb-6 flex items-center gap-3 border-b pb-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              <UserPlus className="h-5 w-5" style={{ color: "#6366f1" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Customer Details
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Please provide accurate contact information
              </p>
            </div>
          </div>

          <CustomerForm mode="create" />
        </div>
      </div>
    </div>
  );
}
