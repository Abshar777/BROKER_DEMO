"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import { DEMO_CLIENTS } from "@/lib/mock/data";
import { ChevronRight } from "lucide-react";

export default function Login() {
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

  const quick = async (demoEmail: string) => {
    await signIn({ email: demoEmail });
    router.push("/dashboard");
  };

  return (
    <>
      <Item>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">LOG IN</h1>
        <p className="mb-6 mt-1.5 text-muted">Welcome back — sign in to your Aurora account.</p>
      </Item>

      <form onSubmit={submit}>
        <Item>
          <div className="mb-3">
            <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
        </Item>
        <Item>
          <div className="mb-1">
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="mb-4 text-right">
            <Link href="/forgot" className="text-sm font-semibold text-forest hover:underline">Forgot password?</Link>
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
        <p className="mt-5 text-center text-sm text-muted">
          New to Aurora?{" "}
          <Link href="/signup" className="font-semibold text-forest hover:underline">Create an account</Link>
        </p>
      </Item>

      <Item>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-2">
          <span className="h-px flex-1 bg-line" /> OR PICK A DEMO PROFILE <span className="h-px flex-1 bg-line" />
        </div>
        <div className="flex flex-col gap-2.5">
          {DEMO_CLIENTS.map((c) => (
            <button
              key={c.email}
              onClick={() => quick(c.email)}
              disabled={busy}
              className="flex items-center justify-between rounded-[14px] bg-card px-4 py-3 text-left transition hover:bg-card-2 disabled:opacity-50"
            >
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted">{c.email}</div>
              </div>
              <ChevronRight className="text-muted-2" size={18} />
            </button>
          ))}
        </div>
      </Item>
    </>
  );
}
