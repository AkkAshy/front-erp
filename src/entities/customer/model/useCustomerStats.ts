import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { CustomerStats } from "../api/types";

export const useCustomerStats = (
  id: number
): UseQueryResult<CustomerStats, Error> => {
  return useQuery({
    queryKey: ["customer-stats", id],
    queryFn: async () => {
      const response = await customersApi.getStats(id);
      return response.data;
    },
    enabled: !!id,
  });
};
