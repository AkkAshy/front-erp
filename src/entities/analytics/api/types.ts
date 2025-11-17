type PaymentSummaryItem = {
  payment_method: "card" | "cash" | "debt" | "transfer";
  total_amount: number;
  total_transactions: number;
  total_items_sold: number;
};

export type PaymentSummaryResponse = {
  payment_summary: PaymentSummaryItem[];
  total_amount: number;
  total_transactions: number;
  total_items_sold: number;
};
