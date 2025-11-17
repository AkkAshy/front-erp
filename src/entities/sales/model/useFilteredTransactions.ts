import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { salesApi } from "../api/salesApi";
import type { Transaction } from "./types";

type Filters = {
  transaction_id?: number | string;
  cashier?: number | string;
  date_from?: string;
  date_to?: string;
  offset?: number;
  limit?: number;
};

export const useFilteredTransactions = (
  filters: Filters
): UseQueryResult<{ data: Transaction }, Error> => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => salesApi.getFilteredTransactions(filters),
    staleTime: 5 * 60 * 1000,
  });
};
