import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { salesApi } from "@/entities/sales/api/salesApi";
import type { CashierStatsResponse } from "../api/types";

type UseCashierStatsParams = {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  enabled?: boolean;
};

export const useCashierStats = (
  params?: UseCashierStatsParams
): UseQueryResult<CashierStatsResponse, Error> => {
  return useQuery({
    queryKey: ["cashierStats", params],
    queryFn: async () => {
      const response = await salesApi.getCashierStats({
        date_from: params?.dateFrom,
        date_to: params?.dateTo,
        limit: params?.limit,
      });
      return response.data;
    },
    enabled: params?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};
