import axios from "axios";
import { attachAuthInterceptor } from "../auth/authInterceptor";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // для отправки refreshToken
});

// Debug interceptor - add before auth interceptor
api.interceptors.request.use((config) => {
  console.log("🌐 API Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullUrl: `${config.baseURL}${config.url}`,
    params: config.params,
    data: config.data,
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

attachAuthInterceptor(api);
