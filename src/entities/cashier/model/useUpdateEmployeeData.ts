import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { UpdateEmployeeRequest } from "../api/types";

type UpdateEmployeeParams = {
  id: number;
  data: UpdateEmployeeRequest;
};

export const useUpdateEmployeeData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEmployeeParams) =>
      usersApi.updateEmployeeData(id, data),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш конкретного сотрудника и список сотрудников
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
  });
};
