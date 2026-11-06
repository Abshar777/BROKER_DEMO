"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Item } from "@/components/motion";
import { Flag } from "@/components/Flag";
import { StatusPill } from "@/components/StatusPill";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { Search } from "lucide-react";

const FILTERS = ["All", "Active", "Suspended", "KYC pending"] as const;
type Filter = (typeof FILTERS)[number];

export default function Clients() {
  const db = useStore((s) => s.db);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const rows = useMemo(() => {
    const list = db?.clients ?? [];
    const term = q.trim().toLowerCase();
    return list.filter((c) => {
      if (filter === "Active" && c.status !== "active") return false;
      if (filter === "Suspended" && c.status !== "suspended") return false;
      if (filter === "KYC pending" && c.kycStatus !== "pending") return false;
      if (!term) return true;
      return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.id.toLowerCase().includes(term);
    });
  }, [db, q, filter]);

  if (!db) return null;

  return (
    <>
      <Item>
        <h1 className="font-wise text-[30px] tracking-tight text-forest">Clients</h1>
        <p className="mb-5 mt-1 text-muted">{db.clients.length} total accounts on the platform.</p>
      </Item>

      <Item>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-[320px]">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email or ID"
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-95",
                  filter === f ? "bg-forest text-green" : "bg-card text-ink hover:bg-card-2",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Item>

      <Item>
        <div className="overflow-hidden rounded-[20px] border border-line bg-white">
          {/* header (desktop) */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-2 md:grid">
            <span>Client</span><span>Tier</span><span>KYC</span><span className="text-right">Equity</span><span className="text-right">Status</span>
          </div>
          {rows.length === 0 && <div className="px-5 py-10 text-center text-muted">No clients match.</div>}
          {rows.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => router.push(`/clients/${c.id}`)}
              whileHover={{ backgroundColor: "#F4F5F2" }}
              className="grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-5 py-4 text-left last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Flag cc={c.country} size={38} />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.name}</div>
                  <div className="truncate text-sm text-muted">{c.email}</div>
                </div>
              </div>
              <div className="hidden text-sm font-medium md:block">{c.tier}</div>
              <div className="hidden md:block"><StatusPill status={c.kycStatus} /></div>
              <div className="hidden text-right md:block">
                <span className="num font-semibold">{money(c.equity).replace(".00", "")}</span>
              </div>
              <div className="justify-self-end"><StatusPill status={c.status} /></div>
            </motion.button>
          ))}
        </div>
      </Item>
    </>
  );
}
