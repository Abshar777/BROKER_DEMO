"use client";
import { Tx } from "@/lib/mock/data";
import { signed, fmtDate } from "@/lib/format";
import clsx from "clsx";
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Star, Gift, type LucideIcon } from "lucide-react";

const META: Record<Tx["kind"], { Icon: LucideIcon; bg: string; fg: string }> = {
  deposit: { Icon: ArrowDownToLine, bg: "bg-green-faint", fg: "text-pos" },
  withdrawal: { Icon: ArrowUpFromLine, bg: "bg-card-2", fg: "text-ink" },
  transfer: { Icon: ArrowLeftRight, bg: "bg-[#f0eef9]", fg: "text-[#6b3fa0]" },
  commission: { Icon: Star, bg: "bg-green-faint", fg: "text-pos" },
  bonus: { Icon: Gift, bg: "bg-[#f5efe6]", fg: "text-[#8a6516]" },
  trade: { Icon: ArrowLeftRight, bg: "bg-card-2", fg: "text-ink" },
};

export function TxList({ items }: { items: Tx[] }) {
  if (!items.length) return <div className="py-8 text-center text-muted">No transactions yet.</div>;
  return (
    <div>
      {items.map((t) => {
        const { Icon, bg, fg } = META[t.kind];
        return (
          <div key={t.id} className="flex items-center gap-3.5 border-t border-line py-4 first:border-t-0">
            <span className={clsx("grid h-[42px] w-[42px] flex-none place-items-center rounded-full", bg, fg)}>
              <Icon size={19} />
            </span>
            <div className="min-w-0">
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-muted">
                {fmtDate(t.date)} · {t.subtitle}
                {t.status !== "completed" && <span className="ml-1 capitalize text-[#8a6516]"> · {t.status}</span>}
              </div>
            </div>
            <div className={clsx("num ml-auto text-right font-semibold", t.amount >= 0 && "text-pos")}>
              {signed(t.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
