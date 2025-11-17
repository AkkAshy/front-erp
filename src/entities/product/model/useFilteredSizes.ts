import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { Size } from "../api/types";

export const useFilteredSizes = (filters: {
  search?: string;
  offset?: number;
  limit?: number;
}): UseQueryResult<{ data: Size }, Error> => {
  return useQuery({
    queryKey: ["sizes", filters],
    queryFn: () => productApi.getFilteredSizes(filters),
    staleTime: 5 * 60 * 1000,
  });
};
