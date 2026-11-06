"use client";
import clsx from "clsx";

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={clsx(
        "relative h-7 w-12 flex-none rounded-full transition-colors duration-200",
        on ? "bg-green" : "bg-line",
      )}
    >
      <span
        className={clsx(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200",
          on ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}
