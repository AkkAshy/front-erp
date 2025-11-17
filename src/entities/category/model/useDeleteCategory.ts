import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"], // тот же ключ, что и в useQuery
      });
    },
  });
};
