"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Item } from "@/components/motion";
import { Flag } from "@/components/Flag";
import { StatusPill } from "@/components/StatusPill";
import { useStore } from "@/lib/store";
import { money, fmtDateLong } from "@/lib/format";
import { Check, X, Inbox, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={clsx("rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95", on ? "bg-forest text-green" : "bg-card text-ink hover:bg-card-2")}>
      {children}
    </button>
  );
}

export function ActionBtn({ kind, busy, onClick }: { kind: "approve" | "reject"; busy: boolean; onClick: () => void }) {
  const approve = kind === "approve";
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50",
        approve ? "bg-green text-forest hover:bg-green-press" : "bg-[#FBE6E5] text-neg hover:brightness-95",
      )}
    >
      {approve ? <Check size={16} /> : <X size={16} />}
      {approve ? "Approve" : "Reject"}
    </button>
  );
}

export function Empty({ icon }: { icon?: React.ReactNode }) {
  return (
    <div className="grid place-items-center gap-3 rounded-[20px] border border-dashed border-line bg-card/40 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-green-light text-forest">{icon ?? <Inbox size={26} />}</span>
      <div>
        <div className="font-semibold">All caught up</div>
        <div className="text-sm text-muted">Nothing waiting for review here.</div>
      </div>
    </div>
  );
}

/** Deposits + withdrawals share this queue. */
export function MoneyQueue({ type }: { type: "deposit" | "withdrawal" }) {
  const db = useStore((s) => s.db);
  const reviewDeposit = useStore((s) => s.reviewDeposit);
  const reviewWithdrawal = useStore((s) => s.reviewWithdrawal);
  const busyId = useStore((s) => s.busyId);
  const [showDone, setShowDone] = useState(false);
  if (!db) return null;

  const isDep = type === "deposit";
  const all = isDep ? db.deposits : db.withdrawals;
  const review = isDep ? reviewDeposit : reviewWithdrawal;
  const pending = all.filter((r) => r.status === "pending");
  const done = all.filter((r) => r.status !== "pending");
  const list = showDone ? done : pending;
  const Icon = isDep ? ArrowDownToLine : ArrowUpFromLine;

  return (
    <>
      <Item>
        <h1 className="font-wise text-[30px] tracking-tight text-forest">{isDep ? "Deposits" : "Withdrawals"}</h1>
        <p className="mb-5 mt-1 text-muted">{isDep ? "Approve incoming funding requests." : "Approve payout requests to clients."}</p>
      </Item>

      <Item>
        <div className="mb-4 flex gap-2">
          <Toggle on={!showDone} onClick={() => setShowDone(false)}>Pending ({pending.length})</Toggle>
          <Toggle on={showDone} onClick={() => setShowDone(true)}>Processed ({done.length})</Toggle>
        </div>
      </Item>

      {list.length === 0 ? (
        <Item><Empty icon={<Icon size={26} />} /></Item>
      ) : (
        <Item>
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((r) => {
                const busy = busyId === r.id;
                return (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22 } }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <span className={clsx("grid h-12 w-12 flex-none place-items-center rounded-full", isDep ? "bg-green-light text-pos" : "bg-[#FDF0D5] text-[#9A6B00]")}>
                      <Icon size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/clients/${r.clientId}`} className="truncate font-semibold hover:underline">{r.name}</Link>
                        {showDone && <StatusPill status={r.status} />}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted">
                        <span>{r.method}</span><span>·</span>
                        <span>MT5 {r.login}</span><span>·</span>
                        <span>{fmtDateLong(r.requested)}</span>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-3 sm:gap-4">
                      <span className="num font-wise text-[20px] tracking-tight text-forest">{money(r.amount).replace(".00", "")}</span>
                      {!showDone && (
                        <div className="flex gap-2">
                          <ActionBtn kind="reject" busy={busy} onClick={() => review(r.id, "rejected")} />
                          <ActionBtn kind="approve" busy={busy} onClick={() => review(r.id, "approved")} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Item>
      )}
    </>
  );
}
