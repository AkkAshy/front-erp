import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { EmployeesListResponse } from "../api/types";

type UseEmployeesParams = {
  offset?: number;
  limit?: number;
  is_active?: boolean;
};

export const useEmployees = (
  params?: UseEmployeesParams
): UseQueryResult<EmployeesListResponse, Error> => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: async () => {
      const response = await usersApi.getEmployees(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
