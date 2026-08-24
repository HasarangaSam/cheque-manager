import Link from "next/link";
import { Users, Plus, Phone, Mail, CreditCard, ChevronRight, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { cheques: true } },
      cheques: {
        select: {
          status: true,
          amount: true,
        },
      },
    },
  });

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Customer Directory</h1>
              <p className="text-xs text-slate-500">
                {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Link
            href="/customers/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Link>
        </div>
      </div>

      <div className="px-8 py-6">
        {customers.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-8 py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-3 text-base font-bold text-slate-800">No customers registered</h2>
            <p className="mt-1 text-xs text-slate-500">Add your first customer to start logging cheques.</p>
            <Link
              href="/customers/new"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Phone & Email
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Cheques Count
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Pending Value
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-right text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => {
                  const pendingTotal = customer.cheques
                    .filter((c) => c.status === "PENDING")
                    .reduce((sum, c) => sum + Number(c.amount), 0);

                  const pendingCount = customer.cheques.filter((c) => c.status === "PENDING").length;

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 hover:underline"
                        >
                          {customer.name}
                        </Link>
                        {customer.address && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                            {customer.address}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-800">{customer.phone}</p>
                        <p className="text-xs text-slate-500">{customer.email ?? "—"}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          <CreditCard className="h-3 w-3" />
                          {customer._count.cheques} Cheques
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {pendingCount > 0 ? (
                          <div>
                            <p className="text-xs font-bold text-amber-700">{fmt(pendingTotal)}</p>
                            <p className="text-[11px] text-slate-500">{pendingCount} pending</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No pending</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/customers/${customer.id}/cheques/new`}
                            className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            + Cheque
                          </Link>
                          <Link
                            href={`/customers/${customer.id}`}
                            className="inline-flex items-center gap-1 rounded bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            View
                            <ChevronRight className="h-3 w-3" />
                          </Link>
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
