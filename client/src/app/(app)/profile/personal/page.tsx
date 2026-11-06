"use client";
import { Card } from "@/components/ui/Card";
import { Flag } from "@/components/Flag";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";

function Row({ icon, label, value, right }: { icon: React.ReactNode; label: string; value: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 border-t border-line px-5 py-4 first:border-t-0">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-card text-forest">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-muted">{label}</div>
        <div className="truncate font-semibold">{value}</div>
      </div>
      {right}
    </div>
  );
}

export default function Personal() {
  const client = useStore((s) => s.client);
  return (
    <>
      <PageHeader title="Personal details" sub="Your account information" />
      <Item>
        <Card className="overflow-hidden border border-line bg-white">
          <Row icon={<span className="text-[15px] font-semibold">{client?.initials ?? "··"}</span>} label="Full name" value={client?.name ?? "—"} />
          <Row icon={<Mail size={18} />} label="Email" value={client?.email ?? "—"} right={<span className="rounded-full bg-green-light px-2.5 py-1 text-xs font-semibold text-pos">Verified</span>} />
          <Row icon={<Phone size={18} />} label="Phone" value="+971 50 123 4567" />
          <Row icon={<Flag cc={client?.country ?? "AE"} size={26} />} label="Country" value={client?.country === "AE" ? "United Arab Emirates" : (client?.country ?? "—")} />
          <Row icon={<MapPin size={18} />} label="Address" value="Business Bay, Dubai" />
          <Row icon={<Calendar size={18} />} label="Date of birth" value="14 Mar 1994" />
        </Card>
      </Item>
      <Item>
        <p className="mt-4 text-center text-xs text-muted-2">Demo account — details are read-only.</p>
      </Item>
    </>
  );
}
