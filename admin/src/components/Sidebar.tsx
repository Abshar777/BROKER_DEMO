"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  LayoutGrid, Users, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, List, type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden>
      <path d="M4 15c3 0 3.6-8 8-8s5 8 8 8" stroke="#9FE870" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const nav: { href: string; label: string; icon: LucideIcon; badge?: "kyc" | "dep" | "wd" }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/kyc", label: "KYC review", icon: ShieldCheck, badge: "kyc" },
  { href: "/deposits", label: "Deposits", icon: ArrowDownToLine, badge: "dep" },
  { href: "/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine, badge: "wd" },
  { href: "/transactions", label: "Transactions", icon: List },
];

export function Sidebar() {
  const path = usePathname();
  const reduce = useReducedMotion();
  const db = useStore((s) => s.db);
  const on = (h: string) => path === h || path.startsWith(h + "/");

  const counts = {
    kyc: db?.kyc.filter((k) => k.status === "pending").length ?? 0,
    dep: db?.deposits.filter((r) => r.status === "pending").length ?? 0,
    wd: db?.withdrawals.filter((r) => r.status === "pending").length ?? 0,
  };

  const Pill = () => (
    <motion.span
      layoutId="admin-sidebar-active"
      className="absolute inset-0 rounded-[14px] bg-green-faint"
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
    />
  );

  return (
    <aside className="sticky top-0 hidden h-screen w-[256px] flex-none flex-col self-start gap-1 overflow-y-auto border-r border-line px-4 py-6 md:flex">
      <Link href="/dashboard" className="mb-4 flex items-center gap-2 px-2.5">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-forest">
          <Mark />
        </span>
        <b className="font-wise text-[22px] tracking-tight text-forest">Aurora</b>
        <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green">Admin</span>
      </Link>

      {nav.map(({ href, label, icon: Icon, badge }) => {
        const active = on(href);
        const n = badge ? counts[badge] : 0;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "relative flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[15px] font-medium transition-colors",
              active ? "font-semibold text-forest" : "text-ink hover:bg-card",
            )}
          >
            {active && <Pill />}
            <Icon size={20} strokeWidth={1.9} className={clsx("relative z-10", active ? "text-forest" : "text-[#2b2e28]")} />
            <span className="relative z-10 flex-1">{label}</span>
            {n > 0 && (
              <span className="relative z-10 grid h-5 min-w-5 place-items-center rounded-full bg-neg px-1.5 text-[11px] font-bold text-white">
                {n}
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
