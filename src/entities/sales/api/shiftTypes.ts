// ===== CASHIER SESSION TYPES =====

// Касса (Cash Register)
export type CashRegister = {
  id: number;
  name: string;
  code: string;
};

// Смена кассира
export type CashierShift = {
  id: number;
  cash_register: CashRegister;
  cashier_name: string;
  status: "open" | "closed" | "suspended";
  opening_cash: string;
  expected_cash: string;
  actual_cash: string | null;
  cash_difference: string;
  total_sales?: string;
  cash_sales?: string;
  card_sales?: string;
  sales_count?: number;
  opened_at: string;
  closed_at: string | null;
};

// Запрос на открытие смены (opening_balance опционален, по умолчанию 100000)
export type OpenShiftRequest = {
  opening_balance?: number;
};

// Ответ при открытии смены
export type OpenShiftResponse = {
  status: "success";
  message: string;
  data: CashierShift;
  default_opening_cash: number;
};

// Запрос на закрытие смены (вводим недостачу, а не фактическую сумму)
export type CloseShiftRequest = {
  shortage: number; // Сколько не хватает (0 если всё совпадает)
};

// Ответ при закрытии смены
export type CloseShiftResponse = {
  status: "success";
  message: string;
  data: CashierShift;
  summary: {
    expected_cash: number;
    shortage: number;
    actual_cash: number;
    opening_cash_for_next_shift: number;
  };
};

// Ответ при получении текущей смены
export type CurrentShiftResponse = {
  status: "success" | "error";
  message?: string;
  data: CashierShift | null;
};

// ===== CASH MOVEMENT TYPES =====

export type MovementType = "cash_in" | "cash_out";
export type MovementReason = "collection" | "change" | "float" | "expense" | "correction" | "other";

export type CashMovement = {
  id: number;
  session: number;
  movement_type: MovementType;
  reason: MovementReason;
  amount: string;
  description: string;
  performed_by: number;
  created_at: string;
};

// Запрос на изъятие денег владельцем
export type OwnerWithdrawRequest = {
  session: number;
  amount: number;
  description?: string;
};

// Ответ при изъятии денег
export type OwnerWithdrawResponse = {
  status: "success" | "error";
  code?: "exceeds_limit" | "insufficient_cash";
  message: string;
  data: {
    movement?: CashMovement;
    cash_before?: number;
    cash_after?: number;
    minimum_required: number;
    current_balance?: number;
    requested?: number;
    max_withdraw?: number;
  };
};

// ===== REPORT TYPES =====

export type ShiftReport = {
  session: {
    id: number;
    cashier_name: string;
    status: string;
    opening_cash: string;
    expected_cash: string;
    opened_at: string;
  };
  sales: {
    total_amount: number;
    total_items: number;
    count: number;
  };
  payments: Array<{
    payment_method: string;
    total: number;
    count: number;
  }>;
  cash_movements: {
    cash_in: number;
    cash_out: number;
  };
};

// ===== CASHIER STATS TYPES =====

export type CashierStats = {
  id: number;
  full_name: string;
  phone: string;
  role: string;
  total_sales: string;
  cash_sales: string;
  card_sales: string;
  sales_count: number;
  sessions_count: number;
};

export type CashierStatsResponse = {
  status: "success";
  data: {
    period: {
      from: string;
      to: string;
    };
    cashiers: CashierStats[];
    total_cashiers: number;
  };
};

// ===== LIST RESPONSES =====

export type ShiftsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CashierShift[];
};

export type CashMovementsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CashMovement[];
};

// ===== CONSTANTS =====

export const DEFAULT_OPENING_CASH = 100000; // 100 000 сум
export const MINIMUM_CASH_IN_REGISTER = 100000; // 100 000 сум
