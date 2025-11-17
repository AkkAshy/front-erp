import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { CustomerStats } from "../api/types";

export const useCustomerStats = (
  id: number
): UseQueryResult<{ data: CustomerStats }, Error> => {
  return useQuery({
    queryKey: ["customer-stats", id],
    queryFn: () => customersApi.getStats(id),
    enabled: !!id,
  });
};
