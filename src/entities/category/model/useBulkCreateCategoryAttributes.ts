import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import type { BulkCreateCategoryAttributesRequest } from "../api/types";

export const useBulkCreateCategoryAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateCategoryAttributesRequest) =>
      categoryApi.bulkCreateCategoryAttributes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-attributes"] });
    },
  });
};
