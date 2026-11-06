"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Item } from "@/components/motion";
import { Flag } from "@/components/Flag";
import { StatusPill } from "@/components/StatusPill";
import { Toggle, ActionBtn, Empty } from "@/components/Review";
import { useStore } from "@/lib/store";
import { fmtDateLong } from "@/lib/format";
import { FileText, ShieldCheck } from "lucide-react";

export default function KycReview() {
  const db = useStore((s) => s.db);
  const review = useStore((s) => s.reviewKyc);
  const busyId = useStore((s) => s.busyId);
  const [showDone, setShowDone] = useState(false);
  if (!db) return null;

  const pending = db.kyc.filter((k) => k.status === "pending");
  const done = db.kyc.filter((k) => k.status !== "pending");
  const list = showDone ? done : pending;

  return (
    <>
      <Item>
        <h1 className="font-wise text-[30px] tracking-tight text-forest">KYC review</h1>
        <p className="mb-5 mt-1 text-muted">Approve or reject identity verifications.</p>
      </Item>

      <Item>
        <div className="mb-4 flex gap-2">
          <Toggle on={!showDone} onClick={() => setShowDone(false)}>Pending ({pending.length})</Toggle>
          <Toggle on={showDone} onClick={() => setShowDone(true)}>Processed ({done.length})</Toggle>
        </div>
      </Item>

      {list.length === 0 ? (
        <Item><Empty icon={<ShieldCheck size={26} />} /></Item>
      ) : (
        <Item>
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((k) => {
                const busy = busyId === k.id;
                return (
                  <motion.div
                    key={k.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22 } }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <Flag cc={k.country} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/clients/${k.clientId}`} className="truncate font-semibold hover:underline">{k.name}</Link>
                        {showDone && <StatusPill status={k.status} />}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted">
                        <span className="inline-flex items-center gap-1"><FileText size={14} /> {k.docType}</span>
                        <span>·</span><span>{k.id}</span>
                        <span>·</span><span>{fmtDateLong(k.submitted)}</span>
                      </div>
                    </div>
                    {!showDone && (
                      <div className="flex flex-none gap-2">
                        <ActionBtn kind="reject" busy={busy} onClick={() => review(k.id, "rejected")} />
                        <ActionBtn kind="approve" busy={busy} onClick={() => review(k.id, "approved")} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Item>
      )}
    </>
  );
}
