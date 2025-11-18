import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/types";

export const useFilteredCategories = (filters: {
  offset?: number;
  limit?: number;
}): UseQueryResult<{ data: Category }, Error> => {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: () => categoryApi.getFilteredCategories(filters),
    staleTime: 5 * 60 * 1000,
  });
};
