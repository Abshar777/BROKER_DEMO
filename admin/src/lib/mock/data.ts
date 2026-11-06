/* ---------------------------------------------------------------- *
 * Aurora Admin — demo dataset. In-memory, persisted to localStorage.
 * No real backend, no real PII. Swap for real HTTP later; UI unchanged.
 * ---------------------------------------------------------------- */

export type KycStatus = "approved" | "pending" | "rejected" | "unverified";
export type Tier = "Standard" | "Pro" | "Demo";
export type ClientStatus = "active" | "suspended";
export type ReqStatus = "pending" | "approved" | "rejected";
export type TxKind = "deposit" | "withdrawal" | "transfer" | "commission" | "bonus";

export interface Client {
  id: string;
  name: string;
  email: string;
  country: string; // ISO-2
  tier: Tier;
  kycStatus: KycStatus;
  status: ClientStatus;
  balance: number;
  equity: number;
  registered: string; // ISO
  initials: string;
}

export interface KycRequest {
  id: string;
  clientId: string;
  name: string;
  email: string;
  country: string;
  docType: "Passport" | "National ID" | "Driver's licence";
  submitted: string; // ISO
  status: ReqStatus;
}

export interface MoneyRequest {
  id: string;
  clientId: string;
  name: string;
  method: string;
  amount: number;
  login: number;
  requested: string; // ISO
  status: ReqStatus;
}

export interface AdminTx {
  id: string;
  clientId: string;
  clientName: string;
  kind: TxKind;
  amount: number; // signed
  date: string; // ISO
  status: "completed" | "processing" | "pending" | "rejected";
}

export interface DB {
  clients: Client[];
  kyc: KycRequest[];
  deposits: MoneyRequest[];
  withdrawals: MoneyRequest[];
  ledger: AdminTx[];
}

const iso = (minsAgo: number) => new Date(Date.now() - minsAgo * 60000).toISOString();
const inits = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "··";

const C = (
  id: string, name: string, email: string, country: string, tier: Tier,
  kycStatus: KycStatus, status: ClientStatus, balance: number, equity: number, daysAgo: number,
): Client => ({ id, name, email, country, tier, kycStatus, status, balance, equity, registered: iso(daysAgo * 1440), initials: inits(name) });

export function seed(): DB {
  const clients: Client[] = [
    C("AX-1042", "Mohammed Abshar", "mohammed@aurora.demo", "AE", "Standard", "pending", "active", 24180, 25384, 12),
    C("AX-1043", "Navaneeth Krishna", "navaneeth@aurora.demo", "IN", "Pro", "approved", "active", 61240, 63012, 48),
    C("AX-1044", "Fami Shamsudeen", "fami@aurora.demo", "IN", "Standard", "pending", "active", 3820, 3820, 2),
    C("AX-1045", "Aisha Al Mansoori", "aisha@aurora.demo", "AE", "Pro", "approved", "active", 128900, 131450, 95),
    C("AX-1046", "Daniel Osei", "daniel@aurora.demo", "GB", "Standard", "unverified", "active", 0, 0, 1),
    C("AX-1047", "Linh Tran", "linh@aurora.demo", "VN", "Standard", "pending", "active", 9400, 9712, 6),
    C("AX-1048", "Carlos Mendes", "carlos@aurora.demo", "BR", "Pro", "approved", "suspended", 15600, 14980, 70),
    C("AX-1049", "Sofia Rossi", "sofia@aurora.demo", "IT", "Standard", "approved", "active", 7320, 7510, 33),
    C("AX-1050", "Omar Haddad", "omar@aurora.demo", "JO", "Standard", "rejected", "active", 500, 500, 4),
    C("AX-1051", "Grace Wong", "grace@aurora.demo", "SG", "Pro", "approved", "active", 54120, 55890, 120),
    C("AX-1052", "Ethan Walker", "ethan@aurora.demo", "US", "Standard", "pending", "active", 2100, 2100, 1),
    C("AX-1053", "Yuki Tanaka", "yuki@aurora.demo", "JP", "Pro", "approved", "active", 38750, 39210, 61),
  ];

  const kyc: KycRequest[] = [
    { id: "K-7781", clientId: "AX-1044", name: "Fami Shamsudeen", email: "fami@aurora.demo", country: "IN", docType: "Passport", submitted: iso(18), status: "pending" },
    { id: "K-7782", clientId: "AX-1042", name: "Mohammed Abshar", email: "mohammed@aurora.demo", country: "AE", docType: "National ID", submitted: iso(44), status: "pending" },
    { id: "K-7783", clientId: "AX-1047", name: "Linh Tran", email: "linh@aurora.demo", country: "VN", docType: "Passport", submitted: iso(126), status: "pending" },
    { id: "K-7784", clientId: "AX-1052", name: "Ethan Walker", email: "ethan@aurora.demo", country: "US", docType: "Driver's licence", submitted: iso(310), status: "pending" },
  ];

  const deposits: MoneyRequest[] = [
    { id: "D-44120", clientId: "AX-1043", name: "Navaneeth Krishna", method: "USDT (CoinsBuy)", amount: 5000, login: 921773, requested: iso(9), status: "pending" },
    { id: "D-44121", clientId: "AX-1045", name: "Aisha Al Mansoori", method: "Bank transfer", amount: 20000, login: 930114, requested: iso(52), status: "pending" },
    { id: "D-44122", clientId: "AX-1051", name: "Grace Wong", method: "Card", amount: 1500, login: 940233, requested: iso(140), status: "pending" },
  ];

  const withdrawals: MoneyRequest[] = [
    { id: "W-88301", clientId: "AX-1043", name: "Navaneeth Krishna", method: "Bank transfer", amount: 3200, login: 921773, requested: iso(21), status: "pending" },
    { id: "W-88302", clientId: "AX-1053", name: "Yuki Tanaka", method: "USDT (CoinsBuy)", amount: 8000, login: 950781, requested: iso(88), status: "pending" },
    { id: "W-88303", clientId: "AX-1045", name: "Aisha Al Mansoori", method: "Bank transfer", amount: 45000, login: 930114, requested: iso(205), status: "pending" },
  ];

  const ledger: AdminTx[] = [
    { id: "T-50021", clientId: "AX-1043", clientName: "Navaneeth Krishna", kind: "deposit", amount: 5000, date: iso(9), status: "pending" },
    { id: "T-50020", clientId: "AX-1049", clientName: "Sofia Rossi", kind: "deposit", amount: 2000, date: iso(30), status: "completed" },
    { id: "T-50019", clientId: "AX-1043", clientName: "Navaneeth Krishna", kind: "withdrawal", amount: -3200, date: iso(21), status: "processing" },
    { id: "T-50018", clientId: "AX-1051", clientName: "Grace Wong", kind: "commission", amount: 180.4, date: iso(60), status: "completed" },
    { id: "T-50017", clientId: "AX-1053", clientName: "Yuki Tanaka", kind: "transfer", amount: -1200, date: iso(95), status: "completed" },
    { id: "T-50016", clientId: "AX-1045", clientName: "Aisha Al Mansoori", kind: "deposit", amount: 20000, date: iso(52), status: "pending" },
    { id: "T-50015", clientId: "AX-1048", clientName: "Carlos Mendes", kind: "bonus", amount: 250, date: iso(180), status: "completed" },
    { id: "T-50014", clientId: "AX-1050", clientName: "Omar Haddad", kind: "deposit", amount: 500, date: iso(230), status: "completed" },
    { id: "T-50013", clientId: "AX-1053", clientName: "Yuki Tanaka", kind: "withdrawal", amount: -8000, date: iso(88), status: "pending" },
    { id: "T-50012", clientId: "AX-1051", clientName: "Grace Wong", kind: "deposit", amount: 1500, date: iso(140), status: "pending" },
  ];

  return { clients, kyc, deposits, withdrawals, ledger };
}
