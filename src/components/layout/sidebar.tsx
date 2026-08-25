"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/90 px-6 py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
              CM
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">
                ChequeManager
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Financial Ledger
              </p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-5 space-y-1.5">
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
                className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition-colors ${
                    active
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        {/* User Section & Logout */}
        <div className="border-t border-slate-800/80 px-4 py-3.5 bg-slate-950 space-y-3">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-2 ring-indigo-500/30",
                  userButtonPopoverCard:
                    "bg-slate-900 border border-slate-800 text-white shadow-2xl",
                  userPreviewMainIdentifier: "text-white font-semibold text-xs",
                  userPreviewSecondaryIdentifier: "text-slate-400 text-[11px]",
                  userButtonPopoverActionButton:
                    "hover:bg-slate-800 text-slate-200",
                  userButtonPopoverActionButtonIcon: "text-indigo-400",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Administrator
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400 inline" />
                Authorized
              </p>
            </div>
          </div>

          {/* Dedicated Logout Button */}
          <SignOutButton redirectUrl="/sign-in">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-800/50 px-3 py-2 text-xs font-semibold transition-all group cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/50 px-5 py-3 bg-slate-950/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>ChequeManager</span>
            <span className="inline-block rounded bg-emerald-950/70 border border-emerald-800/40 px-1.5 py-0.5 text-[10px] text-emerald-400 font-mono font-medium">
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs shadow-md shadow-indigo-600/30">
              CM
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              ChequeManager
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7 ring-2 ring-indigo-500/30",
              },
            }}
          />
        </div>
      </header>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-950 lg:flex flex-col">
        {navContent}
      </aside>
    </>
  );
}
