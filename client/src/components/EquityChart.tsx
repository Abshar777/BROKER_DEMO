"use client";
import { motion, useReducedMotion } from "framer-motion";

const LINE =
  "M0,150 L60,128 L120,138 L180,104 L240,116 L300,80 L360,94 L420,56 L480,66 L540,34 L600,42";
const AREA = LINE + " L600,200 L0,200 Z";

export function EquityChart() {
  const rm = useReducedMotion();
  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full" style={{ height: 176, overflow: "visible" }} aria-hidden>
      <defs>
        <linearGradient id="eqfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#163300" stopOpacity="0.16" />
          <stop offset="1" stopColor="#163300" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="60" x2="600" y2="60" stroke="#E7E8E3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="120" x2="600" y2="120" stroke="#E7E8E3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={AREA}
        fill="url(#eqfill)"
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path
        d={LINE}
        fill="none"
        stroke="#163300"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
      />
      {!rm && (
        <motion.circle
          cx="600"
          cy="42"
          r="6"
          fill="#9FE870"
          animate={{ opacity: [0.55, 0], scale: [1, 2.4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      <circle cx="600" cy="42" r="5" fill="#163300" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
