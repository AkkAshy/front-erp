import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { Employee } from "../api/types";

export const useEmployee = (id: number): UseQueryResult<Employee, Error> => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const response = await usersApi.getEmployee(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
