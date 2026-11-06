import clsx from "clsx";

type Tone = "ok" | "warn" | "bad" | "neutral" | "info";

const TONES: Record<Tone, string> = {
  ok: "bg-green-light text-pos",
  warn: "bg-[#FDF0D5] text-[#9A6B00]",
  bad: "bg-[#FBE6E5] text-neg",
  neutral: "bg-card-2 text-muted",
  info: "bg-[#E4EEFB] text-[#1E5BB8]",
};

/** Map a domain status string to a tone + label. */
export function statusTone(s: string): { tone: Tone; label: string } {
  switch (s) {
    case "approved":
    case "completed":
    case "active": return { tone: "ok", label: cap(s) };
    case "pending": return { tone: "warn", label: "Pending" };
    case "processing": return { tone: "info", label: "Processing" };
    case "rejected":
    case "suspended": return { tone: "bad", label: cap(s) };
    case "unverified": return { tone: "neutral", label: "Unverified" };
    default: return { tone: "neutral", label: cap(s) };
  }
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const { tone, label } = statusTone(status);
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", TONES[tone], className)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", {
        "bg-pos": tone === "ok",
        "bg-[#C98A00]": tone === "warn",
        "bg-neg": tone === "bad",
        "bg-[#1E5BB8]": tone === "info",
        "bg-muted-2": tone === "neutral",
      })} />
      {label}
    </span>
  );
}
