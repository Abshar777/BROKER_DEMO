"use client";
import { useRef } from "react";
import clsx from "clsx";

export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, length));
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) { setAt(i, ""); return; }
    if (raw.length > 1) {
      // Pasted / multi-char: spread across boxes from here.
      const merged = (digits.slice(0, i).join("") + raw).replace(/\D/g, "").slice(0, length);
      onChange(merged);
      const focusAt = Math.min(merged.length, length - 1);
      refs.current[focusAt]?.focus();
      return;
    }
    setAt(i, raw);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          maxLength={length}
          aria-label={`Digit ${i + 1}`}
          className={clsx(
            "num h-14 w-full rounded-[14px] border bg-white text-center text-[22px] font-semibold outline-none transition",
            d ? "border-forest" : "border-line",
            "focus:border-forest focus:ring-2 focus:ring-green-light",
          )}
        />
      ))}
    </div>
  );
}
