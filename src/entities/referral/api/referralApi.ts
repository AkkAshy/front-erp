import { api } from "@/shared/api/base/client";
import type {
  CreateReferralRequest,
  CreateCouponRequest,
  ValidateCouponRequest,
  CreatePayoutRequest,
  EarningStatus,
} from "./types";

export const referralApi = {
  // ===== REFERRALS (Рефералы) =====

  // Получить список всех рефералов - GET /api/referrals/referrals/
  getReferrals: (params?: {
    is_active?: boolean;
    search?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/referrals/referrals/", { params }),

  // Получить реферала по ID - GET /api/referrals/referrals/{id}/
  getReferral: (id: number) => api.get(`/referrals/referrals/${id}/`),

  // Создать реферала - POST /api/referrals/referrals/
  createReferral: (data: CreateReferralRequest) =>
    api.post("/referrals/referrals/", data),

  // Обновить реферала - PATCH /api/referrals/referrals/{id}/
  updateReferral: (id: number, data: Partial<CreateReferralRequest>) =>
    api.patch(`/referrals/referrals/${id}/`, data),

  // Деактивировать реферала - DELETE /api/referrals/referrals/{id}/
  deleteReferral: (id: number) => api.delete(`/referrals/referrals/${id}/`),

  // ===== REFERRAL DASHBOARD (Дашборд реферала) =====

  // Получить дашборд реферала (для роли referral)
  // GET /api/referrals/referrals/dashboard/
  getDashboard: () => api.get("/referrals/referrals/dashboard/"),

  // Статистика реферала по периодам
  // GET /api/referrals/referrals/{id}/stats/?period=month
  getReferralStats: (id: number, period: "week" | "month" | "year") =>
    api.get(`/referrals/referrals/${id}/stats/`, { params: { period } }),

  // ===== REFERRAL EARNINGS (Заработки реферала) =====

  // История заработков реферала
  // GET /api/referrals/referrals/{id}/earnings/
  getReferralEarnings: (
    referralId: number,
    params?: {
      status?: EarningStatus;
      date_from?: string;
      date_to?: string;
      offset?: number;
      limit?: number;
    }
  ) => api.get(`/referrals/referrals/${referralId}/earnings/`, { params }),

  // ===== REFERRAL PAYOUTS (Выплаты рефералу) =====

  // Создать выплату рефералу - POST /api/referrals/referrals/{id}/payout/
  createPayout: (referralId: number, data: CreatePayoutRequest) =>
    api.post(`/referrals/referrals/${referralId}/payout/`, data),

  // История выплат реферала - GET /api/referrals/referrals/{id}/payouts/
  getReferralPayouts: (
    referralId: number,
    params?: {
      offset?: number;
      limit?: number;
    }
  ) => api.get(`/referrals/referrals/${referralId}/payouts/`, { params }),

  // ===== COUPONS (Купоны) =====

  // Получить список купонов - GET /api/referrals/coupons/
  getCoupons: (params?: {
    referral?: number;
    is_active?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/referrals/coupons/", { params }),

  // Получить купон по ID - GET /api/referrals/coupons/{id}/
  getCoupon: (id: number) => api.get(`/referrals/coupons/${id}/`),

  // Получить купон по коду - GET /api/referrals/coupons/by-code/{code}/
  getCouponByCode: (code: string) =>
    api.get(`/referrals/coupons/by-code/${code}/`),

  // Создать купон - POST /api/referrals/coupons/
  createCoupon: (data: CreateCouponRequest) =>
    api.post("/referrals/coupons/", data),

  // Обновить купон - PATCH /api/referrals/coupons/{id}/
  updateCoupon: (id: number, data: Partial<CreateCouponRequest>) =>
    api.patch(`/referrals/coupons/${id}/`, data),

  // Деактивировать купон - PATCH /api/referrals/coupons/{id}/
  deactivateCoupon: (id: number) =>
    api.patch(`/referrals/coupons/${id}/`, { is_active: false }),

  // Валидация купона - POST /api/referrals/coupons/validate/
  validateCoupon: (data: ValidateCouponRequest) =>
    api.post("/referrals/coupons/validate/", data),

  // Привязать бонусный товар к купону - POST /api/referrals/coupons/{id}/set-bonus-product/
  setBonusProduct: (couponId: number, data: { product_id: number; quantity?: number }) =>
    api.post(`/referrals/coupons/${couponId}/set-bonus-product/`, data),

  // ===== APPLY COUPON TO SALE (Применение купона к продаже) =====

  // Применить купон к продаже - POST /api/sales/sales/{sale_id}/apply-coupon/
  applyCouponToSale: (saleId: number, couponCode: string) =>
    api.post(`/sales/sales/${saleId}/apply-coupon/`, { coupon_code: couponCode }),

  // Удалить купон из продажи - POST /api/sales/sales/{sale_id}/remove-coupon/
  removeCouponFromSale: (saleId: number) =>
    api.post(`/sales/sales/${saleId}/remove-coupon/`),

  // ===== UPDATE ITEM IN SALE (Изменение товара в чеке) =====

  // Изменить цену/количество товара в чеке
  // POST /api/sales/sales/{sale_id}/update-item/
  updateItemInSale: (
    saleId: number,
    data: {
      item_id: number;
      unit_price?: number;
      quantity?: number;
    }
  ) => api.post(`/sales/sales/${saleId}/update-item/`, data),
};
