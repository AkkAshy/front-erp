import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { ProductItem } from "../api/types";

type Results = {
  count: number;
  min_quantity: number;
  products: ProductItem[];
};
export const useLowStockProducts = (
  min_quantity: number = 5
): UseQueryResult<Results, Error> => {
  return useQuery({
    queryKey: ["low-stock-products", min_quantity],
    queryFn: async () => {
      const response = await productApi.getLowStockProducts(min_quantity);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
