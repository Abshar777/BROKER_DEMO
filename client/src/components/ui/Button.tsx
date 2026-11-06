"use client";
import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={clsx(
        "font-semibold inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-green text-forest hover:bg-green-press",
        variant === "secondary" && "bg-green-light text-forest hover:brightness-95",
        variant === "ghost" && "bg-card text-ink hover:bg-card-2",
        className,
      )}
    />
  );
}
