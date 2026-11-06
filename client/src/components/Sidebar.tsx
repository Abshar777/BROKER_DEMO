"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  Home, CreditCard, List, Users, BarChart3, type LucideIcon,
} from "lucide-react";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden>
      <path d="M4 15c3 0 3.6-8 8-8s5 8 8 8" stroke="#9FE870" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const main: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/accounts", label: "MT5 accounts", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: List },
];
const fund = [
  { href: "/deposit", label: "Deposit" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/transfer", label: "Transfers" },
];
const extra: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/ib", label: "IB room", icon: Users },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

export function Sidebar() {
  const path = usePathname();
  const reduce = useReducedMotion();
  const on = (h: string) => path === h;

  const Pill = ({ radius }: { radius: string }) => (
    <motion.span
      layoutId="sidebar-active"
      className={clsx("absolute inset-0 bg-green-faint", radius)}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
    />
  );

  return (
    <aside className="sticky top-0 hidden h-screen w-[268px] flex-none self-start flex-col gap-1 overflow-y-auto border-r border-line px-4 py-6 md:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-2.5 pb-5">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-forest">
          <Mark />
        </span>
        <b className="font-wise text-[22px] tracking-tight text-forest">Aurora</b>
      </Link>

      {main.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "relative flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[15px] font-medium transition-colors",
            on(href) ? "font-semibold text-forest" : "text-ink hover:bg-card",
          )}
        >
          {on(href) && <Pill radius="rounded-[14px]" />}
          <Icon size={21} strokeWidth={1.8} className={clsx("relative z-10", on(href) ? "text-forest" : "text-[#2b2e28]")} />
          <span className="relative z-10">{label}</span>
        </Link>
      ))}

      <div className="px-3.5 pb-1 pt-3 text-[12px] font-semibold uppercase tracking-wide text-muted-2">Fund</div>
      {fund.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "relative rounded-[12px] px-3.5 py-2.5 pl-12 text-[14px] transition-colors",
            on(href) ? "font-semibold text-forest" : "text-[#3a3d37] hover:bg-card",
          )}
        >
          {on(href) && <Pill radius="rounded-[12px]" />}
          <span className="relative z-10">{label}</span>
        </Link>
      ))}

      {extra.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "relative flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[15px] font-medium transition-colors",
            on(href) ? "font-semibold text-forest" : "text-ink hover:bg-card",
          )}
        >
          {on(href) && <Pill radius="rounded-[14px]" />}
          <Icon size={21} strokeWidth={1.8} className={clsx("relative z-10", on(href) ? "text-forest" : "text-[#2b2e28]")} />
          <span className="relative z-10">{label}</span>
        </Link>
      ))}
    </aside>
  );
}
