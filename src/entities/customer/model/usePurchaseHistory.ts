import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { PurchaseHistoryResult } from "../api/types";

export const usePurchaseHistory = (
  id: number,
  params?: { offset?: number; limit?: number }
): UseQueryResult<PurchaseHistoryResult, Error> => {
  return useQuery({
    queryKey: ["purchase-history", id, params],
    queryFn: async () => {
      const response = await customersApi.getPurchaseHistory(id, params);
      return response.data;
    },
    enabled: !!id,
  });
};
