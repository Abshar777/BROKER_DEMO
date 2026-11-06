"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  LayoutGrid, Users, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, List, type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";

type Item = { href: string; label: string; icon: LucideIcon; badge?: "kyc" | "dep" | "wd" };

const items: Item[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/kyc", label: "KYC", icon: ShieldCheck, badge: "kyc" },
  { href: "/deposits", label: "Deposits", icon: ArrowDownToLine, badge: "dep" },
  { href: "/withdrawals", label: "Withdraw", icon: ArrowUpFromLine, badge: "wd" },
  { href: "/transactions", label: "Activity", icon: List },
];

/** Mobile-only bottom nav. Horizontally scrollable because the console has 6 sections. */
export function BottomDock() {
  const path = usePathname();
  const db = useStore((s) => s.db);
  const on = (h: string) => path === h || path.startsWith(h + "/");

  const counts = {
    kyc: db?.kyc.filter((k) => k.status === "pending").length ?? 0,
    dep: db?.deposits.filter((r) => r.status === "pending").length ?? 0,
    wd: db?.withdrawals.filter((r) => r.status === "pending").length ?? 0,
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3 md:hidden"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom,0px))" }}
    >
      <motion.nav
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.2 }}
        className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-[24px] border border-line bg-white px-2 py-2 shadow-[0_10px_34px_rgba(13,30,24,.16)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = on(href);
          const n = badge ? counts[badge] : 0;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex min-w-[60px] flex-none flex-col items-center gap-0.5 rounded-[18px] px-3 py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="admin-dock-pill"
                  className="absolute inset-0 rounded-[18px] bg-green-faint"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative">
                <Icon size={21} className={active ? "text-forest" : "text-muted"} strokeWidth={active ? 2.2 : 1.8} />
                {n > 0 && (
                  <span className="absolute -right-2.5 -top-2 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-neg px-1 text-[10px] font-bold text-white">
                    {n}
                  </span>
                )}
              </span>
              <span className={clsx("relative text-[11px] font-semibold", active ? "text-forest" : "text-muted")}>{label}</span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
