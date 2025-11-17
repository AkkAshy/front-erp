import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useAddSizeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.addSize,
    onSuccess: () => {
      // Обновляем список размеров
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
};
