"use client";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { RotateCcw, LogOut } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const reset = useStore((s) => s.reset);
  const signOut = useStore((s) => s.signOut);

  const onReset = async () => { await reset(); };
  const onSignOut = () => { signOut(); router.replace("/login"); };

  return (
    <div className="mb-6 flex h-11 items-center justify-between gap-3">
      <span className="hidden text-sm text-muted md:block">Operations console</span>
      <div className="ml-auto flex items-center gap-2.5">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-card-2 active:scale-95"
        >
          <RotateCcw size={15} /> Reset demo
        </button>
        <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[13px] font-semibold text-green">AO</span>
          <span className="pr-1 text-sm font-semibold">Admin</span>
        </span>
        <button
          onClick={onSignOut}
          aria-label="Sign out"
          className="grid h-10 w-10 place-items-center rounded-full bg-card text-muted transition hover:bg-card-2 hover:text-neg active:scale-95"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}
