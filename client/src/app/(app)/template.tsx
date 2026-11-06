"use client";
import { Stagger } from "@/components/motion";

/**
 * Re-mounts on every navigation, so each page re-runs the staggered entrance:
 * its direct <Item> children cascade in one after another.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <Stagger className="max-w-[900px]">{children}</Stagger>;
}
