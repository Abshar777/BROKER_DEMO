"use client";
import { Card } from "@/components/ui/Card";
import { Item } from "@/components/motion";

export default function Insights() {
  return (
    <>
      <Item>
        <h1 className="mb-5 font-semibold text-[30px]">Insights</h1>
      </Item>
      <Item>
        <Card className="max-w-[640px] border border-line bg-white p-6">
          <p className="text-muted">Spending, deposits and trading-performance insights land here next in the demo.</p>
        </Card>
      </Item>
    </>
  );
}
