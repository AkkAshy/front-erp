// ===== USER TYPES (Пользователи) =====
// Соответствует новому API: GET /api/users/profile/

export type ProfileResponse = {
  status: "success";
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
    store: {
      id: number;
      name: string;
      slug: string;
      tenant_key: string;
      description?: string;
    };
    employee: {
      id: number;
      role: "owner" | "manager" | "cashier" | "warehouse_keeper";
      role_display: string;
      permissions: string[];
      phone: string;
      photo: string | null;
    };
  };
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  password?: string;
  is_active: boolean;
  is_active_in_store?: boolean;
  date_joined?: string;
  // ✅ FIXED: GET /users/users/ теперь возвращает employee_info
  // При создании/обновлении пользователя поля phone, role, sex отправляются напрямую (не в employee_info)
  employee_info?: {
    id: number;
    role: string;
    role_display: string;
    phone: string;
    position: string | null;
    is_active: boolean;
    hired_at: string;
    photo: string | null;
    sex?: string; // Опционально для обратной совместимости
  };
};

// ⭐ Реальный формат ответа: просто массив User[]
export type Employees = User[];

// Legacy type - для совместимости со старым кодом
export type UserInfo = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  groups: string[];
  employee: {
    role: string;
    role_display?: string;
    phone: string;
    photo: string | null;
    sex: string | null;
    plain_password: string;
    accessible_stores_info: {
      id: string;
      name: string;
    }[];
  };
};

export type Gender = "Erkak" | "Ayol" | null;

// ===== CASHIER TYPES (Кассиры) =====
// Соответствует API: GET /api/users/employees/cashiers/

export type Cashier = {
  id: number;
  full_name: string;
  phone: string;
  role: string;
  photo?: string | null;
};

export type CashiersResponse = {
  status: "success";
  data: Cashier[];
};

// ===== CASHIER STATS TYPES (Статистика кассиров) =====
// Соответствует API: GET /api/sales/sessions/cashier-stats/

export type CashierStat = {
  id: number;
  full_name: string;
  phone: string;
  role: string;
  total_sales: string;  // Общая сумма продаж
  cash_sales: string;   // Продажи наличными
  card_sales: string;   // Продажи по карте
  sales_count: number;  // Количество продаж
  sessions_count: number; // Количество смен
};

export type CashierStatsResponse = {
  status: "success";
  data: {
    period: {
      from: string;
      to: string;
    };
    cashiers: CashierStat[];
    total_cashiers: number;
  };
};

// ===== STAFF CREDENTIALS TYPES (Учетные данные общего аккаунта) =====
// Соответствует API: GET /api/users/stores/staff-credentials/

export type StaffCredentials = {
  username: string;
  password: string;
  full_name: string;
  is_active: boolean;
  store_name: string;
  tenant_key: string;
  note: string;
};

export type StaffCredentialsResponse = {
  status: "success";
  data: StaffCredentials;
};

// ===== EMPLOYEE TYPES (Полное управление сотрудниками) =====
// Соответствует API: GET /api/users/employees/

export type Employee = {
  id: number;
  user: number | null;  // ID связанного User (null для простых кассиров)
  store: number;
  role: "owner" | "manager" | "cashier" | "stockkeeper" | "staff";
  role_display: string;
  phone: string;
  photo: string | null;
  position: string | null;
  sex: "M" | "F" | null;
  sex_display: string | null;
  is_active: boolean;
  hired_at: string;  // YYYY-MM-DD
  created_at: string;
  // Добавляем поля для отображения имени
  first_name?: string;
  last_name?: string;
  full_name?: string;
};

export type EmployeesListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
};

export type CreateEmployeeRequest = {
  first_name: string;
  last_name: string;
  phone: string;
  role: "cashier" | "stockkeeper" | "manager";
  hired_at?: string;  // YYYY-MM-DD, optional
  position?: string;
  sex?: "M" | "F";
  photo?: string;
};

export type UpdateEmployeeRequest = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  sex?: "M" | "F";
  is_active?: boolean;
  photo?: string;
};
