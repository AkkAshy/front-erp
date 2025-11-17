import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/types";

export const useCategories = (): UseQueryResult<{ data: Category }, Error> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};
