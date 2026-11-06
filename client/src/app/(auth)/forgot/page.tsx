"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Item } from "@/components/motion";
import * as api from "@/lib/mock/api";
import { KeyRound } from "lucide-react";

export default function Forgot() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return setErr("Enter your email");
    setErr("");
    setBusy(true);
    await api.sendOtp({ email });
    setBusy(false);
    router.push(`/verify?next=/reset&email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Item>
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-light">
          <KeyRound size={24} className="text-forest" />
        </span>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">RESET PASSWORD</h1>
        <p className="mb-6 mt-1.5 text-muted">Enter your email and we'll send you a code to reset your password.</p>
      </Item>

      <form onSubmit={submit}>
        <Item>
          <div className="mb-4">
            <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
        </Item>
        <Item>
          {err && <p className="mb-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" type="submit" className="w-full py-3.5 text-[16px]" disabled={busy}>
            {busy ? "Sending code…" : "Send reset code"}
          </Button>
        </Item>
      </form>

      <Item>
        <p className="mt-5 text-center text-sm">
          <Link href="/login" className="font-semibold text-forest hover:underline">Back to log in</Link>
        </p>
      </Item>
    </>
  );
}
