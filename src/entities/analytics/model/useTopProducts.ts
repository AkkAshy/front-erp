import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

type TopProduct = {
  top_products: {
    product__name: string;
    total_quantity: number;
    total_revenue: number;
  }[];
  limit: number;
};

export const useTopProducts = (params: {
  limit: number;
  start_date: string;
}): UseQueryResult<TopProduct, Error> =>
  useQuery({
    queryKey: ["top-products", params],
    queryFn: () => analyticsApi.getTopProducts(params).then((res) => res.data),
  });
