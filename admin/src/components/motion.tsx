"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.08, delayChildren: 0.06 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const rm = useReducedMotion();
  if (rm) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function Item({ children, className }: { children: React.ReactNode; className?: string }) {
  const rm = useReducedMotion();
  if (rm) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemV}>
      {children}
    </motion.div>
  );
}

/** Standalone fade+rise, no Stagger parent needed. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const rm = useReducedMotion();
  if (rm) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
