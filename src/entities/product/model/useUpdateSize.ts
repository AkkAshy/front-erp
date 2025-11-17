import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useUpdateSizeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, size }: { id: number; size: string }) =>
      productApi.updateSize(id, size),
    onSuccess: () => {
      // Обновляем список размеров
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
};

