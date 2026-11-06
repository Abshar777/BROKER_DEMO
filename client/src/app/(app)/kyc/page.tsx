"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";
import { IdCard, ScanFace, FileText, Check, Upload, ShieldCheck, BadgeCheck } from "lucide-react";

const STEPS = [
  { key: "id", icon: IdCard, title: "Identity document", sub: "Passport or national ID" },
  { key: "selfie", icon: ScanFace, title: "Selfie check", sub: "A quick photo of your face" },
  { key: "address", icon: FileText, title: "Proof of address", sub: "Utility bill or bank statement" },
];

export default function Kyc() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const kyc = useStore((s) => s.client?.kycStatus);
  const submitKyc = useStore((s) => s.submitKyc);
  const busy = useStore((s) => s.busy);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const count = STEPS.filter((s) => done[s.key]).length;
  const pct = Math.round((count / STEPS.length) * 100);
  const allDone = count === STEPS.length;
  const verified = kyc === "approved";

  const submit = async () => {
    await submitKyc();
    setSubmitted(true);
  };

  if (verified || submitted) {
    return (
      <>
        <PageHeader title="Verification" />
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <motion.span
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="grid h-24 w-24 place-items-center rounded-full bg-green"
          >
            <BadgeCheck size={46} className="text-forest" />
          </motion.span>
          <Item>
            <h2 className="font-wise text-[32px] tracking-tight text-forest">VERIFIED</h2>
            <p className="mt-1.5 max-w-[320px] text-muted">Your identity is confirmed. Withdrawals and full account features are unlocked.</p>
          </Item>
          <Item>
            <Button variant="primary" className="mt-2 px-8 py-3.5" onClick={() => router.push("/dashboard")}>Back to home</Button>
          </Item>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Verify your identity" sub="Takes about 2 minutes" />

      <Item>
        <Card className="mb-5 border border-line bg-gradient-to-br from-green-faint via-white to-white p-5">
          <div className="flex items-center gap-3.5">
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="grid h-12 w-12 flex-none place-items-center rounded-full bg-green text-forest"
            >
              <ShieldCheck size={24} />
            </motion.span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[17px]">{count} of {STEPS.length} completed</div>
              <div className="text-sm text-muted">Upload your documents to get verified</div>
            </div>
            <span className="num font-wise text-[22px] text-forest">{pct}%</span>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-card-2">
            <motion.div
              className="h-full rounded-full bg-green"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            />
          </div>
        </Card>
      </Item>

      <Item>
        <Card className="mb-5 overflow-hidden border border-line bg-white">
          {STEPS.map(({ key, icon: Icon, title, sub }) => {
            const ok = !!done[key];
            return (
              <button
                key={key}
                onClick={() => setDone((d) => ({ ...d, [key]: true }))}
                className="flex w-full items-center gap-3.5 border-t border-line px-5 py-4 text-left transition first:border-t-0 hover:bg-card"
              >
                <motion.span
                  animate={{ backgroundColor: ok ? "#9FE870" : "#F4F5F2" }}
                  transition={{ duration: 0.3 }}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full text-forest"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {ok ? (
                      <motion.span key="check" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                        <Check size={21} />
                      </motion.span>
                    ) : (
                      <motion.span key="icon" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                        <Icon size={21} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <div className="flex-1">
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-muted">{sub}</div>
                </div>
                {ok ? (
                  <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1 rounded-full bg-green-light px-2.5 py-1 text-xs font-semibold text-pos">
                    <Check size={12} /> Uploaded
                  </motion.span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-sm font-semibold"><Upload size={14} /> Upload</span>
                )}
              </button>
            );
          })}
        </Card>
      </Item>

      <Item>
        <Button variant="primary" className="w-full py-4 text-[16px]" disabled={!allDone || busy} onClick={submit}>
          {busy ? "Submitting…" : allDone ? "Submit for verification" : `Upload all documents (${count}/${STEPS.length})`}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-2">Demo only — tap a step to simulate an upload. No files are sent.</p>
      </Item>
    </>
  );
}
