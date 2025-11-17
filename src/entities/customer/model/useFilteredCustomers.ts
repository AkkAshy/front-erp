import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import type { CustomersResult } from "../api/types";

type Filters = {
  q?: string;
  date_from?: string;
  date_to?: string;
  offset?: number;
  limit?: number;
};

export const useFilteredCustomers = (
  filters: Filters
): UseQueryResult<{ data: CustomersResult }, Error> => {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customersApi.getFilteredCustomers(filters),
    staleTime: 5 * 60 * 1000,
  });
};
