"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { Item } from "@/components/motion";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Mail, Phone, ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How long do withdrawals take?", a: "Crypto withdrawals are processed within minutes. Bank transfers take 1–2 business days once approved." },
  { q: "Why do I need to verify my identity?", a: "KYC verification keeps your account secure and unlocks withdrawals. It takes about 2 minutes to complete." },
  { q: "How do I transfer between accounts?", a: "Open Transfer from the dashboard, pick the source and destination accounts, and funds move instantly with no fees." },
  { q: "What are IB commissions?", a: "When clients you refer trade, you earn a share of the spread. Earnings appear in the IB room." },
];

const CONTACTS = [
  { icon: MessageCircle, label: "Live chat", sub: "Replies in ~2 min", tone: "bg-green text-forest" },
  { icon: Mail, label: "Email us", sub: "support@aurora.demo", tone: "bg-card text-forest" },
  { icon: Phone, label: "Call support", sub: "+971 4 000 0000", tone: "bg-card text-forest" },
];

export default function Support() {
  const [open, setOpen] = useState<number | null>(0);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader title="Help & support" sub="We're here to help" />

      <Item>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {CONTACTS.map(({ icon: Icon, label, sub, tone }) => (
            <button key={label} className="flex flex-col items-center gap-2 rounded-[16px] border border-line bg-white p-4 text-center transition hover:bg-card active:scale-[.98]">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${tone}`}><Icon size={20} /></span>
              <div className="text-sm font-semibold leading-tight">{label}</div>
              <div className="text-[11px] text-muted">{sub}</div>
            </button>
          ))}
        </div>
      </Item>

      <Item>
        <h2 className="mb-2 font-semibold text-[18px]">Frequently asked</h2>
        <Card className="mb-5 overflow-hidden border border-line bg-white">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-t border-line first:border-t-0">
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
                  <span className="flex-1 font-semibold">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-muted-2" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-[15px] text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Card>
      </Item>

      <Item>
        <h2 className="mb-2 font-semibold text-[18px]">Send us a message</h2>
        <Card className="border border-line bg-white p-5">
          {sent ? (
            <p className="py-2 text-center font-semibold text-pos">Thanks — our team will reply shortly. ✓</p>
          ) : (
            <>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                placeholder="Describe your issue…"
                className="input mb-3 resize-none"
              />
              <Button variant="primary" className="w-full py-3.5" disabled={!msg.trim()} onClick={() => setSent(true)}>
                Send message
              </Button>
            </>
          )}
        </Card>
        <p className="mt-3 text-center text-xs text-muted-2">Demo only — no message is actually sent.</p>
      </Item>
    </>
  );
}
