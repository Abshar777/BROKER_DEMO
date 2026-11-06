import { DB, seed, DEMO_CLIENTS } from "./data";
import { uid } from "../format";

/**
 * Demo "API": in-memory dataset persisted to localStorage, with simulated
 * latency. No network, no real backend — swap these functions for real HTTP
 * calls later and the UI is unchanged.
 */
const KEY = "aurora-demo-db-v2";
let db: DB | null = null;

function ensure(): DB {
  if (db) return db;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { db = JSON.parse(raw) as DB; return db; }
    } catch {}
  }
  db = seed();
  return db;
}
function persist() {
  if (typeof window !== "undefined" && db) {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  }
}
const clone = (d: DB) => JSON.parse(JSON.stringify(d)) as DB;
const delay = (ms = 420) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchState(): Promise<DB> {
  await delay(260);
  return clone(ensure());
}

export async function deposit(input: { amount: number; method: string; login: number }): Promise<DB> {
  await delay();
  const d = ensure();
  const acc = d.accounts.find((a) => a.login === input.login) ?? d.accounts[0];
  acc.balance += input.amount;
  acc.equity += input.amount;
  d.transactions.unshift({
    id: uid("D"), kind: "deposit", title: `${input.method} deposit`,
    subtitle: `To ${acc.type} · ${acc.login}`, amount: input.amount, currency: "USD",
    date: new Date().toISOString(), status: "completed",
  });
  persist();
  return clone(d);
}

export async function withdraw(input: { amount: number; method: string; login: number }): Promise<DB> {
  await delay();
  const d = ensure();
  const acc = d.accounts.find((a) => a.login === input.login) ?? d.accounts[0];
  acc.balance -= input.amount;
  acc.equity -= input.amount;
  d.transactions.unshift({
    id: uid("W"), kind: "withdrawal", title: `Withdrawal · ${input.method}`,
    subtitle: `From ${acc.type} · ${acc.login}`, amount: -input.amount, currency: "USD",
    date: new Date().toISOString(), status: "processing",
  });
  persist();
  return clone(d);
}

export async function transfer(input: { from: number; to: number; amount: number }): Promise<DB> {
  await delay();
  const d = ensure();
  const from = d.accounts.find((a) => a.login === input.from);
  const to = d.accounts.find((a) => a.login === input.to);
  if (from) { from.balance -= input.amount; from.equity -= input.amount; }
  if (to) { to.balance += input.amount; to.equity += input.amount; }
  d.transactions.unshift({
    id: uid("T"), kind: "transfer",
    title: `Transfer ${input.from} → ${input.to}`,
    subtitle: `${from?.type ?? ""} → ${to?.type ?? ""}`, amount: -input.amount, currency: "USD",
    date: new Date().toISOString(), status: "completed",
  });
  persist();
  return clone(d);
}

export async function resetDemo(): Promise<DB> {
  await delay(200);
  db = seed();
  persist();
  return clone(db);
}

/* ---------------------------------------------------------------- *
 * Demo auth "API" — no real backend. Any credentials are accepted;
 * OTP accepts any 6 digits. Swap for real HTTP later, UI unchanged.
 * ---------------------------------------------------------------- */
const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "··";

export async function login(input: { email: string; password?: string }): Promise<DB> {
  await delay(600);
  const d = ensure();
  // Match a known demo client by email, else keep the seed identity.
  const known = DEMO_CLIENTS.find((c) => c.email.toLowerCase() === input.email.trim().toLowerCase());
  if (known) {
    d.client.name = known.name;
    d.client.firstName = known.name.split(" ")[0];
    d.client.email = known.email;
    d.client.initials = initials(known.name);
    persist();
  }
  return clone(d);
}

export async function signup(input: { name: string; email: string; country: string; password?: string }): Promise<DB> {
  await delay(700);
  const d = ensure();
  d.client.name = input.name.trim() || d.client.name;
  d.client.firstName = d.client.name.split(" ")[0];
  d.client.email = input.email.trim() || d.client.email;
  d.client.country = input.country || d.client.country;
  d.client.initials = initials(d.client.name);
  d.client.kycStatus = "unverified";
  persist();
  return clone(d);
}

export async function sendOtp(_input: { email: string }): Promise<{ sent: true }> {
  await delay(500);
  return { sent: true };
}

export async function verifyOtp(input: { code: string }): Promise<{ ok: boolean }> {
  await delay(650);
  // Demo: accept any 6-digit code.
  return { ok: /^\d{6}$/.test(input.code.trim()) };
}

export async function resetPassword(_input: { password: string }): Promise<{ ok: true }> {
  await delay(650);
  return { ok: true };
}

export async function submitKyc(): Promise<DB> {
  await delay(900);
  const d = ensure();
  d.client.kycStatus = "approved";
  persist();
  return clone(d);
}
