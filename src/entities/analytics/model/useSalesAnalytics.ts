import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useSalesAnalytics = (params: {
  date_gte: string;
  date_lte: string;
  payment_method?: string;
}) =>
  useQuery({
    queryKey: ["sales-analytics", params],
    queryFn: () => analyticsApi.getSales(params).then((res) => res.data),
  });
