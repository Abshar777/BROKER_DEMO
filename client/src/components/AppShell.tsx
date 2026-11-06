"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Stagger } from "./motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const init = useStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1320px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-5 pb-28 md:px-12 md:py-6 md:pb-16">
        <TopBar />
        <Stagger className="max-w-[900px]">{children}</Stagger>
      </main>
    </div>
  );
}
