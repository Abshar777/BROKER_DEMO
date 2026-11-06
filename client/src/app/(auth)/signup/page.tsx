"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";

const COUNTRIES = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "SG", name: "Singapore" },
  { code: "AU", name: "Australia" },
];

export default function Signup() {
  const router = useRouter();
  const { signUp, busy } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("AE");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return setErr("Enter your full name");
    if (!email.trim()) return setErr("Enter your email");
    if (password.length < 6) return setErr("Use at least 6 characters for your password");
    setErr("");
    await signUp({ name, email, country, password });
    router.push("/verify");
  };

  return (
    <>
      <Item>
        <h1 className="font-wise text-[34px] leading-[1.1] tracking-tight text-forest">CREATE ACCOUNT</h1>
        <p className="mb-6 mt-1.5 text-muted">Open your Aurora account in under a minute.</p>
      </Item>

      <form onSubmit={submit}>
        <Item>
          <div className="mb-3">
            <Input label="Full name" placeholder="Jane Trader" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
        </Item>
        <Item>
          <div className="mb-3">
            <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
        </Item>
        <Item>
          <label className="mb-3 block">
            <div className="mb-1.5 text-sm font-semibold text-muted">Country of residence</div>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="input appearance-none bg-white">
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </label>
        </Item>
        <Item>
          <div className="mb-4">
            <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
        </Item>
        <Item>
          {err && <p className="mb-2 text-sm text-neg">{err}</p>}
          <Button variant="primary" type="submit" className="w-full py-3.5 text-[16px]" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-2">
            By continuing you agree to Aurora's demo Terms & Privacy Policy.
          </p>
        </Item>
      </form>

      <Item>
        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-forest hover:underline">Log in</Link>
        </p>
      </Item>
    </>
  );
}
