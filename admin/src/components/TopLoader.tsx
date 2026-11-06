"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Thin progress bar that sweeps across the top on every route change. */
export function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const first = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (first.current) { first.current = false; return; } // skip initial mount
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <AnimatePresence>
        {loading && (
          <motion.div
            key={pathname}
            className="h-full origin-left rounded-r-full bg-green shadow-[0_0_10px_rgba(159,232,112,0.9)]"
            style={{ transformOrigin: "left" }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: [0, 0.75, 1], opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
