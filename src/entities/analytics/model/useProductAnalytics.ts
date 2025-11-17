import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useProductAnalytics = () =>
  useQuery({
    queryKey: ["product-analytics"],
    // getProductAnalytics не существует, используем getProductPerformance
    queryFn: () =>
      analyticsApi.getProductPerformance().then((res: any) => res.data),
  });
