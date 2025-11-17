import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useCustomerAnalytics = () =>
  useQuery({
    queryKey: ["customer-analytics"],
    // getCustomerAnalytics не принимает параметры, используем без них
    queryFn: () =>
      analyticsApi.getCustomerAnalytics().then((res: any) => res.data),
  });
