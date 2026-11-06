"use client";
import { TxList } from "@/components/TxList";
import { Item } from "@/components/motion";
import { useStore } from "@/lib/store";

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  return (
    <>
      <Item>
        <h1 className="mb-4 font-semibold text-[30px]">Transactions</h1>
      </Item>
      <Item>
        <TxList items={transactions} />
      </Item>
    </>
  );
}
