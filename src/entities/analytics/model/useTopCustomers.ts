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

export const useTopCustomers = (params: {
  limit: number;
  start_date: string;
}): UseQueryResult<TopCustomers, Error> =>
  useQuery({
    queryKey: ["top-customers", params],
    queryFn: () => analyticsApi.getTopCustomers(params).then((res) => res.data),
  });
