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
