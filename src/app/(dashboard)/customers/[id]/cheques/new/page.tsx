import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ChequeForm from "@/components/cheques/cheque-form";

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
          <div
            className="mb-6 flex items-center gap-3 border-b pb-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(14,165,233,0.1)" }}
            >
              <CreditCard className="h-5 w-5" style={{ color: "#0ea5e9" }} />
            </div>
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Cheque Information
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Enter the cheque details accurately
              </p>
            </div>
          </div>

          <ChequeForm
            mode="create"
            customerId={customer.id}
            customerName={customer.name}
          />
        </div>
      </div>
    </div>
  );
}
