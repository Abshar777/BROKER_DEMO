"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";

const DKEY = "aurora-kyc-nudge-dismissed-v1";
const HIDE = ["/login", "/signup", "/verify", "/forgot", "/reset", "/kyc"];

/** Small dismissible popup card above the dock that nudges KYC while pending. */
export function KycNudge() {
  const pathname = usePathname();
  const kyc = useStore((s) => s.client?.kycStatus);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true); // hidden until we read storage

  useEffect(() => {
    setMounted(true);
    try { setDismissed(localStorage.getItem(DKEY) === "1"); } catch { setDismissed(false); }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DKEY, "1"); } catch {}
    setDismissed(true);
  };

  if (!mounted) return null;

  const onHidden = !pathname || pathname === "/" || HIDE.some((h) => pathname.startsWith(h));
  const show = !onHidden && !dismissed && !!kyc && kyc !== "approved";

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 30, delay: 0.4 } }}
          exit={{ y: 40, opacity: 0, transition: { duration: 0.2 } }}
          className="fixed z-[55] mx-auto w-[calc(100%-2rem)] max-w-[420px] md:left-auto md:right-6 md:mx-0 md:w-[360px]"
          style={{ bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))", left: "1rem", right: "1rem" }}
        >
          <div className="flex items-center gap-3 rounded-[18px] border border-line bg-white p-3.5 shadow-[0_10px_40px_rgba(13,15,10,0.14)]">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-green-light">
              <ShieldCheck size={22} className="text-forest" />
            </span>
            <Link href="/kyc" className="min-w-0 flex-1" onClick={dismiss}>
              <div className="flex items-center gap-1 font-semibold">
                Verify your identity <ChevronRight size={16} className="text-muted-2" />
              </div>
              <div className="truncate text-sm text-muted">Finish KYC to unlock withdrawals.</div>
            </Link>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="grid h-8 w-8 flex-none place-items-center rounded-full text-muted-2 transition hover:bg-card"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
