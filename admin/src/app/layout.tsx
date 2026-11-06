import "./globals.css";
import type { Metadata } from "next";
import { TopLoader } from "@/components/TopLoader";
import { Toasts } from "@/components/Toasts";
import { DockGate } from "@/components/DockGate";

export const metadata: Metadata = {
  title: "Aurora Admin",
  description: "Aurora — operations console (demo)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopLoader />
        {children}
        <DockGate />
        <Toasts />
      </body>
    </html>
  );
}
