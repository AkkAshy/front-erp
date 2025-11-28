import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "../api/referralApi";
import type {
  CreateCouponRequest,
  CouponsList,
  Coupon,
  ValidateCouponRequest,
  ValidateCouponResponse,
  ApplyCouponResponse,
  RemoveCouponResponse,
} from "../api/types";

// ===== QUERIES =====

// Получить список купонов
export const useCoupons = (params?: {
  referral?: number;
  is_active?: boolean;
  offset?: number;
  limit?: number;
}) => {
  return useQuery<CouponsList>({
    queryKey: ["coupons", params],
    queryFn: async () => {
      const response = await referralApi.getCoupons(params);
      return response.data;
    },
  });
};

// Получить купон по ID
export const useCoupon = (id: number | null) => {
  return useQuery<Coupon>({
    queryKey: ["coupon", id],
    queryFn: async () => {
      const response = await referralApi.getCoupon(id!);
      return response.data;
    },
    enabled: !!id,
  });
};

// Получить купон по коду
export const useCouponByCode = (code: string | null) => {
  return useQuery<{ coupon: Coupon; is_valid: boolean }>({
    queryKey: ["couponByCode", code],
    queryFn: async () => {
      const response = await referralApi.getCouponByCode(code!);
      return response.data;
    },
    enabled: !!code,
  });
};

// ===== MUTATIONS =====

// Создать купон
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<Coupon, Error, CreateCouponRequest>({
    mutationFn: async (data) => {
      const response = await referralApi.createCoupon(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
};

// Обновить купон
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Coupon,
    Error,
    { id: number; data: Partial<CreateCouponRequest> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await referralApi.updateCoupon(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupon", id] });
    },
  });
};

// Деактивировать купон
export const useDeactivateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<Coupon, Error, number>({
    mutationFn: async (id) => {
      const response = await referralApi.deactivateCoupon(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
};

// Валидация купона
export const useValidateCoupon = () => {
  return useMutation<ValidateCouponResponse, Error, ValidateCouponRequest>({
    mutationFn: async (data) => {
      const response = await referralApi.validateCoupon(data);
      return response.data;
    },
  });
};

// Применить купон к продаже
export const useApplyCouponToSale = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApplyCouponResponse,
    Error,
    { saleId: number; couponCode: string }
  >({
    mutationFn: async ({ saleId, couponCode }) => {
      const response = await referralApi.applyCouponToSale(saleId, couponCode);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};

// Удалить купон из продажи
export const useRemoveCouponFromSale = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveCouponResponse, Error, number>({
    mutationFn: async (saleId) => {
      const response = await referralApi.removeCouponFromSale(saleId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};

// Привязать бонусный товар к купону
export const useSetBonusProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; message: string; data: any },
    Error,
    { couponId: number; productId: number; quantity?: number }
  >({
    mutationFn: async ({ couponId, productId, quantity }) => {
      const response = await referralApi.setBonusProduct(couponId, {
        product_id: productId,
        quantity: quantity || 1,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
};
