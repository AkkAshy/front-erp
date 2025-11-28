import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "../api/referralApi";
import type {
  CreatePayoutRequest,
  CreatePayoutResponse,
  PayoutsList,
  EarningsList,
  EarningStatus,
} from "../api/types";

// ===== QUERIES =====

// Получить историю выплат реферала
export const useReferralPayouts = (
  referralId: number | null,
  params?: {
    offset?: number;
    limit?: number;
  }
) => {
  return useQuery<PayoutsList>({
    queryKey: ["referralPayouts", referralId, params],
    queryFn: async () => {
      const response = await referralApi.getReferralPayouts(referralId!, params);
      return response.data;
    },
    enabled: !!referralId,
  });
};

// Получить историю заработков реферала
export const useReferralEarnings = (
  referralId: number | null,
  params?: {
    status?: EarningStatus;
    date_from?: string;
    date_to?: string;
    offset?: number;
    limit?: number;
  }
) => {
  return useQuery<EarningsList>({
    queryKey: ["referralEarnings", referralId, params],
    queryFn: async () => {
      const response = await referralApi.getReferralEarnings(referralId!, params);
      return response.data;
    },
    enabled: !!referralId,
  });
};

// ===== MUTATIONS =====

// Создать выплату рефералу
export const useCreatePayout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePayoutResponse,
    Error,
    { referralId: number; data: CreatePayoutRequest }
  >({
    mutationFn: async ({ referralId, data }) => {
      const response = await referralApi.createPayout(referralId, data);
      return response.data;
    },
    onSuccess: (_, { referralId }) => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      queryClient.invalidateQueries({ queryKey: ["referral", referralId] });
      queryClient.invalidateQueries({ queryKey: ["referralPayouts", referralId] });
      queryClient.invalidateQueries({ queryKey: ["referralDashboard"] });
    },
  });
};
