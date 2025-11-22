// Типы для смены кассира
export type CashierShift = {
  id: number;
  cash_register: number;
  cash_register_name: string;
  cashier_full_name: string | null;
  cashier_name: string;
  status: "open" | "closed";
  status_display: string;
  opening_cash: string;
  expected_cash: string;
  actual_cash: string | null;
  cash_difference: string;
  duration: number;
  total_sales: string;
  cash_sales: string;
  card_sales: string;
  notes: string;
  opened_at: string;
  closed_at: string | null;
  cash_movements: any[];
  sales_count: number;
};

export type OpenShiftRequest = {
  opening_balance: number;
};

export type CloseShiftRequest = {
  actual_cash: number;
  notes?: string;
};

export type ShiftsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CashierShift[];
};
