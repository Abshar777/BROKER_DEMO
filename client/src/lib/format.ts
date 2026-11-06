export const usd = (n: number, dp = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

/** "$1,234.00" / "−$80.00" (signed by value) */
export const money = (n: number) => `${n < 0 ? "−" : ""}$${usd(Math.abs(n))}`;

/** Always prefixed with + / − for ledger rows */
export const signed = (n: number) => `${n >= 0 ? "+" : "−"}$${usd(Math.abs(n))}`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

export const fmtDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const uid = (p = "T") => p + Math.random().toString(36).slice(2, 8).toUpperCase();
