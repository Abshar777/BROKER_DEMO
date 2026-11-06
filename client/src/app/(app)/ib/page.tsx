"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Item, Stagger } from "@/components/motion";
import { Copy, Check } from "lucide-react";

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="num mt-1 font-semibold text-[24px]">{value}</div>
    </Card>
  );
}

const rows = [
  { who: "Rajeesh K.", when: "10 Nov", amt: "+$12.40" },
  { who: "Fami S.", when: "8 Nov", amt: "+$18.10" },
  { who: "Navaneeth K.", when: "5 Nov", amt: "+$12.00" },
];

export default function IB() {
  const [copied, setCopied] = useState(false);
  const link = "https://aurora.demo/r/MA2026";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <>
      <Item>
        <h1 className="mb-5 font-semibold text-[30px]">IB room</h1>
      </Item>

      <Stagger className="mb-4 grid gap-4 md:grid-cols-3">
        <Item><Tile label="Total earned" value="$1,284.50" /></Item>
        <Item><Tile label="This month" value="$42.50" /></Item>
        <Item><Tile label="Active clients" value="18" /></Item>
      </Stagger>

      <Item>
        <Card className="max-w-[600px] border border-line bg-white p-5">
          <div className="mb-1 font-semibold text-[18px]">Your referral link</div>
          <p className="mb-3 text-sm text-muted">Share it — earn commission on every trade your clients make.</p>
          <div className="flex items-center gap-2">
            <input readOnly value={link} className="input num flex-1" />
            <Button variant="secondary" onClick={copy}>
              {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
            </Button>
          </div>
        </Card>
      </Item>

      <Item>
        <h2 className="mb-2 mt-7 font-semibold text-[22px]">Recent commissions</h2>
        <div className="max-w-[600px]">
          {rows.map((r) => (
            <div key={r.who} className="flex items-center justify-between border-t border-line py-3.5 first:border-t-0">
              <div>
                <div className="font-semibold">{r.who}</div>
                <div className="text-sm text-muted">{r.when}</div>
              </div>
              <div className="num font-semibold text-pos">{r.amt}</div>
            </div>
          ))}
        </div>
      </Item>
    </>
  );
}
