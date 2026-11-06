export interface Currency {
  code: string;
  symbol: string;
  cc: string; // flag country code
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", cc: "US", name: "US Dollar" },
  { code: "EUR", symbol: "€", cc: "EU", name: "Euro" },
  { code: "GBP", symbol: "£", cc: "GB", name: "British Pound" },
  { code: "AED", symbol: "د.إ", cc: "AE", name: "UAE Dirham" },
];

export const CURRENCY_BY_CODE: Record<string, Currency> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);
