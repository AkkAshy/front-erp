import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteEmployee(id),
    onSuccess: () => {
      // Инвалидируем кэш списка сотрудников и кассиров
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
  });
};
