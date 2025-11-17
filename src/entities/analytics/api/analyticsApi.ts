import { api } from "@/shared/api/base/client";

export const analyticsApi = {
  // ===== DAILY SALES REPORTS (Kunlik savdo hisobotlari) =====

  // Получить все ежедневные отчеты
  // GET /api/analytics/daily-sales/
  getDailySales: () => api.get("/analytics/daily-sales/"),

  // Отчет за сегодня
  // GET /api/analytics/daily-sales/today/
  getTodayReport: () => api.get("/analytics/daily-sales/today/"),

  // Отчет за период
  // GET /api/analytics/daily-sales/period/?start_date=2025-01-01&end_date=2025-01-31
  getPeriodReport: (start_date: string, end_date: string) =>
    api.get("/analytics/daily-sales/period/", {
      params: { start_date, end_date },
    }),

  // Тренды продаж
  // GET /api/analytics/daily-sales/trends/?days=30
  getSalesTrends: (days: number = 30) =>
    api.get("/analytics/daily-sales/trends/", { params: { days } }),

  // ===== PRODUCT PERFORMANCE (Mahsulotlar samaradorligi) =====

  // Общая производительность товаров
  // GET /api/analytics/product-performance/
  getProductPerformance: () => api.get("/analytics/product-performance/"),

  // Топ товары
  // GET /api/analytics/product-performance/top-products/?limit=10&order_by=revenue
  getTopProducts: (params?: {
    limit?: number;
    order_by?: "revenue" | "quantity" | "profit";
  }) => api.get("/analytics/product-performance/top-products/", { params }),

  // Медленно продающиеся товары
  // GET /api/analytics/product-performance/slow-movers/?days=30
  getSlowMovers: (days: number = 30) =>
    api.get("/analytics/product-performance/slow-movers/", { params: { days } }),

  // ===== CUSTOMER ANALYTICS (Mijozlar tahlili) =====

  // Общая аналитика клиентов
  // GET /api/analytics/customer-analytics/
  getCustomerAnalytics: () => api.get("/analytics/customer-analytics/"),

  // Сегменты клиентов
  // GET /api/analytics/customer-analytics/segments/
  getCustomerSegments: () => api.get("/analytics/customer-analytics/segments/"),

  // Клиенты в зоне риска
  // GET /api/analytics/customer-analytics/at-risk/
  getAtRiskCustomers: () => api.get("/analytics/customer-analytics/at-risk/"),

  // ===== INVENTORY SNAPSHOTS (Ombor holati) =====

  // Все снимки инвентаря
  // GET /api/analytics/inventory-snapshots/
  getInventorySnapshots: () => api.get("/analytics/inventory-snapshots/"),

  // Последний снимок
  // GET /api/analytics/inventory-snapshots/latest/
  getLatestInventory: () => api.get("/analytics/inventory-snapshots/latest/"),

  // Товары с низким остатком
  // GET /api/analytics/inventory-snapshots/low-stock-alerts/
  getLowStockAlerts: () => api.get("/analytics/inventory-snapshots/low-stock-alerts/"),

  // Товары вне склада
  // GET /api/analytics/inventory-snapshots/out-of-stock/
  getOutOfStock: () => api.get("/analytics/inventory-snapshots/out-of-stock/"),
};
