"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CountUp({ value, dp = 2 }: { value: number; dp?: number }) {
  const rm = useReducedMotion();
  const [n, setN] = useState(rm ? value : 0);
  const prev = useRef(0);

  useEffect(() => {
    if (rm) { setN(value); prev.current = value; return; }
    const from = prev.current;
    const to = value;
    const dur = 1100;
    let start: number | undefined;
    let raf = 0;
    const tick = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, rm]);

  return <>{n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}</>;
}
