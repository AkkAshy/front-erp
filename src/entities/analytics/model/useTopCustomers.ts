import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

type TopCustomers = {
  top_customers: {
    customer__full_name: string;
    customer__phone: string;
    total_purchases: number;
    total_transactions: number;
    total_debt: number;
  }[];
  limit: number;
};

export const useTopCustomers = (): UseQueryResult<TopCustomers, Error> =>
  useQuery({
    queryKey: ["top-customers"],
    // getTopCustomers не существует, используем getCustomerAnalytics как заглушку
    queryFn: () =>
      analyticsApi.getCustomerAnalytics().then((res: any) => res.data),
  });
