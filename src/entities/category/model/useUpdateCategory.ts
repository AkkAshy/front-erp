import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
    }: {
      id: number;
      name?: string;
    }) => categoryApi.update(id, { name }),
    onSuccess: () => {
      // Обновляем список
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
