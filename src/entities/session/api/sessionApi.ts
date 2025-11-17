import { api } from "@/shared/api/base/client";
import type { RegisterData, LoginData, AuthResponse } from "./types";
import { setAccessToken, setRefreshToken, setTenantKey } from "@/shared/api/auth/tokenService";

export const sessionApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/auth/login/", data);

    // ⭐ Реальный формат ответа: { access, refresh, user, default_store, available_stores }
    if (response.data.access && response.data.refresh) {
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);

      if (response.data.default_store?.tenant_key) {
        setTenantKey(response.data.default_store.tenant_key);
      }

      // Сохраняем дополнительно для удобства
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("store", JSON.stringify(response.data.default_store));
      localStorage.setItem("available_stores", JSON.stringify(response.data.available_stores || []));
    }

    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/auth/register/", data);

    // ⭐ Реальный формат ответа: { access, refresh, user, default_store, available_stores }
    if (response.data.access && response.data.refresh) {
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);

      if (response.data.default_store?.tenant_key) {
        setTenantKey(response.data.default_store.tenant_key);
      }

      // Сохраняем дополнительно для удобства
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("store", JSON.stringify(response.data.default_store));
      localStorage.setItem("available_stores", JSON.stringify(response.data.available_stores || []));
    }

    return response.data;
  },

  refresh: () => api.post("/users/auth/token/refresh/"),
};
