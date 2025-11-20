import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { salesApi } from "@/entities/sales/api/salesApi";
import type { CashierStatsResponse } from "../api/types";
import { getTenantKey } from "@/shared/api/auth/tokenService";

type UseCashierStatsParams = {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  enabled?: boolean;
};

export const useCashierStats = (
  params?: UseCashierStatsParams
): UseQueryResult<CashierStatsResponse, Error> => {
  const tenantKey = getTenantKey();

  return useQuery({
    queryKey: ["cashierStats", tenantKey, params], // Добавили tenant_key для разделения кэша
    queryFn: async () => {
      const response = await salesApi.getCashierStats({
        date_from: params?.dateFrom,
        date_to: params?.dateTo,
        limit: params?.limit,
      });
      return response.data;
    },
    enabled: params?.enabled !== false && !!tenantKey, // Выполнять только если tenant_key есть
    staleTime: 0, // Данные сразу считаются устаревшими
    refetchOnMount: true, // Всегда перезапрашивать при монтировании
  });
};
