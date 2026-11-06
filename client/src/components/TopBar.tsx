"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ChevronRight } from "lucide-react";

export function TopBar() {
  const client = useStore((s) => s.client);
  return (
    <div className="mb-6 flex h-11 items-center justify-end gap-3.5">
      <span className="rounded-full bg-green-light px-4 py-2 text-sm font-semibold text-forest">
        Earn US$115
      </span>
      <Link href="/profile" aria-label="Open profile" className="flex items-center gap-2 rounded-full transition hover:opacity-80">
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-card-2 text-sm font-semibold">
          {client?.initials ?? "··"}
          <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e8673b]" />
        </span>
        <ChevronRight size={18} className="text-[#333]" />
      </Link>
    </div>
  );
}
