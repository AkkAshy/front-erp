import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { CashiersResponse } from "../api/types";

export const useCashiers = (): UseQueryResult<CashiersResponse, Error> => {
  return useQuery({
    queryKey: ["cashiers"],
    queryFn: async () => {
      const response = await usersApi.getCashiers();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
