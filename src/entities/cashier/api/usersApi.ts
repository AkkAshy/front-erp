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
};
