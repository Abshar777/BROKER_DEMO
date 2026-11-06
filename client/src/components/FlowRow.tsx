"use client";

export function FlowRow({
  icon,
  label,
  value,
  sub,
  onChange,
  changeLabel = "Change",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  onChange?: () => void;
  changeLabel?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-t border-line py-4 first:border-t-0">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-card text-ink">{icon}</span>
      <div className="min-w-0">
        <div className="text-sm text-muted">{label}</div>
        <div className="font-semibold">{value}</div>
        {sub && <div className="text-sm text-pos">{sub}</div>}
      </div>
      {onChange && (
        <button
          onClick={onChange}
          className="ml-auto flex-none rounded-full bg-green-light px-4 py-2 text-sm font-semibold text-forest transition hover:brightness-95"
        >
          {changeLabel}
        </button>
      )}
    </div>
  );
}
