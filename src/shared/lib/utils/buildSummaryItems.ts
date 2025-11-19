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

  // Безопасное преобразование значений (на случай если они null или undefined)
  const safeAmount = total_amount ?? 0;
  const safeTransactions = total_transactions ?? 0;
  const safeItems = total_items_sold ?? 0;

  return [
    {
      id: 1,
      title: "Savdo summasi",
      change: percentGrowth(today.amount, yesterday.amount),
      value: `${safeAmount.toLocaleString("de-DE")} uzs`,
    },
    {
      id: 2,
      title: "Cheklar soni",
      change: percentGrowth(today.transactions, yesterday.transactions),
      value: `${safeTransactions.toLocaleString("de-DE")} dona`,
    },
    {
      id: 3,
      title: "Mahsulotlar soni",
      change: percentGrowth(today.items, yesterday.items),
      value: `${safeItems.toLocaleString("de-DE")} dona`,
    },
    {
      id: 4,
      title: "O'rtacha chek narxi",
      change: percentGrowth(
        today.amount / today.transactions,
        yesterday.amount / yesterday.transactions
      ),
      value: `${(safeTransactions
        ? Math.floor(safeAmount / safeTransactions)
        : 0
      ).toLocaleString("de-DE")} uzs`,
    },
  ];
};
