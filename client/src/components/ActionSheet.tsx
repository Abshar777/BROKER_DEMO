"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";

export interface ActionItem {
  key: string;
  icon: LucideIcon;
  label: string;
  sub?: string;
  tone?: string; // icon circle classes, e.g. "bg-green text-forest"
  onSelect: () => void;
}

const sheet = { type: "spring", damping: 32, stiffness: 320 } as const;

export function ActionSheet({
  open,
  onClose,
  title,
  items,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: ActionItem[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] w-full max-w-[520px] overflow-auto rounded-t-[24px] border border-line bg-white p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheet}
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom,0px))" }}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
            <h3 className="mb-3 px-1 font-semibold text-[20px]">{title}</h3>
            <motion.div
              className="flex flex-col gap-1.5"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
            >
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <motion.button
                    key={it.key}
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    onClick={() => { it.onSelect(); onClose(); }}
                    className="flex items-center gap-3.5 rounded-[16px] bg-card px-4 py-3.5 text-left transition hover:bg-card-2 active:scale-[.98]"
                  >
                    <span className={`grid h-11 w-11 flex-none place-items-center rounded-full ${it.tone ?? "bg-green text-forest"}`}>
                      <Icon size={21} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{it.label}</div>
                      {it.sub && <div className="truncate text-sm text-muted">{it.sub}</div>}
                    </div>
                    <ChevronRight size={18} className="text-muted-2" />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
