"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Item } from "./motion";

/** Back-arrow + title header for sub-pages. */
export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  const router = useRouter();
  return (
    <Item>
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card transition hover:bg-card-2 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-semibold text-[26px] leading-tight">{title}</h1>
          {sub && <p className="text-sm text-muted">{sub}</p>}
        </div>
      </div>
    </Item>
  );
}
