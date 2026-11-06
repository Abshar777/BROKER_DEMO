"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CreditCard, Plus, ListChecks, Users, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, type LucideIcon } from "lucide-react";
import { ActionSheet } from "./ActionSheet";

type Item = { label: string; icon: LucideIcon; href?: string; action?: "fund"; badge?: number };

const items: Item[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
  { action: "fund", label: "Fund", icon: Plus },
  { href: "/transactions", label: "Activity", icon: ListChecks },
  { href: "/ib", label: "IB", icon: Users, badge: 3 },
];

const FUND_PATHS = ["/deposit", "/withdraw", "/transfer"];

export function BottomDock() {
  const path = usePathname();
  const router = useRouter();
  const [fundOpen, setFundOpen] = useState(false);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center md:hidden"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom,0px))" }}
      >
        <motion.nav
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.2 }}
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-white px-2 py-2 shadow-[0_10px_34px_rgba(13,30,24,.16)]"
        >
          {items.map(({ href, label, icon: Icon, badge, action }) => {
            const on = action === "fund" ? FUND_PATHS.includes(path) : path === href;
            const inner = (
              <>
                {on && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-full bg-green-faint"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <span className="relative">
                  <Icon size={22} className={on ? "text-forest" : "text-muted"} strokeWidth={on ? 2.2 : 1.8} />
                  {badge && (
                    <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#f5a623] px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                <span className={`relative text-[11px] font-semibold ${on ? "text-forest" : "text-muted"}`}>{label}</span>
              </>
            );
            const cls = "relative flex min-w-[62px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5";
            return action === "fund" ? (
              <button key={label} onClick={() => setFundOpen(true)} className={cls} aria-label="Move money">{inner}</button>
            ) : (
              <Link key={label} href={href!} className={cls}>{inner}</Link>
            );
          })}
        </motion.nav>
      </div>

      <ActionSheet
        open={fundOpen}
        onClose={() => setFundOpen(false)}
        title="Move money"
        items={[
          { key: "deposit", icon: ArrowDownToLine, label: "Deposit", sub: "Add funds — instant, no fees", tone: "bg-green text-forest", onSelect: () => router.push("/deposit") },
          { key: "withdraw", icon: ArrowUpFromLine, label: "Withdraw", sub: "To bank, crypto or cash", tone: "bg-card-2 text-forest", onSelect: () => router.push("/withdraw") },
          { key: "transfer", icon: ArrowLeftRight, label: "Transfer", sub: "Between your accounts", tone: "bg-card-2 text-forest", onSelect: () => router.push("/transfer") },
        ]}
      />
    </>
  );
}
