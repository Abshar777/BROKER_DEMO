"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Item } from "@/components/motion";
import * as api from "@/lib/mock/api";
import { CheckCircle2 } from "lucide-react";

export default function Reset() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pw.length < 6) return setErr("Use at least 6 characters");
    if (pw !== confirm) return setErr("Passwords don't match");
    setErr("");
    setBusy(true);
    await api.resetPassword({ password: pw });
    setBusy(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Item>
          <span className="grid h-16 w-16 place-items-center rounded-full bg-green">
            <CheckCircle2 size={32} className="text-forest" />
          </span>
        </Item>
        <Item>
          <h1 className="font-wise text-[30px] tracking-tight text-forest">PASSWORD RESET</h1>
          <p className="mt-1.5 text-muted">Your password has been updated. You can now log in.</p>
        </Item>
        <Item>
          <Button variant="primary" className="mt-2 px-8 py-3.5" onClick={() => router.push("/login")}>
            Back to log in
          </Button>
        </Item>
      </div>
    );
  }

  return (
    <>
      <Item>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">NEW PASSWORD</h1>
        <p className="mb-6 mt-1.5 text-muted">Choose a new password for your account.</p>
      </Item>

      <form onSubmit={submit}>
        <Item>
          <div className="mb-3">
            <Input label="New password" type="password" placeholder="At least 6 characters" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          </div>
        </Item>
        <Item>
          <div className="mb-4">
            <Input label="Confirm password" type="password" placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
        </Item>
        <Item>
          {err && <p className="mb-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" type="submit" className="w-full py-3.5 text-[16px]" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </Button>
        </Item>
      </form>
    </>
  );
}
