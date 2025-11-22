import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useDeleteCategoryAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategoryAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-attributes"] });
    },
  });
};
