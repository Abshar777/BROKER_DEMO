"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, readAuth } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const init = useStore((s) => s.init);
  const setAuthed = useStore((s) => s.setAuthed);
  const router = useRouter();
  // Gate the first paint so SSR and the first client render agree (both null),
  // then read the persisted auth flag on the client only — avoids hydration mismatch.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (readAuth()) {
      setAuthed(true);
      init();
      setReady(true);
    } else {
      router.replace("/login");
    }
  }, [init, setAuthed, router]);

  if (!ready) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-[1320px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-5 pb-28 md:px-12 md:py-6 md:pb-16">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
