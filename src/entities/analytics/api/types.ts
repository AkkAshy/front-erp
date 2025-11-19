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

// ===== DAILY SALES REPORT TYPES (Новый формат API) =====

export type DailyReport = {
  id: number;
  date: string;
  total_sales: string;
  total_sales_count: number;
  avg_sale_amount: string;
  cash_sales: string;
  card_sales: string;
  credit_sales: string;
  total_discount: string;
  total_tax: string;
  total_items_sold: number;
  unique_products_sold: number;
  unique_customers: number;
  new_customers: number;
  sessions_opened: number;
  sessions_closed: number;
  created_at: string;
  updated_at: string;
};

export type PeriodReportResponse = {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  totals: {
    total_sales: number;
    total_count: number;
    total_discount: number;
    total_tax: number;
    total_items: number;
    avg_sale: number;
  };
  daily_reports: DailyReport[];
};
