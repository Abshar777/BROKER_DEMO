"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Item } from "@/components/motion";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { useStore, useStats } from "@/lib/store";
import { money, signed, fmtDate } from "@/lib/format";
import { Users, Wallet, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const db = useStore((s) => s.db);
  const stats = useStats();
  if (!db || !stats) return null;

  const recent = db.ledger.slice(0, 6);

  return (
    <>
      <Item>
        <h1 className="font-wise text-[30px] tracking-tight text-forest">Overview</h1>
        <p className="mb-6 mt-1 text-muted">Everything waiting on you across the platform.</p>
      </Item>

      <Item>
        <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard icon={Users} label="Total clients" value={String(stats.clients)} sub={`${stats.activeClients} active`} href="/clients" />
          <StatCard icon={Wallet} label="Assets under mgmt" value={money(stats.aum).replace(".00", "")} accent="green" />
          <StatCard icon={ShieldCheck} label="KYC to review" value={String(stats.pendingKyc)} href="/kyc" accent={stats.pendingKyc ? "warn" : "neutral"} />
          <StatCard icon={ArrowUpFromLine} label="Withdrawals to approve" value={String(stats.pendingWithdrawals)} href="/withdrawals" accent={stats.pendingWithdrawals ? "warn" : "neutral"} />
        </div>
      </Item>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Review queue */}
        <Item>
          <div className="rounded-[20px] border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-[17px]">Action queue</h2>
              <span className="text-sm text-muted">{stats.pendingKyc + stats.pendingDeposits + stats.pendingWithdrawals} pending</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <QueueRow href="/kyc" icon={<ShieldCheck size={18} />} title="KYC verifications" count={stats.pendingKyc} hint="identity documents" />
              <QueueRow href="/deposits" icon={<ArrowDownToLine size={18} />} title="Deposit approvals" count={stats.pendingDeposits} hint={money(stats.depositValue).replace(".00", "")} />
              <QueueRow href="/withdrawals" icon={<ArrowUpFromLine size={18} />} title="Withdrawal approvals" count={stats.pendingWithdrawals} hint={money(stats.withdrawalValue).replace(".00", "")} />
            </div>
          </div>
        </Item>

        {/* Recent activity */}
        <Item>
          <div className="rounded-[20px] border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-[17px]">Recent activity</h2>
              <Link href="/transactions" className="text-sm font-semibold text-forest hover:underline">View all</Link>
            </div>
            <div className="flex flex-col">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.clientName}</div>
                    <div className="text-xs capitalize text-muted">{t.kind} · {fmtDate(t.date)}</div>
                  </div>
                  <div className="flex flex-none items-center gap-2.5">
                    <span className={`num text-sm font-semibold ${t.amount < 0 ? "text-neg" : "text-pos"}`}>{signed(t.amount)}</span>
                    <StatusPill status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Item>
      </div>
    </>
  );
}

function QueueRow({ href, icon, title, count, hint }: { href: string; icon: React.ReactNode; title: string; count: number; hint: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className="flex items-center gap-3.5 rounded-[14px] bg-card px-4 py-3.5 transition-colors hover:bg-card-2"
      >
        <span className={`grid h-10 w-10 flex-none place-items-center rounded-full ${count ? "bg-green text-forest" : "bg-card-2 text-muted-2"}`}>{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted">{count ? `${count} waiting · ${hint}` : "All clear"}</div>
        </div>
        {count > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-neg px-2 text-xs font-bold text-white">{count}</span>}
        <ArrowRight size={18} className="flex-none text-muted-2" />
      </motion.div>
    </Link>
  );
}
