import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { EmployeesListResponse } from "../api/types";
import { getTenantKey } from "@/shared/api/auth/tokenService";

type UseEmployeesParams = {
  offset?: number;
  limit?: number;
  is_active?: boolean;
};

export const useEmployees = (
  params?: UseEmployeesParams
): UseQueryResult<EmployeesListResponse, Error> => {
  const tenantKey = getTenantKey();

  return useQuery({
    queryKey: ["employees", tenantKey, params], // Добавили tenant_key для разделения кэша
    queryFn: async () => {
      const response = await usersApi.getEmployees(params);
      return response.data;
    },
    enabled: !!tenantKey, // Выполнять запрос только если tenant_key есть
    staleTime: 0, // Данные сразу считаются устаревшими
    refetchOnMount: true, // Всегда перезапрашивать при монтировании
  });
};
