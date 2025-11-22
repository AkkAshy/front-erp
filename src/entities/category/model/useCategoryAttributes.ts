import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import type { CategoryAttributesByCategory } from "../api/types";

export const useCategoryAttributes = (categoryId: number | null) => {
  return useQuery<CategoryAttributesByCategory>({
    queryKey: ["category-attributes", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        return { status: "success", data: [] };
      }
      const response = await categoryApi.getCategoryAttributesByCategory(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
  });
};
