import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      // после успешного создания инвалидируем список продуктов
      queryClient.invalidateQueries({
        queryKey: ["products"], // тот же ключ, что у useQuery списка продуктов
      });
    },
  });
};
