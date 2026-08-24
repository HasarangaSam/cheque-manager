"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Cheques",
    href: "/cheques",
    icon: CreditCard,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-950 lg:flex flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
          CM
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">ChequeManager</p>
          <p className="text-[11px] text-slate-400">Financial Ledger System</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main Navigation
        </p>
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-4 w-4 flex-shrink-0 transition-colors ${
                  active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              <span className="flex-1">{item.name}</span>
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800/80 px-5 py-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Version 1.2</span>
          <span className="inline-block rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            Active
          </span>
        </div>
      </div>
    </aside>
  );
}
