export type RegisterData = {
  // Личные данные владельца
  first_name: string;
  last_name?: string;
  middle_name?: string;  // ⭐ Добавлено
  owner_phone: string;    // ⭐ Теперь обязательное
  email?: string;

  // Данные для входа
  username: string;
  password: string;
  password_confirm: string;  // ⭐ Добавлено

  // Данные магазина
  store_name: string;
  store_address: string;      // ⭐ Теперь обязательное
  store_city?: string;        // ⭐ Добавлено
  store_region?: string;      // ⭐ Добавлено
  store_phone: string;        // ⭐ Теперь обязательное
  store_email?: string;
  store_legal_name?: string;  // ⭐ Добавлено
  store_tax_id?: string;      // ⭐ Добавлено
  store_description?: string;
};

export type LoginData = {
  username: string;
  password: string;
};

// ⭐ РЕАЛЬНЫЙ формат ответа от API (из консоли):
// { access, refresh, user, default_store, available_stores }
export type AuthResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    full_name: string;
  };
  default_store: {
    tenant_key: string;
    name: string;
    role: string; // "owner" | "employee"
  };
  available_stores: Array<{
    tenant_key: string;
    name: string;
    role: string;
  }>;
};
