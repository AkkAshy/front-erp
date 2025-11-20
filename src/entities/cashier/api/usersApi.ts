import { api } from "@/shared/api/base/client";

export const usersApi = {
  // get all
  filterUsers: (_id?: number | string, name?: string, is_active?: boolean) =>
    api.get(`/users/users/`, { params: { name, is_active } }),

  // get single user by ID
  getUser: (id: number | string) =>
    api.get(`/users/users/${id}/`),

  // get profile
  profileInfo: () => api.get("/users/profile/"),

  // get cashiers list (для выбора кассира)
  getCashiers: () => api.get("/users/employees/cashiers/"),

  // get staff credentials (для владельца магазина)
  getStaffCredentials: () => api.get("/users/stores/staff-credentials/"),

  // ===== EMPLOYEES MANAGEMENT (Управление сотрудниками) =====

  // get all employees (полный список для управления)
  getEmployees: (params?: {
    offset?: number;
    limit?: number;
    is_active?: boolean;
  }) => api.get("/users/employees/", { params }),

  // get single employee by ID
  getEmployee: (id: number) => api.get(`/users/employees/${id}/`),

  // create new employee (кассир без User аккаунта)
  createEmployee: (data: {
    first_name: string;
    last_name: string;
    phone: string;
    role: "cashier" | "stockkeeper" | "manager";
    hired_at?: string;
    position?: string;
    sex?: "M" | "F";
    photo?: string;
  }) => api.post("/users/employees/", data),

  // update employee
  updateEmployeeData: (id: number, data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    position?: string;
    sex?: "M" | "F";
    is_active?: boolean;
    photo?: string;
  }) => api.patch(`/users/employees/${id}/`, data),

  // delete employee
  deleteEmployee: (id: number) => api.delete(`/users/employees/${id}/`),

  toggleActiveUser: (data: { is_active: boolean; id: number }) =>
    api.patch(`/users/users/${data.id}/`, { is_active: data.is_active }),

  createUser: (data: {
    username: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone: string;
    role: string;
    store?: number;  // Опционально - по умолчанию магазин создателя
    email?: string;
    sex?: string | null;
  }) => api.post("/users/users/", data),

  // update profile
  updateProfile: (data: {
    first_name: string;
    last_name: string;
    employee: { phone: string; sex: string };
  }) => api.patch("/users/profile-update/", data),

  // update user profile (basic info only - NO password, NO phone, NO sex)
  updateUser: (data: {
    id: number | string;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }) => {
    // Явно извлекаем только разрешённые поля, исключая id
    const { id, ...userData } = data;
    return api.patch(`/users/users/${id}/update-profile/`, userData);
  },

  // change user password (separate endpoint)
  changePassword: (data: {
    id: number | string;
    new_password: string;
  }) => {
    const { id, new_password } = data;
    return api.post(`/users/users/${id}/change-password/`, { new_password });
  },

  // update employee info (role, phone, position, is_active, sex)
  updateEmployee: (data: {
    id: number | string;
    role?: string;
    phone?: string;
    position?: string;
    is_active?: boolean;
    sex?: string;
  }) => {
    // Явно извлекаем только разрешённые поля для employee, исключая id
    const { id, ...employeeData } = data;
    return api.patch(`/users/users/${id}/update-employee/`, employeeData);
  },

  // ===== STORE MANAGEMENT (Управление магазинами) =====

  // create new store (НЕ требуется X-Tenant-Key, только Authorization)
  createStore: (data: {
    name: string;
    slug?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    description?: string;
  }) => api.post("/users/stores/", data),

  // get all my stores with credentials (НЕ требуется X-Tenant-Key, только Authorization)
  getMyStoresWithCredentials: () => api.get("/users/stores/my-stores-with-credentials/"),
};
