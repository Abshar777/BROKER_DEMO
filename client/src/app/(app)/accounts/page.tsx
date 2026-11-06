"use client";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flag } from "@/components/Flag";
import { Item, Stagger } from "@/components/motion";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-card-2 px-3 py-2.5">
      <div className="text-xs text-muted">{label}</div>
      <div className="num mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

export default function Accounts() {
  const accounts = useStore((s) => s.accounts);
  return (
    <>
      <Item>
        <h1 className="mb-5 font-semibold text-[30px]">MT5 accounts</h1>
      </Item>
      <Stagger className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => (
          <Item key={a.login}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Flag cc="US" size={36} />
                  <div>
                    <div className="font-semibold text-[20px]">{a.type} account</div>
                    <div className="num text-sm text-muted">{a.login} · {a.currency} · {a.leverage}</div>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.type === "Demo" ? "bg-[#f0eef9] text-[#6b3fa0]" : "bg-green-faint text-forest"}`}>
                  {a.type === "Demo" ? "Demo" : "Live"}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="Balance" value={money(a.balance)} />
                <Stat label="Equity" value={money(a.equity)} />
                <Stat label="Credit" value={money(a.credit)} />
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/deposit"><Button variant="primary">Deposit</Button></Link>
                <Link href="/transfer"><Button variant="secondary">Transfer</Button></Link>
              </div>
            </Card>
          </Item>
        ))}
      </Stagger>
    </>
  );
}
