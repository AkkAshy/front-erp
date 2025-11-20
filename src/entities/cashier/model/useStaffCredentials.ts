import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { StaffCredentialsResponse } from "../api/types";
import { getTenantKey } from "@/shared/api/auth/tokenService";

export const useStaffCredentials = (): UseQueryResult<StaffCredentialsResponse, Error> => {
  const tenantKey = getTenantKey();

  return useQuery({
    queryKey: ["staffCredentials", tenantKey], // Добавили tenant_key для разделения кэша
    queryFn: async () => {
      const response = await usersApi.getStaffCredentials();
      return response.data;
    },
    enabled: !!tenantKey, // Выполнять запрос только если tenant_key есть
    staleTime: 10 * 60 * 1000, // 10 минут
    retry: false, // Не повторять при ошибке 403 (не владелец)
  });
};
