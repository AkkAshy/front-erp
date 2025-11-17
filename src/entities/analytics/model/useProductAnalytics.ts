import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useProductAnalytics = (params: {
  product: number;
  date_gte: string;
}) =>
  useQuery({
    queryKey: ["product-analytics", params],
    queryFn: () =>
      analyticsApi.getProductAnalytics(params).then((res) => res.data),
  });
