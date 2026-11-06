"use client";
import { Stagger } from "@/components/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return <Stagger>{children}</Stagger>;
}
