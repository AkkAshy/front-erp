import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { CreateEmployeeRequest } from "../api/types";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => usersApi.createEmployee(data),
    onSuccess: () => {
      // Инвалидируем кэш списка сотрудников, кассиров и пользователей
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
