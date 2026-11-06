"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Item } from "@/components/motion";
import { StatusPill } from "@/components/StatusPill";
import { useStore } from "@/lib/store";
import { signed, fmtDateLong } from "@/lib/format";
import { Search, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Percent, Gift } from "lucide-react";
import type { TxKind } from "@/lib/mock/data";

const KINDS: (TxKind | "all")[] = ["all", "deposit", "withdrawal", "transfer", "commission", "bonus"];
const ICON: Record<TxKind, React.ReactNode> = {
  deposit: <ArrowDownToLine size={16} />,
  withdrawal: <ArrowUpFromLine size={16} />,
  transfer: <ArrowLeftRight size={16} />,
  commission: <Percent size={16} />,
  bonus: <Gift size={16} />,
};

export default function Transactions() {
  const db = useStore((s) => s.db);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<TxKind | "all">("all");

  const rows = useMemo(() => {
    const list = db?.ledger ?? [];
    const term = q.trim().toLowerCase();
    return list.filter((t) => {
      if (kind !== "all" && t.kind !== kind) return false;
      if (!term) return true;
      return t.clientName.toLowerCase().includes(term) || t.id.toLowerCase().includes(term);
    });
  }, [db, q, kind]);

  if (!db) return null;

  return (
    <>
      <Item>
        <h1 className="font-wise text-[30px] tracking-tight text-forest">Transactions</h1>
        <p className="mb-5 mt-1 text-muted">Platform-wide ledger across all clients.</p>
      </Item>

      <Item>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-[320px]">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search client or ID" className="input pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={clsx("rounded-full px-3.5 py-2 text-sm font-semibold capitalize transition active:scale-95", kind === k ? "bg-forest text-green" : "bg-card text-ink hover:bg-card-2")}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </Item>

      <Item>
        <div className="overflow-hidden rounded-[20px] border border-line bg-white">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-4 border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-2 md:grid">
            <span>Client</span><span>Type</span><span>Date</span><span className="text-right">Amount</span><span className="text-right">Status</span>
          </div>
          {rows.length === 0 && <div className="px-5 py-10 text-center text-muted">No transactions match.</div>}
          {rows.map((t) => (
            <div key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] md:gap-4">
              <div className="min-w-0">
                <Link href={`/clients/${t.clientId}`} className="truncate font-semibold hover:underline">{t.clientName}</Link>
                <div className="truncate text-sm text-muted">{t.id}</div>
              </div>
              <div className="hidden items-center gap-2 text-sm font-medium capitalize md:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-card-2 text-ink">{ICON[t.kind]}</span>
                {t.kind}
              </div>
              <div className="hidden text-sm text-muted md:block">{fmtDateLong(t.date)}</div>
              <div className="hidden text-right md:block">
                <span className={clsx("num font-semibold", t.amount < 0 ? "text-neg" : "text-pos")}>{signed(t.amount)}</span>
              </div>
              <div className="flex flex-col items-end gap-1 md:block md:justify-self-end">
                <span className={clsx("num text-sm font-semibold md:hidden", t.amount < 0 ? "text-neg" : "text-pos")}>{signed(t.amount)}</span>
                <StatusPill status={t.status} />
              </div>
            </div>
          ))}
        </div>
      </Item>
    </>
  );
}
