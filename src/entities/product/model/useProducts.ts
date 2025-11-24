import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { Product } from "../api/types";

export const useProducts = (): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productApi.getAll();
      return response.data;
    },
  });
};
