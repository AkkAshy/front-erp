import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { Product } from "../api/types";

type Filters = {
  search?: string;
  category?: number | string;
  attributes__attribute_type?: string;
  created_by?: number | string;
  offset?: number;
  limit?: number;
};

export const useFilteredProducts = (
  filters: Filters
): UseQueryResult<{ data: Product }, Error> => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productApi.getFilteredProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
};
