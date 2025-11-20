import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { Employee } from "../api/types";
import { getTenantKey } from "@/shared/api/auth/tokenService";

export const useEmployee = (id: number): UseQueryResult<Employee, Error> => {
  const tenantKey = getTenantKey();

  return useQuery({
    queryKey: ["employee", tenantKey, id], // Добавили tenant_key для разделения кэша
    queryFn: async () => {
      const response = await usersApi.getEmployee(id);
      return response.data;
    },
    enabled: !!id && !!tenantKey, // Выполнять запрос только если есть id и tenant_key
    staleTime: 0, // Данные сразу считаются устаревшими
    refetchOnMount: true, // Всегда перезапрашивать при монтировании
  });
};
