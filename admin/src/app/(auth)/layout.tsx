import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-16 items-center border-b border-line px-6">
        <Link href="/login" className="flex items-center gap-2">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-forest">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden>
              <path d="M4 15c3 0 3.6-8 8-8s5 8 8 8" stroke="#9FE870" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          <b className="font-wise text-[22px] text-forest">Aurora</b>
          <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green">Admin</span>
        </Link>
      </header>

      <main className="grid flex-1 place-items-center px-5 py-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>

      <footer className="px-6 py-5 text-center text-xs text-muted-2">
        Demo environment · no real accounts, payments or messages
      </footer>
    </div>
  );
}
