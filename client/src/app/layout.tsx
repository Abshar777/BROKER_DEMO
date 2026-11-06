import "./globals.css";
import type { Metadata } from "next";
import { DockGate } from "@/components/DockGate";
import { TopLoader } from "@/components/TopLoader";
import { KycNudge } from "@/components/KycNudge";

export const metadata: Metadata = {
  title: "Aurora",
  description: "Aurora — trading client portal (demo)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopLoader />
        {children}
        <DockGate />
        <KycNudge />
      </body>
    </html>
  );
}
