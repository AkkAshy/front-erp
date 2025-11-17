import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { PurchaseHistoryResult } from "../api/types";

export const usePurchaseHistory = (
  id: number,
  params?: { offset?: number; limit?: number }
): UseQueryResult<{ data: PurchaseHistoryResult }, Error> => {
  return useQuery({
    queryKey: ["purchase-history", id, params],
    queryFn: () => customersApi.getPurchaseHistory(id, params),
    enabled: !!id,
  });
};
