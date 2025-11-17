import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

// API возвращает product_name, но UI ожидает product__name
type TopProductsResponse = {
  period?: {
    start_date: string;
    end_date: string;
  };
  top_products: {
    product_id: number;
    product_name: string;
    product_code: string;
    total_revenue: number;
    total_quantity: number;
    total_profit: number;
    sales_count: number;
  }[];
};

type TopProduct = {
  top_products: {
    product__name: string;
    total_quantity: number;
    total_revenue: number;
  }[];
  limit: number;
};

export const useTopProducts = (params?: {
  limit?: number;
  order_by?: "revenue" | "quantity" | "profit";
}): UseQueryResult<TopProduct, Error> =>
  useQuery({
    queryKey: ["top-products", params],
    queryFn: () =>
      analyticsApi.getTopProducts(params).then((res: any) => {
        const data = res.data as TopProductsResponse;
        // Преобразуем product_name в product__name для совместимости с UI
        return {
          top_products: data.top_products.map((p) => ({
            product__name: p.product_name,
            total_quantity: p.total_quantity,
            total_revenue: p.total_revenue,
          })),
          limit: params?.limit || 10,
        };
      }),
  });
