const EMOJI: Record<string, string> = {
  US: "🇺🇸", AE: "🇦🇪", EU: "🇪🇺", GB: "🇬🇧", SG: "🇸🇬", IN: "🇮🇳", KR: "🇰🇷", JP: "🇯🇵",
  VN: "🇻🇳", BR: "🇧🇷", IT: "🇮🇹", JO: "🇯🇴",
};

/** Round country flag badge (Wise-style). */
export function Flag({ cc, size = 26 }: { cc: string; size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center overflow-hidden rounded-full bg-card-2"
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: size * 1.18, lineHeight: 1 }}>{EMOJI[cc] ?? "🏳️"}</span>
    </span>
  );
}
