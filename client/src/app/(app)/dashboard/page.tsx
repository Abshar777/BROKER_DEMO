"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TxList } from "@/components/TxList";
import { Flag } from "@/components/Flag";
import { Item } from "@/components/motion";
import { CountUp } from "@/components/CountUp";
import { EquityChart } from "@/components/EquityChart";
import { ActionSheet } from "@/components/ActionSheet";
import { useStore, useTotals } from "@/lib/store";
import { money } from "@/lib/format";
import { ChevronRight, ChevronDown, Landmark, Plus, BarChart3, ShieldCheck, ArrowLeftRight, Wallet, Send } from "lucide-react";

export default function Dashboard() {
  const { accounts, transactions, client } = useStore();
  const totals = useTotals();
  const rm = useReducedMotion();
  const router = useRouter();
  const verified = client?.kycStatus === "approved";
  const [transferOpen, setTransferOpen] = useState(false);
  const [stacked, setStacked] = useState(false);

  return (
    <>
      <Item>
        <div className="text-[15px] text-muted">Total equity</div>
        <div className="num mt-0.5 flex items-center gap-3 font-wise text-[34px] tracking-tight">
          <span><CountUp value={totals.equity} /> USD</span>
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-card">
            <BarChart3 size={18} className="text-ink" />
          </span>
        </div>
      </Item>

      <Item>
        <div className="my-6 flex flex-wrap gap-2.5">
          <Link href="/deposit"><Button variant="primary">Deposit</Button></Link>
          <Link href="/withdraw"><Button variant="secondary">Withdraw</Button></Link>
          <Button variant="secondary" onClick={() => setTransferOpen(true)}>Transfer <ChevronDown size={16} strokeWidth={2.4} /></Button>
        </div>
      </Item>

      {!verified && (
        <Item>
          <Link href="/kyc" className="mb-5 block">
            <div className="flex items-center gap-3.5 rounded-[18px] border border-[#F0D98A] bg-[#FFF8E8] p-4 transition hover:brightness-[.99]">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#FFE7A8] text-[#9A6B00]">
                <ShieldCheck size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#7A5600]">Verify your identity</div>
                <div className="truncate text-sm text-[#9A6B00]">Finish KYC to unlock withdrawals — about 2 minutes.</div>
              </div>
              <ChevronRight size={18} className="text-[#9A6B00]" />
            </div>
          </Link>
        </Item>
      )}

      <Item>
        <div className="mt-3 grid gap-[18px] md:grid-cols-2">
          <div className="relative rounded-[20px] bg-card">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-12 right-12 rounded-t-[14px] bg-[#c9b6f0] shadow-[0_6px_16px_rgba(140,110,220,.25)]"
              style={{ top: -14, height: 24 }}
              animate={stacked ? { y: -44, rotate: -5, height: 54 } : rm ? { y: 0 } : { y: [0, -3, 0] }}
              transition={stacked ? { type: "spring", stiffness: 320, damping: 22 } : { repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-8 right-8 rounded-t-[14px] bg-[#f4c58a] shadow-[0_6px_16px_rgba(230,160,90,.25)]"
              style={{ top: -8, height: 24 }}
              animate={stacked ? { y: -22, rotate: 4, height: 48 } : rm ? { y: 0 } : { y: [0, -2, 0] }}
              transition={stacked ? { type: "spring", stiffness: 320, damping: 22 } : { repeat: Infinity, duration: 3.4, delay: 0.25, ease: "easeInOut" }}
            />
            <motion.button
              onClick={() => setStacked((s) => !s)}
              whileTap={{ scale: 0.985 }}
              aria-expanded={stacked}
              aria-label="Toggle account cards"
              className="relative flex w-full items-center justify-between rounded-t-[20px] bg-green px-[18px] py-3 text-left"
            >
              <b className="flex items-center gap-1.5 font-semibold text-[15px] text-forest">
                {accounts.length} accounts <ChevronRight size={15} strokeWidth={2.6} />
              </b>
              <motion.svg
                animate={{ rotate: stacked ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden
              >
                <path d="M4 15c3 0 3.6-8 8-8s5 8 8 8" stroke="#163300" strokeWidth="2.4" strokeLinecap="round" />
              </motion.svg>
            </motion.button>
            <div className="p-[18px]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[21px]">Live accounts</h3>
                  <div className="num mt-0.5 text-muted">{money(totals.balance)}</div>
                </div>
                <ChevronRight size={20} className="text-muted-2" />
              </div>
              <div className="mt-3">
                {accounts.map((a) => (
                  <Link key={a.login} href="/accounts" className="flex items-center gap-3 border-t border-[#e3e4df] py-3 first:border-t-0">
                    <Flag cc="US" size={26} />
                    <span>{a.login} · {a.type}</span>
                    <span className="num ml-auto font-semibold">{money(a.balance)}</span>
                    <ChevronRight size={16} className="text-muted-2" />
                  </Link>
                ))}
              </div>
              <Link href="/accounts" className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-card-2 px-4 py-2.5 text-sm font-semibold">
                <Landmark size={17} /> Account details
              </Link>
            </div>
          </div>

          <Card className="flex flex-col items-center justify-center gap-2 bg-card-2 px-6 py-9 text-center">
            <h3 className="font-semibold text-[21px]">Do more with your money</h3>
            <p className="max-w-[260px] text-muted">Claim a credit bonus, refer a friend, and earn a return.</p>
            <Link href="/ib" className="mt-3 grid h-[58px] w-[58px] place-items-center rounded-full bg-green text-forest transition hover:bg-green-press active:scale-95">
              <Plus size={26} />
            </Link>
          </Card>
        </div>
      </Item>

      <Item>
        <div className="mt-[18px] rounded-[20px] bg-card p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-[18px]">Equity · last 30 days</h3>
            <span className="rounded-full bg-green-faint px-3 py-1 text-xs font-semibold text-forest">▲ 8.4%</span>
          </div>
          <EquityChart />
          <div className="num mt-1 flex justify-between text-xs text-muted"><span>Oct 7</span><span>Nov 6</span></div>
        </div>
      </Item>

      <Item>
        <div className="my-5 flex items-center gap-4 rounded-[18px] bg-card px-5 py-4">
          <span className="grid h-[52px] w-[62px] flex-none place-items-center rounded-[12px] text-2xl" style={{ background: "linear-gradient(135deg,#ffd27a,#ff9e6b)" }}>💸</span>
          <div className="min-w-0 flex-1">
            <div>Your Pro account now earns MT5 credit bonuses.</div>
            <Link href="/ib" className="font-semibold text-[15px] underline underline-offset-2">Find out more</Link>
          </div>
        </div>
      </Item>

      <Item>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h2 className="font-semibold text-[24px]">Transactions</h2>
          <Link href="/transactions" className="font-semibold text-[14px] underline underline-offset-2">See all</Link>
        </div>
        <TxList items={transactions.slice(0, 4)} />
      </Item>

      <ActionSheet
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer"
        items={[
          { key: "accounts", icon: ArrowLeftRight, label: "Between my accounts", sub: "Instant · no fees", tone: "bg-green text-forest", onSelect: () => router.push("/transfer") },
          { key: "wallet", icon: Wallet, label: "To my wallet", sub: "Withdraw to crypto / bank", tone: "bg-card-2 text-forest", onSelect: () => router.push("/withdraw") },
          { key: "trader", icon: Send, label: "To another trader", sub: "Send by Aurora ID", tone: "bg-card-2 text-forest", onSelect: () => router.push("/transfer") },
        ]}
      />
    </>
  );
}
