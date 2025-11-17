import { api } from "@/shared/api/base/client";
import type { CreateSale, CreateSaleItem, CreateSalePayment, SaleStatus } from "../model/types";

export const salesApi = {
  // ===== SIMPLIFIED POS WORKFLOW (УПРОЩЕННЫЙ WORKFLOW) =====

  // Scan item - auto-create or update draft sale
  // POST /api/sales/sales/scan-item/
  scanItem: (data: {
    session: number;
    product: number;  // ID товара
    quantity?: number;
    batch?: number | null;
  }) => api.post("/sales/sales/scan-item/", data),

  // Get current pending sale
  // GET /api/sales/sales/current/?session={session_id}
  getCurrentSale: (session: number) =>
    api.get("/sales/sales/current/", { params: { session } }),

  // Add item to existing sale
  // POST /api/sales/sales/{sale_id}/add-item/
  addItemToSale: (saleId: number, data: {
    product: number;
    quantity?: number;
    batch?: number | null;
  }) => api.post(`/sales/sales/${saleId}/add-item/`, data),

  // Remove item from sale
  // DELETE /api/sales/sales/{sale_id}/remove-item/
  removeItemFromSale: (saleId: number, data: { item_id: number }) =>
    api.delete(`/sales/sales/${saleId}/remove-item/`, { data }),

  // Complete sale with payments
  // POST /api/sales/sales/{sale_id}/checkout/
  checkout: (saleId: number, data: {
    payments: Array<{
      payment_method: "cash" | "card" | "transfer";
      amount: number;
      received_amount?: number;
    }>;
  }) => api.post(`/sales/sales/${saleId}/checkout/`, data),

  // ===== SALES (ПРОДАЖИ) =====

  // ⚠️ ВАЖНО: Создание продажи - 4 шага (см. комментарии в types.ts)

  // Step 1: Создать пустую продажу - POST /api/sales/sales/
  createSale: (data: CreateSale) => api.post("/sales/sales/", data),

  // Получить все продажи - GET /api/sales/sales/
  getAllSales: (params?: {
    session?: number;
    status?: SaleStatus;
    customer_phone?: string;
    receipt_number?: string;
    date_from?: string;  // ISO формат: YYYY-MM-DD
    date_to?: string;    // ISO формат: YYYY-MM-DD
    offset?: number;
    limit?: number;
  }) => api.get("/sales/sales/", { params }),

  // Получить продажу по ID - GET /api/sales/sales/{id}/
  getSale: (id: number) => api.get(`/sales/sales/${id}/`),

  // Step 4: Завершить продажу - POST /api/sales/sales/{id}/complete/
  // Списывает товар со склада и устанавливает статус "completed"
  completeSale: (id: number) => api.post(`/sales/sales/${id}/complete/`),

  // Отменить продажу - POST /api/sales/sales/{id}/cancel/
  cancelSale: (id: number) => api.post(`/sales/sales/${id}/cancel/`),

  // Оформить возврат - POST /api/sales/sales/{id}/refund/
  refundSale: (id: number) => api.post(`/sales/sales/${id}/refund/`),

  // Получить продажи за сегодня - GET /api/sales/sales/today/
  getTodaySales: () => api.get("/sales/sales/today/"),

  // ===== PAYMENTS (ПЛАТЕЖИ) =====

  // Step 3: Создать платеж - POST /api/sales/payments/
  createPayment: (data: CreateSalePayment) => api.post("/sales/payments/", data),

  // Получить все платежи
  getAllPayments: (params?: {
    sale?: number;
    session?: number;
    payment_method?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/payments/", { params }),

  // ===== SALE ITEMS (ПОЗИЦИИ ПРОДАЖИ) =====

  // Step 2: Создать позицию продажи - POST /api/sales/sale-items/
  createSaleItem: (data: CreateSaleItem) => api.post("/sales/sale-items/", data),

  // Получить все позиции продажи
  getAllSaleItems: (params?: {
    sale?: number;
    product?: number;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/sale-items/", { params }),

  // ===== LEGACY (старые эндпоинты для совместимости) =====

  // Старый эндпоинт для истории транзакций
  getFilteredTransactions: (params: {
    transaction_id?: number | string;
    cashier?: number | string;
    date_from?: string;
    date_to?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/sales/", { params }),
};
