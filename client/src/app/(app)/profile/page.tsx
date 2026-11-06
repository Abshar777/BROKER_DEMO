"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Flag } from "@/components/Flag";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import { User, ShieldCheck, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, BadgeCheck } from "lucide-react";

const KYC: Record<string, { label: string; cls: string }> = {
  approved: { label: "Verified", cls: "bg-green-light text-pos" },
  pending: { label: "In review", cls: "bg-[#FFF3D6] text-[#9A6B00]" },
  unverified: { label: "Unverified", cls: "bg-card-2 text-muted" },
};

const MENU = [
  { icon: User, label: "Personal details", sub: "Name, email, country", href: "/profile/personal" },
  { icon: ShieldCheck, label: "Security", sub: "Password, 2-factor, devices", href: "/profile/security" },
  { icon: CreditCard, label: "Payment methods", sub: "Cards & crypto wallets", href: "/profile/payment" },
  { icon: Bell, label: "Notifications", sub: "Email & push alerts", href: "/profile/notifications" },
  { icon: HelpCircle, label: "Help & support", sub: "FAQs, contact us", href: "/support" },
];

export default function Profile() {
  const router = useRouter();
  const client = useStore((s) => s.client);
  const signOut = useStore((s) => s.signOut);
  const status = client?.kycStatus ?? "unverified";
  const kyc = KYC[status];
  const verified = status === "approved";

  const logout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <>
      <Item>
        <h1 className="mb-5 font-semibold text-[30px]">Profile</h1>
      </Item>

      <Item>
        <Card className="mb-4 flex items-center gap-4 border border-line bg-white p-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-green text-[22px] font-semibold text-forest">
            {client?.initials ?? "··"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[20px] font-semibold">{client?.name ?? "Guest"}</div>
            <div className="truncate text-sm text-muted">{client?.email ?? "—"}</div>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${kyc.cls}`}>
            <BadgeCheck size={14} /> {kyc.label}
          </span>
        </Card>
      </Item>

      {!verified && (
        <Item>
          <Link href="/kyc" className="mb-4 block">
            <Card className="flex items-center gap-3.5 border border-[#F0D98A] bg-[#FFF8E8] p-4 transition hover:brightness-[.99]">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#FFE7A8] text-[#9A6B00]">
                <ShieldCheck size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#7A5600]">Finish verifying your identity</div>
                <div className="truncate text-sm text-[#9A6B00]">Complete KYC to unlock withdrawals.</div>
              </div>
              <ChevronRight size={18} className="text-[#9A6B00]" />
            </Card>
          </Link>
        </Item>
      )}

      <Item>
        <Card className="mb-4 flex items-center justify-between border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <Flag cc={client?.country ?? "AE"} size={34} />
            <div>
              <div className="text-sm text-muted">Country of residence</div>
              <div className="font-semibold">{client?.country ?? "—"}</div>
            </div>
          </div>
          <span className="rounded-full bg-card px-3 py-1.5 text-sm font-semibold">Aurora ID · {client?.id ?? "—"}</span>
        </Card>
      </Item>

      <Item>
        <Card className="overflow-hidden border border-line bg-white">
          {MENU.map(({ icon: Icon, label, sub, href }) => (
            <Link
              key={label}
              href={href}
              className="flex w-full items-center gap-3.5 border-t border-line px-5 py-4 text-left transition first:border-t-0 hover:bg-card"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card">
                <Icon size={18} className="text-forest" />
              </span>
              <div className="flex-1">
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-muted">{sub}</div>
              </div>
              <ChevronRight size={18} className="text-muted-2" />
            </Link>
          ))}
        </Card>
      </Item>

      <Item>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line py-3.5 font-semibold text-neg transition hover:bg-[#FBEDEC]"
        >
          <LogOut size={18} /> Log out
        </button>
        <p className="mt-3 text-center text-xs text-muted-2">Demo account · Aurora FX</p>
      </Item>
    </>
  );
}
