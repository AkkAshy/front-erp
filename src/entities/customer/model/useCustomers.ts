import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { CustomersResult } from "../api/types";

export const useCustomers = (): UseQueryResult<
  CustomersResult,
  Error
> => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await customersApi.getAll();
      return response.data;
    },
  });
};
