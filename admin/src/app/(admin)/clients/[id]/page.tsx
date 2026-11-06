"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Item } from "@/components/motion";
import { Flag } from "@/components/Flag";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { money, signed, fmtDateLong } from "@/lib/format";
import { ArrowLeft, Mail, Globe, CalendarDays, Hash } from "lucide-react";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const db = useStore((s) => s.db);
  const toggle = useStore((s) => s.toggleClient);
  const busyId = useStore((s) => s.busyId);
  if (!db) return null;

  const c = db.clients.find((x) => x.id === id);
  if (!c) {
    return (
      <Item>
        <button onClick={() => router.push("/clients")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline">
          <ArrowLeft size={16} /> Back to clients
        </button>
        <p className="text-muted">Client not found.</p>
      </Item>
    );
  }

  const history = db.ledger.filter((t) => t.clientId === c.id);
  const suspended = c.status === "suspended";
  const busy = busyId === c.id;

  return (
    <>
      <Item>
        <button onClick={() => router.push("/clients")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline">
          <ArrowLeft size={16} /> Back to clients
        </button>
      </Item>

      <Item>
        <div className="mb-5 flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Flag cc={c.country} size={56} />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-wise text-[26px] tracking-tight text-forest">{c.name}</h1>
                <StatusPill status={c.status} />
              </div>
              <div className="mt-0.5 text-muted">{c.tier} account · {c.id}</div>
            </div>
          </div>
          <Button
            variant={suspended ? "primary" : "ghost"}
            onClick={() => toggle(c.id)}
            disabled={busy}
            className={suspended ? "" : "!bg-[#FBE6E5] !text-neg hover:!brightness-95"}
          >
            {busy ? "Saving…" : suspended ? "Reactivate client" : "Suspend client"}
          </Button>
        </div>
      </Item>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Item>
          <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-white p-5">
            <div className="grid grid-cols-2 gap-4">
              <Metric label="Balance" value={money(c.balance).replace(".00", "")} />
              <Metric label="Equity" value={money(c.equity).replace(".00", "")} />
            </div>
            <div className="border-t border-line pt-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-2">Details</div>
              <Detail icon={<Mail size={16} />} label="Email" value={c.email} />
              <Detail icon={<Globe size={16} />} label="Country" value={c.country} />
              <Detail icon={<CalendarDays size={16} />} label="Registered" value={fmtDateLong(c.registered)} />
              <Detail icon={<Hash size={16} />} label="KYC status" value={<StatusPill status={c.kycStatus} />} />
            </div>
          </div>
        </Item>

        <Item>
          <div className="rounded-[20px] border border-line bg-white p-5">
            <h2 className="mb-3 font-semibold text-[17px]">Transaction history</h2>
            {history.length === 0 && <p className="py-6 text-center text-muted">No transactions yet.</p>}
            {history.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                <div>
                  <div className="text-sm font-semibold capitalize">{t.kind}</div>
                  <div className="text-xs text-muted">{t.id} · {fmtDateLong(t.date)}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`num text-sm font-semibold ${t.amount < 0 ? "text-neg" : "text-pos"}`}>{signed(t.amount)}</span>
                  <StatusPill status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Item>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-[14px] bg-card p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="num mt-1 font-wise text-[22px] tracking-tight text-forest">{value}</div>
    </motion.div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
      <span className="text-muted-2">{icon}</span>
      <span className="flex-1 text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
