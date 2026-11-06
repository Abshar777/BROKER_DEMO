"use client";
import { usePathname } from "next/navigation";
import { BottomDock } from "./BottomDock";

const HIDE = ["/login", "/signup", "/verify", "/forgot", "/reset"];

/** Renders the persistent bottom dock on authed pages only (not auth/root). */
export function DockGate() {
  const p = usePathname();
  if (!p || p === "/" || HIDE.some((h) => p.startsWith(h))) return null;
  return <BottomDock />;
}
