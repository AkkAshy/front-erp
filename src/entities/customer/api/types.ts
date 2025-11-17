// ===== CUSTOMER TYPES =====

export type CustomerType = "individual" | "organization";

export type Customer = {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type: CustomerType;
  organization_name?: string;
  inn?: string;
  address?: string;
  notes?: string;
  is_vip: boolean;
  group?: CustomerGroup | null;
  bonus_balance: number;
  created_at: string;
  updated_at: string;

  // Статистика (read-only поля)
  total_purchases?: number;
  total_spent?: number;
  last_purchase_date?: string | null;
};

export type CreateCustomer = {
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type?: CustomerType;
  organization_name?: string;
  inn?: string;
  address?: string;
  notes?: string;
  is_vip?: boolean;
  group?: number | null;
};

export type UpdateCustomer = {
  id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  customer_type?: CustomerType;
  organization_name?: string;
  inn?: string;
  address?: string;
  notes?: string;
  is_vip?: boolean;
  group?: number | null;
};

export type CustomersResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
};

// ===== CUSTOMER GROUP TYPES =====

export type CustomerGroup = {
  id: number;
  name: string;
  discount_percent: number;
  description?: string;
  customer_count: number;
  created_at: string;
  updated_at: string;
};

export type CustomerGroupsResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomerGroup[];
};

// ===== PURCHASE HISTORY TYPES =====

export type PurchaseHistoryItem = {
  product_name: string;
  quantity: number;
  price: number;
};

export type PurchaseHistory = {
  id: number;
  sale_number: string;
  created_at: string;
  total_amount: number;
  items: PurchaseHistoryItem[];
};

export type PurchaseHistoryResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PurchaseHistory[];
};

// ===== STATISTICS TYPES =====

export type CustomerStats = {
  total_purchases: number;
  total_spent: number;
  average_purchase: number;
  last_purchase_date: string | null;
  bonus_balance: number;
  vip_status: boolean;
};
