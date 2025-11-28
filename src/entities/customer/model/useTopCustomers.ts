import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { TopCustomersResponse, TopCustomersOrderBy } from "../api/types";

export const useTopCustomers = (params?: {
  limit?: number;
  order_by?: TopCustomersOrderBy;
}) => {
  return useQuery<TopCustomersResponse>({
    queryKey: ["topCustomers", params],
    queryFn: async () => {
      const response = await customersApi.getTopCustomers(params);
      return response.data;
    },
  });
};
