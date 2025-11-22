// Типы для смены кассира
export type CashierShift = {
  id: number;
  cashier: number;
  cashier_name: string;
  store: number;
  store_name: string;
  status: "open" | "closed";
  opening_balance: string;
  closing_balance: string | null;
  expected_balance: string;
  total_sales: string;
  total_cash_sales: string;
  total_card_sales: string;
  total_transfer_sales: string;
  sales_count: number;
  opened_at: string;
  closed_at: string | null;
  balance_difference: string | null;
  notes: string | null;
};

export type OpenShiftRequest = {
  opening_balance: number;
};

export type CloseShiftRequest = {
  actual_cash_amount: number;
  notes?: string;
};

export type ShiftsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CashierShift[];
};
