"use client";
import { create } from "zustand";
import { DB, Mt5Account, Tx } from "./mock/data";
import * as api from "./mock/api";

const AUTH_KEY = "aurora-demo-auth-v1";
/** Read persisted auth flag — browser only. Never call during render (SSR mismatch). */
export const readAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(AUTH_KEY) === "1"; } catch { return false; }
};
const writeAuth = (v: boolean) => {
  if (typeof window === "undefined") return;
  try { v ? localStorage.setItem(AUTH_KEY, "1") : localStorage.removeItem(AUTH_KEY); } catch {}
};

interface State {
  loaded: boolean;
  busy: boolean;
  authed: boolean;
  client: DB["client"] | null;
  accounts: Mt5Account[];
  transactions: Tx[];
  init: () => Promise<void>;
  setAuthed: (v: boolean) => void;
  signIn: (i: { email: string; password?: string }) => Promise<void>;
  signUp: (i: { name: string; email: string; country: string; password?: string }) => Promise<void>;
  signOut: () => void;
  deposit: (i: { amount: number; method: string; login: number }) => Promise<void>;
  withdraw: (i: { amount: number; method: string; login: number }) => Promise<void>;
  transfer: (i: { from: number; to: number; amount: number }) => Promise<void>;
  submitKyc: () => Promise<void>;
  reset: () => Promise<void>;
}

const apply = (d: DB) => ({ client: d.client, accounts: d.accounts, transactions: d.transactions });

export const useStore = create<State>((set, get) => ({
  loaded: false,
  busy: false,
  authed: false, // hydrated from localStorage after mount (see app layout) — never during SSR
  client: null,
  accounts: [],
  transactions: [],
  setAuthed: (v) => set({ authed: v }),
  init: async () => {
    if (get().loaded) return;
    const d = await api.fetchState();
    set({ ...apply(d), loaded: true });
  },
  signIn: async (i) => {
    set({ busy: true });
    const d = await api.login(i);
    writeAuth(true);
    set({ ...apply(d), authed: true, loaded: true, busy: false });
  },
  signUp: async (i) => {
    set({ busy: true });
    const d = await api.signup(i);
    writeAuth(true);
    set({ ...apply(d), authed: true, loaded: true, busy: false });
  },
  signOut: () => {
    writeAuth(false);
    set({ authed: false });
  },
  deposit: async (i) => { set({ busy: true }); const d = await api.deposit(i); set({ ...apply(d), busy: false }); },
  withdraw: async (i) => { set({ busy: true }); const d = await api.withdraw(i); set({ ...apply(d), busy: false }); },
  transfer: async (i) => { set({ busy: true }); const d = await api.transfer(i); set({ ...apply(d), busy: false }); },
  submitKyc: async () => { set({ busy: true }); const d = await api.submitKyc(); set({ ...apply(d), busy: false }); },
  reset: async () => { const d = await api.resetDemo(); set({ ...apply(d) }); },
}));

export function useTotals() {
  const accounts = useStore((s) => s.accounts);
  return {
    equity: accounts.reduce((n, a) => n + a.equity, 0),
    balance: accounts.reduce((n, a) => n + a.balance, 0),
    credit: accounts.reduce((n, a) => n + a.credit, 0),
  };
}
