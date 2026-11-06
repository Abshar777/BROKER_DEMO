"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import { ShieldCheck, Zap } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { signIn, busy } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return setErr("Enter your email");
    setErr("");
    await signIn({ email, password });
    router.push("/dashboard");
  };

  const quick = async () => {
    await signIn({ email: "ops@aurora.demo" });
    router.push("/dashboard");
  };

  return (
    <>
      <Item>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-faint px-3 py-1.5 text-xs font-semibold text-forest">
          <ShieldCheck size={14} /> Operations console
        </span>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">ADMIN LOG IN</h1>
        <p className="mb-6 mt-1.5 text-muted">Sign in to review KYC, deposits and withdrawals.</p>
      </Item>

      <form onSubmit={submit}>
        <Item>
          <div className="mb-3">
            <Input label="Work email" type="email" placeholder="you@aurora.demo" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
        </Item>
        <Item>
          <div className="mb-4">
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
        </Item>
        <Item>
          {err && <p className="mb-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" type="submit" className="w-full py-3.5 text-[16px]" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </Button>
        </Item>
      </form>

      <Item>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-2">
          <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
        </div>
        <button
          onClick={quick}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-card px-4 py-3.5 font-semibold transition hover:bg-card-2 active:scale-[.98] disabled:opacity-50"
        >
          <Zap size={17} className="text-forest" /> Enter demo console
        </button>
      </Item>
    </>
  );
}
