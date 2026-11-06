"use client";
import { InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className, type = "text", ...props }: Props) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block">
      {label && <div className="mb-1.5 text-sm font-semibold text-muted">{label}</div>}
      <div className="relative">
        <input
          {...props}
          type={isPw && show ? "text" : type}
          className={clsx("input", isPw && "pr-11", className)}
        />
        {isPw && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2 transition hover:text-ink"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  );
}
