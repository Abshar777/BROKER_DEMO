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
import { Zap, Receipt, ChevronDown } from "lucide-react";

export default function Transfer() {
  const { accounts, transfer, busy } = useStore();
  const router = useRouter();
  const [fi, setFi] = useState(0);
  const [ti, setTi] = useState(1);
  const [amount, setAmount] = useState("100");
  const [ccy, setCcy] = useState("USD");
  const [sheet, setSheet] = useState<null | "from" | "to" | "currency">(null);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const from = accounts[fi];
  const to = accounts[ti];
  const cur = CURRENCY_BY_CODE[ccy];

  const accountOption = (a: (typeof accounts)[number]) => ({
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
  });

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setErr("Enter an amount greater than 0");
    if (fi === ti) return setErr("Pick two different accounts");
    if (from && amt > from.balance) return setErr("Amount exceeds the source balance");
    setErr("");
    await transfer({ from: from.login, to: to.login, amount: amt });
    setDone(true);
  };

  if (done) return <Success title="Transfer complete" sub={`$${amount} moved ${from?.login} → ${to?.login}`} onDone={() => router.push("/dashboard")} />;

  return (
    <>
      <Item>
        <h1 className="font-semibold text-[30px]">Transfer</h1>
        <p className="mb-6 mt-1 text-muted">Move money instantly between your own accounts.</p>
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
                aria-label="Transfer amount"
                className="num w-[190px] bg-transparent text-right font-wise text-[40px] leading-none text-forest outline-none"
              />
            </div>
          </div>
        </Item>

        <Item>
          <FlowRow icon={<Flag cc="US" size={28} />} label="From" value={`${from?.login} · ${from?.type}`} sub={`$${from?.balance.toLocaleString()} available`} onChange={() => setSheet("from")} />
          <FlowRow icon={<Flag cc="US" size={28} />} label="To" value={`${to?.login} · ${to?.type}`} onChange={() => setSheet("to")} />
          <FlowRow icon={<Zap size={20} />} label="Arrives" value="Instant" />
          <FlowRow icon={<Receipt size={20} />} label="Total fees" value="Free" />
        </Item>

        <Item>
          {err && <p className="mt-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" className="mt-6 w-full py-4 text-[16px]" disabled={busy} onClick={submit}>
            {busy ? "Transferring…" : "Continue"}
          </Button>
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
      <SelectSheet open={sheet === "from"} onClose={() => setSheet(null)} title="From account" selectedKey={from?.login} onSelect={(key) => setFi(accounts.findIndex((a) => a.login === key))} options={accounts.map(accountOption)} />
      <SelectSheet open={sheet === "to"} onClose={() => setSheet(null)} title="To account" selectedKey={to?.login} onSelect={(key) => setTi(accounts.findIndex((a) => a.login === key))} options={accounts.map(accountOption)} />
    </>
  );
}
