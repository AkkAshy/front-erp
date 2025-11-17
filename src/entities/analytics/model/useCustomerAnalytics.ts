import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useCustomerAnalytics = (params: {
  customer: number;
  date_gte: string;
}) =>
  useQuery({
    queryKey: ["customer-analytics", params],
    queryFn: () =>
      analyticsApi.getCustomerAnalytics(params).then((res) => res.data),
  });
