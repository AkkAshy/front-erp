import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customersApi } from "@/entities/customer/api/customersApi";
import { getTenantKey } from "@/shared/api/auth/tokenService";

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

export const useTopCustomers = (limit: number = 5): UseQueryResult<TopCustomers, Error> => {
  const tenantKey = getTenantKey();

  return useQuery({
    queryKey: ["top-customers", tenantKey, limit],
    enabled: !!tenantKey,
    staleTime: 0,
    refetchOnMount: true,
    queryFn: async () => {
      const res = await customersApi.getTopCustomers({
        limit,
        order_by: "total_purchases",
      });

      const data = res.data?.data || [];

      const topCustomers = data.map((c: any) => ({
        customer__full_name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Noma'lum",
        customer__phone: c.phone || "",
        total_purchases: c.total_purchases || 0,
        total_transactions: c.total_purchases_count || 0,
        total_debt: 0,
      }));

      return {
        top_customers: topCustomers,
        limit,
      };
    },
  });
};
