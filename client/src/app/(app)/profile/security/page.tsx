"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";
import { KeyRound, Smartphone, Fingerprint, Monitor, ChevronRight } from "lucide-react";

const DEVICES = [
  { name: "iPhone 15 Pro", meta: "Dubai · active now", current: true },
  { name: "MacBook Air", meta: "Dubai · 2 hours ago", current: false },
  { name: "Chrome · Windows", meta: "Abu Dhabi · 3 days ago", current: false },
];

export default function Security() {
  const [twoFa, setTwoFa] = useState(true);
  const [biometric, setBiometric] = useState(true);

  return (
    <>
      <PageHeader title="Security" sub="Protect your account" />

      <Item>
        <Card className="mb-4 flex items-center gap-3.5 border border-line bg-white p-5">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><KeyRound size={18} /></span>
          <div className="flex-1">
            <div className="font-semibold">Password</div>
            <div className="text-sm text-muted">Last changed 2 months ago</div>
          </div>
          <Button variant="ghost" className="px-4 py-2 text-sm">Change</Button>
        </Card>
      </Item>

      <Item>
        <Card className="mb-4 overflow-hidden border border-line bg-white">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><Smartphone size={18} /></span>
            <div className="flex-1">
              <div className="font-semibold">Two-factor authentication</div>
              <div className="text-sm text-muted">Code on every login</div>
            </div>
            <Switch on={twoFa} onChange={setTwoFa} label="Two-factor authentication" />
          </div>
          <div className="flex items-center gap-3.5 border-t border-line px-5 py-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><Fingerprint size={18} /></span>
            <div className="flex-1">
              <div className="font-semibold">Biometric unlock</div>
              <div className="text-sm text-muted">Face ID / fingerprint</div>
            </div>
            <Switch on={biometric} onChange={setBiometric} label="Biometric unlock" />
          </div>
        </Card>
      </Item>

      <Item>
        <h2 className="mb-2 mt-2 font-semibold text-[18px]">Active devices</h2>
        <Card className="overflow-hidden border border-line bg-white">
          {DEVICES.map((d) => (
            <div key={d.name} className="flex items-center gap-3.5 border-t border-line px-5 py-4 first:border-t-0">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest"><Monitor size={18} /></span>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  {d.name}
                  {d.current && <span className="rounded-full bg-green-light px-2 py-0.5 text-[11px] font-semibold text-pos">This device</span>}
                </div>
                <div className="text-sm text-muted">{d.meta}</div>
              </div>
              {!d.current && <ChevronRight size={18} className="text-muted-2" />}
            </div>
          ))}
        </Card>
      </Item>
    </>
  );
}
