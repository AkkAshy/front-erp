import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "../api/salesApi";
import type { CreateSaleItem } from "./types";

export const useCreateSaleItem = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateSaleItem>({
    mutationFn: salesApi.createSaleItem,
    onSuccess: () => {
      // Обновляем текущую продажу после добавления товара
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
