"use client";
import { create } from "zustand";
import { DB } from "./mock/data";
import * as api from "./mock/api";

const AUTH_KEY = "aurora-admin-auth-v1";
/** Read persisted auth flag — browser only. Never call during render (SSR mismatch). */
export const readAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(AUTH_KEY) === "1"; } catch { return false; }
};
const writeAuth = (v: boolean) => {
  if (typeof window === "undefined") return;
  try { v ? localStorage.setItem(AUTH_KEY, "1") : localStorage.removeItem(AUTH_KEY); } catch {}
};

export interface Toast { id: number; msg: string; tone: "ok" | "bad" }

interface State {
  loaded: boolean;
  busy: boolean;
  busyId: string | null; // row currently being actioned
  authed: boolean;
  db: DB | null;
  toasts: Toast[];
  init: () => Promise<void>;
  setAuthed: (v: boolean) => void;
  signIn: (i: { email: string; password?: string }) => Promise<void>;
  signOut: () => void;
  reviewKyc: (id: string, d: "approved" | "rejected") => Promise<void>;
  reviewDeposit: (id: string, d: "approved" | "rejected") => Promise<void>;
  reviewWithdrawal: (id: string, d: "approved" | "rejected") => Promise<void>;
  toggleClient: (id: string) => Promise<void>;
  reset: () => Promise<void>;
  toast: (msg: string, tone?: "ok" | "bad") => void;
  dropToast: (id: number) => void;
}

export const useStore = create<State>((set, get) => ({
  loaded: false,
  busy: false,
  busyId: null,
  authed: false, // hydrated from localStorage after mount — never during SSR
  db: null,
  toasts: [],
  setAuthed: (v) => set({ authed: v }),
  init: async () => {
    if (get().loaded) return;
    const db = await api.fetchState();
    set({ db, loaded: true });
  },
  signIn: async (i) => {
    set({ busy: true });
    await api.login(i);
    const db = await api.fetchState();
    writeAuth(true);
    set({ db, authed: true, loaded: true, busy: false });
  },
  signOut: () => { writeAuth(false); set({ authed: false }); },

  reviewKyc: async (id, decision) => {
    set({ busyId: id });
    const db = await api.reviewKyc(id, decision);
    set({ db, busyId: null });
    get().toast(decision === "approved" ? "KYC approved" : "KYC rejected", decision === "approved" ? "ok" : "bad");
  },
  reviewDeposit: async (id, decision) => {
    set({ busyId: id });
    const db = await api.reviewDeposit(id, decision);
    set({ db, busyId: null });
    get().toast(decision === "approved" ? "Deposit approved" : "Deposit rejected", decision === "approved" ? "ok" : "bad");
  },
  reviewWithdrawal: async (id, decision) => {
    set({ busyId: id });
    const db = await api.reviewWithdrawal(id, decision);
    set({ db, busyId: null });
    get().toast(decision === "approved" ? "Withdrawal approved" : "Withdrawal rejected", decision === "approved" ? "ok" : "bad");
  },
  toggleClient: async (id) => {
    set({ busyId: id });
    const db = await api.toggleClient(id);
    set({ db, busyId: null });
    const c = db.clients.find((x) => x.id === id);
    get().toast(c?.status === "suspended" ? "Client suspended" : "Client reactivated", c?.status === "suspended" ? "bad" : "ok");
  },
  reset: async () => {
    const db = await api.resetDemo();
    set({ db });
    get().toast("Demo data reset", "ok");
  },

  toast: (msg, tone = "ok") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    set((s) => ({ toasts: [...s.toasts, { id, msg, tone }] }));
    setTimeout(() => get().dropToast(id), 3200);
  },
  dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Derived platform stats for the dashboard. */
export function useStats() {
  const db = useStore((s) => s.db);
  if (!db) return null;
  const active = db.clients.filter((c) => c.status === "active");
  return {
    clients: db.clients.length,
    activeClients: active.length,
    aum: db.clients.reduce((n, c) => n + c.equity, 0),
    pendingKyc: db.kyc.filter((k) => k.status === "pending").length,
    pendingDeposits: db.deposits.filter((r) => r.status === "pending").length,
    pendingWithdrawals: db.withdrawals.filter((r) => r.status === "pending").length,
    depositValue: db.deposits.filter((r) => r.status === "pending").reduce((n, r) => n + r.amount, 0),
    withdrawalValue: db.withdrawals.filter((r) => r.status === "pending").reduce((n, r) => n + r.amount, 0),
  };
}
