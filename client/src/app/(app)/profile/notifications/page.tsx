"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";

const GROUPS: { title: string; items: { key: string; label: string; sub: string; def: boolean }[] }[] = [
  {
    title: "Account",
    items: [
      { key: "deposits", label: "Deposits & withdrawals", sub: "When funds move", def: true },
      { key: "login", label: "New login alerts", sub: "Security sign-ins", def: true },
      { key: "kyc", label: "Verification updates", sub: "KYC status changes", def: true },
    ],
  },
  {
    title: "Trading",
    items: [
      { key: "margin", label: "Margin alerts", sub: "Low free margin", def: true },
      { key: "ib", label: "IB commissions", sub: "New earnings", def: false },
    ],
  },
  {
    title: "Channels",
    items: [
      { key: "email", label: "Email", sub: "mohammed@aurora.demo", def: true },
      { key: "push", label: "Push notifications", sub: "This device", def: true },
      { key: "marketing", label: "Promotions", sub: "Offers & news", def: false },
    ],
  },
];

export default function Notifications() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.flatMap((g) => g.items.map((i) => [i.key, i.def]))),
  );
  const toggle = (k: string) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <PageHeader title="Notifications" sub="Choose what reaches you" />
      {GROUPS.map((g) => (
        <Item key={g.title}>
          <h2 className="mb-2 mt-2 font-semibold text-[18px]">{g.title}</h2>
          <Card className="mb-4 overflow-hidden border border-line bg-white">
            {g.items.map((i) => (
              <div key={i.key} className="flex items-center gap-3.5 border-t border-line px-5 py-4 first:border-t-0">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{i.label}</div>
                  <div className="truncate text-sm text-muted">{i.sub}</div>
                </div>
                <Switch on={!!state[i.key]} onChange={() => toggle(i.key)} label={i.label} />
              </div>
            ))}
          </Card>
        </Item>
      ))}
    </>
  );
}
