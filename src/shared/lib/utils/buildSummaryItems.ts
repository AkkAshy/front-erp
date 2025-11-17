import { percentGrowth } from "../math/percent";

// utils/summary.ts
export const buildSummaryItems = (
  today: { amount: number; transactions: number; items: number },
  yesterday: { amount: number; transactions: number; items: number },
  totals: {
    total_amount: number;
    total_transactions: number;
    total_items_sold: number;
  }
) => {
  const { total_amount, total_transactions, total_items_sold } = totals;

  return [
    {
      id: 1,
      title: "Savdo summasi",
      change: percentGrowth(today.amount, yesterday.amount),
      value: `${total_amount.toLocaleString("de-DE")} uzs`,
    },
    {
      id: 2,
      title: "Cheklar soni",
      change: percentGrowth(today.transactions, yesterday.transactions),
      value: `${total_transactions.toLocaleString("de-DE")} dona`,
    },
    {
      id: 3,
      title: "Mahsulotlar soni",
      change: percentGrowth(today.items, yesterday.items),
      value: `${total_items_sold.toLocaleString("de-DE")} dona`,
    },
    {
      id: 4,
      title: "O’rtacha chek narxi",
      change: percentGrowth(
        today.amount / today.transactions,
        yesterday.amount / yesterday.transactions
      ),
      value: `${(total_transactions
        ? Math.floor(total_amount / total_transactions)
        : 0
      ).toLocaleString("de-DE")} uzs`,
    },
  ];
};
