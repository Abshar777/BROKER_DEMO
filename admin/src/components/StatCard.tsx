"use client";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon, label, value, sub, href, accent = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  href?: string;
  accent?: "neutral" | "green" | "warn";
}) {
  const body = (
    <motion.div
      whileHover={href ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={clsx(
        "flex h-full flex-col gap-3 rounded-[20px] border p-5 transition-colors",
        href && "cursor-pointer hover:border-forest/25",
        accent === "green" ? "border-green/40 bg-green-faint" : accent === "warn" ? "border-[#F0D9A8] bg-[#FDF8ED]" : "border-line bg-card",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={clsx(
          "grid h-10 w-10 place-items-center rounded-full",
          accent === "green" ? "bg-green text-forest" : accent === "warn" ? "bg-[#F6C65B] text-[#5A3E00]" : "bg-card-2 text-ink",
        )}>
          <Icon size={19} strokeWidth={2} />
        </span>
        {sub && <span className="text-xs font-semibold text-muted-2">{sub}</span>}
      </div>
      <div>
        <div className="num font-wise text-[26px] leading-none tracking-tight text-forest">{value}</div>
        <div className="mt-1.5 text-sm text-muted">{label}</div>
      </div>
    </motion.div>
  );
  return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}
