"use client";
import { Stagger } from "@/components/motion";

/** Re-mounts on each navigation so direct <Item> children re-run the stagger entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <Stagger className="max-w-[1180px]">{children}</Stagger>;
}
