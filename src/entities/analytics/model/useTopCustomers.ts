import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

// API возвращает данные из customer-analytics
type CustomerAnalyticsItem = {
  id: number;
  customer: number;
  customer_name: string;
  customer_phone: string;
  customer_type: string;
  monetary: number;
  frequency: number;
  recency_days: number;
  purchases_count: number;
  total_spent: number;
  rfm_score: number;
  segment: string;
};

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

export const useTopCustomers = (limit: number = 5): UseQueryResult<TopCustomers, Error> =>
  useQuery({
    queryKey: ["top-customers", limit],
    queryFn: () =>
      analyticsApi.getCustomerAnalytics().then((res: any) => {
        const results = res.data?.results || [];

        // Сортируем по monetary (общая сумма покупок) и берем топ N
        const topCustomers = [...results]
          .sort((a: CustomerAnalyticsItem, b: CustomerAnalyticsItem) => b.monetary - a.monetary)
          .slice(0, limit)
          .map((c: CustomerAnalyticsItem) => ({
            customer__full_name: c.customer_name,
            customer__phone: c.customer_phone,
            total_purchases: c.total_spent,
            total_transactions: c.purchases_count,
            total_debt: 0, // API не предоставляет эту информацию напрямую
          }));

        return {
          top_customers: topCustomers,
          limit,
        };
      }),
  });
