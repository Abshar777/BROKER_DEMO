"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/OtpInput";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import * as api from "@/lib/mock/api";
import { MailCheck } from "lucide-react";

export default function Verify() {
  const router = useRouter();
  const client = useStore((s) => s.client);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [left, setLeft] = useState(45);
  const [emailParam, setEmailParam] = useState("");
  const next = useRef("/dashboard");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("next");
    if (p) next.current = p;
    const em = q.get("email");
    if (em) setEmailParam(em);
  }, []);

  const shownEmail = emailParam || client?.email || "your email";

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const verify = async () => {
    setBusy(true);
    setErr("");
    const { ok } = await api.verifyOtp({ code });
    setBusy(false);
    if (!ok) return setErr("Enter the 6-digit code to continue");
    router.push(next.current);
  };

  const resend = async () => {
    if (left > 0) return;
    await api.sendOtp({ email: client?.email ?? "" });
    setLeft(45);
  };

  return (
    <>
      <Item>
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-light">
          <MailCheck size={26} className="text-forest" />
        </span>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">VERIFY EMAIL</h1>
        <p className="mb-6 mt-1.5 text-muted">
          We sent a 6-digit code to <b className="text-ink">{shownEmail}</b>. Enter it below.
        </p>
      </Item>

      <Item>
        <div className="mb-2">
          <OtpInput value={code} onChange={setCode} />
        </div>
        <p className="mb-5 text-xs text-muted-2">Demo tip — any 6 digits work.</p>
      </Item>

      <Item>
        {err && <p className="mb-2 text-sm text-neg">{err}</p>}
        <Button variant="primary" className="w-full py-3.5 text-[16px]" disabled={busy || code.length < 6} onClick={verify}>
          {busy ? "Verifying…" : "Verify"}
        </Button>
      </Item>

      <Item>
        <p className="mt-5 text-center text-sm text-muted">
          Didn't get it?{" "}
          {left > 0 ? (
            <span className="text-muted-2">Resend in {left}s</span>
          ) : (
            <button onClick={resend} className="font-semibold text-forest hover:underline">Resend code</button>
          )}
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/login" className="font-semibold text-forest hover:underline">Back to log in</Link>
        </p>
      </Item>
    </>
  );
}
