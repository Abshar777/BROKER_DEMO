"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Success } from "@/components/form";
import { FlowRow } from "@/components/FlowRow";
import { Flag } from "@/components/Flag";
import { SelectSheet } from "@/components/SelectSheet";
import { Item, Stagger } from "@/components/motion";
import { useStore } from "@/lib/store";
import { CURRENCIES, CURRENCY_BY_CODE } from "@/lib/currency";
import { Zap, Receipt, Banknote, ChevronDown } from "lucide-react";

const METHODS = ["USDT (CoinsBuy)", "Bank transfer", "Card"];

export default function Deposit() {
  const { accounts, deposit, busy } = useStore();
  const router = useRouter();
  const [amount, setAmount] = useState("500");
  const [mi, setMi] = useState(0);
  const [ai, setAi] = useState(0);
  const [ccy, setCcy] = useState("USD");
  const [sheet, setSheet] = useState<null | "account" | "method" | "currency">(null);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const acc = accounts[ai];
  const cur = CURRENCY_BY_CODE[ccy];

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setErr("Enter an amount greater than 0");
    setErr("");
    await deposit({ amount: amt, method: METHODS[mi], login: acc.login });
    setDone(true);
  };

  if (done) return <Success title="Deposit received" sub={`$${amount} added to account ${acc?.login}`} onDone={() => router.push("/dashboard")} />;

  return (
    <>
      <Item>
        <h1 className="font-semibold text-[30px]">Deposit</h1>
        <p className="mb-6 mt-1 text-muted">Add funds to your trading account — instant, no fees.</p>
      </Item>

      <Stagger className="max-w-[560px]">
        <Item>
          <div className="mb-2 flex items-center justify-between gap-4">
            <button type="button" onClick={() => setSheet("currency")} className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-[15px] font-semibold transition hover:bg-card-2 active:scale-95">
              <Flag cc={cur.cc} size={24} /> {cur.code} <ChevronDown size={16} />
            </button>
            <div className="flex items-baseline">
              <span className="font-wise text-[40px] leading-none text-forest">{cur.symbol}</span>
              <input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                aria-label="Deposit amount"
                className="num w-[190px] bg-transparent text-right font-wise text-[40px] leading-none text-forest outline-none"
              />
            </div>
          </div>
        </Item>

        <Item>
          <FlowRow icon={<Banknote size={20} />} label="Deposit method" value={METHODS[mi]} onChange={() => setSheet("method")} />
          <FlowRow icon={<Flag cc="US" size={28} />} label="To account" value={`${acc?.login} · ${acc?.type}`} sub={`$${acc?.balance.toLocaleString()} available`} onChange={() => setSheet("account")} />
          <FlowRow icon={<Zap size={20} />} label="Arrives" value="Today — in seconds" />
          <FlowRow icon={<Receipt size={20} />} label="Total fees" value="Free — no fees to pay" />
        </Item>

        <Item>
          {err && <p className="mt-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" className="mt-6 w-full py-4 text-[16px]" disabled={busy} onClick={submit}>
            {busy ? "Processing…" : "Continue"}
          </Button>
          <p className="mt-3 text-xs text-muted">Demo only — no real payment. Your balance updates instantly.</p>
        </Item>
      </Stagger>

      <SelectSheet
        open={sheet === "currency"}
        onClose={() => setSheet(null)}
        title="Select currency"
        selectedKey={ccy}
        onSelect={(key) => setCcy(String(key))}
        options={CURRENCIES.map((c) => ({
          key: c.code,
          node: (
            <>
              <Flag cc={c.cc} size={34} />
              <div>
                <div className="font-semibold">{c.code} <span className="text-muted-2">· {c.symbol}</span></div>
                <div className="text-sm text-muted">{c.name}</div>
              </div>
            </>
          ),
        }))}
      />
      <SelectSheet
        open={sheet === "method"}
        onClose={() => setSheet(null)}
        title="Deposit method"
        selectedKey={METHODS[mi]}
        onSelect={(key) => setMi(METHODS.indexOf(String(key)))}
        options={METHODS.map((m) => ({ key: m, node: <span className="font-semibold">{m}</span> }))}
      />
      <SelectSheet
        open={sheet === "account"}
        onClose={() => setSheet(null)}
        title="To account"
        selectedKey={acc?.login}
        onSelect={(key) => setAi(accounts.findIndex((a) => a.login === key))}
        options={accounts.map((a) => ({
          key: a.login,
          node: (
            <>
              <Flag cc="US" size={34} />
              <div>
                <div className="font-semibold">{a.login} · {a.type}</div>
                <div className="text-sm text-muted num">${a.balance.toLocaleString()} balance</div>
              </div>
            </>
          ),
        }))}
      />
    </>
  );
}
