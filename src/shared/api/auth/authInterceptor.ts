import axios from "axios";
import { getAccessToken, setAccessToken, getTenantKey } from "./tokenService";
import { API_BASE_URL } from "../base/config";

let isRefreshing = false;
let queue: (() => void)[] = [];

export const attachAuthInterceptor = (api: ReturnType<typeof axios.create>) => {
  api.interceptors.request.use((config) => {
    // Добавляем токен авторизации
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⭐ Добавляем X-Tenant-Key для всех запросов (кроме регистрации, логина и управления списком магазинов)
    // Примечание: config.url в axios - это относительный путь, может быть с или без начального слеша
    const url = config.url || '';
    const isExcludedEndpoint =
      url.includes('/auth/register') ||
      url.includes('/auth/login') ||
      url.includes('/auth/token/refresh') ||
      url.includes('/users/stores/my-stores-with-credentials') || // GET список магазинов владельца
      url === '/users/stores/' ||          // POST /users/stores/ - создание магазина
      url === 'users/stores/' ||           // Без начального слеша
      url === '/users/stores' ||           // Без trailing slash
      url === 'users/stores';              // Без обоих слешей

    console.log("🔍 Interceptor Check:", {
      url: config.url,
      isExcluded: isExcludedEndpoint,
      willAddTenantKey: !isExcludedEndpoint,
      tenantKey: !isExcludedEndpoint ? getTenantKey() : 'N/A'
    });

    if (!isExcludedEndpoint) {
      const tenantKey = getTenantKey();
      if (tenantKey) {
        config.headers['X-Tenant-Key'] = tenantKey;
      }
    }

    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // Don't attempt token refresh for login or refresh endpoints
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/token/refresh');

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            queue.push(() => resolve(api(originalRequest)));
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/users/auth/token/refresh/`,
            { refresh: localStorage.getItem("refreshToken") }
          );

          setAccessToken(data.access);
          if (data.refresh) {
            localStorage.setItem("refreshToken", data.refresh); // обязательно при ротации
          }
          queue.forEach((cb) => cb());
          queue = [];
          return api(originalRequest);
        } catch (err) {
          setAccessToken("");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
