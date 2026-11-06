"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";
import { CreditCard, Wallet, Plus, Check } from "lucide-react";

const CARDS = [
  { brand: "Visa", last4: "6411", exp: "08/27", primary: true },
  { brand: "Mastercard", last4: "2290", exp: "12/26", primary: false },
];
const WALLETS = [
  { net: "USDT · TRC-20", addr: "TJ9x…4kQp" },
  { net: "USDT · ERC-20", addr: "0x7a…9fE2" },
];

export default function Payment() {
  return (
    <>
      <PageHeader title="Payment methods" sub="Cards & crypto wallets" />

      <Item>
        <h2 className="mb-2 font-semibold text-[18px]">Cards</h2>
        <Card className="mb-4 overflow-hidden border border-line bg-white">
          {CARDS.map((c) => (
            <div key={c.last4} className="flex items-center gap-3.5 border-t border-line px-5 py-4 first:border-t-0">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><CreditCard size={18} /></span>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  {c.brand} •••• {c.last4}
                  {c.primary && <span className="inline-flex items-center gap-1 rounded-full bg-green-light px-2 py-0.5 text-[11px] font-semibold text-pos"><Check size={11} /> Primary</span>}
                </div>
                <div className="num text-sm text-muted">Expires {c.exp}</div>
              </div>
            </div>
          ))}
        </Card>
      </Item>

      <Item>
        <h2 className="mb-2 font-semibold text-[18px]">Crypto wallets</h2>
        <Card className="mb-4 overflow-hidden border border-line bg-white">
          {WALLETS.map((w) => (
            <div key={w.net} className="flex items-center gap-3.5 border-t border-line px-5 py-4 first:border-t-0">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><Wallet size={18} /></span>
              <div className="flex-1">
                <div className="font-semibold">{w.net}</div>
                <div className="num text-sm text-muted">{w.addr}</div>
              </div>
            </div>
          ))}
        </Card>
      </Item>

      <Item>
        <Button variant="secondary" className="w-full py-3.5"><Plus size={18} /> Add payment method</Button>
        <p className="mt-3 text-center text-xs text-muted-2">Demo only — no real cards or wallets are stored.</p>
      </Item>
    </>
  );
}
