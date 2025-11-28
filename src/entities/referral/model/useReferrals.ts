import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "../api/referralApi";
import type {
  CreateReferralRequest,
  ReferralsList,
  Referral,
  CreateReferralResponse,
  ReferralDashboard,
  ReferralStats,
} from "../api/types";

// ===== QUERIES =====

// Получить список рефералов
export const useReferrals = (params?: {
  is_active?: boolean;
  search?: string;
  offset?: number;
  limit?: number;
}) => {
  return useQuery<ReferralsList>({
    queryKey: ["referrals", params],
    queryFn: async () => {
      const response = await referralApi.getReferrals(params);
      return response.data;
    },
  });
};

// Получить реферала по ID
export const useReferral = (id: number | null) => {
  return useQuery<Referral>({
    queryKey: ["referral", id],
    queryFn: async () => {
      const response = await referralApi.getReferral(id!);
      return response.data;
    },
    enabled: !!id,
  });
};

// Получить дашборд реферала (для роли referral)
export const useReferralDashboard = () => {
  return useQuery<ReferralDashboard>({
    queryKey: ["referralDashboard"],
    queryFn: async () => {
      const response = await referralApi.getDashboard();
      return response.data;
    },
  });
};

// Получить статистику реферала по периодам
export const useReferralStats = (
  id: number | null,
  period: "week" | "month" | "year"
) => {
  return useQuery<ReferralStats>({
    queryKey: ["referralStats", id, period],
    queryFn: async () => {
      const response = await referralApi.getReferralStats(id!, period);
      return response.data;
    },
    enabled: !!id,
  });
};

// ===== MUTATIONS =====

// Создать реферала
export const useCreateReferral = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReferralResponse, Error, CreateReferralRequest>({
    mutationFn: async (data) => {
      const response = await referralApi.createReferral(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
};

// Обновить реферала
export const useUpdateReferral = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Referral,
    Error,
    { id: number; data: Partial<CreateReferralRequest> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await referralApi.updateReferral(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      queryClient.invalidateQueries({ queryKey: ["referral", id] });
    },
  });
};

// Удалить/деактивировать реферала
export const useDeleteReferral = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await referralApi.deleteReferral(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
};
