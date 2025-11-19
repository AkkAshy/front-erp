import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { StaffCredentialsResponse } from "../api/types";

export const useStaffCredentials = (): UseQueryResult<StaffCredentialsResponse, Error> => {
  return useQuery({
    queryKey: ["staffCredentials"],
    queryFn: async () => {
      const response = await usersApi.getStaffCredentials();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 минут
    retry: false, // Не повторять при ошибке 403 (не владелец)
  });
};
