import { DB, seed, AdminTx } from "./data";

/**
 * Demo admin "API": in-memory dataset persisted to localStorage with simulated
 * latency. No network, no real backend — swap these for real HTTP later.
 */
const KEY = "aurora-admin-db-v1";
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

/* ----- KYC review ------------------------------------------------ */
export async function reviewKyc(id: string, decision: "approved" | "rejected"): Promise<DB> {
  await delay(650);
  const d = ensure();
  const req = d.kyc.find((k) => k.id === id);
  if (req) {
    req.status = decision;
    const c = d.clients.find((x) => x.id === req.clientId);
    if (c) c.kycStatus = decision === "approved" ? "approved" : "rejected";
  }
  persist();
  return clone(d);
}

/* ----- Deposit review -------------------------------------------- */
export async function reviewDeposit(id: string, decision: "approved" | "rejected"): Promise<DB> {
  await delay(650);
  const d = ensure();
  const req = d.deposits.find((r) => r.id === id);
  if (req) {
    req.status = decision;
    if (decision === "approved") {
      const c = d.clients.find((x) => x.id === req.clientId);
      if (c) { c.balance += req.amount; c.equity += req.amount; }
    }
    mark(d.ledger, req.clientId, "deposit", req.amount, decision);
  }
  persist();
  return clone(d);
}

/* ----- Withdrawal review ----------------------------------------- */
export async function reviewWithdrawal(id: string, decision: "approved" | "rejected"): Promise<DB> {
  await delay(650);
  const d = ensure();
  const req = d.withdrawals.find((r) => r.id === id);
  if (req) {
    req.status = decision;
    if (decision === "approved") {
      const c = d.clients.find((x) => x.id === req.clientId);
      if (c) { c.balance -= req.amount; c.equity -= req.amount; }
    }
    mark(d.ledger, req.clientId, "withdrawal", -req.amount, decision);
  }
  persist();
  return clone(d);
}

/* ----- Suspend / reactivate a client ----------------------------- */
export async function toggleClient(id: string): Promise<DB> {
  await delay(400);
  const d = ensure();
  const c = d.clients.find((x) => x.id === id);
  if (c) c.status = c.status === "active" ? "suspended" : "active";
  persist();
  return clone(d);
}

export async function resetDemo(): Promise<DB> {
  await delay(200);
  db = seed();
  persist();
  return clone(db);
}

/* ----- Admin auth (demo) ----------------------------------------- */
export async function login(_input: { email: string; password?: string }): Promise<{ ok: true }> {
  await delay(600);
  return { ok: true };
}

/** Flip the matching pending ledger row(s) to reflect a decision. */
function mark(
  ledger: AdminTx[], clientId: string, kind: "deposit" | "withdrawal",
  amount: number, decision: "approved" | "rejected",
) {
  const row = ledger.find((t) => t.clientId === clientId && t.kind === kind && t.status === "pending");
  if (row) row.status = decision === "approved" ? "completed" : "rejected";
}
