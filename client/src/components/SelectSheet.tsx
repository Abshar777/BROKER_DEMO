"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export interface SheetOption {
  key: string | number;
  node: React.ReactNode;
}

export function SelectSheet({
  open,
  onClose,
  title,
  options,
  selectedKey,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  options: SheetOption[];
  selectedKey: string | number;
  onSelect: (key: string | number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
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
            className="absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] w-full max-w-[520px] overflow-auto rounded-t-[22px] border border-line bg-white p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom,0px))" }}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
            <h3 className="mb-2 px-1 font-semibold text-[18px]">{title}</h3>
            <div className="flex flex-col">
              {options.map((o) => {
                const on = o.key === selectedKey;
                return (
                  <button
                    key={o.key}
                    onClick={() => {
                      onSelect(o.key);
                      onClose();
                    }}
                    className={`flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition ${on ? "bg-green-faint" : "hover:bg-card"}`}
                  >
                    {o.node}
                    {on && <Check size={20} className="ml-auto flex-none text-forest" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  if (!mounted) return null;
  return createPortal(content, document.body);
}
