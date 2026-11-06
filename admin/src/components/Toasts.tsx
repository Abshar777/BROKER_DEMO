"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useStore } from "@/lib/store";

/** Bottom-right stack of action confirmations. Portaled to <body>. */
export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  const drop = useStore((s) => s.dropToast);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            onClick={() => drop(t.id)}
            className="pointer-events-auto flex items-center gap-3 rounded-[16px] border border-line bg-white py-3 pl-3 pr-4 shadow-[0_12px_40px_rgba(13,15,10,0.16)]"
          >
            <span className={`grid h-8 w-8 flex-none place-items-center rounded-full ${t.tone === "ok" ? "bg-green text-forest" : "bg-[#FBE6E5] text-neg"}`}>
              {t.tone === "ok" ? <Check size={17} /> : <X size={17} />}
            </span>
            <span className="text-sm font-semibold">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
