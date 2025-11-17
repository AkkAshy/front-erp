import { api } from "../base/client";

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  // Отправляем кастомное событие для обновления useAuth в той же вкладке
  window.dispatchEvent(new Event("auth-changed"));
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// ⭐ Новые функции для работы с tenant_key
export const setTenantKey = (tenantKey: string) => {
  localStorage.setItem("tenant_key", tenantKey);
};

export const getTenantKey = () => {
  return localStorage.getItem("tenant_key");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tenant_key");  // ⭐ Очищаем и tenant_key
};

export const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await api.post("/users/auth/token/refresh/", {  // ⭐ Обновлён путь
      refresh: refreshToken,
    });
    const data = res.data;

    setAccessToken(data.access);
    if (data.refresh) setRefreshToken(data.refresh);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
};
