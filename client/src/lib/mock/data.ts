export type AccountType = "Standard" | "Pro" | "Demo";

export interface Mt5Account {
  login: number;
  type: AccountType;
  server: string;
  leverage: string;
  balance: number;
  equity: number;
  credit: number;
  currency: string;
}

export type TxKind = "deposit" | "withdrawal" | "transfer" | "commission" | "bonus" | "trade";
export type TxStatus = "completed" | "pending" | "processing" | "rejected";

export interface Tx {
  id: string;
  kind: TxKind;
  title: string;
  subtitle: string;
  amount: number; // signed: +in / −out
  currency: string;
  date: string; // ISO
  status: TxStatus;
}

export interface Client {
  id: string;
  name: string;
  firstName: string;
  email: string;
  country: string;
  kycStatus: "approved" | "pending" | "unverified";
  initials: string;
}

export interface DB {
  client: Client;
  accounts: Mt5Account[];
  transactions: Tx[];
}

const iso = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

/** A set of demo clients you could sign in as (first one is the default). */
export const DEMO_CLIENTS: { email: string; name: string }[] = [
  { email: "mohammed@aurora.demo", name: "Mohammed Abshar" },
  { email: "navaneeth@aurora.demo", name: "Navaneeth K." },
  { email: "fami@aurora.demo", name: "Fami Shamsudeen" },
];

export function seed(): DB {
  return {
    client: {
      id: "2",
      name: "Mohammed Abshar",
      firstName: "Mohammed",
      email: "mohammed@aurora.demo",
      country: "AE",
      kycStatus: "pending",
      initials: "MA",
    },
    accounts: [
      { login: 920416, type: "Standard", server: "Aurora-Live", leverage: "1:100", balance: 24180, equity: 25384, credit: 0, currency: "USD" },
      { login: 921773, type: "Pro", server: "Aurora-Live", leverage: "1:200", balance: 13824, equity: 13824, credit: 4314.74, currency: "USD" },
      { login: 510088, type: "Demo", server: "Aurora-Demo", leverage: "1:500", balance: 10000, equity: 10000, credit: 0, currency: "USD" },
    ],
    transactions: [
      { id: "D-000742", kind: "deposit", title: "USDT deposit", subtitle: "CoinsBuy", amount: 1500, currency: "USD", date: iso(0), status: "completed" },
      { id: "T-19A2", kind: "transfer", title: "Transfer to MT5 920416", subtitle: "Wallet → Standard", amount: -500, currency: "USD", date: iso(1), status: "completed" },
      { id: "C-8821", kind: "commission", title: "IB commission", subtitle: "October run", amount: 42.5, currency: "USD", date: iso(2), status: "completed" },
      { id: "B-3310", kind: "bonus", title: "Credit bonus granted", subtitle: "Aurora promo", amount: 250, currency: "USD", date: iso(3), status: "completed" },
      { id: "W-000311", kind: "withdrawal", title: "Withdrawal to bank", subtitle: "Completed", amount: -820, currency: "USD", date: iso(5), status: "completed" },
    ],
  };
}
