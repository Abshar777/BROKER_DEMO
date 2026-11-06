"use client";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1.5 text-sm text-muted">{label}</div>
      {children}
    </label>
  );
}

export function Success({ title, sub, onDone }: { title: string; sub: string; onDone: () => void }) {
  return (
    <div className="max-w-[520px]">
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-green">
          <CheckCircle2 size={32} className="text-forest" />
        </span>
        <h1 className="font-semibold text-[28px]">{title}</h1>
        <p className="text-muted">{sub}</p>
        <Button variant="primary" onClick={onDone} className="mt-2">Back to home</Button>
      </div>
    </div>
  );
}
