import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { CreateStoreRequest } from "../api/types";

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreRequest) => usersApi.createStore(data),
    onSuccess: () => {
      // Инвалидируем кэш списка магазинов (если будет такой)
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};
